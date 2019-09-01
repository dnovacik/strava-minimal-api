const strava = require("./index");

strava.athlete.get()
.then(res => {
  console.log(res + "test.js");
})
.catch(err => {
  console.log(err + "test.js");
});