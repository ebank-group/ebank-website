// v1.0

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

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
}
window.addEventListener("resize", () => {
  if (window.innerWidth >= 767) {
    initLenis();
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
const popupForm = document.querySelector(".popup .ea-form");
const newsletterForm = document.querySelector("#wf-form-subscribe-form");
const moveLoader = (form) => {
  const ancestor = form.parentElement.parentElement;
  const loader = ancestor.querySelector(".form-loading");
  ancestor.removeChild(loader);
  form.parentElement.appendChild(loader);
};
[popupForm, newsletterForm].forEach((form) => moveLoader(form));

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
    "https://script.google.com/macros/s/AKfycbxLlo6UduZheDKHRi09oeWR0ykLMI1B0q2d8I94Xpb3K0eqWWXXYyoh59-xDFC58rj8/exec";
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
popupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSubmit(e, "waitlist");
});
newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSubmit(e, "newsletter");
});
//modal
const modal = document.querySelector(".modal");
const toggleModal = () => {
  modal.classList.toggle("cc-open");
};
const modalCloseBtn = modal.querySelector(".popup-close");
const heroCta = document.querySelector("#hero-cta");
const navCta = document.querySelector("#nav-cta");
const ctaBtn = document.querySelector("#cta-btn");
const toggles = [heroCta, navCta, ctaBtn, modalCloseBtn];
toggles.filter(Boolean).forEach((cta) => {
  cta.addEventListener("click", toggleModal);
});
