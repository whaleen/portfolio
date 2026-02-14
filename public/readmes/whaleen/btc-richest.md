[![Netlify Status](https://api.netlify.com/api/v1/badges/1bb05762-e136-4d75-b370-113b0b8e14f0/deploy-status)](https://app.netlify.com/sites/btc-richest/deploys)


## Production

This repository is a production code base served by Netlify. 

This repository is private therefore the API key and Netlify build hook in this README are kept safely. 

Netlify build hook:
`curl -X POST -d {} https://api.netlify.com/build_hooks/5e619be169507b4365fbc9d8`

This runs the build script on Netlify. Can be run in the terminal manually. Go ahead and try it. It's fun. It is setup in .github/workflows/main.yml to run **every 15 minutes** so it's automatic with 'GitHub Actions'.

### The build script on Netlify is:

`https://chainz.cryptoid.info/btc/api.dws?q=rich ; curl -H 'X-CMC_PRO_API_KEY: ba9dad90-2b59-43ce-aed9-4e5c169b7901' -H 'Accept: application/json' -d 'symbol=BTC'  -G https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest -o _data/btc.json ; eleventy`

This is the combination of 3 commands. 2 which hit their respoective APIs and 1 to build eleventy. Eleventy is the page generator.

**Note: This is an 11ty project. The templating is done with Nunjucks.**

## Local development
- `git clone https://github.com/whaleen/btc-richest`
- `cd btc-richest`
- `npm install`
- `npx @11ty/eleventy --serve`

No data exists in the the _data folder until you run the following scripts. Each of which place data files in the _data folder (inluded in this repo for demonstration. For fresh data you'll need to run the scripts with your API key... See below.).


### Bitcoin Top 1000 Hodlers

`npm run rich`
- Hits Chainz API for top 1000 largest bitcoin hodlers
- Now a file called rich.json in in the _data folder


### Bitcoin Price

`npm run btc`
- Hits Coin Market Cap API with npm script
- Now a file called btc.json in in the _data folder
- Requires an API key.
- Replace API key in the package.json script for 'btc'


### Demo on Netlify
[https://btc-richest.netlify.com](https://btc-richest.netlify.com)

Netfly provides the means to store API keys and to automate builds. Visit their docs to explore options for production. In developement you can just just run the scripts to generate the files locally and push the output to GitHub. This is how this repo is being utilized. Local edits get pushed to GitHub and Netlfy sucks them in.

See `package.json` for scripts used to pull data from the APIs. All script except the 'btc' script are using and Coin Market Cap and require an API key. The rest are using Chainz. It should be evident from looking at the scripts that each is simply a CURL command which write the API results to a file so you can cook up your own recipes based on your needs.

### APIs used

An account with Coing Market Cap is required to use their API.

- Coin Market Cap - https://coinmarketcap.com/api/documentation/v1/
- Chainz - https://chainz.cryptoid.info/api.dws

Netfly provides the means to store API keys and to automate builds. In developement you can just just run the scripts to generate the files locally and push the output to GitHub. This is how this repo is being utilized. Local edits get pushed to GitHub and Netlfy sucks them in.

See package.json for scripts used to pull data from the APIs.
