const express = require("express");
// const mysql = require("mysql");
const cors = require("cors");
const mongoose = require("mongoose");
const model = require("./model");
const usermodel = require("./usermodel");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.set("strictQuery", false);

console.log("Connecting to MongoDB.....");

mongoose
  .connect(process.env.URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting MongoDB", error);
  });

app.get("/", async (req, res) => {
  const link = await model.findOne({ id: 1 }, { link: 1 });
  res.send({ link: link.link });
});

app.post("/update", async (req, res) => {
  const response = await model.findOneAndUpdate(
    { id: 1 },
    { $set: { link: req.body.newUrl } }
  );
  res.send({ success: true });
});

app.post("/add", async (req, res) => {
  const user = new usermodel({
    name: req.body.name,
    mobile: req.body.mobile,
  });
  const response = await user.save();
  if (response && response._id) {
    res.status(200).json({
      success: true,
      message: "User saved successfully",
      data: response,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "User not saved",
    });
  }
});

app.post("/getUsers", async (req, res) => {
  const users = await usermodel.find({}, {}, { lean: true });
  if (users && users.length > 0) {
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "No users found",
    });
  }
});

app.listen(3000, () => {
  console.log("listening");
});
