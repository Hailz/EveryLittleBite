var express = require('express');
var Pantries = require('../models/pantries');
var router = express.Router();

router.route('/')
  .get(function(req, res){
    Pantries.find(function(err, pantries) {
      if (err) return res.status(500).send(err);
      return res.send(pantries);
  });
})  
  .post(function(req, res) {
    Pantries.findOne({name: req.body.name, userId: req.body.userId}, function(err, exhists){
      if (exhists) return res.status(400).send({ message: 'Item already exhists in users pantry!'});
      Pantries.create(req.body, function(err, pantry){
        if (err) return res.status(500).send(err);
        return res.send(pantry)
      });
    });
  });

router.delete('/:id', function(req, res){
  Pantries.findByIdAndRemove(req.params.id, function(err){ 
    if (err) return res.status(500).send(err);
    return res.send({message: 'Pantry item Deleted'})
  });
});

router.route('/:id')
  .get(function(req, res) {
    Pantries.findById(req.params.id, function(err, pantry) {
      if (err) return res.status(500).send(err);
      return res.send(pantry);
    });
  });

  router.put('/:id', function(req, res) {
    console.log("______________",req.body, req.params.id)
    Pantries.findByIdAndUpdate(req.params.id, req.body, function(err) {
      if (err) return res.status(500).send(err);
      return res.send({ message: 'success' });
    });
  });


module.exports = router;