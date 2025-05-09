const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  rating: String
});

module.exports = mongoose.model('Destination', destinationSchema);
