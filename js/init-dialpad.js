document.addEventListener("DOMContentLoaded", () => {
  let user = getCookie("user_id");
  let secret = getCookie("secret");
  let cname = getCookie("cname");
  let domain = getCookie("domain");
  let container = $("#my-container");
  let logoutBtn = document.getElementById("logout");

  logoutBtn.onclick = () => {
    logout();
  };
  container.webphone(["sip.ringplan.com"]);

  container.webphone.login(
    user,
    secret,
    cname,
    domain.length > 0 ? domain : null,
    () => {
      logoutBtn.style.display = "block";
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());
      if (params.error) {
        urlSearchParams.delete("error");
        history.pushState({}, "", window.location.pathname);
      }
    },
    async () => {
      console.log("jjjjjjjjjjjjjjjjjjjjjjj");
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
});
