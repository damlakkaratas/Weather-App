const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");

});

app.post("/", function(req, res) {
  const apiKey = "a191dd0ed149dc007ea1001b25493c6b";
  const unit = "metric";
  const query = req.body.cityName;
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit
  https.get(url, function(response) {
    console.log(response.statusCode);

    let weatherData = "";

    response.on("data", function(data) {
      weatherData += data;
    });
    response.on("end", function() {
      weatherData = JSON.parse(weatherData);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL =
        "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      const htmlResponse = `
            <h1>The weather is currently ${weatherDescription}.</h1>
            <p>The temperature in Izmir is ${temp} degrees Celsius.</p>
            <img src="${imageURL}" alt="Weather Icon">
          `;

      res.send(htmlResponse)
    });
  });
});

app.listen(3000, function() {
  console.log("Server is running on port 3000")
});
