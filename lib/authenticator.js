const axios = require("axios").default;
const {
  authorizationHeader,
  refreshTokenHeader,
  defaultHeader
} = require("./helpers/headers.js");
const qs = require("qs");

const stravaOAuthUrl = 'https://www.strava.com/oauth/token';

// the user data stravaConfig
const stravaConfig = {
  clientId: process.env.STRAVA_CLIENT_ID || null,
  clientSecret: process.env.STRAVA_CLIENT_SECRET || null,
  code: process.env.STRAVA_AUTH_CODE || null,
  token: null,
  refreshToken: null
}

module.exports = {
  authenticate,
  refreshTokens,
  stravaConfig
}

// interceptor for auto-refreshing the token if there is a token but client gets error 401
const interceptor = axios.interceptors.response
  .use(response => {
    return response;
  }, error => {
    const { response: { status, config } } = error;

    if (status !== 401) {
      return Promise.reject(error);
    }

    axios.interceptors.response.eject(interceptor);

    if (stravaConfig.token && stravaConfig.refreshToken) {
      refreshTokens()
        .then(response => {
          return onSuccess(config, response);
        })
        .catch(err => {
          return onFailure(err);
        });
    } else {
      authenticate()
        .then(response => {
          return onSuccess(config, response);
        })
        .catch(err => {
          return onFailure(err);
        });
    }
  });

function authenticate() {
  let uri = `${stravaOAuthUrl}?${qs.stringify(authorizationHeader(stravaConfig.clientId, stravaConfig.clientSecret, stravaConfig.code))}`;

  return axios.post(uri);
}

function refreshTokens() {
  let uri = `${stravaOAuthUrl}?${qs.stringify(refreshTokenHeader(stravaConfig.clientId, stravaConfig.clientSecret, stravaConfig.refreshToken))}`;

  return axios.post(uri);
}

function onSuccess(originalRequest, response) {
  stravaConfig.token = response.data.access_token;
  stravaConfig.refreshToken = response.data.refresh_token;

  let headers = defaultHeader(stravaConfig.token);
  originalRequest.headers = headers;

  return axios.request(originalRequest)
    .then(r => {
      return Promise.resolve(r);
    })
    .catch(e => {
      return Promise.reject(e);
    });
}

function onFailure(error) {
  return Promise.reject(error);
}