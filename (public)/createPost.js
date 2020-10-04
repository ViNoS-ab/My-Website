function createPost(content, id, title, b4) {
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



  points.textContent = "...";

  DeleteTxt.textContent = "Delete post";
  EditTxt.textContent = "Edit Post";

  Delete.classList.add("delete");
  changes.classList.add("changes");
  menu.classList.add("liMenu");
  scrollDiv.classList.add("scrollDiv");
  liDiv.classList.add("liDiv");
  li.classList.add("postContainer");
  if (title) li.id = title;
  DelIcon.classList.add("delIcon");
  editIcon.classList.add("editIcon");
  EditTxt.classList.add("editTxt");
  DeleteTxt.classList.add("deltxt");
  liDiv.id = "liDiv" + id;
  if (b4) postLi.insertBefore(li, postLi.childNodes[0]);
  //here we make the post with with full main part width and height
  content = content.replace(/on/g, "&#111;&#110;");
  
  content = content.replace(/javascript/g, "&#106;avascript");
 content = content.replace(
    "<script>",
    `<p class="md-spoiler" onclick="this.classList.add('md-unhidenspoiler')"><span>scripts are not allowed to excute</span></p>`
  );

  liDiv.innerHTML = content;
  
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
  Delete.addEventListener("click", () => {
    if (confirm("Are you sure that you want to delete the post ?")) {
      db.collection("posts")
        .doc(id.toString())
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
          alert("you are not the post owner");
        });
    }
  });
}
