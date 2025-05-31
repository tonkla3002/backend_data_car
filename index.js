require('dotenv').config();
const express = require("express");
const cors = require("cors");

const data_carRouter = require("./routes/data_car");
const data_parkRouter = require("./routes/data_park");
const adminRouter = require("./routes/admin");
const createdbRouter = require("./routes/createdb");

const app = express();
const port = 8000;


app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Test");
});

app.use("/createdb", createdbRouter);
app.use("/data_car", data_carRouter);
app.use("/data_park", data_parkRouter);
app.use("/admin", adminRouter);


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

