const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, required: true },
    image: { type: String, required: true },  // Image filename, to be used in /Images folder
});

const About = mongoose.model('About', teamMemberSchema);

module.exports = About;
