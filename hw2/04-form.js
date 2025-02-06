const express = require("express");
const app = express();
const port = process.env.PORT || 5001;

// http://localhost:5001/form should return a form with input elements for username, email, and submit button

// http://localhost:5001/submit should return all the data the user entered

app.get("/form", (req, res) => {
  res.writeHead(200, { "content-type": "text/html" });
  res.write(`<form action="/submit" method="get">
  <label for="User">User Name :</label><br>
  <input type="text" id="User" name="User"><br>
  <label for="Email">Email :</label><br>
  <input type="text" id="User" name="Email" ><br><br>
  <input type="submit" value="Submit">
</form> `);
  res.end();
  return;
});

app.get("/submit", (req, res) => {
  console.log("Submmited");
  console.log(req.query);
  //console.log(req);
  res.writeHead(200, { "content-type": "text/html" });
  res.write(
    `<div>
      <p>The name is ${req.query.User}</p>
    </div>
    <div>
        <p>The Email is ${req.query.Email}</p>
    </div>`
  );
  res.end();
});

app.get("*", (req, res) => {
  res.writeHead(200, { "content-type": "text/html" });
  res.write(`<a href="/form" >Form</a>`);
  res.end();
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
