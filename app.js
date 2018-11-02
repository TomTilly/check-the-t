const express = require('express');
const app = express();
const port = 7777; // For testing on localhost

app.set('view engine', 'ejs');
app.use(express.static('public'));

/* Routes */

app.get('/', function(req, res) {
	res.render('index');
});

app.listen(port, function(){
	console.log('Server started');
});