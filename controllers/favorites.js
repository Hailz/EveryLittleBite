var express = require('express');
var Favorites = require('../models/favorites');
var router = express.Router();

router.route('/')
  .get(function(req, res){
    Favorites.find(function(err, favorites) {
      if (err) return res.status(500).send(err);
      return res.send(favorites);
  });
})  
  .post(function(req, res) {
    Favorites.findOne({locationId: req.body.location, userId: req.body.userId}, function(err, favorite){
      if (favorite) return res.status(400).send({ message: 'Favorite already exhists!'});
      Favorites.create(req.body, function(err, favorite){
        if (err) return res.status(500).send(err);
        return res.send(favorite)
      });
    });
  });

router.route('/:id').delete(function(req, res){
  Favorites.findOneAndRemove({id: req.params.id}, function(err){ 
    if (err) return res.status(500).send(err);
    return res.send({message: 'Favorite Deleted'})
  })
})


module.exports = router;