// Import the bullshit module.
var bs = require('./lib/bullshit.js');

// Import the Twitter API - see https://www.npmjs.com/package/twitter
var Twitter = require('twitter');
var http = require('http');

// Twitter API config
var client = new Twitter({
   consumer_key: 'fill',
   consumer_secret: 'these',
   access_token_key: 'fields',
   access_token_secret: 'out'
});

// Retrieve ip and port from available environment variables, default to 127.0.0.1:3002
var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002
var ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1"

// Generate a post that is less than 140 chars long (in a rather inefficient, though effective fashion)
function generatePost() {
  post = bs.ionize(3);

  // Ensure that posts are <= 140 characters and are NOT undefined.
  while(post.length > 140 || typeof post === 'undefined' || post.length === 0)
    post = bs.ionize(1);

  return post;
}

/* Will attempt to resend tweet until success.
 * Failure here is fairly rare. No worries regarding flooding the API because:
	 a) Timeout will kill the command after a few seconds.
	 b) API rate limiting will kick in, then reset long before next tweet is posted (My implementation runs the script 2x a day with a large interval between)
	 c) Though generatePost occasionally returns an empty string, the twitter API will not accept this and so a new post gets generated anyways, good enough for a quick bot.
 */
function sendPost() {
 client.post('statuses/update', {status: generatePost()}, function(error, tweet, response){
   // Rerun this method on failure (see above).
   if (error)
     sendPost();
 });
}

// Make Twitter API calls at a 15min interval
cron = function(){
  try {
    sendPost();
  } catch(err) {
    console.log("" + new Date().today() + " @ " + new Date().timeNow() + " Error: " + JSON.stringify(err));
  }
  setTimeout(cron,900000)
}

cron();

// HTTP requests made to the application's external URL will redirect to the bot's twitter profile.
http.createServer(function(req, res) {
    res.writeHead(301, {
       Location: 'https://twitter.com/nabgbot'});
    res.end();
}).listen(port, ip);
