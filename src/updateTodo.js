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

app.put("/todo/:id", async (req, res, next) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const { completed } = req.body;
  const { id } = req.params;

  let todoToUpdate;
  let todo;

  try {
    const results = await dynamodb
      .get({
        TableName: "TodoTable",
        Key: { id },
      })
      .promise();

    todoToUpdate = results.Item;

    todo = await dynamodb
      .update({
        TableName: "TodoTable",
        Key: { id },
        UpdateExpression: "set completed = :completed",
        ExpressionAttributeValues: {
          ":completed": completed
        },
        ReturnValues: "ALL_NEW"
      })
      .promise();

  } catch (error) {
    console.log(error);
  }

  return res.status(200).json(todo);
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
