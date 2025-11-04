const splash = document.getElementById("splash");
const loginWrap = document.getElementById("loginWrap");

const SPLASH_TIME = 2500;
window.addEventListener("load", () => {
  setTimeout(() => {
    splash.classList.add("hide");
    setTimeout(() => {
      splash.style.display = "none";
      loginWrap.classList.add("visible");
      document.getElementById("username").focus();
    }, 500);
  }, SPLASH_TIME);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && splash && !splash.classList.contains("hide")) {
    splash.classList.add("hide");
    setTimeout(() => {
      splash.style.display = "none";
      loginWrap.classList.add("visible");
      document.getElementById("username").focus();
    }, 300);
  }
});
