const mongoose = require('mongoose');

const logsSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    maxlength: [512, 'Description cannot exceed 5000 characters'],
    required: true
  },
  datetime: {
    type: Date,
    required: true
  },
});

const LogModel = mongoose.model('accounts-logs', logsSchema);
module.exports = LogModel;
