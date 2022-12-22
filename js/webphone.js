var classesStr = `items-center text-[#0D0D54] font-bold bg-[#F7F7FB] border-r-4 border-[#3B9EF7]`;
var activeClasses = classesStr.split(" ");
var subMenuClassesStr = `bg-[#F7F7FB] text-[#0D0D54]`;
var activeSubMenuClasses = subMenuClassesStr.split(" ");


async function login() {
  let user = document.getElementById("user_id").value;
  let pwd = document.getElementById("user_pwd").value;
  let cname = document.getElementById("user_cname").value;
  let domain = document.getElementById("user_domain").value;

  return new Promise((resolve, reject) => {
    $("#my-container").webphone.login(
      user,
      pwd,
      cname,
      domain.length > 0 ? domain : null,
      async () => {
        
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());

        if (params.error) {
          urlSearchParams.delete("error");
          history.pushState({}, "", window.location.pathname);
        }
        resolve();
      },
      async () => {
        // alert("login error");
        reject();
      }
    );
  });
}

const logout = async () => {
  $("#my-container").webphone.logout();
  $("#dialpad-content").addClass("hidden");
  $("#login-content").removeClass("hidden");
  setCookie("user_id", "", 1);
  setCookie("secret", "", 1);
  setCookie("cname", "", 1);
  setCookie("domain", "", 1);
};

async function updateUI() {
  try {
    await login();
    document.getElementById("login-content").classList.add("hidden");
    const data = await fetch("/dialpad/index.html");
    const html = await data.text();
    document.getElementById("dialpad-content").insertAdjacentHTML("afterbegin", html);
    document.getElementById("error-message").style.display = "none";
    document.getElementById("loading-progress").classList.remove("grid");
    document.getElementById("loading-progress").classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
    $("#my-container").removeClass("hidden");
    $("#my-container").addClass("flex");
    $("#webphone-keypad").removeClass("hidden");
    $("#webphone-keypad").addClass("flex");
    let extensionOpts = document.getElementById("extension-options");
    let phoneTab = document.getElementById("phone-tab");
    let settingsTab = document.getElementById("settings-tab");
    let subMenu = document.getElementById("settings-submenu");
    let pageTitle = document.getElementById("page-title");
    let mainContainer = document.getElementById("main");
    let settingsInfo = document.getElementById("settings-info");
    let mainWrapper = document.getElementById("main-wrapper");
    let logoutPopupTrigger = document.getElementById("logout-trigger");
    let modal = document.getElementById("logout-modal");
    let logoutConfirm = document.getElementById("logout-confirm");
    let logoutCancel = document.getElementById("logout-cancel");

    let versionInfoBtn = document.getElementById("version-info");
    let sidebar = document.getElementById("sidebar");
    let hamburgerBtn = document.getElementById("hamburger");

    extensionOpts.querySelector("span").innerText = getCookie("user_id")


    const cancelLogout = () => {
      modal.classList.remove("grid");
      modal.classList.add("hidden");
      pageTitle.innerText = "Settings - Version Info";
      settingsInfo.classList.remove("!hidden");
      versionInfoBtn.classList.add(...activeSubMenuClasses);
      logoutPopupTrigger.classList.remove(...activeSubMenuClasses);
    };

    // tabs functionality

    settingsTab.onclick = () => {
      settingsTab.children[0].classList.remove("gap-5");
      settingsTab.children[0].classList.add(...activeClasses, "gap-16");
      phoneTab.classList.remove(...activeClasses);
      phoneTab.classList.add("gap-5", "font-medium");
      phoneTab.querySelector("img").classList.add("grayscale");
      settingsTab.querySelector("img").classList.remove("grayscale");
      subMenu.classList.remove("hidden");
      pageTitle.innerText = "Settings - Version Info";
      extensionOpts.classList.add("hidden");
      $("#my-container").addClass("hidden");
      mainContainer.classList.add("!bg-[#F2F2F2]");
      settingsInfo.classList.remove("hidden");
      settingsInfo.classList.add("flex");
      mainWrapper.classList.add("h-main", "grid", "place-items-center");
    };

    phoneTab.onclick = () => {
      phoneTab.classList.remove("gap-5");
      phoneTab.classList.add(...activeClasses, "gap-16");
      settingsTab.children[0].classList.remove(...activeClasses);
      settingsTab.children[0].classList.add("gap-5", "font-medium");
      phoneTab.querySelector("img").classList.remove("grayscale");
      settingsTab.querySelector("img").classList.add("grayscale");
      subMenu.classList.add("hidden");
      pageTitle.innerText = "Phone";
      extensionOpts.classList.remove("hidden");
      $("#my-container").removeClass("hidden");
      mainContainer.classList.remove("!bg-[#F2F2F2]");
      settingsInfo.classList.add("hidden");
      settingsInfo.classList.remove("flex");
      mainWrapper.classList.remove("h-main", "grid", "place-items-center");
    };

    logoutPopupTrigger.onclick = (e) => {
      e.stopPropagation();
      modal.classList.remove("hidden");
      modal.classList.add("grid");
      pageTitle.innerText = "Settings - Logout";
      settingsInfo.classList.add("!hidden");
      versionInfoBtn.classList.remove(...activeSubMenuClasses);
      logoutPopupTrigger.classList.add(...activeSubMenuClasses);
    };

    logoutConfirm.onclick = () => {
      logout();
    };
    logoutCancel.onclick = () => {
      cancelLogout();
    };

    hamburgerBtn.onclick = () => {
      sidebar.classList.toggle("-translate-x-full");
    };
  } catch (error) {
    document.getElementById("dialpad-content").innerHTML = "";
    document.getElementById("login-content").classList.remove("hidden");
    document.getElementById("loading-progress").classList.remove("grid");
    document.getElementById("loading-progress").classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
    document.getElementById("error-message").style.display = "inline";
  }
}



window.onload = function () {
  let userDomain = document.getElementById("user_domain");

  userDomain.value = "zraytechnoloDoobh.ringplan.com";

  // check later document referrer to show or hide the select extensions menu

  let uname = getCookie("user_id") || "",
    pass = getCookie("secret") || "",
    cname = getCookie("cname") || "",
    domain = getCookie("domain") || "";

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
    updateUI();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  $("#my-container").webphone(["sip.ringplan.com"]);

  let loginBtn = document.getElementById("login-btn");
  let loader = document.getElementById("loading-progress");

  loginBtn.onclick = () => {
    loader.classList.remove("hidden");
    loader.classList.add("grid");
    document.body.classList.add("overflow-hidden");

    updateUI();
  };
});
