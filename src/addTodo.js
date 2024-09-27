const serverless = require("serverless-http");
const express = require("express");
const { v4 } = require("uuid");
const AWS = require("aws-sdk");
const app = express();

app.use(express.json());

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "AddTodo root.",
  });
});

app.post("/addTodo", async (req, res, next) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { todo } = await req.body;
  const createdAt = new Date().toISOString();
  const id = v4();

  const newTodo = {
    id,
    todo,
    createdAt,
    completed: false,
  };

  await dynamodb
    .put({
      TableName: "TodoTable",
      Item: newTodo,
    })
    .promise();

  return res.status(200).json(newTodo);
});

app.get("/hello", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
