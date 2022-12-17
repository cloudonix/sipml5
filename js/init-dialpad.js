
document.addEventListener("DOMContentLoaded", () => {
    let user = getCookie("user_id");
    let secret = getCookie("secret");
    let cname = getCookie("cname");
    let domain = getCookie("domain");
    let container = $("#my-container")
    let logoutBtn = document.getElementById("logout")

    logoutBtn.onclick = () => {
        logout()
    }
    container.webphone(["sip.ringplan.com"]);

    container.webphone.login(
      user,
      secret,
      cname,
      domain.length > 0 ? domain : null,
      function () {
        console.log("success");
        logoutBtn.style.display = "block"
      },
      function () {
        console.log("error");
      }
    );

    const logout = () => {
        container.webphone.logout()
        window.location = "/index.html"
    }
  });