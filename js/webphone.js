function setCookie(cname, cvalue, exSeconds) {
  let d = new Date();
  d.setTime(d.getTime() + exSeconds * 1000);
  let expires = "expires=" + d.toUTCString();
  let cookie = cname + "=" + cvalue + ";" + expires + ";path=/"; // + cname;
  console.log(cookie);
  document.cookie = cookie;
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    console.log("Found cookie: " + c);
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  console.log("No Cookie found by name: " + cname);
  return "";
}

async function login() {
  let user = document.getElementById("user_id");
  let pwd = document.getElementById("user_pwd");
  let cname = document.getElementById("user_cname");
  let domain = document.getElementById("user_domain");

  if (!user || !pwd) {
    console.log("wrong credentials");
    return;
  }

  setCookie("user_id", user.value, 300);
  setCookie("secret", pwd.value, 300);
  setCookie("cname", cname.value, 300);
  setCookie("domain", domain.value, 300);

  const data = await fetch("/dialpad/index.html");
  const html = await data.text();

  document.open();
  document.write(html);
  document.close();
}

window.onload = function () {
  let userDomain = document.getElementById("user_domain");
  let errorMessage = document.getElementById("error-message");
  userDomain.value = "zraytechnoloDoobh.ringplan.com";


  // check later document referrer to show or hide the select extensions menu

  let uname = getCookie("user_id") || "",
    pass = getCookie("secret") || "",
    cname = getCookie("cname") || "",
    domain = getCookie("domain") || "";

  const urlSearchParams = new URLSearchParams(window.location.search);

  const params = Object.fromEntries(urlSearchParams.entries());

  if (params.error) {
    errorMessage.style.display = "inline";
  }

  if (
    window.location.search.length > 1 &&
    window.location.search.toLowerCase().indexOf("user=") > -1 &&
    window.location.search.toLowerCase().indexOf("pass=") > -1
  ) {
    let query_params = window.location.search.split("&");
    for (var i = 0; i < query_params.length; i++) {
      if (query_params[i].toLowerCase().indexOf("user=") > -1) {
        uname = query_params[i].split("=")[1];
      } else if (query_params[i].toLowerCase().indexOf("pass=") > -1) {
        pass = query_params[i].split("=")[1];
      } else if (query_params[i].toLowerCase().indexOf("cname=") > -1) {
        cname = query_params[i].split("=")[1].replace("%20", " ");
      } else if (query_params[i].toLowerCase().indexOf("domain=") > -1) {
        domain = query_params[i].split("=")[1];
      }
    }
  }

  let userId = document.getElementById("user_id");
  let password = document.getElementById("user_pwd");
  let cnameInput = document.getElementById("user_cname");
  let domainInput = document.getElementById("user_domain");

  if (uname.length > 1 && pass.length > 1) {
    userId.value = uname;
    password.value = pass;
    cnameInput.value = cname;
    domainInput.value = domain;
    login();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  let loginBtn = document.getElementById("login-btn");
  loginBtn.onclick = () => {
    login();
  };
});
