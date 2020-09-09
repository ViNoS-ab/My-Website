//const { response } = require("express");
const newPost = document.getElementById("newPost");
const MDE = document.querySelector(".container");
const div = document.querySelectorAll("div");
const postLi = document.getElementById("posts");
const submit = document.getElementById("submitPost");
const editBtn = document.getElementById("editBtn");
const allPosts = document.getElementById("allPosts");
const toTopBtn = document.querySelector("#backToTop a");
const body = document.querySelector("body");
const input = document.getElementById("input");
const loginSpan = document.querySelector(".loginSpan");
const signupSpan = document.querySelector(".signupSpan");
const cMDE = document.querySelector(".cMDE");
const login = document.getElementById("login");
const lgnEmail = document.getElementById("lgnEmail");
const lgnPsw = document.getElementById("lgnPsw");
const signup = document.getElementById("signUp");
const signEmail = document.getElementById("signEmail");
const signPsw = document.getElementById("signPsw");
const signRptPsw = document.getElementById("signRptPsw");
const wrongPw = document.getElementById("wrongPw");
const wrongEmail = document.getElementById("wrongEmail");
const takenEmail = document.getElementById("takenEmail");
const resText = document.getElementById("resTxt");

let postId;

const url1 = "https://just-demo-website.herokuapp.com";
const url = "http://localhost:3000";
const urlPosts = "/api/posts/";
const urllgn = "/users/login/";
const urlsign = "/users/";

const last = (array, n) => {
  if (array == null) return void 0;
  if (n == null) return array[array.length - 1];
  return array.slice(Math.max(array.length - n));
};
//show the md
const openMd = () => {
  cMDE.removeAttribute("hidden");
  for (let i = 0; i < div.length; i++) {
    div[i].style.opacity = "60%"; //make the opacity of the sourrounding divs to 60%
  }
};

//close the MD when touching outside the container
window.addEventListener("click", ($event) => {
  if ($event.target == cMDE) {
    closeMD();
  }
});
//close the md
function closeMD() {
  editBtn.setAttribute("hidden", "");
  cMDE.setAttribute("hidden", "");
  for (let i = 0; i < div.length; i++) {
    div[i].style.opacity = "1";
  }
}
newPost.addEventListener("click", () => {
  const textArea = document.getElementById("input");
  textArea.value = "";
  openMd();
});

// from here its sending post part
submit.addEventListener("click", async (event) => {
  event.preventDefault();

  const post = {
    content: a.preview.innerHTML,
  };
  submitPost(post).then(closeMD());
});

const submitPost = async (data) => {
  try {
    let request = await fetch(urlPosts, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (request.status == 200) {
      response = await request.json();
      alert(
        "Post submitted successfully\nmaybe you need to refresh the page to see it correctly"
      );
      const allPosts = postLi.innerHTML;
      postLi.innerHTML = "<li>" + response.content + "</li>" + allPosts;
    } else {
      response = await request.text();

      alert(request.statusText + " : " + response);
      console.log(request.status + request.statusText + " : " + response);
    }
  } catch (err) {
    console.log(err);
  }
};

// this is getting the posts from json file part
const GetPosts = async () => {
  try {
    let request = await fetch(urlPosts, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    });

    response = await request.json();

    for (const post of response) {
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

      liDiv.innerHTML = post.content;
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
      liDiv.id = "liDiv" + post.id;

      postLi.insertBefore(li, postLi.childNodes[0]);
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
      // this is delete posts part
      const DeletePost = async () => {
        try {
          let request = await fetch(urlPosts + post.id, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });
          response = await request.text();
          if (response === "the post has been succefly deleted") {
            alert(response);
            li.style.display = "none";
          }
        } catch (err) {
          console.log(err);
        }
      };
      Delete.addEventListener("click", () => {
        if (confirm("Are you sure that you want to delete the post ?")) {
          DeletePost();
        }
      });
      Edit.addEventListener("click", () => {
        const thisPost = document.getElementById("liDiv" + post.id);
        const textArea = document.getElementById("input");
        textArea.value = thisPost.textContent;
        setTimeout(() => {
          openMd();
        }, 1);

        postId = post.id;
        editBtn.removeAttribute("hidden");
      });
    }
  } catch (err) {
    console.log(err);
  }
};
GetPosts().then(() => {
  //forming an array with node collection to use the slice method
  const arry = Array.prototype.slice.call(postLi.childNodes);
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

//hide the back to top button (when u are in the top already xD)
window.onscroll = function () {
  toTopAppearing();
};
function toTopAppearing() {
  if (window.scrollY <= 250) {
    toTopBtn.style.transform = "scale(0)"; //i used scale to make transition delay
  } else {
    toTopBtn.style.transform = "scale(1)";
  }
} // if u are wondering why it is douplicated its because the 2nd works b4 scrolling and the 1st work only when scrolling
if (window.scrollY <= 250) {
  toTopBtn.style.transform = "scale(0)";
} else {
  toTopBtn.style.transform = "scale(1)";
}

//this is updatinhg the post part (it is related to some few things up)
const EditPost = async (data) => {
  try {
    let request = await fetch(urlPosts + postId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(postId);
    if (request.status == 200) {
      alert("Post edited successfully");
      const thisId = document.getElementById("liDiv" + postId);
      thisId.innerHTML = data.content;
      postId = null;
    } else {
      response = await request.text();

      alert(request.statusText + " : " + response);
      console.log(request.status + request.statusText + " : " + response);
      postId = null;
    }
  } catch (err) {
    console.log(err);
  }
};
editBtn.addEventListener("click", () => {
  const post = {
    content: a.preview.innerHTML,
  };
  if (confirm("Edit the post ?")) {
    EditPost(post).then(closeMD());
  }
});
//login interface
// Get the modal
const Lmodal = document.getElementById("id01");

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", ($event) => {
  if ($event.target == Lmodal) {
    Lmodal.style.display = "none";
  }
});

loginSpan.addEventListener("click", () => {
  Lmodal.style.display = "block";
});
//sign in interface
// Get the modal
const Smodal = document.getElementById("id02");

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", ($event) => {
  if ($event.target == Smodal) {
    Smodal.style.display = "none";
  }
});
signupSpan.addEventListener("click", () => {
  Smodal.style.display = "block";
});

//login system

const LogIn = () => {
  const loginInput = {
    email: lgnEmail.value,
    password: lgnPsw.value,
  };
  LogInFunc(loginInput).then(() => {
    // Logout
    wrongEmail.textContent = "";
    wrongPw.textContent = "";
    const logoutBtn = document.getElementById("logout");
    const acc = document.getElementById("acc");
    const accName = document.getElementById("accName");
    logoutBtn.addEventListener("click", () => {
      acc.remove();
      accName.remove();
      loginSpan.style.display = "flex";
      signupSpan.style.display = "block";
      setCookie("email=", "");
      setCookie("password=", "");
    });
    //show the logout and email
    accName.addEventListener("click", () => {
      acc.style.opacity = "1";
      acc.focus();
    });
    acc.addEventListener("blur", () => {
      acc.style.opacity = "0";
    });
  });
};

const LogInFunc = async (loginInput) => {
  try {
    let request = await fetch(urllgn, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",

      body: JSON.stringify(loginInput),
    });
    if (request.status == 200) {
      response = await request.json();
      if (response.text == "you are logged in ") {
        Lmodal.style.display = "none";
        loginSpan.style.display = "none";
        signupSpan.style.display = "none";

        const lgnAndSignDiv = document.querySelector("#loginBtn");
        const accName = document.createElement("p");
        lgnAndSignDiv.appendChild(accName);
        accName.id = "accName";
        accName.innerHTML =
          '<i class="fas fa-user"></i>' + response.email.split("@", 1);
        const acc = document.createElement("ul");
        const mailName = document.createElement("li");
        const logout = document.createElement("li");
        acc.setAttribute("tabindex", "0");
        acc.appendChild(mailName);
        acc.appendChild(logout);
        lgnAndSignDiv.appendChild(acc);
        mailName.innerHTML = '<p id="resTxt"> ' + response.email + "</p>";
        logout.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sign out';
        mailName.id = "mailName";
        acc.id = "acc";
        logout.id = "logout";

        if (document.getElementById("rememberLgn").checked === true) {
          setCookie("email=", loginInput.email, 365 * 3);
          setCookie("password=", loginInput.password, 365 * 3);
        } else {
          setCookie("email=", loginInput.email);
          setCookie("password=", loginInput.password);
        }

        if (getCookie("loggedB4") !== "=yes") {
          setCookie("loggedB4=", "yes");
          alert(response.text);
        }
        console.log(getCookie("loggedB4") != "=yes");
      }
      if (response.text == "Wrong password")
        wrongPw.textContent = response.text;
    } else {
      response = await request.json();
      if (response.text == "Cannot find user") {
        wrongEmail.textContent = response.text;
      } else {
        alert(request.statusText + " : " + response.text);
        console.log(request.status + request.statusText + " : " + response);
      }
    }
    document.getElementById("logInForm").reset();
  } catch (err) {
    console.log(err);
    alert("an error occured try again later");
  }
};

// sign up system

const signUp = async () => {
  if (signPsw.value !== signRptPsw.value) return alert("password not match");
  const signUpinput = {
    email: signEmail.value,
    password: signPsw.value,
  };
  takenEmail.textContent = "";
  try {
    let request = await fetch(urlsign, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify(signUpinput),
    });
    if (request.status == 200) {
      response = await request.text();
      alert(response);
      if (response == "you signed up !!") {
        Smodal.style.display = "none";
        if (document.getElementById("rememberSign").checked === true) {
          setCookie("email=", signUpinput.email, 365 * 3);
          setCookie("password=", signUpinput.password, 365 * 3);
          LogInFunc(signUpinput);
        }
      }
    } else {
      response = await request.text();
      takenEmail.textContent = response;
      //alert(request.statusText + " : " + response);
      console.log(request.status + request.statusText + " : " + response);
    }
    document.getElementById("signUpForm").reset();
  } catch (err) {
    console.log(err);
  }
};

// this is to make the site lunch with the api
class App {
  init() {
    this.render();
  }
  render() {}
}

let app = new App();
app.init();
//function to set the cookie
function setCookie(cname, cvalue, exdays) {
  if (exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  } else {
    document.cookie = cname + "=" + cvalue + ";path=/";
  }
}
//func to get the cookie
function getCookie(cname) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
//func to check for cookie
function checkCookie() {
  const userE = getCookie("email");
  const userP = getCookie("password");
  const loginInput = {
    email: userE.split("=")[1], // spliting with the equal will give us an array ["" , "cookieValue"] b4 splitting that gives "=cookieValue"
    password: userP.split("=")[1],
  };
  if (userE != "" && userP != "") {
    LogInFunc(loginInput).then(() => {
      wrongEmail.textContent = "";
      wrongPw.textContent = "";
      // logout
      const logoutBtn = document.getElementById("logout");
      const acc = document.getElementById("acc");
      const accName = document.getElementById("accName");
      logoutBtn.addEventListener("click", () => {
        acc.remove();
        accName.remove();
        loginSpan.style.display = "flex";
        signupSpan.style.display = "block";
        setCookie("email=", "");
        setCookie("password=", "");
      });

      //show the logout and email
      accName.addEventListener("click", () => {
        acc.style.opacity = "1";
        acc.focus();
      });
      acc.addEventListener("blur", () => {
        acc.style.opacity = "0";
      });
    });
  }
}

checkCookie();
console.log(firebase);
