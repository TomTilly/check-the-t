// Requiring packages

const express = require('express');
const request = require('request');
const util = require('util');
const mongoose = require('mongoose');
const app = express();

require('dotenv').config({ path: 'variables.env' })

const port = 7777; // For testing on localhost

app.set('view engine', 'ejs'); // Set template engine
app.use(express.static('public')); // Use public directory when serving assets


// Connect to Database

mongoose.connect(process.env.DATABASE, {
	auth: {
		user: process.env.DB_USER,
		password: process.env.DB_PASS
	},
	useNewUrlParser: true 
});

const db = mongoose.connection;

db.on('error', (err) => {
	console.error(`Database Error: ${err.message}`);
});

const stopsSchema = new mongoose.Schema({
		name: String,
		id: String
	});

const Stop = mongoose.model("Stop", stopsSchema);

/* Save stops to database (commented out so it only runs once,
 * not sure how to update previous entries). In future, run this
 * once per day at 3AM, and check last-modified header
 * in API response to see if version is current */
// db.once('open', function(){
	// request('https://api-v3.mbta.com/stops', function (error, response, body) {
	// 	if(!error && response.statusCode == 200){
	// 		const stopInfo = JSON.parse(body);
	// 		for(let i = 0; i < stopInfo.data.length; i++){
	// 			const stop = new Stop(
	// 				{
	// 					name: stopInfo.data[i].attributes.name,
	// 					id: stopInfo.data[i].id
	// 				}
	// 			);
	// 			stop.save((err,stop) => {
	// 				if(err){
	// 					console.log("Error: ", err);
	// 				} else {
	// 					console.log("Saved item to DB: ", stop);
	// 				}
	// 			});
	// 		}
	// 	} else {
	// 		console.log('error:', error);
	// 		console.log('statusCode:', reponse && reponse.statusCode);
	// 	}
	// });
// });

/* Routes */

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/arrivals', function(req, res) {
	const stationName = req.query['station-name'];
	Stop.find({name: stationName}, function(err, stops){
		if(err) {
			console.log("Error finding item in DB: ", err);
		} else {
			// get prediction URL
			let stationIDs = [];
			let predictionsRequestURL = '';
			let routePredictions = [];
			let wasStationFound = false;
			stops.forEach(stop => {
				stationIDs.push(encodeURIComponent(stop.id));
			});
			stationIDs.join(',');
			predictionsRequestURL = `https://api-v3.mbta.com/predictions?filter[stop]=${stationIDs}&include=route,stop,trip&filter[route_type]=0,1,3&sort=departure_time`;
			console.log('predictionsRequestURL: ', predictionsRequestURL);

			// note: maybe include this elsewhere as utility?
			function maybePluralize(count, noun, suffix = 's') {
			  return `${count} ${noun}${count !== 1 ? suffix : ''}`;
			}

			// routePredictions contain meta data about a route and predictions belonging to that route for the stop requested by the user
			function RoutePrediction(route, filteredPrediction) {
				this.routeID = route.id;
				this.routeClassAttr = getClassAttr(this.routeID, route.attributes.description); // used to display class names in html to trigger css styles
				this.routeDisplayName = route.attributes.long_name;
				this.directionNames = route.attributes.direction_names;
				this.predictions = [ [], [] ];
				this.predictions[filteredPrediction.directionID].push(filteredPrediction);
			}

			// filteredPredictions are filtered down from srcPredictions(the predictions from the API) to only the essential information for the app
			function FilteredPrediction(stopName, destination, directionID, timePrediction) {
				this.stopName = stopName;
				this.destination = destination;
				this.directionID = directionID;
				this.timePrediction = timePrediction;
			}

			/* Return values:
			 * if mid-route stop, return arrival time. return 'Arriving' when time < 30 seconds
			 * if last stop, return null (don't want to display this prediction)
			 * if first stop, return departure time. return 'Boarding' when time < 30 seconds
			*/
			function getTimePrediction(srcPrediction) {
				// determine whether to display arrival or departure time
				const arrivalTime = srcPrediction.attributes.arrival_time;
				const departureTime = srcPrediction.attributes.departure_time;
				let hasArrivalTime = false;
				let timePrediction;
				if(arrivalTime && departureTime) {
					// mid-route stop, display arrival time
					timePrediction = new Date(arrivalTime);
					hasArrivalTime = true;
				} else if (!departureTime) {
					// last stop, don't display any time
					return null;
				} else if (departureTime && !arrivalTime) {
					// first stop, display departure time and use "Boarding" vs. "Arriving"
					timePrediction = new Date(departureTime);
					hasArrivalTime = false;
				}

				// get time to display to user
				if(timePrediction) {
					const currentTime = new Date();
					const difference = new Date(timePrediction - currentTime);
					if(currentTime > timePrediction){
						return (hasArrivalTime) ? 'ARR' : 'BRD';
					} else if (difference.getUTCHours() > 0){
						if(difference.getMinutes() > 0) {
							return `${maybePluralize(difference.getUTCHours(), 'hr')} ${difference.getMinutes()} min`;	
						} else {
							// minutes are 0, exclude from return
							return `${maybePluralize(difference.getUTCHours(), 'hr')}`;
						}
					} else if (difference.getMinutes() > 0) {
						return `${difference.getMinutes()} min`;
					} else if (difference.getSeconds() > 30) {
						return '1 min';
					} else {
						return (hasArrivalTime) ? 'ARR' : 'BRD';
					}
				} else {
					console.log('Time prediction error');
					return 'Error';
				}
			}

			function getClassAttr(routeID, routeDesc) {
				if(routeDesc === 'Local Bus' || routeDesc === 'Key Bus Route (Frequent Service)') {
					return 'local-bus';
				} else if (routeID === "741" || routeID === "742" || routeID === "743" || routeID === "751" || routeID === "749") {
					return "silver-line";
				} else if (routeID === 'Mattapan') {
					return "red-line";
				} else {
					// will create red-line, green-line, blue-line, etc...
					// .replace is necessary to get rid of subroutes on Green Line (ex: removes '-B' in 'Green-B')
					return `${routeID.toLowerCase().replace(/-./,'')}-line`;
				}
			}

			// send request to MBTA api
			request(predictionsRequestURL, function(error, response, body) {
				if(error || !(response.statusCode == 200)) {
					// error in request to API
					console.log('error:', error);
					console.log('statusCode:', reponse && reponse.statusCode);
				} else {
					// request successful
					body = JSON.parse(body);
					if(!body.data.length) {
						// station was not found, 
						wasStationFound = false;
						console.log('no predictions returned, station name not found');
					} else {
						// station(s) found, get predictions for each route and send to arrivals template
						wasStationFound = true;
						
						// srcPredictions are the predictions returned from the MBTA API
						body.data.forEach(function(srcPrediction){
							
							// check time prediction. returns null if last stop on a trip, which shouldn't be displayed
							const timePrediction = getTimePrediction(srcPrediction);
							if(timePrediction) {
								const routeID = srcPrediction.relationships.route.data.id;
								const index = routePredictions.findIndex(routePrediction => routePrediction.routeID === routeID); // returns the index number of the routePrediction with a matching routeID, or -1 if it can't be found
								const tripID = srcPrediction.relationships.trip.data.id;
								const stopID = srcPrediction.relationships.stop.data.id;
								const stop = body.included.find(includedObj => {
									return (includedObj.type === 'stop' && includedObj.id === stopID);
								});
								const trip = body.included.find(includedObj => {
									return (includedObj.type === 'trip' && includedObj.id === tripID);
								});
								const stopName = stop.attributes.name;
								const destination = trip.attributes.headsign;
								const directionID = srcPrediction.attributes.direction_id;
								const timePrediction = getTimePrediction(srcPrediction);

								if(index === -1) {
									// no match was found in routePredictions array, add new routePrediction obj
									const route = body.included.find(includedObj => {
										return (includedObj.type === 'route' && includedObj.id === routeID);
									});
									// Make filtered prediction obj send to routePrediction
									const filteredPrediction = new FilteredPrediction(stopName, destination, directionID, timePrediction);	
									// Push routePrediction
									routePredictions.push(new RoutePrediction(route, filteredPrediction));
								} else {
									// match was found in routePredictions array, add prediction to routePredictions.predictions[directionID] if length < 3
									if(routePredictions[index].predictions[directionID].length < 3) {
										routePredictions[index].predictions[directionID].push(new FilteredPrediction(stopName, destination, directionID, timePrediction));
									}
								}
							}
						});
					}
				}
				console.log(util.inspect(routePredictions, {depth: 50, colors: true}));
				res.render('arrivals', {routePredictions: routePredictions, stationName: stationName, wasStationFound: wasStationFound});
			}); // end of api request
		}
	}); // end of database lookup
});

app.get('/about', function(req, res) {
	res.render('about');
});


app.get('*', function(req, res) {
	res.render('404');
});

app.listen(port, function(){
	console.log('Server started');
});