var mongoose = require('mongoose');

var PantriesSchema = new mongoose.Schema({
  userId: String,
  name: String,
  addDate: String,
  img: String,
  useBy: String,
  type: String,
  compostable: String,
  freeze: String,
  fridge: String
});

module.exports = mongoose.model('Pantries', PantriesSchema);