// v0

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

let lenisAnchorsInit = false;
const initLenisAnchors = (lenis) => {
  if (!lenis) {
    console.warn("Lenis instance is required");
    return;
  }

  if (lenisAnchorsInit) return;

  lenisAnchorsInit = true;

  document.querySelectorAll('a[href*="#"]').forEach((link) => {
    const href = link.getAttribute("href");
    const [path, hash] = href.split("#");

    if (!hash) return;

    link.addEventListener("click", (e) => {
      const currentPath = window.location.pathname;
      const targetPath = path || currentPath;

      if (targetPath === currentPath) {
        // Same page — smooth scroll with Lenis
        const target = document.getElementById(hash);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, {
            offset: -20,
            duration: 1.2,
            easing: (t) => 1 - Math.pow(1 - t, 3),
          });
        }
      } else {
        sessionStorage.setItem("scrollTarget", `#${hash}`);
      }
    });
  });

  window.addEventListener("load", () => {
    console.log("load event listern:");

    const target = sessionStorage.getItem("scrollTarget");
    if (target) {
      sessionStorage.removeItem("scrollTarget");
      const el = document.querySelector(target);
      if (el) {
        setTimeout(() => {
          console.log("scrolling to:", el);
          // window.scrollTo(0, 0);
          // lenis.scrollTo(0);
          lenis.scrollTo(el, {
            offset: -20,
            duration: 1.2,
            easing: (t) => 1 - Math.pow(1 - t, 3),
          });
        }, 100); // wait for DOM + Lenis init
      }
    }
  });
};

const initLenis = () => {
  window.lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
  });
  gsap.ticker.add((time) => {
    window.lenis.raf(time * 1000);
  });
  lenis.on("scroll", ScrollTrigger.update);
};
if (window.innerWidth >= 767) {
  initLenis();
  initLenisAnchors(window.lenis);
}
window.addEventListener("resize", () => {
  if (window.innerWidth >= 767) {
    initLenis();
    initLenisAnchors(window.lenis);
  }
});

if (window.lenis) {
  window.lenis.scrollTo(0);
}
//loading anim
const loader = document.querySelector(".page-loader");

const pageImgEls = Array.from(document.querySelectorAll("img"));
const pageImgs = pageImgEls.map((el) => el.getAttribute("src"));
let loadedCount = 0;
const total = pageImgs.length;

const updateProgress = () => {
  const progress = (loadedCount / total) * 100;
  gsap.to(".loader-progress-inner", {
    width: `${Math.round(progress)}%`,
    duration: 1,
  });
};

window.pageLoadingAnim = gsap
  .timeline({ paused: true })
  .to(".loader-progress", { width: "120%" })
  .to(".loader-progress-inner", { height: "100vh" }, "<")
  .to(loader, { autoAlpha: 0 });

const preloadWithProgress = (srcs) => {
  srcs.forEach((src) => {
    const img = new Image();
    img.onload = img.onerror = () => {
      loadedCount++;
      updateProgress();
      if (loadedCount === total) {
        setTimeout(() => {
          window.pageLoadingAnim.play();
        }, 500);
      }
    };
    img.src = src;
  });
};

preloadWithProgress(pageImgs);

//forms
const contactForm = document.querySelector("#wf-form-contact-form");

const hideEl = (el) => {
  Object.assign(el.style, {
    display: "none",
    visibility: "hidden",
  });
};

const showEl = (el, flex) => {
  Object.assign(el.style, {
    display: flex ? "flex" : "block",
    visibility: "visible",
  });
};

const moveLoader = (form) => {
  const ancestor = form.parentElement.parentElement;
  const loader = ancestor.querySelector(".form-loading");
  ancestor.removeChild(loader);
  form.parentElement.appendChild(loader);
  hideEl(loader);
};
[contactForm].forEach((form) => moveLoader(form));

const styleLoader = (loader, form) => {
  loader.style.height = form.scrollHeight + "px";
  const styles = window.getComputedStyle(form);
  const margins = ["marginTop", "marginLeft", "marginRight", "marginBottom"];
  Object.assign(loader.style, {
    height: form.scrollHeight + "px",
    margin: margins.map((margin) => styles[margin]).join(" "),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  });
};
const handleSubmit = async (e, type) => {
  e.preventDefault();
  const form = e.target;
  const parent = form.parentElement;
  const loading = parent.querySelector(".form-loading");
  styleLoader(loading, form); // prevents jumps
  // show loader
  showEl(loading, true);
  hideEl(form);
  const successMsg = parent.querySelector(".form-success");
  const errorMsg = parent.querySelector(".form-error");
  const errorResponse = errorMsg.querySelector(".form-error-text");

  // hide (in edge cases)
  hideEl(errorMsg);
  hideEl(successMsg);
  const endpoint =
    "https://script.google.com/macros/s/AKfycbwL8bwk0OCcbu1ksk4fEDJwwok36GK9av13sM8Bpu37_gg50vLOuj8305HG1XM6SftZ/exec";
  const formData = new FormData(form);
  formData.append("type", type);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (result.status !== "success") {
      // show form + error + custom-message
      showEl(form, true);
      showEl(errorMsg);
      errorResponse.textContent = result.status;
      throw new Error(result.status);
    } else {
      // show success
      showEl(successMsg);
    }
  } catch (e) {
    console.error("form could not submit:", e);
    // show form + error
    showEl(form, true);
    showEl(errorMsg);
  } finally {
    hideEl(loading);
  }
};
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSubmit(e, "contact");
});
