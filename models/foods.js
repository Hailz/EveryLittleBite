var mongoose = require('mongoose');

var FoodsSchema = new mongoose.Schema({
  img: String,
  name: String,
  useBy: String,
  type: String,
  compostable: String,
  freeze: String,
  fridge: String
});

module.exports = mongoose.model('Foods', FoodsSchema);