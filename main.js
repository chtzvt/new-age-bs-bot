// Import the bullshit module
var bs = require('./lib/bullshit.js');
// Import the Twitter API module - see https://www.npmjs.com/package/twitter
var Twitter = require('twit');
// HTTP server module to serve profile page redirect
var http = require('http');

/* NABGBot Configuration:
 *	TWITTER_API_KEYS - Fill this in with the API keys you get from https://apps.twitter.com/
 *  RESPONSE_API_KEYS - You can generate another set of API keys for the response stream, or you can
 *  use the first set of keys, instead. I like to use 2 different sets so that if the response keys hit the quota
 *  and become disabled temporarily, the bot can still post statuses without interruption.
 * 	IP and PORT - These are automatically determined while on Openshift, but will default to 127.0.0.1:8082
 * 	TWITTER_URL - The full URL to your bot's twitter page
 *	POST_INTERVAL - The interval, in ms, at which posts should be made (Keep Twitter's API rate limits in mind!).
 */
var CONFIG = {
                TWITTER_API_KEYS: {
                           consumer_key: ' ',
                           consumer_secret: ' ',
                           access_token: ' ',
                           access_token_secret: ' '
                },
                RESPONSE_API_KEYS: {
                           consumer_key: ' ',
                           consumer_secret: ' ',
                           access_token: ' ',
                           access_token_secret: ' '
                },
		BOT_NAME: 'nabgbot',
		IP: process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1",
		PORT: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8082,
		TWITTER_URL: "https://twitter.com/nabgbot",
		POST_INTERVAL: 1800000
};

console.info('NABG_INFO: Starting '+CONFIG.TWITTER_URL+' on '+CONFIG.IP+':'+CONFIG.PORT);

// Create Twitter API client instances
var client = new Twitter(CONFIG.TWITTER_API_KEYS);
var tweetResponses = new Twitter(CONFIG.RESPONSE_API_KEYS);

var responseStream = tweetResponses.stream('statuses/filter', {
    track: '@' + CONFIG.BOT_NAME
});

responseStream.on('tweet', postReply);

responseStream.on('disconnect', function(disconnectMessage) {
    console.info('RESPONSE STREAM DISCONNECT: ' + JSON.stringify(disconnectMessage));
    responseStream.start();
});

// Generates a post that is less than 140 chars long
function generatePost() {
  // Generate post with between 1 or 2 sentences by default.
  post = bs.ionize(Math.floor(Math.random()*2)+1);

  // Ensure that posts are <= 140 characters and are NOT empty.
  while(post.length > 140 || typeof post === 'undefined' || post.length === 0)
    post = bs.ionize(1);

  return post;
}

function getUsers(tweet) {
    var mentions = '@' + tweet.user.screen_name + ' ';

    for (var i = 0; i < tweet.entities.user_mentions.length; i++)
        if (tweet.entities.user_mentions[i].screen_name != CONFIG.BOT_NAME)
            mentions += '@' + tweet.entities.user_mentions[i].screen_name + ' ';

    return mentions;
}

/* Will attempt to resend tweet until success.
 * Failure here is fairly rare. No worries regarding flooding the API because:
	 a) API rate limiting will kick in, then reset in 15 minutes (see https://dev.twitter.com/rest/public/rate-limiting/)
	 b) Though generatePost occasionally returns an empty string, the twitter API will not accept this and so a new post gets generated anyways ¯\_(ツ)_/¯
	 c) generatePost always returns a valid post in less than 3 attempts at maximum.
 */
function sendPost() {
 client.post('statuses/update', {status: generatePost()}, function(error, tweet, response){
   // Rerun this method on failure (see above).
   if (error)
     console.error('NABG_DEBUG: '+CONFIG.TWITTER_URL+' Twitter returned an error: '+JSON.stringify(response));
 });
}

function postReply(tweet) {
    try {
        //Never reply to self.
        if (tweet.user.screen_name == CONFIG.BOT_NAME)
            return;

	var mentions = getUsers(tweet);
        var tweetContent = mentions + generatePost();
	var numTries = 30;  // Max # of generation attempts

        while (tweetContent.length > 140 && numTries > 0) {
            tweetContent = mentions + generatePost();
            numTries--;
        }

	if(numTries <= 0)
		tweetContent = mentions + ", open your heart to spiritualism";

        var params = {
            status: tweetContent,
            in_reply_to_status_id: tweet.id_str
        };

        tweetResponses.post('statuses/update', params, function(err, data, response) {
            if (err)
                console.info('NABGBOT_DEBUG: ' + JSON.stringify(err));
        });
    } catch (e) {
        console.info('NABGBOT_DEBUG: ' + CONFIG.TWITTER_URL + ' Caught ' + e.name + ': ' + e.message);
    }
}

// Make Twitter API calls at a configurable interval, with graceful error handling and logging
function cron() {
  try {
    sendPost();
  } catch(err) {
    console.error('NABG_DEBUG: '+CONFIG.TWITTER_URL+' Caught '+err.name+': '+err.message);
  }
  setTimeout(cron,CONFIG.POST_INTERVAL);
}

cron();

// HTTP requests made to the application's external URL will redirect to the bot's twitter profile.
http.createServer(function(req, res) {
    res.writeHead(301, {Location: CONFIG.TWITTER_URL});
    res.end();
}).listen(CONFIG.PORT, CONFIG.IP);
