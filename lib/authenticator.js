const stravaConfig = require("./../config.json");
const axios = require("axios");
const {
  authorizationHeader,
  refreshTokenHeader,
  defaultHeader
} = require("./helpers/headers.js");
const qs = require("qs");

module.exports = {
  authenticate,
  refreshTokens
}

const stravaOAuthUrl = 'https://www.strava.com/oauth/token';

// interceptor for auto-refreshing the token if there is a token but client gets error 401
axios.interceptors.response
  .use(response => {
    return response;
  }, error => {
    return new Promise((resolve, reject) => {
      const { response: { status, config } } = error;

      if (status !== 401) {
        return Promise.reject(error);
      }
  
      if (stravaConfig.token && stravaConfig.refreshToken) {
        return refreshTokens()
          .then(response => {
            onSuccess(config, response)
              .then(r => {
                return resolve(r);
              })
              .catch(err => {
                return reject(err);
              });
          })
          .catch(err => {
            return reject(err);
          });
      } else {
        return authenticate()
          .then(response => {
            onSuccess(config, response)
              .then(r => {
                return resolve(r);
              })
              .catch(err => {
                return reject(err);
              })
          })
          .catch(err => {
            return reject(err);
          });
      }
    });
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

  return axios.request(originalRequest);
}