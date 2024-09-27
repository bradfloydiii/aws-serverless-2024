const serverless = require("serverless-http");
const express = require("express");
const app = express();

app.get("/greeting", (req, res, next) => {
  return res.status(200).json({
    message: `Go Serverless v2.0! Your function executed successfully!`,
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
