const express = require("express");
const app = express();
const port = process.env.PORT || 5001;

// http://localhost:5001/welcome should return a status code 200 with a welcome message of your choice in html format

// http://localhost:5001/redirect should redirect the request to '/redirected' by using 302 as the status code / the redirected page should return a redirected message of your choice

// http://localhost:5001/cache should return 'this resource was cached' in html format and set the cache max age to a day

// http://localhost:5001/cookie should return 'cookies… yummm' in plain text and set 'hello=world' as a cookie

// For other routes, such as http://localhost:5001/other, this exercise should return a status code 404 with '404 - page not found' in html format

const routes = [
  "welcome",
  "redirect",
  "redirected",
  "cache",
  "cookie",
  "other",
];

app.get("/", (req, res) => {
  res.status(200);
  res.set({ "Content-Type": "text/html" });
  res.send("Express Routing Exercise");
});

app.get("/welcome", (req, res) => {
  res.status(200);
  res.set({ "Content-Type": "text/html" });
  res.send("<div>Welcome to 03-express-routing</div>");
});
app.get("/redirect", (req, res) => {
  res.status(302);
  res.set({ Location: "/redirected" });
  res.send("<div>Page will redirect</div>");
});
app.get("/redirected", (req, res) => {
  res.status(200);
  res.set({ "Content-Type": "text/html" });
  res.send("This is the redirected page");
});
app.get("/cache", (req, res) => {
  res.status(200);
  res.set("Cache-Content", `public, set-max=${24 * 60 * 60}`);
  res.send("<div>this resource was cached</div>");
});
app.get("/cookie", (req, res) => {
  res.status(200);
  res.set({ "content-type": "text/html", cookie: "hello=world" });
  res.send("<div>cookie... yummm</div>");
});
app.get("*", (req, res) => {
  res.status(404);
  res.set({ "content-type": "text/html" });
  res.send("<div>404... page not found</div>");
});

// Add your code here

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
