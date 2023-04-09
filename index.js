//index.js
const express = require('express');
require("dotenv").config();
const cors = require("cors");
const os = require('os')
const mongoose = require('mongoose');
const { createClient } = require('redis');
const session = require('express-session');
//const redis = require('redis');
const RedisStore = require("connect-redis").default
const { MONGO_IP,
  MONGO_PORT,
  MONGO_USER,
  MONGO_PASSWORD,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET } = require('./config/config.js');

const redisClient = createClient({
  url: `redis://${REDIS_URL}:${REDIS_PORT}`
});

redisClient.connect().catch(console.error);
//redisClient.on('error', err => console.log('Redis Client Error', err));
//console.log("REDIS :", REDIS_URL, REDIS_PORT, SESSION_SECRET);
const postRouter = require('./routes/postRoutes.js')
const userRouter = require('./routes/userRoutes.js')

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
  mongoose
    .connect(mongoURL)
    //.connect("mongodb://root:super-password1@mongodb-node:27017/?authSource=admin")
    //.connect("mongodb://root:super-password1@103.151.155.59:27027/?authSource=admin")
    .then(() => console.log("Sukses Koneksi MongoDB Rev"))
    .catch((e) => {
      console.log(e)
      setTimeout(connectWithRetry, 5000)
    })
}

connectWithRetry()
app.enable("trust proxy");
app.use(cors({}));
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: SESSION_SECRET,
  cookie: {
    secure: false,
    resave: false,
    saveUninitialized: false,
    httpOnly: true,
    maxAge: 3000000
  }
}))

app.use(express.json())

app.get('/api', (req, res) => {
  res.send(`Hello Silmi 3 Dev ${os.hostname()}`);
});

app.use("/api/v1/posts", postRouter)
app.use("/api/v1/users", userRouter)
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Example app listening on port  ${port}`);
});
