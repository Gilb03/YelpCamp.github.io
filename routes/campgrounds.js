//===============================
//INDEX ROUTES
//================================
//index route - show all campgrounds
var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get("/", function (req, res){
    req.user
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
        }
    });   
});

//create route - add new campgrounds
router.post("/", isLoggedIn, function (req, res){
    var name = req.body.name,
        author = {
            id: req.user._id,
            username: req.user.username
        }
      image = req.body.image,
      description = req.body.description,
      link = req.body.link,
      newCampground = {  name: name,  image: image,  description: description,  link: link, author: author }
  //  create a new campground and save to dB
      Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
      });
});
//new -show form to create new campground
router.get("/new", isLoggedIn, function (req, res){
    res.render("campgrounds/new");
});

//SHOW Route -shows more info about one campground
router.get("/:id", function(req, res){
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
        res.redirect("/login");
}
module.exports = router;