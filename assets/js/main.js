const currentPage = window.location.pathname;
const BREAKPOINT_LG = 991.98;
let animation = sessionStorage.getItem("animation") === "true";
let showSideBar = localStorage.getItem("showSideBar") === "true";
let sidebar = document.querySelector(".my-sidebar");
let toggler = document.getElementById("sidebar-toggler");
toggler.addEventListener("click", toggle);
window.addEventListener("resize", hideAnimations());

switch (currentPage) {
    case "/":
    case "/resume/":
        hideToggler();
        if (animation) {
            sidebar.classList.add("show");
            toggler.classList.add("show");
            void document.body.offsetHeight;

            document.body.classList.remove("preload");
            hide();
        } else {
            document.body.classList.remove("preload");
        }
        break;
    default:
        if (showSideBar && window.innerWidth > BREAKPOINT_LG) {
            if (animation) {
                sidebar.classList.add("show");
                toggler.classList.add("show");
                void document.body.offsetHeight;
            } else {
                document.body.classList.remove("preload");
                show();
            }
        }
        document.body.classList.remove("preload");
        break;
}

// Table of Content active code
let activeElement = null;
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
            activeElement = key;
            element.classList.add("active");
            history.replaceState(null, null, `#${key}`);
        } else {
            element.classList.remove("active");
        }
    });

    links.get(activeElement).classList.add("active");
});

let links = new Map();
let actives = new Map();
for (el of document.querySelectorAll("#TableOfContents a[href]")) {
    let id = /#(.*)/.exec(el.href)[1];
    links.set(id, el);
    actives.set(id, false);
    observer.observe(document.getElementById(id));
}

function toggle() {
    // use localStorage so user preference persists between sessions
    if (sidebar.classList.contains("show")) {
        hide();
        localStorage.setItem("showSideBar", false);
    } else {
        show();
        localStorage.setItem("showSideBar", true);
    }
}

function hide() {
    sidebar.classList.remove("show");
    toggler.classList.remove("show");
    sessionStorage.setItem("animation", false);
}

function show() {
    sidebar.classList.add("show");
    toggler.classList.add("show");
    sessionStorage.setItem("animation", true);
}

function hideToggler() {
    toggler.style.display = "none";
}

function hideAnimations() {
    let previousWidth = document.body.clientWidth;
    return () => {
        let currentWidth = document.body.clientWidth;

        let newDiff = currentWidth - BREAKPOINT_LG;
        let previousDiff = previousWidth - BREAKPOINT_LG;

        // In between breakpoints. Disable animations
        if (previousDiff > 0 != newDiff > 0) {
            document.body.classList.add("noanimation");
            void document.body.offsetHeight;
            document.body.classList.remove("noanimation");
        }
        previousWidth = currentWidth;
    };
}
