var express = require('express');
var unirest = require('unirest');
var router = express.Router();
var XMashapeKey = process.env.APEKEY

router.route('/')
  .post(function(req, res){
    unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients="+req.body.ingredients+"&limitLicense=false&number=5&ranking=1")
    .header("X-Mashape-Key", XMashapeKey)
    .header("Accept", "application/json")
    .end(function (result) {
      console.log(result.body);
      return res.send(result.body);
    });
  })

module.exports = router; 