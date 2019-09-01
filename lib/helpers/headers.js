module.exports = {
  authorizationHeader,
  refreshTokenHeader,
  defaultHeader
}

function authorizationHeader(clientId, clientSecret, code) {
  return {
    'client_id': clientId,
    'client_secret': clientSecret,
    'code': code,
    'grant_type': 'authorization_code'
  }
}

function refreshTokenHeader(clientId, clientSecret, refreshToken) {
  return {
    'client_id': clientId,
    'client_secret': clientSecret,
    'refresh_token': refreshToken,
    'grant_type': 'refresh_token'
  }
}

function defaultHeader(token) {
  return {
    'Authorization': `Bearer ${token}`
  }
}