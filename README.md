# New Age BS Bot

Welcome to the New Age Bullshit bot!

This is a quick project built upon Seb Pearce's excellent [New Age Bullshit Generator](http://sebpearce.com/bullshit/) that
takes the incredibly humorous output of the NABG and presents it to the internet in tweet form.

This is the Openshift-ready branch that I use in production to host [@nabgbot](https://www.twitter.com/nabgbot/). Necessary changes
have been made to accommodate for Openshift's various requirements, and the bot posts at a 15 minute interval. The code has
also been configured to redirect to the bot's twitter profile should a user make an HTTP request to the application (e.g at [nabgbot-ctis.rhcloud.com](http://nabgbot-ctis.rhcloud.com)).

After configuration, you should be able to simply import the repo into an Openshift gear and be ready to go. You will need
to fill out the Twitter API config before doing so, however. You may also wish to adjust the interval at which tweets
are posted (the default is 15 minutes).

Enjoy!

See it in action: [@nabgbot](https://www.twitter.com/nabgbot/)
