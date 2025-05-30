const express = require("express");
const cors = require("cors");
// const dataRouter = require("./routes/data");
// const userRouter = require("./routes/user");
// const detailRouter = require("./routes/detail")
// const searchRouter = require("./routes/search")
const data_carRouter = require("./routes/data_car");
const data_parkRouter = require("./routes/data_park");

const app = express();
const port = 8000;

// Middleware
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true })); // Replaces body-parser, as it's included in Express

// Routes
app.get("/", (req, res) => {
  res.send("Hello, Hee Pin");
});

app.use("/data_car", data_carRouter);
app.use("/data_park", data_parkRouter);
// app.use("/data", dataRouter);
// app.use("/user", userRouter);
// app.use("/detail", detailRouter);
// app.use("/search", searchRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

