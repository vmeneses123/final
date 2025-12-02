const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("public"));

function loadData() {
  return JSON.parse(fs.readFileSync("data.json"));
}

function saveData(data) {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

app.post("/add", (req, res) => {
  const { category, amount } = req.body;
  const data = loadData();

  data.expenses.push({
    category,
    amount: Number(amount)
  });

  saveData(data);
  res.sendStatus(200);
});

app.get("/expenses", (req, res) => {
  const data = loadData();
  const totals = {};

  data.expenses.forEach(e => {
    if (!totals[e.category]) totals[e.category] = 0;
    totals[e.category] += e.amount;
  });

  res.json({
    categories: Object.keys(totals),
    amounts: Object.values(totals),
    total: Object.values(totals).reduce((a, b) => a + b, 0)
  });
});

app.post("/reset-category", (req, res) => {
  const { category } = req.body;
  const data = loadData();

  data.expenses = data.expenses.filter(e => e.category !== category);

  saveData(data);
  res.sendStatus(200);
});

app.post("/reset-all", (req, res) => {
  const data = loadData();

  data.expenses = [];

  saveData(data);
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

