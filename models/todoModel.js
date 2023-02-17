const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  content: { type: String, required: [true, "Please tell us your todo!"] },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Todo = mongoose.model("todo", todoSchema);

module.exports = Todo;
