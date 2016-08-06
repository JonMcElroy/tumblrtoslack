'use strict'

const cron = require('cron')
const worker = require('./worker.js')

// helper
const updateTimer = () => {
	lastTimestamp = new Date().getTime() / 1000;
}

// timers
var lastTimestamp = 0
updateTimer();

// cron
let cronProcess = () => {
	console.log("Cron Process running at " + new Date().getTime())
	worker.fetchPosts(5, lastTimestamp, updateTimer);
}

let job = new cron.CronJob({
	cronTime: "00 00 * * * *",
	onTick: cronProcess,
	start: true,
	timeZone: "America/New_York"
});