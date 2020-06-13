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
})
//foundArticle is results(function(err,results))
//space is represented by %20
//if we want to search article with title Jack Bauer
//localhost:3000/articles/Jack%20Bauer
//if client wants to submit entire new version of the article on Jack Bauer, then it will be done by sending put request on this particular route
//replacing a particular document inside the articles collection with whatever is sent over by the client
.put(function(req,res){
  Article.update(
    //condition, updating article found through this search
    {title: req.params.articleTitle},
    //actual update we want to make, by update me mean we are replacing the original doc with new doc, if we provide new value for only 1 parameter like content, it will remove title, coz instead of changing it replaces with value we provided, and if we dont provide value it removes that parameter.
    {title: req.body.title, content: req.body.content},
    //by default mongoose prevent properties to be overwritten
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated article");
      }
    }
  );
})
//PATCH updates the fields we provided, and not the entire doc.It is not replacing with new doc, but making changes in the old doc
//PUT makes the field not provided for changing as null
//PATCH is HTTP method which is used when we want to update a specific field in specific document
.patch(function(req,res){
  Article.update(
    {title: req.params.articleTitle},
    //flag is set for values of the fields we want to update
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article");
      }else{
        res.send(err);
      }
    }
  );
})

.delete(function(req,res){
  Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if(!err){
          res.send("Successfully deleted the corresponding article");
        }else{
          res.send(err);
        }
      }
  );
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
