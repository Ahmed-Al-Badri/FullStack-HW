const http = require("http");
const { url } = require("inspector");
const port = process.env.PORT || 5001;
const NodeCache = require("node-cache");

// http://localhost:5001/welcome should return a status code 200 with a welcome message of your choice in html format

// http://localhost:5001/redirect should redirect the request to '/redirected' by using 302 as the status code / the redirected page should return a redirected message of your choice

// http://localhost:5001/cache should return 'this resource was cached' in html format and set the cache max age to a day

// http://localhost:5001/cookie should return 'cookies… yummm' in plain text and set 'hello=world' as a cookie

// For other routes, such as http://localhost:5001/other, this exercise should return a status code 404 with '404 - page not found' in html format
const cache = new NodeCache();
const server = http.createServer((req, res) => {
  const routes = [
    "welcome",
    "redirect",
    "redirected",
    "cache",
    "cookie",
    "other",
  ];

  console.log(req.url + " is the amount");
  if (req.url == "/welcome") {
    res.writeHead(200, { "Content-type": "text/html" });
    res.write("<div>HTML Welcome</div>");
    res.end();
    return;
  }
  if (req.url == "/redirect") {
    res.writeHead(302, { Location: "/redirected" });
    res.write("<div>You will be redirected</div>");
    res.end();
    return;
  }
  if (req.url == "/redirected") {
    res.writeHead(200, { "content-type": "text/html" });
    res.write("<div>This is the redirect page</div>");
    res.end();
    return;
  }
  if (req.url == "/cache") {
    res.setHeader("Cache-Control", `max-age=${60 * 60 * 24}`);
    res.writeHead(200, {
      "content-type": "text/html",
    });

    let data = "<div>this resource was cached</div>";
    res.end(data);
    return;
  }
  if (req.url == "/cookie") {
    res.setHeader("Set-Cookie", "hello=world");
    res.writeHead(200, { "content-type": "text/html" });
    res.write("<div>cookies... yummm</div>");
    res.end();
    return;
  }
  if (req.url == "/other") {
    res.writeHead(401, { "content-type": "text/html" });
    res.write("<div>404 - page not found</div>");
    res.end();
    return;
  }
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("Node Routing Exercise");
  res.end();
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
