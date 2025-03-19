require("dotenv").config();
import express from "express";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

let teaData = [];
let nextId = 0;
let deletedIds = []; // Stores IDs of deleted teas

//add a new tea
app.post("/teas", (req, res) => {
  const { name, price } = req.body;
  // Reuse an ID if available, otherwise increment nextId
  const id = deletedIds.length > 0 ? deletedIds.shift() : ++nextId;
  const newTea = { id: id, name, price };
  teaData.push(newTea);
  res.status(201).send(newTea);
});

//get all teas
app.get("/teas", (req, res) => {
  res.status(200).send(teaData);
});

//get a tea with id
app.get("/teas/:id", (req, res) => {
  const tea = teaData.find((t) => t.id === parseInt(req.params.id));
  if (!tea) {
    return res.status(404).send("Tea not found");
  }
  res.status(200).send(tea);
});

//update tea
app.put("/teas/:id", (req, res) => {
  const tea = teaData.find((t) => t.id === parseInt(req.params.id));

  if (!tea) {
    return res.status(404).send("Tea not found");
  }

  const { name, price } = req.body;
  tea.name = name;
  tea.price = price;
  res.send(200).send(tea);
});

//delete tea
app.delete("/teas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = teaData.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).send("tea not found");
  }

  // Remove the tea from the list
  teaData.splice(index, 1);

  // Store the deleted ID for reuse
  deletedIds.push(id);
  deletedIds.sort((a, b) => a - b); // Keep IDs sorted to use the smallest one first
  return res.status(204).send("deleted!");
});

// app.get("/", (req, res) => {
//   res.send("Hello from team J with the tea");
// });

// app.get("/ice-tea", (req, res) => {
//   res.send("Which tea do you want to order?");
// });

// app.get("/twitter", (req, res) => {
//   res.send("monyodotcom");
// });

app.listen(port, () => {
  console.log(`Server is running at port: ${port}...`);
});
