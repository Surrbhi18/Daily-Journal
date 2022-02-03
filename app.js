const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const _ = require('lodash')
const mongoose = require('mongoose')

const homeStratingContent = "Fill your paper with the breathings of your heart.A journal is your completely unaltered voice.Journaling helps you to remember how strong you truly are within yourself.Write what disturbs you, what you fear, what you have not been willing to speak about. Be willing to be split open."
const aboutContent = "Humans are the best creation, and each person is exclusive. Thus, writing about myself, I’m here to express myself that what I see, what I experience and what I plan for my life. I try myself to be modest, passionate, devoted, hardworking and honest."
const contactContent = "Reach out to us anytime and we’ll happily answer your questions."

const app = express()

app.set('view engine', 'ejs')
//const port = 3000

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(express.static("images"))

//mongoose.connect("mongodb://localhost:27017/blogDB");
mongoose.connect("mongodb+srv://Daily-Journal:daily@cluster0.bnecf.mongodb.net/blogDB");

const postsSchema = {
  title: String,
  content: String
}
const Post = mongoose.model("Post", postsSchema)

let articles = []
///--------------------------------------------------------------------------------------------------------------------------------------/
let today = new Date();
let option = {
  weekend: "long",
  day: "numeric",
  month: "long"
}
let day = today.toLocaleDateString("en-Us", option)
//--------------------------------------------------------------------------------------------------------------------------------------------
app.get('/', (req, res) => {
Post.find({}, function(err, foundPost){
  res.render("home", {kindofDay: day,stratingContent:homeStratingContent,posts: foundPost})
})
})
//-------------------------------------------------------------------------------------------------------------------------------------------
app.get("/about", function(req, res){
  res.render("about",{aboutcontent:aboutContent})
})
app.get("/contact", function(req, res){
  res.render("contact",{ contactcontent:contactContent})
})
app.get("/compose", function(req, res){
  res.render("compose")
})
//----------------------------------------------------------------------------------------------------------------------------------------------------
app.post("/compose", function(req,res){
  const  titlename = req.body.postTitle
  const  contentname = req.body.postBody
    const post1 = new Post({
      title: titlename,
      content: contentname
    });
    post1.save();
    const article ={
      titled: titlename,
      contented: contentname
    }
    //console.log(article);
     articles.push(article)
    res.redirect('/')
})
//-------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/post/:postName", function(req,res){
  const requestedTitled = _.lowerCase(req.params.postName);

  articles.forEach(function(article){
    const storedTitle = _.lowerCase(article.titled);

    if(storedTitle === requestedTitled)
    {
   res.render("post",{
    titles: article.titled,
    contents: article.contented
   })
   }
  })
})
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.post("/delete", function(req, res){
  const checkedItenID = req.body.checkbox;
    Post.findByIdAndRemove(checkedItenID, function(err){
       if(!err){
        //console.log("Item Deleted Successfully");
        res.redirect('/')
      }
     });
  })
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
/*app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`)
})*/

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
console.log(`Example app Started Successfully:${port}`)
})
//ID:Daily-Journal Password:daily
