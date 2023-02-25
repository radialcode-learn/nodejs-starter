var express = require("express");
var router = express.Router();
const Todo = require("../models/todoModel");

/* GET All Todos. */
router.get("/", async function (req, res, next) {
  // Find query will return all todos
  const todos = await Todo.find();
  res.send({ success: true, data: todos });
});

/* Create a new Todo. */
router.post("/", async function (req, res, next) {
  // Create methond on Todo Model will create a new document
  const newTodo = await Todo.create({ content: req.body.content });
  res.send({ success: true, data: newTodo });
});

/** Get Single Todo */
router.get("/:id", async function (req, res) {
  const todo = await Todo.findById(req.params.id);
  res.send({ success: true, data: todo });
});

/** Update Todo */
router.put("/:id", async function (req, res) {
  const todoData = {
    content: req.body.content,
    updatedAt: Date.now(),
  };
  const todo = await Todo.findByIdAndUpdate(req.params.id, todoData, {
    new: true,
    runValidators: true,
  });
  res.send({ success: true, data: todo });
});

module.exports = router;
