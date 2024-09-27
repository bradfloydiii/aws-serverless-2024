const serverless = require("serverless-http");
const express = require("express");
// const { v4 } = require("uuid");
const AWS = require("aws-sdk");
const app = express();

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "AddTodo root.",
  });
});

app.get("/todos", async (req, res, next) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  let todos;

  try {
    const results = await dynamodb.scan({ TableName: "TodoTable" }).promise();
    todos = results.Items;
  } catch (error) {
    console.log(error);
  }

  return res.status(200).json(todos);
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
