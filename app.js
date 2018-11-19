const express = require('express');
const request = require('request');
const util = require('util');
const app = express();
const port = 7777; // For testing on localhost

app.set('view engine', 'ejs');
app.use(express.static('public'));


// Get all stop names and ids and store as objects in array. Only use until database is implemented

const stops = [];

request('https://api-v3.mbta.com/stops', function (error, response, body) {
		if(!error && response.statusCode == 200){
			const stopInfo = JSON.parse(body);
			for(let i = 0; i < stopInfo.data.length; i++){
				stops.push(
					{
						name: stopInfo.data[i].attributes.name,
						id: stopInfo.data[i].id
					}
				);
			}
			console.log(stops);
		} else {
			console.log('error:', error);
			console.log('statusCode:', reponse && reponse.statusCode);
		}
	});

/* Routes */

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/arrivals', function(req, res) {
	const stationName = req.query['station-name'];
	let stationIDs = []; 
	stops.forEach(stop => {
		if(stationName == stop.name){
			stationIDs.push(stop.id);
		}
	});
	stationIDs = stationIDs.join(',');
	console.log(stationName);
	console.log(stationIDs);

	const predictionsRequestUrl = `https://api-v3.mbta.com/predictions?filter[stop]=${stationIDs}&include=route,stop,trip&filter[route_type]=0,1,3&sort=departure_time`;
	const routePredictions = [];
	let stationFound;

	request(predictionsRequestUrl, function (error, response, body) {
		if(!error && response.statusCode == 200){
			body = JSON.parse(body);
			let firstPass = true;
			if(body.data.length){
				stationFound = true;
				body.data.forEach(function(prediction){
					console.log('hello');
					/*
					Check if current prediction's route ID matches the route ID
					in an object in the routePredictions array. If true,
					check if time is earlier than other predictions in 
					routePredictions[index].predictions array and add it if it is.
					If false, push new object to routePredictions array with ID of new route.
					*/
					const routeID = prediction.relationships.route.data.id;
					const tripID = prediction.relationships.trip.data.id;
					const route = body.included.find(includedObj => {
						console.log('includedObj.type: ' + includedObj.type);
						return (includedObj.type === 'route' && includedObj.id === routeID);
					}); // returns route obj with ID matching current prediction's route ID
					const trip = body.included.find(includedObj => {
						return (includedObj.type === 'trip' && includedObj.id === tripID);
					}); // returns trip obj with ID matching current prediction's trip ID

					if(firstPass){
						routePredictions.push(
							{
								route: route,
								trips: [trip],
								predictions: [prediction]
							}
						);
						firstPass = false;
					} else {
						const index = routePredictions.findIndex(routePrediction => routePrediction.route.id === routeID);
						const predictionDirection = prediction.attributes.direction_id;
						let predictionsWithSameDirection;
						if(routePredictions[index]){
							predictionsWithSameDirection = routePredictions[index].predictions.filter(prediction => prediction.attributes.direction_id === predictionDirection);
						}
						
						console.log(index);
						if(index === -1){
							routePredictions.push(
								{
									route: route,
									trips: [trip],
									predictions: [prediction]
								}
							);
						} else if(routePredictions[index] && predictionsWithSameDirection.length < 4){
							routePredictions[index].predictions.push(prediction);
							routePredictions[index].trips.push(trip);
							console.log('prediction added');
						} else {
							console.log(`Didn't add prediction`);
						}
					}
				});
			} else { // Station not found
				stationFound = false;
				console.log('no predictions returned, station name not found');
			}
			console.log(util.inspect(routePredictions, {depth: 50, colors: true}));
		} else {
		console.log('error:', error);
		console.log('statusCode:', reponse && reponse.statusCode);
		}
		console.log("stationFound: " + stationFound);
		res.render('arrivals', {routePredictions: routePredictions, stationName: stationName, stationFound: stationFound});
	});
});

app.get('*', function(req, res) {
	res.render('404');
});

app.listen(port, function(){
	console.log('Server started');
});