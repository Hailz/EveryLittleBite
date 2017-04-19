var mongoose = require('mongoose');

var FavoritesSchema = new mongoose.Schema({
  userId: String,
  location: String
});

module.exports = mongoose.model('Favorites', FavoritesSchema);