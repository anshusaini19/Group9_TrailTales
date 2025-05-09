const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String, // e.g. /Images/gallery1.jpg
        required: true
    }
});

module.exports = mongoose.model('Gallery', gallerySchema);
