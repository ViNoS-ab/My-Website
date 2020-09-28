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
const notMatch = document.getElementById("pswNotMatch");
const Lmodal = document.getElementById("id01");
const Smodal = document.getElementById("id02");
const fbBtn = document.getElementById("facebook-lgn");
const googleBtn = document.getElementById("google-lgn");
const rememberSign = document.getElementById("rememberSign");
const rememberLgn = document.getElementById("rememberLgn");
const facebookSign = document.getElementById("facebook-sign");
const googleSign = document.getElementById("google-sign");
const postSearch = document.getElementById("postSearch");
const searchBtn = document.getElementById("searchBtn");

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
function OpeningNewPost() {
  const textArea = document.getElementById("input");
  textArea.value = "";
  openMd();
}

// this is getting the posts from json file part

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

// Edit.addEventListener("click", () => {
//   const thisPost = document.getElementById("liDiv" + post.id);
//   const textArea = document.getElementById("input");
//   textArea.value = thisPost.textContent;

//   setTimeout(() => {
//     openMd();
//   }, 1);

//   postId = post.id;
//   editBtn.removeAttribute("hidden");
// });

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

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", ($event) => {
  if ($event.target == Lmodal) {
    Lmodal.style.display = "none";
  }
});

loginSpan.addEventListener("click", () => {
  Lmodal.style.display = "block";
});

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
  wrongEmail.textContent = "";
  wrongPw.textContent = "";
  const loginInput = {
    email: lgnEmail.value,
    password: lgnPsw.value,
  };
  LogInFunc(loginInput.email, loginInput.password);
};

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
// the search functionality
searchBtn.addEventListener("click" , () => {
  const SearchedPosts = postSearch.value;
  const arry = Array.prototype.slice.call(postLi.childNodes); //forming an array with node collection to use the slice method
  const filteredPosts = arry.filter(filter => {
    return filter.id.includes(SearchedPosts)
  })
for(const a of arry){
  a.style.display = "none"
}
for(const showPost of filteredPosts){
  showPost.style.display = "inline"
}
})
postSearch.addEventListener("keydown" , (key) => {
  if (key.key ==="Enter") {
    const SearchedPosts = postSearch.value;
  const arry = Array.prototype.slice.call(postLi.childNodes); //forming an array with node collection to use the slice method
  const filteredPosts = arry.filter(filter => {
    return filter.id.includes(SearchedPosts)
  })
for(const a of arry){
  a.style.display = "none"
}
for(const showPost of filteredPosts){
  showPost.style.display = "inline"
}
  }
})