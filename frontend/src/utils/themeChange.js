function changetheme() {
    let html = document.getElementsByTagName("html");
    html[0].dataset.theme = html[0].dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem('theme',html[0].dataset.theme)
  }

  export default changetheme