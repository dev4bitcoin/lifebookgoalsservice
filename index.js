const express = require("express");
const cors = require("cors");
const app = express().use("*", cors());

require("./startup/logging")();
//require("./startup/config")();
require("./startup/routes")(app);
require("./startup/db")();

const port = process.env.port || 5000;

app.listen(port, () => {
  console.log(`Listening Port ${port}`);
});
