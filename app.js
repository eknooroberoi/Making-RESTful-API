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


mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
  title: String,
  content: String
}
const Article = mongoose.model("Article", articleSchema);


//when client sends get request to localhost:3000/articles,server is configured to fetch all the articles to client
app.get("/articles", function(req,res){
  Article.find(function(err, foundArticles){
    if(!err){
        res.send(foundArticles);
    }
  else{
    res.send(err);
  }
});
});


//client makes post request to article route, that should create a new article and add it to our collection in Database(client sends data to server)
app.post("/articles", function(req,res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if(!err){
        res.send("Successfully added a new article");
    }
  else{
    res.send(err);
  }
  });
});


//client is sending http delete request to /articles route, this should delete all articles in our collection
app.delete("/articles", function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all articles");
    }
    else{
      res.send(err);
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
