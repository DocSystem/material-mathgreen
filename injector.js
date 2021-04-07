function patchCSS() {
  var link = document.createElement("link");
  if (document.location.pathname == "/NSI.html") {
    link.href = chrome.extension.getURL("css/nsi.css")
  }
  else if (document.location.pathname == "/") {
    link.href = chrome.extension.getURL("css/home.css")
  }
  link.type = "text/css";
  link.rel = "stylesheet";
  document.querySelector("head").appendChild(link);
}

patchCSS();

function patchPage() {
  if (document.location.pathname == "/NSI.html") {
    patchNSI();
  }
  else if (document.location.pathname == "/") {
    patchHome();
  }
}

function patchHome() {
  document.title = "Mathgreen";
  document.querySelector("marquee").setAttribute("direction", "left");
  var oldNav = document.querySelector("#navMenu");
  var newNav = document.createElement("nav");
  newNav.className = "navBar";
  document.querySelectorAll("#navMenu > ul > li").forEach((i) => {
    var partTitle = i.children[0].innerText;
    if (i.children[1].children.length == 1) {
      var url = i.children[1].children[0].children[0].href
      var newButton = document.createElement("a");
      newButton.innerText = partTitle;
      newButton.href = url;
      newNav.appendChild(newButton);
    }
    else {
      for (var si in i.children[1].children) {
        if (typeof i.children[1].children[si] == "object") {
          var subPartTitle = i.children[1].children[si].children[0].innerHTML;
          var url = i.children[1].children[si].children[0].href;
          var newButton = document.createElement("a");
          newButton.innerText = partTitle + " - " + subPartTitle;
          newButton.href = url;
          newNav.appendChild(newButton);
        }
      }
    }
  });
  document.querySelector("header").appendChild(newNav);
  oldNav.parentNode.removeChild(oldNav);
  var newMain = document.createElement("div");
  newMain.className = "mainContent";
  var oldPosts = document.querySelector("section.posts");
  var oldSidebar = document.querySelector("section.sidebar");
  oldPosts.parentNode.removeChild(oldPosts);
  oldSidebar.parentNode.removeChild(oldSidebar);
  newMain.appendChild(oldPosts);
  newMain.appendChild(oldSidebar);
  document.body.appendChild(newMain);
}

function patchNSI() {
  document.title = "NSI - Mathgreen";
  var newBody = document.createElement("body");
  var newh1 = document.createElement("h1");
  newh1.innerText = "Cours - Numérique et Sciences Informatiques";
  newBody.appendChild(newh1);
  var files = document.createElement("ul");
  files.className = "liste_fichiers";
  document.querySelectorAll("a").forEach((i) => {
    var docName = i.innerText;
    var docLink = i.href;
    var newA = document.createElement("li");
    newA.innerText = docName;
    newA.addEventListener("click", () => {
      document.location.href = docLink;
    })
    files.appendChild(newA);
  });
  newBody.appendChild(files);
  document.body = newBody;
}

patchPage();
