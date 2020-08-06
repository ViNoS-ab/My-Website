const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const posts = fs.readFileSync("./posts/posts.json");
const parsedPosts = JSON.parse(posts);
app.use(express.json());
app.use(cors());

var last = function last(array, n) {
  if (array == null) return void 0;
  if (n == null) return array[array.length - 1];
  return array.slice(Math.max(array.length - n, 0));
};

const ids = [];
for (i in parsedPosts) {
  ids.push(parsedPosts[i].id);
}

const url = "https://slatier-challenge.000webhostapp.com";

const corsOptions = {
  origin: url,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

app.get("/api/posts", cors(corsOptions), (req, res) => {
  res.send(parsedPosts);
  console.log(req.ip);
});

app.get("/api/posts/:id", cors(corsOptions), (req, res) => {
  const post = parsedPosts.find((c) => c.id === parseInt(req.params.id));
  if (!post) return res.status(404).send("the post is no longer availabale");
  res.send("<p> " + post.content + "</p>");
});

app.post("/api/posts", cors(corsOptions), (req, res) => {
  if (!req.body.content || req.body.content.length < 10) {
    res.status(400).send("you must send a content with 10 characters at least");
    return;
  }

  const post = {
    id: last(ids) + 1,
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
app.delete("/api/posts/:id", (req, res) => {
  const post = parsedPosts.find((c) => c.id === parseInt(req.params.id));
  if (!post) return res.status(404).send("the post is not found");
  const index = parsedPosts.indexOf(post);
  parsedPosts.splice(index, 1);

  res.send("the post has been succefly deleted");

  const json = JSON.stringify(parsedPosts);

  fs.writeFile("./posts/posts.json", json, () => {
    console.log(JSON.stringify(post));
  });
});

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listnening on Port ${port}...`));
