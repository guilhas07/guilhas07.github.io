const currentPage = window.location.pathname;
let animation = localStorage.getItem("animation") === "true";

window.onload = function () {
    let sidebar = document.querySelector(".my-side-bar");
    switch (currentPage) {
        case "/":
            // switching to home page (toggle off the sidebar with animation)
            if (animation) {
                sidebar.classList.add("show");
                void document.body.offsetHeight;

                document.body.classList.remove("preload");
                sidebar.classList.remove("show");
                localStorage.setItem("animation", false);
            } else {
                document.body.classList.remove("preload");
            }
            break;
        default:
            if (animation) {
                sidebar.classList.add("show");
                void document.body.offsetHeight;
                document.body.classList.remove("preload");
            } else {
                document.body.classList.remove("preload");
                sidebar.classList.add("show");
                localStorage.setItem("animation", true);
            }
            break;
    }
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
