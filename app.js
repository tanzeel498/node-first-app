const { log } = require("console");
const http = require("http");
// import http from "http";

const server = http.createServer(function (req, res) {
  console.log(req);
});

server.listen(3000);
