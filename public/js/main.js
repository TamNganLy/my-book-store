const navbar = document.querySelector(".custom-navbar");

// initial load
function applyNavbarState() {
  if (currentPage === "main") {
    if (window.innerWidth < 992) {
      navbar.classList.add("scrolled");
      navbar.classList.remove("navbar-dark", "bg-dark", "container-fluid");
    } else {
      if (window.scrollY > 0) {
        navbar.classList.add("scrolled");
        navbar.classList.remove("navbar-dark", "bg-dark");
      } else {
        navbar.classList.remove("scrolled");
        navbar.classList.add("navbar-dark", "bg-dark");
      }
    }
  } else {
    navbar.classList.add("scrolled");
    navbar.classList.remove("navbar-dark", "bg-dark");
  }
}

// run on load
applyNavbarState();

// run on scroll
window.addEventListener("scroll", applyNavbarState);

// ✅ run on resize
window.addEventListener("resize", applyNavbarState);

function handler(id) {
  document.getElementById("text" + id).setAttribute("hidden", true)
  document.getElementById("edit" + id).setAttribute("hidden", true)
  document.getElementById("done" + id).removeAttribute("hidden")
  document.getElementById("input" + id).removeAttribute("hidden")
  document.getElementById("cancel" + id).removeAttribute("hidden")
}

function handler_cancel(id) {
  document.getElementById("text" + id).removeAttribute("hidden")
  document.getElementById("edit" + id).removeAttribute("hidden")
  document.getElementById("done" + id).setAttribute("hidden", true)
  document.getElementById("input" + id).setAttribute("hidden", true)
  document.getElementById("cancel" + id).setAttribute("hidden", true)
}

function handler_book(id) {
  document.getElementById("title" + id).setAttribute("hidden", true)
  document.getElementById("author" + id).setAttribute("hidden", true)
  document.getElementById("description" + id).setAttribute("hidden", true)
  document.getElementById("rate" + id).setAttribute("hidden", true) 
  document.getElementById("edit" + id).setAttribute("hidden", true)

  document.getElementById("done" + id).removeAttribute("hidden")
  document.getElementById("updatedTitle" + id).removeAttribute("hidden")
  document.getElementById("updatedAuthor" + id).removeAttribute("hidden")
  document.getElementById("updatedDescription" + id).removeAttribute("hidden")
  document.getElementById("updatedRate" + id).removeAttribute("hidden")
  document.getElementById("cancel" + id).removeAttribute("hidden")
}

function handler_cancel_book(id) {
  document.getElementById("title" + id).removeAttribute("hidden")
  document.getElementById("author" + id).removeAttribute("hidden")
  document.getElementById("description" + id).removeAttribute("hidden")
  document.getElementById("rate" + id).removeAttribute("hidden")
  document.getElementById("edit" + id).removeAttribute("hidden")

  document.getElementById("done" + id).setAttribute("hidden", true)
  document.getElementById("updatedTitle" + id).setAttribute("hidden", true)
  document.getElementById("updatedAuthor" + id).setAttribute("hidden", true)
  document.getElementById("updatedDescription" + id).setAttribute("hidden", true)
  document.getElementById("updatedRate" + id).setAttribute("hidden", true)
  document.getElementById("cancel" + id).setAttribute("hidden", true)
}