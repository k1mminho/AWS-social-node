require("dotenv").config();
const port = process.env.PORT;
const express = require("express");
const https = require("https");
const fs = require("fs");
const options = {
  key: fs.readFileSync("./cert/cert.key"),
  cert: fs.readFileSync("./cert/cert.crt"),
};
const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
const path = require("path");
const models = require("./models");
const {sequelize, Op, where} = require("sequelize")
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const passport = require('passport')

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

const sessionConfig = session({
  secret: "1111",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60, secure: true, httpOnly: false, sameSite: 'none' },
  store: new MySQLStore(dbConfig),
});

app.use(express.static(path.join(__dirname + "/public")))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

const passportConfig = require('./passport')
passportConfig()

app.listen(11111, () => {
  console.log(`http://192.168.219.106:11111`);
});

const server = https.createServer(options, app).listen(port, () => {
  console.log(`https://192.168.219.106:${port}`);
});

const { Server } = require("socket.io");
const { userInfo } = require("os");
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
  res.send({ userInfo: req.user })
});

app.get(`/api/post`, async(req, res) =>{
  const {postId} = req.query
  const result = await models.Post.findOne({where : {postId : postId}})
  return res.send(result)
})

