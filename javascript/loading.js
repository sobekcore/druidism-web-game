// Page loading animation
window.addEventListener("load", function()
  {
    const loader = document.querySelector(".loader");
    loader.className += " hidden";
  }
);

// No animations on load
document.body.classList.add("no-transition");
document.body.classList.remove("no-transition");
setTimeout(() => document.body.classList.remove("no-transition"), 1);
