const config = require("./../config.json");
const authenticator = require("./authenticator");
const athlete = require("./athlete");

class Strava {
  constructor(clientId, clientSecret, code) {
    //set the config
    this.setConfig(clientId, clientSecret, code);
    
    // set the endpoints
    this.athlete = athlete;
  }

  setConfig(clientId, clientSecret, code) {
    config.clientId = clientId;
    config.clientSecret = clientSecret;
    config.code = code;
  }
}

module.exports = Strava;