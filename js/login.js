document.addEventListener("DOMContentLoaded", () => {
  let extensionBtn = document.getElementById("extension-btn");
  let ringplanBtn = document.getElementById("ringplan-btn");

  extensionBtn.onclick = async () => {
    window.location = "/webphone.html"
  };
  ringplanBtn.onclick = () => {
    console.log("adsadasd");
  };
});
