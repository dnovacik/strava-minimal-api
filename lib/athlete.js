const { get } = require("./helpers/http");

module.exports = {
  get: getAthlete
}

function getAthlete() {
  return get('athlete');
}