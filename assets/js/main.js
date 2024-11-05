let previousActive = null;
const observer = new IntersectionObserver((entries) => {
  for (entry of entries) {
    // NOTE: intersection ratios are only 1 or 0
    if (entry.isIntersecting) {
      actives.set(entry.target.id, true);
    } else {
      actives.set(entry.target.id, false);
    }
  }

  // Find the first active entry
  let found = false;
  actives.entries().forEach(([key, val]) => {
    const element = links.get(key);
    if (!found && val) {
      found = true;
      previousActive = key;
      element.classList.add("active");
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
