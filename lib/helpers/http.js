const authenticator = require("./../authenticator");
const qs = require("qs");
const axios = require("axios").default;
const { defaultHeader } = require("./headers");

module.exports = {
  get
}

const baseURL = 'https://www.strava.com/api/v3/';

function get(path, params) {
  let uri = params ? `${path}?${qs(params)}` : path;

  return axios.get(uri, {
    headers: defaultHeader(authenticator.stravaConfig.token),
    baseURL: baseURL
  });
}