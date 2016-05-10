# New Age BS Bot

Welcome to the New Age BS bot!

This is a quick project built upon Seb Pearce's excellent [New Age Bullshit Generator](http://sebpearce.com/bullshit/) that takes the incredibly humorous output
of the NABG and presents it to the Internet in tweet form.

Before using this, you'll want to `npm install twitter` and grab application keys for your bot from [the dashboard](https://apps.twitter.com/).

After that, you'll want to host the bot somehow. I had a cron job that ran main.js every so often (which I've included in
this repo), but you could also wrap the call to sendPost in a setTimeout and host your application on one of the many
free hosting services available (Openshift, Heroku, etc). This is, of course, assuming that you want to host the bot yourself.

For those of you looking to leverage the power of The Cloud(tm), check out the [Openshift](https://www.openshift.org/) branch of this repository and you'll see
a version of this application in a package that's more or less ready to deploy (minus the twitter account, which you have
to set up yourself). This also implements a setTimeout scheduling method as mentioned above. I actually use this method to
host my own instance of NABSbot (because, thanks to Red Hat's generosity, it's free :^) ).

Enjoy!

See it in action: [@nabgbot](https://www.twitter.com/nabgbot/)
