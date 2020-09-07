const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const fs = require("fs");
const cors = require("cors");
const posts = fs.readFileSync("./data/posts.json");
const users = fs.readFileSync("./data/users.json");
const parsedPosts = JSON.parse(posts);
const parsedUsers = JSON.parse(users);

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

var last = function last(array, n) {
  if (array == null) return void 0;
  if (n == null) return array[array.length - 1];
  return array.slice(Math.max(array.length - n, 0));
};

const emailArry = [];
for (i in parsedUsers) {
  emailArry.push(parsedUsers[i].email);
}

const ids = [];
for (i in parsedPosts) {
  ids.push(parsedPosts[i].id);
}


const corsOptions = {
  origin: null,
  methods: "GET,PUT,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

// getting all posts
app.get("/api/posts", cors(corsOptions), (req, res) => {
  res.send(parsedPosts);
  console.log(req.ip);
});

//getting a single post
app.get("/api/posts/:id", cors(corsOptions), (req, res) => {
  const post = parsedPosts.find((c) => c.id === parseInt(req.params.id));
  if (!post) return res.status(404).send("the post is no longer availabale");
  res.send("<p> " + post.content + "</p>");
});

// sending a post
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
  fs.writeFile("./data/posts.json", json, () => {
    console.log(JSON.stringify(post));
    console.log(last(json));
  });
});

// deleting a post
app.delete("/api/posts/:id", (req, res) => {
  const post = parsedPosts.find((c) => c.id === parseInt(req.params.id));
  if (!post) return res.status(404).send("the post is not found");
  const index = parsedPosts.indexOf(post);
  parsedPosts.splice(index, 1);

  res.send("the post has been succefly deleted");

  const json = JSON.stringify(parsedPosts);

  fs.writeFile("./data/posts.json", json, () => {
    console.log(JSON.stringify(post));
  });
});

// editing a post
app.put("/api/posts/:id", cors(corsOptions), (req, res) => {
  const post = parsedPosts.find((c) => c.id === parseInt(req.params.id));
  if (!post) return res.status(404).send("the post doesen't exist");

  if (!req.body.content || req.body.content.length < 10) {
    res.status(400).send("you must send a content with 10 characters at least");
    return;
  }
  post.content = req.body.content;

  res.send(post.content);

  const json = JSON.stringify(parsedPosts);

  fs.writeFile("./data/posts.json", json, () => {
    console.log(post.content);
  });
});

//sign up
app.post("/users", cors(corsOptions), async (req, res) => {
  for (let i = 0; i < emailArry.length; i++) {
    if (emailArry[i] === req.body.email) {
      return res.status(400).send("This Email is already taken");
    }
  }
  console.log(req.body.email);
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      email: req.body.email,
      password: hashedPassword,
    };

    parsedUsers.push(user);

    const usersJson = JSON.stringify(parsedUsers);

    fs.writeFile("./data/users.json", usersJson, () => {
      console.log(user.email + " has signed up");
    });
    res.send("you signed up !!");
  } catch (error) {
    res.status(500).send("An error occured");
  }
});
//log in
app.post("/users/login", cors(corsOptions), async (req, res) => {
  const user = parsedUsers.find((user) => user.email === req.body.email);
  if (user == null) {
    return res.status(404).send({ text: "Cannot find user" }); //sending responses as json to avoid errors and additional work on the main js file
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send({
        text: "you are logged in ",
        email: user.email,
      });
      console.log(user.email + " has logged in");
    } else {
      res.send({ text: "Wrong password" });
      console.log(user.email + " typed a wrong pw");
    }
  } catch (error) {
    res.status(500).send({ text: "An error occured" });
  }
});
// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listnening on Port ${port}...`));


