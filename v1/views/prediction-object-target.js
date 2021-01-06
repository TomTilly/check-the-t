// routePredictions array model

[
	{
		routeID: 'Red', // data.relationships.route.data.id
		routeClassAttr: 'red-line', // create from routeID
		routeDisplayName: 'Red Line', // included.route.attributes.long_name
		directionNames: ['Inbound', 'Outbound'], // included.route.attributes.direction_names
		dir0Predictions: [
			{
				timePrediction: new Date(), // data.attributes.arrival_time (or .departure_time)
				stopName: 'Porter', // included.stop.attributes.name
				destination: 'Alewife', // included.trip.attributes.headsign
			}
		],
		dir1Predictions: [
			{
				timePrediction: new Date(), // real time goes here
				stopName: 'Porter',
				destination: 'Alewife',
			},
			{
				timePrediction: new Date(), // real time goes here
				stopName: 'Porter',
				destination: 'Alewife',
			},
			{
				timePrediction: new Date(), // real time goes here
				stopName: 'Porter',
				destination: 'Alewife',
			}
		]
	},
	{
		routeID: 'Red', // data.relationships.route.data.id
		routeClassAttr: 'red-line', // create from routeID
		routeDisplayName: 'Red Line', // included.route.attributes.long_name
		directionNames: ['Inbound', 'Outbound'], // included.route.attributes.direction_names
		dir0Predictions: [
			{
				timePrediction: new Date(), // data.attributes.arrival_time (or .departure_time)
				stopName: 'Porter', // included.stop.attributes.name
				destination: 'Alewife', // included.trip.attributes.headsign
			}
		],
		dir1Predictions: [
			{
				timePrediction: new Date(), // real time goes here
				stopName: 'Porter',
				destination: 'Alewife',
			},
			{
				timePrediction: new Date(), // real time goes here
				stopName: 'Porter',
				destination: 'Alewife',
			},
			{
				timePrediction: new Date(), // real time goes here
				stopName: 'Porter',
				destination: 'Alewife',
			}
		]
	} // etc...
]