const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const axios = require("axios");
const cheerio = require("cheerio");
var async = require("async");


app.get("/I/want/title/", (req, res) => {
  const addresses = [
    ...(Array.isArray(req.query.address)
      ? req.query.address
      : [req.query.address]),
  ];
  getTitles(addresses, (titles) => {
    console.log('dilta yem',titles);
    res.send(
      `<html>
                      <head></head>
                      <body>
                      
                          <h1> Following are the titles of given websites: </h1>
                          <ul>
                          ${titles.map((title) => `<li>${title}</li>`).join("")}
                          </ul>
                      </body>
                  </html>`
    );
  });
});

const getTitle = (address, callback) => {
  axios
    .get(address.startsWith("http") ? address : `https://${address}`)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const title = $("title").text();
      callback(`${address} - "${title}"`);
    })
    .catch(() => {
      callback(`${address} - NO RESPONSE`);
    });
};

const getTitles = (addresses, callback) => {
  const titles = [];
  async.each(addresses, (address, callback) => {
    getTitle(address, (title) => {
      titles.push(title);
      if (titles.length === addresses.length)
        callback(titles);
    });
  }).catch(() => {
    callback(titles);
  });
};

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
