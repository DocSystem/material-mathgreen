var pathname = document.location.pathname;

var savedPages = {};

function patchCSS(docRoot, pathname) {
  var link = docRoot.createElement("link");
  if (pathname == "/NSI.html" || pathname == "/Premiere.html" || pathname == "/Terminale.html" || pathname == "/mathexp.html" || pathname == "/BCPST.html") {
    link.href = chrome.extension.getURL("css/cours.css");
  }
  else if (pathname == "/") {
    link.href = chrome.extension.getURL("css/home.css");
  }
  link.type = "text/css";
  link.rel = "stylesheet";
  docRoot.querySelector("head").appendChild(link);
}

patchCSS(document, pathname);

function patchPage(docRoot, pathname) {
  if (pathname == "/NSI.html") {
    patchCours("NSI", "Cours - Numérique et Sciences Informatiques", docRoot);
  }
  else if (pathname == "/Premiere.html") {
    patchCours("Première", "Première : Cours & Exercices", docRoot);
  }
  else if (pathname == "/Terminale.html") {
    patchCours("Terminale Spécialité", "Terminale : Spécialité", docRoot);
  }
  else if (pathname == "/mathexp.html") {
    patchCours("Math expertes", "Terminale : Maths expertes", docRoot);
  }
  else if (pathname == "/BCPST.html") {
    patchCours("BCPST", "Activités : BCPST", docRoot);
  }
  else if (pathname == "/") {
    patchHome(docRoot);
  }
}

function patchHome(docRoot) {
  docRoot.title = "Mathgreen";
  docRoot.querySelector("marquee").setAttribute("direction", "left");
  var visitMessage = "<p><strong>" + docRoot.documentElement.outerHTML.split("<strong>")[1].split("\n\n")[0] + "</p>";
  var parser = new DOMParser();
  visitMessage = parser.parseFromString(visitMessage, "text/html");
  visitMessage = visitMessage.querySelector("p");
  docRoot.querySelector("strong").nextSibling.parentNode.removeChild(docRoot.querySelector("strong").nextSibling);
  docRoot.querySelector("strong").parentNode.removeChild(docRoot.querySelector("strong"));
  var topGradiant = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 160"><defs><linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%"   stop-color="#0B45EF"/><stop offset="100%" stop-color="#2DD2DC"/></linearGradient></defs><path fill="url(#gradient)" d="M0,160L48,138.7C96,117,192,75,288,48C384,21,480,11,576,26.7C672,43,768,85,864,117.3C960,149,1056,171,1152,154.7C1248,139,1344,85,1392,58.7L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"/></svg><svg width="100%" height="200"><linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%"   stop-color="#0B45EF"/><stop offset="100%" stop-color="#2DD2DC"/></linearGradient><rect x="0" y="0" width="100%" height="200" fill="url(#gradient)"/></svg>`;
  topGradiant = parser.parseFromString(topGradiant, "text/html");
  topGradiant.querySelectorAll("svg").forEach((i) => {
    docRoot.body.prepend(i);
  });
  var oldNav = docRoot.querySelector("#navMenu");
  var newNav = docRoot.createElement("nav");
  newNav.className = "navBar";
  docRoot.querySelectorAll("#navMenu > ul > li").forEach((i) => {
    var partTitle = i.children[0].innerText;
    if (i.children[1].children.length == 1) {
      var url = i.children[1].children[0].children[0].href
      var newButton = docRoot.createElement("a");
      newButton.innerText = partTitle;
      newButton.addEventListener("click", () => {
        changePage(url);
      });
      newNav.appendChild(newButton);
    }
    else {
      for (var si in i.children[1].children) {
        if (typeof i.children[1].children[si] == "object") {
          var subPartTitle = i.children[1].children[si].children[0].innerHTML;
          var url = i.children[1].children[si].children[0].href;
          var newButton = docRoot.createElement("a");
          newButton.innerText = partTitle + " - " + subPartTitle;
          newButton.addEventListener("click", () => {
            changePage(url);
          });
          newNav.appendChild(newButton);
        }
      }
    }
  });
  docRoot.querySelector("header").appendChild(newNav);
  oldNav.parentNode.removeChild(oldNav);
  var newMain = docRoot.createElement("div");
  newMain.className = "mainContent";
  var oldPosts = docRoot.querySelector("section.posts");
  var oldSidebar = docRoot.querySelector("section.sidebar");
  oldPosts.parentNode.removeChild(oldPosts);
  oldSidebar.parentNode.removeChild(oldSidebar);
  oldSidebar.querySelector("h2").innerText = oldSidebar.querySelector("h2").innerText.trim().split(".")[0]
  newMain.appendChild(oldPosts);
  newMain.appendChild(oldSidebar);
  docRoot.body.appendChild(newMain);
  docRoot.querySelector(".ctext").parentNode.removeChild(docRoot.querySelector(".ctext"));
  docRoot.querySelectorAll(".post header").forEach((i) => {
    if (i.innerText.trim() == "") {
      i.parentNode.removeChild(i);
    }
  });
  var separator = docRoot.createElement("div");
  separator.classList.add("separator");
  docRoot.querySelector(".sidebar header").appendChild(separator);
  var aboutMenu = docRoot.createElement("div");
  aboutMenu.classList.add("aboutMenu");
  aboutMenu.appendChild(visitMessage);
}

function patchCours(pageName, pageFullName, docRoot) {
  docRoot.title = `${pageName} - Mathgreen`;
  var newBody = docRoot.createElement("body");
  var newh1 = docRoot.createElement("h1");
  newh1.innerText = pageFullName;
  newBody.appendChild(newh1);
  var files = docRoot.createElement("ul");
  files.className = "liste_fichiers";
  docRoot.querySelectorAll("a").forEach((i) => {
    if ((i.innerText.trim() != "") && (i.href != "") && (i.href != "http://creativecommons.org/licenses/by-nc-sa/4.0/") && (i.href != docRoot.location.href)) {
      var docName = i.innerText;
      docName = docName.replaceAll("+", " + ");
      docName = docName.replaceAll("-", " - ");
      var docLink = i.href;
      var newA = docRoot.createElement("li");
      var aText = docRoot.createElement("p");
      aText.innerText = docName;
      newA.appendChild(aText);
      newA.addEventListener("click", () => {
        docRoot.location.href = docLink;
      })
      files.appendChild(newA);
    }
  });
  newBody.appendChild(files);
  docRoot.body = newBody;
}

function changePage(url) {
  document.location.href=url;
}

patchPage(document, pathname);
