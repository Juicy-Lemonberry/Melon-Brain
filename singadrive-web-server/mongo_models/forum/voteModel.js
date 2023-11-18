const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  account_id: {
    type: Number,
    required: true
  },
  content_id: {
    type: Number,
    required: true
  },
  vote_content: {
    type: String,
    enum: ['POST', 'COMMENT'],
    required: true
  },
  vote_value: {
    type: String,
    enum: ['UPVOTE', 'DOWNVOTE'],
    required: true
  }
});

const VoteModel = mongoose.model('vote', voteSchema);
module.exports = VoteModel;
