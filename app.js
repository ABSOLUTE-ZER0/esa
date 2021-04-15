//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require('dotenv').config()

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/public'));

mongoose.connect("mongodb+srv://admin-zero:"+process.env.MONGO_PASSWORD+"@cluster0.qpoyp.mongodb.net/portfolioDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});


var docs;
var work;
var workShowcase;

const documentationSchema = new mongoose.Schema({
  name: String,
  desc: String,
  img_path: String,
  topic: Array
})


const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
})

const workSchema = new mongoose.Schema({
  name: String,
  ima_path: String,
  basic_desc: String,
  url: String,
  showcase: Boolean,
  active: String,
  app_desc: Array
})



const Document = mongoose.model("Document", documentationSchema);
const Contact = mongoose.model("Contact", contactSchema);
const Work = mongoose.model("Work", workSchema);


Document.find({
  documentation: true
}, function (err, result) {
  docs = result;
});

Work.find({}, function (err, result) {
  work = result;
});

Work.find({showcase: true}, function (err, result) {
  workShowcase = result;
});


app.get("/", function (req, res) {
  Document.find({
    skill: true
  }, function (err, skills) {
    res.render("home", {
      skills: skills,
      work: workShowcase
    });
  });
});

app.get("/work", function (req, res) {
  res.render("work", {
    work: work
  });
});

app.get("/contact", function (req, res) {
  res.render("contact");
});

app.get("/docs", function (req, res) {
  res.render("docs", {
    docs: docs
  })
});


app.get("/docs/:topic/:subTopic", function (req, res) {

  const subTopic = req.params.subTopic;
  const topic = req.params.topic;

  Document.find({
    documentation: true,
    name: topic
  }, function (err, docs) {
    docs.forEach(function (doc) {
      doc.topic.forEach(function (subdoc) {
        if (subdoc.topic_name == subTopic) {
          res.render("doc", {
            doc: doc,
            subdoc: subdoc
          });
        }
      });

    });
  });
});


app.get("/docs/:topic", function (req, res) {

  const topic = req.params.topic;

  docs.forEach(function (doc) {
    if (doc.name == topic) {
      res.render("doc", {
        doc: doc,
        subdoc: doc.topic[0]
      });
    }
  });
});




app.post("/contact", function (req, res) {
  var name = req.body.NameFrom;
  var email = req.body.EmailFrom;
  var message = req.body.Message;

  const newContact = new Contact({
    name: name,
    email: email,
    message: message
  });
  newContact.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/contact");
    }
  });

});





app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});