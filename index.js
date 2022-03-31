const express = require("express");
const fetch = require("node-fetch");
const app = express();

// require("dotenv").config();

// if using node-redis package
const { createClient } = require("redis");


const REDIS_URL="rediss://master:password@redis:6379"
const REDIS_HOST="redis"

const redis = createClient({
  url: REDIS_URL,
});

// if using ioredis package
// const Redis = require("ioredis");

// const redis = new Redis(process.env.REDIS_URL, {
//     tls: {
//         servername: process.env.REDIS_HOST,
//     },
// });

const port = 3000;

app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Hello from st-core-service" });
});

app.get("/pricing-service", async (req, res) => {
  const response = await fetch("http://pricing-service-clusterip-service:3001");
  const data = await response.json();
  console.log(data);
  res.json(data);
});

app.get("/redis", (req, res) => {

    await redis.connect(); // if using node-redis client.

    const pingCommandResult = await redis.ping();
    console.log("Ping command result: ", pingCommandResult);

    const getCountResult = await redis.get("count");
    console.log("Get count result: ", getCountResult);

    const incrCountResult = await redis.incr("count");
    console.log("Increase count result: ", incrCountResult);

    const newGetCountResult = await redis.get("count");
    console.log("New get count result: ", newGetCountResult);

    await redis.set(
      "object",
      JSON.stringify({
        name: "Redis",
        lastname: "Client",
      })
    );

    const getStringResult = await redis.get("object");
    console.log("Get string result: ", JSON.parse(getStringResult));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
