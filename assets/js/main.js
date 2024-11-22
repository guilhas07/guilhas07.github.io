window.onload = function () {
  let sidebar = document.querySelector(".my-side-bar");
  if (sidebar) {
    if (localStorage.getItem("animation") !== "true") {
      // NOTE: remove preload class so it triggers animation
      document.body.classList.remove("preload");
      localStorage.setItem("animation", true);
    }
    sidebar.classList.add("show");
    // NOTE: force reflow
    void document.body.offsetHeight;
  } else {
    localStorage.setItem("animation", false);
  }
  document.body.classList.remove("preload");
};

let previousActive = null;
const observer = new IntersectionObserver((entries) => {
  for (entry of entries) {
    // NOTE: intersection ratios are only 1 or 0
    actives.set(entry.target.id, entry.isIntersecting);
  }

  // Find the first active entry
  let found = false;
  actives.entries().forEach(([key, val]) => {
    const element = links.get(key);
    if (!found && val) {
      found = true;
      previousActive = key;
      element.classList.add("active");
      history.replaceState(null, null, `#${key}`);
    } else {
      element.classList.remove("active");
    }
  });

  // Activate the previousActive
  if (!found) {
    links.get(previousActive).classList.add("active");
  }
});

let links = new Map();
let actives = new Map();
for (el of document.querySelectorAll("#TableOfContents a[href]")) {
  let id = /#(.*)/.exec(el.href)[1];
  links.set(id, el);
  actives.set(id, false);
  observer.observe(document.getElementById(id));
}
