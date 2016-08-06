'use strict'

// TODO: Search for @username in posts and message relevant user
const express = require('express')
const worker = require('./worker.js')

let app = express();

// helpers
const updateTimer = () => {
	lastTimestamp = new Date().getTime() / 1000;
}

// timers
var lastTimestamp = 0
updateTimer();

// app
app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/tumblrtoslack', (req, res) => {
	worker.fetchPosts(5, lastTimestamp, updateTimer);
	res.send('Success');
})

app.listen(app.get('port'), function() {
	console.log("Node app is running at localhost:" + app.get('port'))
})