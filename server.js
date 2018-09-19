var express = require("express");
var bodyParser = require("body-parser");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");

var app = express();

var databaseUrl = "newsScraper";
var collections = ["scrapedNews"];
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});

app.use(express.static("public"));
var PORT = process.env.PORT || 8080;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// app.get("/", function(req, res){
//     res.render("index");
// })

app.get("/all", function (req, res) {
    console.log("/all route is getting hit by button");
    db.scrapedNews.find({}, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            // console.log(found);
            // console.log("the index should be rendered now");
            res.render("index", {data: found});
        }
    });
});

app.get("/delete", function(req, res){
    db.scrapedNews.remove({saved: {$ne: true}}, function(error, found){
        if(error){
            console.log(error);
        }
        else{
            res.json(found);
        }
    });
});

app.get("/scrape", function (req, res) {
    request("https://news.ycombinator.com/", function (error, response, html) {
        var $ = cheerio.load(html);
        $(".title").each(function (i, element) {
            var title = $(element).children("a").text();
            var link = $(element).children("a").attr("href");
            if (title && link) {
                db.scrapedNews.insert({
                    title: title,
                    link: link
                },
                    function (err, inserted) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            //Otherwise, log the inserted data
                            //console.log(inserted);
                        }
                    });
            }
        });
        res.send("Scrape Complete");
    });
    
});

app.post("/saved/:id", function(req, res){
    console.log(req.params.id);
    db.scrapedNews.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {saved: true}}, function(error, updated){
        if(error){
            console.log(error);
        }
        else{
            console.log(updated);
        }
    });
});

app.get("/savedarticles", function(req, res){
    console.log("/savedarticles route was hit");
    db.scrapedNews.find({saved: true}, function(error, savedArt){
        if(error){
            console.log(error);
        }
        else{
            console.log("Saved articles:");
            console.log(savedArt.length);
            res.render("index",{data: savedArt})
        }
    });
});

app.get("/articlecomments/:id", function(req, res){
    db.scrapedNews.findOne({_id: mongojs.ObjectId(req.params.id)}, function(error, found){
        if(error){
            console.log(error);
        }
        else{
            res.json(found);
        }
    });
});

app.post("/postcomment/:id", function(req, res){
    console.log("post route hit");
    console.log(req.body.comment);
    db.scrapedNews.update({_id: mongojs.ObjectId(req.params.id)},{$push: {comments: req.body.comment}}, function(error, updated){
        if(error){
            console.log(error);
        }
        else{
            res.json(updated);
        }
    });
});

app.listen(PORT, function () {
    console.log("App running on port:" + PORT);
});

