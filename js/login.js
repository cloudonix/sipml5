document.addEventListener("DOMContentLoaded", () => {
  let extensionBtn = document.getElementById("extension-btn");
  extensionBtn.onclick = function () {
    window.open("../webphone.html", "Ringplan login", "width=600,height=600");
  };
});
