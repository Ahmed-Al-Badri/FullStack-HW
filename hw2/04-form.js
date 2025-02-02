const http = require("http");
const port = process.env.PORT || 5001;

// http://localhost:5001/form should return a form with input elements for username, email, and submit button

// http://localhost:5001/submit should return all the data the user entered

const server = http.createServer((req, res) => {
  if (req.url == "/form") {
    res.writeHead(200, { "content-type": "text/html" });
    res.write(`<form action="/submit" method="post">
  <label for="User">User Name :</label><br>
  <input type="text" id="User" name="User"><br>
  <label for="Email">Email :</label><br>
  <input type="text" id="User" name="Email" ><br><br>
  <input type="submit" value="Submit">
</form> `);
    res.end();
    return;
  }

  if (req.url == "/submit") {
    console.log("Submmited");
    console.log(req);
  }
  res.writeHead(200, { "content-type": "text/html" });
  res.write(`<a href="/form" >Form</a>`);
  res.end();
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
