# New Age BS Bot

--

Welcome to the New Age BS bot!

This is a quick project built upon Seb Pearce's excellent [New Age Bullshit Generator]() that takes the incredibly humorous output 
of the NABG and presents it to the internet in tweet form.

Before using this, you'll want to `npm install twitter` and grab application keys for your bot from [the dashboard](https://apps.twitter.com/).

After that, you'll want to host the bot somehow. I had a cron job that ran main.js every so often (which I've included in this repo), but
you could also wrap the call to sendPost in a setTimeout and host your application on one of the many free services available (Openshift, Heroku, etc). 

Enjoy!

See it in action: [@nabgbot](https://www.twitter.com/nabgbot/)
