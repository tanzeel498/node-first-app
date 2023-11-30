const fs = require("node:fs");

const requestHandler = (req, res) => {
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
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=").at(1);
      console.log(message);
      fs.writeFile("message.txt", message, (err) => {
        console.log(err);
        res.writeHead(302, { location: "/" });
        return res.end();
      });
    });
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>Node Server</title></head>");
  res.write("<body><h1>My First Node.js Server Live</h1></body>");
  res.write("</html>");
  res.end();

  // process.exit();
};

module.exports = requestHandler;
