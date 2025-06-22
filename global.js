// v1.3
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

//loader

//reset to top
// window.addEventListener("load", () => {
//   if ("scrollRestoration" in history) {
//     history.scrollRestoration = "manual";
//   }

//   setTimeout(() => {
//     if (window.lenis) {
//       window.lenis.scrollTo(0, { immediate: true });
//     } else {
//       window.scrollTo(0, 0);
//     }
//   }, 100);
// });

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

//nav
const navBtn = document.querySelector(".nav-menu");
const nav = document.querySelector(".nav-inner");
navBtn.addEventListener("click", () => {
  if (nav.classList.contains("cc-open")) {
    nav.style.height = "72px";
  } else {
    nav.style.height = nav.scrollHeight + "px";
  }
  nav.classList.toggle("cc-open");
});
const pageSTs = [];
const createHeroAnimation = () => {
  const heroImgST = ScrollTrigger.create({
    target: '.section[section-name="hero"]',
    end: "bottom 70%",
    scrub: 1,
    animation: gsap.timeline().to(".hero-img img", { yPercent: 50 }),
  });
  pageSTs.push(heroImgST);
  // hero slider
  const heroImgs = Array.from(document.querySelectorAll(".hero-img"));
  let current = heroImgs.length - 1; // start from last (already placed 1st as last in the DOM)
  gsap.set(heroImgs, { autoAlpha: 0, scale: 1.05 });
  gsap.set(heroImgs[current], { autoAlpha: 1, scale: 1 });
  const cycleFade = () => {
    const next = (current + 1) % heroImgs.length;
    const tl = gsap
      .timeline()
      .to(heroImgs[current], { autoAlpha: 0, duration: 1.2 })
      // .to(heroImgs[next], { autoAlpha: 1, duration: 1.2, scale: 1 }, '<')
      .to(heroImgs[next], { autoAlpha: 1, duration: 1.2 }, "<")
      .to(heroImgs[next], { duration: 9, scale: 1 }, "<")
      .set(heroImgs[current], { scale: 1.05 });
    setTimeout(() => {
      tl.kill();
    }, 9000);
    current = next;
  };
  setInterval(cycleFade, 8000);
};
createHeroAnimation();
const faqs = Array.from(document.querySelectorAll(".faq"));
const closeFaq = (faq) => {
  faq.classList.add("cc-closed");
  const body = faq.querySelector(".faq-body");
  body.style.height = "0px";
  body.style.padding = "0px";
};
const openFaq = (faq) => {
  if (faq.classList.contains("cc-closed")) {
    faq.classList.remove("cc-closed");
    const body = faq.querySelector(".faq-body");
    body.style.height = body.scrollHeight + 8 + "px";
    body.style.paddingTop = "8px";
  } else {
    closeFaq(faq);
  }
};
const closeAllFaqs = () => {
  faqs.forEach((faq) => {
    faq.classList.add("cc-closed");
    const body = faq.querySelector(".faq-body");
    body.style.height = "0px";
    body.style.padding = "0px";
  });
};

const closeOtherFaqs = (faq) => {
  for (el of faqs) {
    if (el !== faq) {
      el.classList.add("cc-closed");
      const body = el.querySelector(".faq-body");
      body.style.height = "0px";
      body.style.padding = "0px";
    }
  }
};
faqs.forEach((faq) => {
  faq.addEventListener("click", () => {
    closeOtherFaqs(faq);
    openFaq(faq);
  });
});
//open first faq
if (faqs.length > 0) {
  faqs[0].click();
}

//modal
const waitlistModal = document.querySelector("[waitlist-modal]");
const comingSoonModal = document.querySelector("[coming-soon-modal]");
const toggleModal = (modal) => {
  modal.classList.toggle("cc-open");
};
const waitlistModalCloseBtn = waitlistModal.querySelector(".popup-close");
const comingSoonModalCloseBtn = comingSoonModal?.querySelector(".popup-close");

//buttons
const navCta = document.querySelector("[nav-button]");
const triggerBtns = Array.from(document.querySelectorAll("[data-get-started]"));
const heroPrimary = document.querySelector("[data-hero-primary-btn]");

triggerBtns.push(navCta, waitlistModalCloseBtn, heroPrimary);

triggerBtns.filter(Boolean).forEach((btn) => {
  btn.addEventListener("click", () => toggleModal(waitlistModal));
});

const heroSecondary = document.querySelector("[data-hero-secondary-btn]");
const secondaryTriggers = [heroSecondary, comingSoonModalCloseBtn];
secondaryTriggers.filter(Boolean).forEach((btn) => {
  btn.addEventListener("click", () => toggleModal(comingSoonModal));
});

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
    "https://script.google.com/macros/s/AKfycbxeDAKeFWPNWB1RltQmqpxEPy3DC76Skek95S2U3EkJt6f18jMdjrF79wBlooHyR2NcCQ/exec";
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
