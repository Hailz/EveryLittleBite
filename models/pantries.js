var mongoose = require('mongoose');

var PantriesSchema = new mongoose.Schema({
  userId: String,
  name: String,
  addDate: String
});

module.exports = mongoose.model('Pantries', PantriesSchema);