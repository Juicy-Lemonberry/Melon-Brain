const mongoose = require('mongoose');

const externalLinkSchema = new mongoose.Schema({
  title: String,
  url: String,
});

const accountsSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true
  },
  description: {
    type: String,
    maxlength: [5000, 'Description cannot exceed 5000 characters'],
    default: ''
  },
  birthday: {
    type: Date,
    // YYYY-MM-DD, unless null.
    get: v => v ? v.toISOString().split('T')[0] : null,
    default: null
  },
  external_links: {
    type: [externalLinkSchema],
    default: []
  }
});

const AccountModel = mongoose.model('accounts', accountsSchema);
module.exports = AccountModel;
