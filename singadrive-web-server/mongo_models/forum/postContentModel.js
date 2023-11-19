const mongoose = require('mongoose');

const postContentSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true
  },
  title: {
    type: String,
    maxlength: [512, 'Title cannot exceed 512 characters'],
    required: true
  },
  content: {
    type: String,
    maxlength: [5000, 'Description cannot exceed 5000 characters'],
    required: true
  }
});

const PostContentModel = mongoose.model('posts_content', postContentSchema);
module.exports = PostContentModel;
