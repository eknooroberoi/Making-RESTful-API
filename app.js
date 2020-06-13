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


/////////////////////Requests targetting all the articles///////////////////////////////////////////////////////////
//chainable route handlers, refactured the code(app.route("/articles").get().post().delete()), chained get,post,delete method together
app.route("/articles")

.get(function(req,res){
  Article.find(function(err, foundArticles){
    if(!err){
        res.send(foundArticles);
    }
  else{
    res.send(err);
  }
});
})

.post(function(req,res){
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
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all articles");
    }
    else{
      res.send(err);
    }
  });
});



// //when client sends get request to localhost:3000/articles,server is configured to fetch all the articles to client
// app.get("/articles", function(req,res){
//   Article.find(function(err, foundArticles){
//     if(!err){
//         res.send(foundArticles);
//     }
//   else{
//     res.send(err);
//   }
// });
// });
//
//
// //client makes post request to article route, that should create a new article and add it to our collection in Database(client sends data to server)
// app.post("/articles", function(req,res){
//   const newArticle = new Article({
//     title: req.body.title,
//     content: req.body.content
//   });
//   newArticle.save(function(err){
//     if(!err){
//         res.send("Successfully added a new article");
//     }
//   else{
//     res.send(err);
//   }
//   });
// });
//
//
// //client is sending http delete request to /articles route, this should delete all articles in our collection
// app.delete("/articles", function(req,res){
//   Article.deleteMany(function(err){
//     if(!err){
//       res.send("Successfully deleted all articles");
//     }
//     else{
//       res.send(err);
//     }
//   });
// });


/////////////////////Requests targetting a specific article///////////////////////////////////////////////////////////
app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.dend("No articles matching that title was found.");
    }
  });
});
//space is represented by %20
//if we want to search article with title Jack Bauer
//localhost:3000/articles/Jack%20Bauer





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
