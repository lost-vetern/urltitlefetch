const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const axios = require("axios");
const cheerio = require("cheerio");
const RSVP = require("rsvp");

app.get("/I/want/title/", (req, res) => {
  const addresses = [
    ...(Array.isArray(req.query.address)
      ? req.query.address
      : [req.query.address]),
  ];
  getTitles(addresses, (titles) => {
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

const getTitles = async (addresses, callback) => {
  const titles = [];

  await Promise.all(
    addresses.map(async (address) => {
      const promise = new RSVP.Promise((resolve, reject) => {
        axios
          .get(address.startsWith("http") ? address : `https://${address}`)
          .then((response) => {
            const $ = cheerio.load(response.data);
            const title = $("title").text();
            resolve(`${address} - "${title}"`);
          })
          .catch(() => {
            reject(`${address} - NO RESPONSE`);
          });
      });
      promise
        .then(function (title) {
          titles.push(title);
        })
        .catch(function (error) {
          titles.push(title);
        })
        .finally(() => {
          if (titles.length === addresses.length) {
            callback(titles);
          }
        });
    })
  );
};

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
