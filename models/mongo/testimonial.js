const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    name: String,
    message: String,
    image: String
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
