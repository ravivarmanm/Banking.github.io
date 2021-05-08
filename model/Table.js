const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  amount: Number,
  transferredAt: Date,
});

const Table = new mongoose.model("Table", tableSchema);
module.exports = Table;
