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