# New Age BS Bot

Welcome to the New Age Bullshit bot!

This is a quick project built upon [Seb Pearce](https://github.com/sebpearce)'s excellent [New Age Bullshit Generator](http://sebpearce.com/bullshit/) that
takes the incredibly humorous output of the NABG and presents it to the Internet in tweet form.

This is the very same [Openshift](https://developers.openshift.com/index.html) package that I use to host [@nabgbot](https://www.twitter.com/nabgbot/), which posts at
a 15 minute interval. The code has also been configured to redirect to the bot's twitter profile should a user make an HTTP
request to the application (e.g. at [nabgbot-ctis.rhcloud.com](http://nabgbot-ctis.rhcloud.com)).

After filling in the configuration, you should be able to simply import the repo into an Openshift gear and be ready to go. You may also wish to adjust
the interval at which tweets are posted (the default is one post every 15 minutes).

**Note:** If you don't want to host your bot on Openshift and would prefer to run it as a script with a cron job or something, have a look at this repository
at [this commit](https://github.com/ctrezevant/new-age-bs-bot/tree/ae02696c4e8e26770f010ab72cffed241c833855).

##Quickstart

Assuming that you already have some amount of familiarity with Openshift, tnitial setup is quite easy. Simply clone
this repository to your local machine, grab [your Twitter API keys](https://apps.twitter.com), and fill out the bot
configuration. Once finished, [create your NodeJS application](https://developers.openshift.com/languages/nodejs/getting-started.html) and push your newly configured bot to your gear.

##Configuration

All configuration is located in the **CONFIG** object:

*  **CONFIG.TWITTER\_API\_KEYS**: The API keys that your bot will use to connect to Twitter. Get these from https://apps.twitter.com

*  **CONFIG.IP**: The external IP address of the Openshift gear. This is automatically retrieved, or if you're running a local
    instance will default to 127.0.0.1

*  **CONFIG.PORT**: The port on which the gear's HTTP server is accessible. This is also retrieved automatically, however, it
    will default to port 8082 on your local machine.

*  **CONFIG.TWITTER\_URL**: The URL of your bot's Twitter profile. This is used to serve a redirect should the application be visited
    from its external URL.

*  **CONFIG.POST\_INTERVAL**: The interval at which posts are made, in milliseconds. The default is 900000ms, which is 15 minutes.
    Be sure to keep [Twitter's API rate limits](https://dev.twitter.com/rest/public/rate-limiting/) in mind when adjusting this.

Enjoy!

See it in action: [@nabgbot](https://www.twitter.com/nabgbot/)
