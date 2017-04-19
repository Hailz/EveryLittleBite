var express = require('express');
var Foods = require('../models/foods');
var router = express.Router();

router.route('/')
  .get(function(req, res){
    Foods.find(function(err, food){
      if (err) return res.status(500).send(err);
      return res.send(food);
    });
  })
  .post(function(req, res){
    Foods.create(req.body, function(err, food){
    if (err) return res.status(500).send(err);
    return res.send(food);
    });
  });


module.exports = router;