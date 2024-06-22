require("dotenv").config();
const port = process.env.PORT;
const express = require("express");
const https = require("https");
const fs = require("fs");
const option = {
  key: fs.readFileSync("./cert/cert.key"),
  cert: fs.readFileSync("./cert/cert.crt"),
};
const app = express();
const cors = require("cors");
app.use(
  cors({
    origin : true,
    credentials : true,
  })
)
const path = require('path');
