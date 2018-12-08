// Requiring packages

const express = require('express');
const app = express();
const request = require('request');
const util = require('util');
const mongoose = require('mongoose');

require('dotenv').config({ path: 'variables.env' })

const port = 7777; // For testing on localhost

app.set('view engine', 'ejs'); // Set template engine
app.use(express.static('public')); // Use public directory when serving assets

// Get all stop names and ids and store as objects in array. Temporary until DB implemented

mongoose.connect(process.env.DATABASE, { 
	auth: {
		user: process.env.DB_USER,
		password: process.env.DB_PASS
	},
	useNewUrlParser: true 
});

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const db = mongoose.connection;

db.on('error', (err) => {
	console.error(`Database Error: ${err.message}`);
});

const stopsSchema = new mongoose.Schema({
		name: String,
		id: String
	});

const Stop = mongoose.model("Stop", stopsSchema);

db.once('open', function(){
	/* Save stops to database (commented out so it only runs once,
	 * not sure how to update previous entries). In future, run this
	 * once per day at 3AM, and check last-modified header
	 * in API response to see if version is current */

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
});

Stop.find({ name: 'Porter'}, function(err, stop){
		console.log(stop);
	});

/* Routes */

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/arrivals', function(req, res) {
	const stationName = req.query['station-name'];
	// let stationIDs = [];
	// stops.forEach(stop => {
	// 	if(stationName == stop.name){
	// 		stationIDs.push(stop.id);
	// 	}
	// });
	// stationIDs = stationIDs.join(',');
	// console.log(stationName);
	// console.log(stationIDs);

	// TODO - Retrieve stop(s) from database

	Stop.find({ name: stationName}, function(err, stops){
		let stationIDs = [];
		stops.forEach(stop => {
			stationIDs.push(encodeURIComponent(stop.id));
		});
		stationIDs = stationIDs.join(',');
		console.log('StationIDs: ', stationIDs);
		let predictionsRequestUrl = `https://api-v3.mbta.com/predictions?filter[stop]=${stationIDs}&include=route,stop,trip&filter[route_type]=0,1,3&sort=departure_time`;
			console.log('predictionsRequestUrl: ', predictionsRequestUrl);

		const routePredictions = [];
		let wasStationFound;

		request(predictionsRequestUrl, function (error, response, body) {
			if(!error && response.statusCode == 200){
				body = JSON.parse(body);
				let firstPass = true;
				if(body.data.length){
					wasStationFound = true;
					body.data.forEach(function(prediction){
						/*
						Check if current prediction's route ID matches the route ID
						in an object in the routePredictions array. If true,
						check if time is earlier than other predictions in 
						routePredictions[index].predictions array and add it if it is.
						If false, push new object to routePredictions array with ID of new route.
						*/
						const routeID = prediction.relationships.route.data.id;
						const tripID = prediction.relationships.trip.data.id;
						
						// returns trip obj with ID matching current prediction's trip ID
						const trip = body.included.find(includedObj => {
							return (includedObj.type === 'trip' && includedObj.id === tripID);
						}); 
						const index = routePredictions.findIndex(routePrediction => routePrediction.route.id === routeID);

						// no match was found in routePredictions array, so add new routePrediction obj
						if(index === -1){ 
							const stopID = prediction.relationships.stop.data.id;
							const stop = body.included.find(includedObj => {
								return (includedObj.type === 'stop' && includedObj.id === stopID);
							});

							// returns route obj with ID matching current prediction's route ID
							const route = body.included.find(includedObj => {
								return (includedObj.type === 'route' && includedObj.id === routeID);
							}); 
							routePredictions.push(
								{
									route: route,
									stop: stop,
									trips: [trip],
									predictions: [prediction]
								}
							);
						}
						// match was found
						else { 
							const predictionDirection = prediction.attributes.direction_id;
							const predictionsWithSameDirection = routePredictions[index].predictions.filter(prediction => prediction.attributes.direction_id === predictionDirection); 
							if(predictionsWithSameDirection.length < 3){
								routePredictions[index].predictions.push(prediction);
								routePredictions[index].trips.push(trip);
							}
						}
					});
				} else { // station not found
					wasStationFound = false;
					console.log('no predictions returned, station name not found');
				}
				console.log(util.inspect(routePredictions, {depth: 50, colors: true}));
			} else { // error in request to API
				console.log('error:', error);
				console.log('statusCode:', reponse && reponse.statusCode);
			}
			
			res.render('arrivals', {routePredictions: routePredictions, stationName: stationName, wasStationFound: wasStationFound});
		});
	});


});

app.get('*', function(req, res) {
	res.render('404');
});

app.listen(port, function(){
	console.log('Server started');
});