let previousActive = null;
const observer = new IntersectionObserver(
  (entries) => {
    console.log("Entries: %O", entries);

    found_active = false;
    for (entry of entries) {
      // NOTE: intersection ratios are only 1 or 0
      if (entry.isIntersecting) {
        actives.add(entry.target.id, entry);
        // most_visible_entry = entry;
        // break;
      } else {
        actives.delete(entry.target.id);
      }
    }

    // There is atleast one element active
    if (actives.size > 0) {
      let key = actives.entries().next().value[0];
      if (key !== previousActive) {
        console.log("Updating entry %s", key);

        links.get(key).classList.toggle("active");
        links.get(previousActive)?.classList.toggle("active");
        previousActive = key;
      }
    }
  },
  {
    // root: null,
    // rootMargin: "0px",
    // threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
  },
);

let links = new Map();
let actives = new Set();
for (el of document.querySelectorAll("#TableOfContents a[href]")) {
  // console.log("El %O", el);
  let id = /#(.*)/.exec(el.href)[1];
  links.set(id, el);
  observer.observe(document.getElementById(id));
}
