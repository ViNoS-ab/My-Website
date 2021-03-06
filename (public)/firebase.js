const auth = firebase.auth();

const google = new firebase.auth.GoogleAuthProvider();
const facebook = new firebase.auth.FacebookAuthProvider();

body.addEventListener("click", (event) => {
  if (event.target == fbBtn || event.target == facebookSign) {
    rememberLgn.checked === true
      ? auth.signInWithPopup(facebook)
      : auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
          auth.signInWithPopup(facebook);
        });
  }
  if (event.target == googleBtn || event.target == googleSign) {
    rememberLgn.checked === true
      ? auth.signInWithPopup(google)
      : auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
          auth.signInWithPopup(google);
        });
  }
});

const LogInFunc = (email, password) => {
  rememberLgn.checked === true
    ? auth.signInWithEmailAndPassword(email, password).catch((error) => {
        if (error.code == "auth/wrong-password") {
          wrongPw.textContent = error.code;
        }
        if (error.code == "auth/user-not-found") {
          wrongEmail.textContent = error.message;
        }
      })
    : auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
        auth.signInWithEmailAndPassword(email, password).catch((error) => {
          if (error.code == "auth/wrong-password") {
            wrongPw.textContent = error.code;
          }
          if (error.code == "auth/user-not-found") {
            wrongEmail.textContent = error.message;
          }
        });
      });
};
const NoSubmitAlert = () =>
  alert(
    "you are not supposed to see this button but anyway you don't have permission to post"
  );

const noNewPostAlert = () => alert("you should be signed in to write a post");
auth.onAuthStateChanged((user) => {
  if (user) {
    newPost.style.display = "block";
    Lmodal.style.display = "none";
    loginSpan.style.display = "none";
    signupSpan.style.display = "none";

    const lgnAndSignDiv = document.querySelector("#loginBtn");
    const accName = document.createElement("p");
    const userIcon = document.createElement("i");

    lgnAndSignDiv.appendChild(accName);

    accName.id = "accName";
    accName.innerText =
      user.displayName !== null ? user.displayName : user.email.split("@", 1);
    userIcon.classList.add("fas");
    userIcon.classList.add("fa-user");
    accName.appendChild(userIcon);
    accName.insertBefore(userIcon, accName.childNodes[0]);
    console.log(
      user.displayName !== null ? user.displayName : user.email.split("@", 1)[0]
    );

    const acc = document.createElement("ul");
    const mailName = document.createElement("li");
    const logout = document.createElement("li");
    const signOut = document.createElement("i");
    const resText = document.createElement("p");

    acc.setAttribute("tabindex", "0");
    acc.appendChild(mailName);
    acc.appendChild(logout);
    lgnAndSignDiv.appendChild(acc);
    mailName.appendChild(resText);

    resText.textContent = user.email;
    logout.textContent = "Sign out";
    mailName.id = "mailName";
    acc.id = "acc";
    logout.id = "logout";
    resText.id = "resTxt";

    logout.appendChild(signOut);
    signOut.classList.add("fas");
    signOut.classList.add("fa-sign-out-alt");
    logout.insertBefore(signOut, logout.childNodes[0]);
    //log out
    logout.addEventListener("click", () => {
      auth.signOut();
    });

    newPost.addEventListener("click", OpeningNewPost);
    newPost.removeEventListener("click", noNewPostAlert);
    //show the logout and email
    accName.addEventListener("click", () => {
      acc.style.opacity = "1";
      acc.focus();
      acc.style.transform = "scale(1)";
    });
    acc.addEventListener("blur", () => {
      acc.style.opacity = "0";
      acc.style.transform = "scale(0)";
    });
  } else {
    const acc = document.getElementById("acc");
    const accName = document.getElementById("accName");
    if (!acc || !accName) return;

    acc.remove();
    accName.remove();
    loginSpan.style.display = "flex";
    signupSpan.style.display = "block";

    newPost.style.display = "none";
    newPost.removeEventListener("click", OpeningNewPost);
    newPost.addEventListener("click", noNewPostAlert);
  }
});

// sign up
const signUp = () => {
  notMatch.textContent = "";
  takenEmail.textContent = "";

  if (signPsw.value === signRptPsw.value) {
    const signUpinput = {
      email: signEmail.value,
      password: signPsw.value,
    };

    auth
      .createUserWithEmailAndPassword(signUpinput.email, signUpinput.password)
      .then(() => {
        document.getElementById("signUpForm").reset();
        document.getElementById("id02").style.display = "none";
      })
      .catch((error) => (takenEmail.textContent = error.message));
  }
};

// firestore (databse)
const db = firebase.firestore();
let posts;

auth.onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    // creating posts
    const submit = document.getElementById("submitPost");
    submit.removeEventListener("click", NoSubmitAlert);

    posts = db.collection("posts");
    const { serverTimestamp } = firebase.firestore.FieldValue;
    const submitPost = async (event) => {
      event.preventDefault();

      let LastId = posts.doc("id");
      let id;
      LastId.get().then((doc) => {
        id = doc.data().lastPost;
        id++;
        id = id.toString();

        const post = {
          uid: user.uid,
          content: a.preview.innerHTML.replace(" md-unhidenspoiler" , ""),
          createdAt: serverTimestamp(),
          id: Number(id),
          title: prompt(
            "please enter a title for that post\n the title will help in the search functionality"
          ),
        };
        posts.doc(id).set(post).then(closeMD()); // puted this line here instead of outside "then" because i need the id
        LastId.update({ lastPost: Number(id) });
      });
    };

    submit.addEventListener("click", submitPost);
  } else {
    // User is signed out.
    const submit = document.getElementById("submitPost");
    const newSubmit = submit.cloneNode(true);
    submit.parentNode.replaceChild(newSubmit, submit);

    newSubmit.addEventListener("click", NoSubmitAlert);
  }
});

// reading posts
// creating the li elemnt with content and everything

let firstGet;
let snapshot;
const GettingPosts = async () => {
  posts = db.collection("posts");
  const arry = Array.prototype.slice.call(postLi.childNodes); //forming an array with node collection to use the slice method
  firstGet = await posts
    .orderBy("createdAt", "desc") // Requires a query
    .get()
    .then((querySnapshot) => {
      const items = querySnapshot.docs.map((doc) => {
        return doc.data();
      });

      if (arry.length == 0) {
        for (const post of items) {
          createPost(post.content, post.id, post.title);
        }
      }
    });
  snapshot = posts.orderBy("content").onSnapshot((querySnapshot) => {
    const items = querySnapshot.docs.map((doc) => {
      return doc.data();
    });

    for (const post of items) {
      const thisPost = document.getElementById(`liDiv${post.id}`);
      if (thisPost) {
        let replacedContent = thisPost.innerHTML.replace(/on/g, "&#111;&#110;");
        replacedContent = replacedContent.replace(
          /javascript:/g,
          "&#106;avascript;"
        );
        replacedContent = replacedContent.replace(
          "<script>",
          `<p class="md-spoiler" onclick="this.classList.add('md-unhidenspoiler')"><span>scripts are not allowed to excute</span></p>`
        );

        if (replacedContent !== post.content) {
          thisPost.innerHTML = replacedContent;
        }
      } else if (post.id) {
        createPost(post.content, post.id, post.title, "b4");
      }
    }
    const arry = Array.prototype.slice.call(
      document.querySelectorAll(".liDiv")
    ); //forming an array with node collection to use the slice method
    for (let i in arry) {
      const thisPostId = arry[i].id.split("liDiv")[1];
      //what are we doing here is cheking if a post exist in the DOM and doesn't exist in db so we delete it
      const deletedPost = items.filter((filter) => {
        return filter.id == thisPostId;
      });
      if (!deletedPost[0]) {
        arry[i].parentElement.parentElement.remove();
      }
    }
  });
};

GettingPosts().then(() => {
  const arry = Array.prototype.slice.call(postLi.childNodes); //forming an array with node collection to use the slice method

  let allPostsTogled = false;
  //hide all the posts then show them in the next step
  for (const displayedLi of arry) {
    displayedLi.style.display = "none";
  }
  // see all posts part
  for (const displayedLi of arry.slice(0, 6)) {
    displayedLi.style.display = "inline";
  }
  allPosts.addEventListener("click", () => {
    const arry = Array.prototype.slice.call(postLi.childNodes); //forming an array with node collection to use the slice method

    if (allPostsTogled === false) {
      for (const displayedLi of arry) {
        displayedLi.style.display = "inline";
        allPostsTogled = true;
        allPosts.textContent = "See less Posts";
      }
    } else {
      for (const displayedLi of arry) {
        displayedLi.style.display = "none"; // we hided hide all posts then in next loop we displayed only 6
      }
      for (const displayedLi of arry.slice(0, 6)) {
        displayedLi.style.display = "inline";
        allPosts.textContent = "See all Posts";
        allPostsTogled = false;
      }
    }
  });
});
