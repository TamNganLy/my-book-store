window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".custom-navbar");
  if (window.scrollY > 0) {
    navbar.classList.add("scrolled");
    navbar.classList.remove("navbar-dark", "bg-dark");
  } else {
    navbar.classList.remove("scrolled");
    navbar.classList.add("navbar-dark", "bg-dark");
  }
});
