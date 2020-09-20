const auth = firebase.auth();

const google = new firebase.auth.GoogleAuthProvider();
const LogInFunc = (email, password) => {
  auth.signInWithEmailAndPassword(email, password).catch((error) => {
    if (error.code == "auth/wrong-password") {
      wrongPw.textContent = error.code;
    }
    if (error.code == "auth/user-not-found") {
      wrongEmail.textContent = error.message;
    }
  });
};

// auth.signInWithPopup(google);

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
      user.displayName !== null ? user.displayName : user.email.split("@", 1)
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

    //show the logout and email
    accName.addEventListener("click", () => {
      acc.style.opacity = "1";
      acc.focus();
    });
    acc.addEventListener("blur", () => {
      acc.style.opacity = "0";
    });
  } else {
    const acc = document.getElementById("acc");
    const accName = document.getElementById("accName");

    acc.remove();
    accName.remove();
    loginSpan.style.display = "flex";
    signupSpan.style.display = "block";

    newPost.style.display = "none";
    newPost.removeEventListener("click", OpeningNewPost);
    newPost.addEventListener("click", () => {
      alert("you should be signed in to write a post");
    });
    submit.removeEventListener("click", submitPost);
    submit.addEventListener("click", () => {
      alert(
        "you are not supposed to see this button but anyway you don't have permission to post"
      );
    });
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
      .then(() => document.getElementById("signUpForm").reset())
      .catch((error) => (takenEmail.textContent = error.message));
  } else {
    notMatch.textContent = "password not match";
    signRptPsw.value = "";
  }
};

// firestore (databse)
const db = firebase.firestore();

let posts;

auth.onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    // creating posts
    posts = db.collection("posts");
    const { serverTimestamp } = firebase.firestore.FieldValue;
    const submitPost = async (event) => {
      event.preventDefault();

      let LastId = posts.doc("id");
      let id;
      LastId.get().then((doc) => {
        id = Number(doc.data().lastPost);
        id++;
        id = id.toString();

        const post = {
          uid: user.uid,
          content: a.preview.innerHTML,
          createdAt: serverTimestamp(),
          id: Number(id),
        };
        console.log(id);
        posts.doc(id).set(post).then(closeMD()); // puted this line here instead of outside "then" because i need the id
        LastId.update({ lastPost: Number(id) });
      });
    };
    submit.addEventListener("click", submitPost);
  } else {
    // User is signed out.
  }
});

// reading posts
// creating the li elemnt with content and everything
function createPost(content, id, b4) {
  const liDiv = document.createElement("div");
  const li = document.createElement("li");
  const menu = document.createElement("div");
  const changes = document.createElement("ul");
  const Edit = document.createElement("li");
  const Delete = document.createElement("li");
  const scrollDiv = document.createElement("div");
  const points = document.createElement("div");
  const EditTxt = document.createElement("span");
  const DeleteTxt = document.createElement("span");
  const DelIcon = document.createElement("span");
  const editIcon = document.createElement("span");

  scrollDiv.appendChild(liDiv);
  postLi.appendChild(li);
  li.appendChild(scrollDiv);
  li.appendChild(menu);
  menu.appendChild(points);
  li.appendChild(changes);
  changes.appendChild(Edit);
  changes.appendChild(Delete);
  Edit.appendChild(editIcon);
  Edit.appendChild(EditTxt);
  Delete.appendChild(DelIcon);
  Delete.appendChild(DeleteTxt);

  liDiv.innerHTML = content;
  points.textContent = "...";

  DeleteTxt.textContent = "Delete post";
  EditTxt.textContent = "Edit Post";

  Delete.classList.add("delete");
  changes.classList.add("changes");
  menu.classList.add("liMenu");
  scrollDiv.classList.add("scrollDiv");
  liDiv.classList.add("liDiv");
  li.classList.add("postContainer");
  DelIcon.classList.add("delIcon");
  editIcon.classList.add("editIcon");
  EditTxt.classList.add("editTxt");
  DeleteTxt.classList.add("deltxt");
  liDiv.id = "liDiv" + id;
  if (b4) postLi.insertBefore(li, postLi.childNodes[0]);
  //here we make the post with with full main part width and height
  scrollDiv.addEventListener("click", () => {
    li.style.width = "90%";
    li.style.position = "absolute";
    li.style.height = "90%";
    li.style.zIndex = "1";
    scrollDiv.style.height = "100%";
    li.style.maxWidth = "90%";
  });
  // here we return it back to normal
  li.addEventListener("dblclick", () => {
    li.style.width = "28%";
    li.style.position = null;
    li.style.height = "200px";
    li.style.zIndex = null;
    scrollDiv.style.height = "200px";
    li.style.maxWidth = "300px";
  });
  //here we just added something like :hover to open changes menu
  menu.addEventListener("mouseover", () => {
    changes.style.opacity = "1";
    changes.style.transform = "scale(1)";
    changes.style.zIndex = "2";
  });
  menu.addEventListener("mouseout", () => {
    changes.style.opacity = "0";
    changes.style.transform = "scale(0)";
  });
  changes.addEventListener("mouseover", () => {
    changes.style.opacity = "1";
    changes.style.transform = "scale(1)";
    changes.style.zIndex = "2";
  });
  changes.addEventListener("mouseout", () => {
    changes.style.opacity = "0";
    changes.style.transform = "scale(0)";
  });
}
let firstGet;
let snapshot;
const GettingPosts = async () => {
  let Ids = 0;
  posts = db.collection("posts");
  const arry = Array.prototype.slice.call(postLi.childNodes); //forming an array with node collection to use the slice method
  firstGet = await posts
    .orderBy("createdAt", "desc") // Requires a query
    .get()
    .then((querySnapshot) => {
      // Map results to an array of li elements
      const items = querySnapshot.docs.map((doc) => {
        return doc.data();
      });
      console.log(items);

      for (const post of items) {
        createPost(post.content, post.id);
        Ids++;
      }
    });
  snapshot = posts.orderBy("content").onSnapshot((querySnapshot) => {
    const items = querySnapshot.docs.map((doc) => {
      return doc.data();
    });
    if (arry.length == 0) {
    } else
      for (const post of items) {
        const thisPost = document.getElementById(`liDiv${post.id}`);
        if (thisPost && thisPost.innerHTML !== post.content) {
          thisPost.innerHTML = post.content;
        } else if (!thisPost) {
          if (Ids < items.length) {
            createPost(post.content, post.id , b4);
          }else {}
        }
      }
  });
};

GettingPosts().then(() => {
  const arry = Array.prototype.slice.call(postLi.childNodes); //forming an array with node collection to use the slice method

  let allPostsTriggred = false;
  // see all posts part
  for (const displayedLi of arry.slice(0, 6)) {
    displayedLi.style.display = "inline";
  }
  allPosts.addEventListener("click", () => {
    if (allPostsTriggred === false) {
      for (const displayedLi of arry) {
        displayedLi.style.display = "inline";
        allPostsTriggred = true;
        allPosts.textContent = "See less Posts";
      }
    } else {
      for (const displayedLi of arry) {
        displayedLi.style.display = "none"; // we hided hide all posts then in next loop we displayed only 6
      }
      for (const displayedLi of arry.slice(0, 6)) {
        displayedLi.style.display = "inline";
        allPosts.textContent = "See all Posts";
        allPostsTriggred = false;
      }
    }
  });
});
