const mongoose = require("mongoose");

const msgSchema = mongoose.Schema({
  id: Number,
  link: String,
});

module.exports = mongoose.model("ytlive", msgSchema, "ytlives");
