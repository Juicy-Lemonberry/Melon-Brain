const mongoose = require('mongoose');
const moment = require('moment-timezone');

const logsSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    maxlength: [512, 'Description cannot exceed 512 characters'],
    required: true
  },
  browser_info: {
    type: String,
    maxlength: [128, 'Browser Information cannot exceed 128 characters'],
    required: true
  },
  datetime: {
    type: Date,
    required: true,
    default: () => {
      return new Date().toLocaleString("en-US", {timeZone: "Asia/Singapore"});
    }
  },
});


const LogModel = mongoose.model('accounts-logs', logsSchema);
module.exports = LogModel;
