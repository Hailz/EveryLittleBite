var express =require('express');
var User = require('../models/user');
var router = express.Router();
var aEmail = process.env.AE
var AN = process.env.AN

router.route('/')
  .get(function(req, res){
    console.log(eEmail, AN)
    User.findOne({ email: aEmail, name: AN }, function(err, user){
      if (err) return res.status(500).send(err);
      console.log(user)
      return res.send(user);
    });
  });

module.exports = router;