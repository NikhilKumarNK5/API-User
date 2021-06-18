//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDatabase", {useNewUrlParser: true});

// Schema Creation
const userSchema = {
    title: String,
    content: String
};

// Model Creation
const User = mongoose.model("User", userSchema);


//TODO


//Request targeting all users
app.route("/users")

.get(function(req, res){
    
    User.find(function(err, foundUsers){
        if(!err){
            res.send(foundUsers);
        }
        else
            res.send(err);
    });
})

.post(function(req, res){

    const newUser = new User({
        title: req.body.title,
        content: req.body.content
    });
    newUser.save(function(err){
        if(!err)
            res.send("Successfully added a new User.");
        else
            res.send(err);
    });
})

.delete(function(req, res){

    User.deleteMany(function(err){
        if(!err)
            res.send("Successfully deleted all the Users.");
        else
            res.send(err);
    });
});


//Request targeting a specific user
app.route("/users/:userTitle")

.get(function(req, res){

    User.findOne({title: req.params.userTitle}, function(err, founduser){
        if(foundUser)
            res.send(foundUser);
        else
            res.send("No users found.");
    });
})

.put(function(req, res){

    User.update(
        {title: req.params.userTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err)
                res.send("Successfully updated user.");
            else
                res.send(err);
        }
    )
})

.delete(function(req, res){
    User.deleteOne(
        {title: req.params.userTitle},
        function(err){
            if(!err)
                res.send("Successfully deleted the corresponding user.");
            else
                res.send(err);
        }
    )
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
