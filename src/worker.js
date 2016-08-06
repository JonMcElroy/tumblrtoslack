'use strict'

const slack = require('slack')
const tumblr = require('tumblr.js')

var client = tumblr.createClient({
	consumer_key: process.env.TUMBLR_CONSUMER_KEY,
	consumer_secret: process.env.TUMBLR_CONSUMER_SECRET,
	token: process.env.TUMBLR_TOKEN,
	token_secret: process.env.TUMBLR_TOKEN_SECRET
})

const fetchPosts = (limit, timestamp, callback) => {
	client.blogPosts(process.env.TUMBLR_ADDRESS, { limit: limit }, (err, data) => {
			preparePosts(data, timestamp, callback)
	})
}

const preparePosts = (data, timestamp, callback) => {
	var dt = 0.0
	for (var i = 0; i < data.posts.length; ++i)
	{
		if (data.posts[i] === undefined)
		{
			continue;
		}

		dt = timestamp - data.posts[i].timestamp;
		console.log("POST " + dt + " < " + data.posts[i].summary) // TODO: REMOVE
		if (dt < 0)
		{
			postToSlack(data.posts[i].summary || "No Summary", data.posts[i].short_url);
			callback();	
		}
	}
}

const postToSlack = (post_title, post_link) => {
	var attachment = { title: post_title, title_link: post_link }
	slack.chat.postMessage({
	  	token: process.env.SLACK_TOKEN,
	  	icon_url: process.env.SLACK_BOT_ICON,
	  	channel: '#general',
	  	username: 'botfriend',
	  	text: 'Hello, there is a new post on Tumblr!',
		attachments: [attachment]
	  }, (err, data) => {
	  	if (err) throw err

	  	let txt = data.message.text
	  	console.log('Slack Message Posted: ' + txt);
	  })
}

module.exports = {
	fetchPosts: fetchPosts,
	preparePosts: preparePosts,
	postToSlack: postToSlack
}