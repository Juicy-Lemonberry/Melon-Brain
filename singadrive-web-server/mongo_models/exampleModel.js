const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
    sampleContent: String
});

const ExampleModel = mongoose.model('Example', exampleSchema);

module.exports = ExampleModel;