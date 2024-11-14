const { error } = require("console");
const express = require("express");
const fs = require("fs");
const { runInNewContext } = require("vm");
const app = express();
const PORT = 3005;
app.use(express.json());
// function to read todos from db.json file
const readTodosFromFile = () => {
  const data = fs.readFileSync("./db.json", "utf-8");
  return JSON.parse(data).todos;
};
// function to write todos to db.json
const writeTodosToFile = (todos) => {
  const data = { todos };
  fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));
};
// API to get all todos
app.get("/", (req, res) => {
  const todos = readTodosFromFile();
  res.json(todos);
});
// API to add a new todo
app.post("/todos", (req, res) => {
  const todos = readTodosFromFile();
  const newTodo = {
    id: todos.length ? todos[todos.length - 1].id + 1 : 1, //todos.length-1 -last index
    task: req.body.task,
    status: false,
  };
  todos.push(newTodo);
  writeTodosToFile(todos);
  res.status(201).json(newTodo);
});
//An API to update the status of all the todos that have even ID from false to true.
//This will work only if the todo with even ID has a status as false.
app.put("/todos/update-even-ids", (req, res) => {
  const todos = readTodosFromFile();
  let updatedCount = 0;
  let updatedTodos = todos.map((todo) => {
    if (todo.id % 2 === 0 && todo.status === false) {
      todo.status = true;
      updatedCount++;
    }
    return todo;
  });
  writeTodosToFile(updatedTodos);
  res.json({message:`${updatedCount} todos updated`});
});
//An API to Delete all the todos whose status is true
app.delete("/todos/delete-status-true",(req,res)=>{
  const todos = readTodosFromFile();
  const afterDeletingTodos = todos.filter((todo)=>!todo.status);// keep only todos with status  false
  writeTodosToFile(afterDeletingTodos);
 res.json({message:`${todos.length - afterDeletingTodos.length} todos deleted`});
});
app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
