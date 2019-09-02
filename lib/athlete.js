const qs = require("qs");
const axios = require("axios");
const config = require("./../config.json");
const { defaultHeader } = require("./helpers/headers");

module.exports = {
  get,
  getStats
}

const baseURL = 'https://www.strava.com/api/v3/';

function get(params) {
  let uri = params ? `athlete?${qs.stringify(params)}` : 'athlete';

  return axios.get(uri, {
    headers: defaultHeader(config.token),
    baseURL: baseURL
  });
}

function getStats(parms) {
  const { athleteId, ...param } = parms;

  let uri = `athletes/${athleteId}/stats?${qs.stringify(param)}`;

  return axios.get(uri, {
    headers: defaultHeader(config.token),
    baseURL: baseURL
  });
}