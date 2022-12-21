let classesStr = `items-center text-[#0D0D54] font-bold bg-[#F7F7FB] border-r-4 border-[#3B9EF7]`
let activeClasses = classesStr.split(" ")
let subMenuClassesStr = `bg-[#F7F7FB] text-[#0D0D54]`
let activeSubMenuClasses = subMenuClassesStr.split(" ")

document.addEventListener("DOMContentLoaded", () => {
  let user = getCookie("user_id");
  let secret = getCookie("secret");
  let cname = getCookie("cname");
  let domain = getCookie("domain");
  let container = $("#my-container");
  let extensionOpts = document.getElementById("extension-options")
  let phoneTab = document.getElementById("phone-tab")
  let settingsTab = document.getElementById("settings-tab")
  let subMenu = document.getElementById("settings-submenu")
  let pageTitle = document.getElementById("page-title")
  let mainContainer = document.getElementById("main")
  let settingsInfo = document.getElementById("settings-info")
  let mainWrapper = document.getElementById("main-wrapper")
  let logoutPopupTrigger = document.getElementById("logout-trigger")
  let modal = document.getElementById("logout-modal")
  let logoutConfirm = document.getElementById("logout-confirm")
  let logoutCancel = document.getElementById("logout-cancel")
  let cancelIcon = document.getElementById("cancel-icon")
  let versionInfoBtn = document.getElementById("version-info")
  let sidebar = document.getElementById("sidebar")
  let hamburgerBtn = document.getElementById("hamburger")

  const manualLogout = async () => {
    const data = await fetch("/webphone.html");
    const html = await data.text();
    document.open();
    document.write(html);
    document.close();
  }

  const cancelLogout = () => {
    modal.classList.remove('grid')
    modal.classList.add('hidden')
    pageTitle.innerText = 'Settings - Version Info'
    settingsInfo.classList.remove('!hidden')
    versionInfoBtn.classList.add(...activeSubMenuClasses)
    logoutPopupTrigger.classList.remove(...activeSubMenuClasses)
  }

  if(!user || !secret){
    manualLogout()
  }

  container.webphone(["sip.ringplan.com"]);

  container.webphone.login(
    user,
    secret,
    cname,
    domain.length > 0 ? domain : null,
    () => {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());
      extensionOpts.querySelector("span").innerText = user
      if (params.error) {
        urlSearchParams.delete("error");
        history.pushState({}, "", window.location.pathname);
      }
    },
    async () => {
      setCookie("user_id", "", 300);
      setCookie("secret", "", 300);
      setCookie("cname", "", 300);
      setCookie("domain", "", 300);

      const data = await fetch("/webphone.html");
      const html = await data.text();
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("error", "true");
      let newRelativePathQuery =
        window.location.pathname + "?" + searchParams.toString();
      history.pushState({}, "", newRelativePathQuery);

      document.open();
      document.write(html);
      document.close();
    }
  );

  const logout = async () => {
    setCookie("user_id", "", 1);
    setCookie("secret", "", 1);
    setCookie("cname", "", 1);
    setCookie("domain", "", 1);

    const data = await fetch("/index.html");
    const html = await data.text();
    history.replaceState({}, "", "/");
    document.open();
    document.write(html);
    document.close();
  };

  // tabs functionality

  settingsTab.onclick = () => {
    settingsTab.children[0].classList.remove('gap-5')
    settingsTab.children[0].classList.add(...activeClasses, 'gap-16')
    phoneTab.classList.remove(...activeClasses)
    phoneTab.classList.add('gap-5', 'font-medium')
    phoneTab.querySelector("img").classList.add('grayscale')
    settingsTab.querySelector("img").classList.remove('grayscale')
    subMenu.classList.remove('hidden')
    pageTitle.innerText = 'Settings - Version Info'
    extensionOpts.classList.add('hidden')
    container.addClass('hidden')
    mainContainer.classList.add('!bg-[#F2F2F2]')
    settingsInfo.classList.remove('hidden')
    settingsInfo.classList.add('flex')
    mainWrapper.classList.add('h-main', 'grid', 'place-items-center')
  }

  phoneTab.onclick = () => {
    phoneTab.classList.remove('gap-5')
    phoneTab.classList.add(...activeClasses, 'gap-16')
    settingsTab.children[0].classList.remove(...activeClasses)
    settingsTab.children[0].classList.add('gap-5', 'font-medium')
    phoneTab.querySelector("img").classList.remove('grayscale')
    settingsTab.querySelector("img").classList.add('grayscale')
    subMenu.classList.add('hidden')
    pageTitle.innerText = 'Phone'
    extensionOpts.classList.remove('hidden')
    container.removeClass('hidden')
    mainContainer.classList.remove('!bg-[#F2F2F2]')
    settingsInfo.classList.add('hidden')
    settingsInfo.classList.remove('flex')
    mainWrapper.classList.remove('h-main', 'grid', 'place-items-center')
  }

  logoutPopupTrigger.onclick = (e) => {
    e.stopPropagation()
    modal.classList.remove('hidden')
    modal.classList.add('grid')
    pageTitle.innerText = 'Settings - Logout'
    settingsInfo.classList.add("!hidden")
    versionInfoBtn.classList.remove(...activeSubMenuClasses)
    logoutPopupTrigger.classList.add(...activeSubMenuClasses)
  }

  logoutConfirm.onclick = () => {
    logout()
  }
  logoutCancel.onclick = () => {
    cancelLogout()
  }
  cancelIcon.onclick = () => {
    cancelLogout()
  }
  hamburgerBtn.onclick = () => {
    sidebar.classList.toggle("-translate-x-full")
  }
});
