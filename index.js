const Joi = require("joi");
const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
app.use(express.json());
app.use(cors());

const url = "https://thisismyapi.herokuapp.com/api/posts";

const corsOptions = {
  origin: url,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

const posts = fs.readFileSync("./posts/posts.json");
const parsedPosts = JSON.parse(posts);

app.get("/api/posts", (req, res) => {
  res.send(parsedPosts);
  console.log(req.statusCode);
});

app.get("/api/posts/:id", (req, res) => {
  const post = parsedPosts.find((c) => c.id === parseInt(req.params.id));
  if (!post) res.status(404).send("the post is no longer availabale");
  res.send("<p>" + post.content + "</p>");
});

app.post("/api/posts", cors(corsOptions), (req, res) => {
  const schema = {
    content: Joi.string().min(3).required(),
  };

  const result = Joi.validate(req.body, schema);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const post = {
    id: parsedPosts.length + 1,
    content: req.body.content,
  };

  parsedPosts.push(post);
  const json = JSON.stringify(parsedPosts);
  console.log(req.body);
  res.send(post);
  fs.writeFile("./posts/posts.json", json, () => {
    console.log(JSON.stringify(post));
  });
});

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listnening on Port ${port}...`));
