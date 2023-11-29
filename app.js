const http = require("http");
const fs = require("fs");
const { parse } = require("path");

const server = http.createServer(function (req, res) {
  // console.log(req.url, req.method, req.headers);
  // console.log(req);

  const { url, method } = req;

  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Send a Message</title></head>");
    res.write("<body>");
    res.write("<form method='POST' action='/message'>");
    res.write(
      "<input type='text' name='message' /><button type='submit'>Send</button>"
    );
    res.write("</form>");
    res.write("</body>");
    res.write("</html>");
    res.end();
    return;
  }

  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => body.push(chunk));
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=").at(1);
      fs.writeFileSync("message.txt", message);
    });

    res.writeHead(302, { location: "/" });
    return res.end();
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>Node Server</title></head>");
  res.write("<body><h1>My First Node.js Server Live</h1></body>");
  res.write("</html>");
  res.end();

  // process.exit();
});

server.listen(3000);
