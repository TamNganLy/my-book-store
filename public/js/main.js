const navbar = document.querySelector(".custom-navbar");

if (currentPage === "main") {
  // normal scroll behavior
  window.addEventListener("scroll", function () {
    if (window.scrollY > 0) {
      navbar.classList.add("scrolled");
      navbar.classList.remove("navbar-dark", "bg-dark");
    } else {
      navbar.classList.remove("scrolled");
      navbar.classList.add("navbar-dark", "bg-dark");
    }
  });
} else if (currentPage === "book") {
  // always scrolled
  navbar.classList.add("scrolled");
  navbar.classList.remove("navbar-dark", "bg-dark");
}

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