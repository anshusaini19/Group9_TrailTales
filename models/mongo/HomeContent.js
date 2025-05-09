const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
  about1: String,
  about2: String
});

module.exports = mongoose.model('HomeContent', homeSchema);
