const mongoose = require('mongoose');

const commentContentSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true
  },
  content: {
    type: String,
    maxlength: [5000, 'Content cannot exceed 5000 characters'],
    required: true
  },
  parent_comment_id: {
    type: Number,
    required: false,
    default: null
  }
});

const CommentContentModel = mongoose.model('comment_content', commentContentSchema);
module.exports = CommentContentModel;