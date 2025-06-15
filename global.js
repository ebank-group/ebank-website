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
const openFaq = (faq) => {
  faq.classList.remove("cc-closed");
  const body = faq.querySelector(".faq-body");
  body.style.height = body.scrollHeight + 8 + "px";
  body.style.paddingTop = "8px";
};
const closeAllFaqs = () => {
  faqs.forEach((faq) => {
    faq.classList.add("cc-closed");
    const body = faq.querySelector(".faq-body");
    body.style.height = "0px";
    body.style.padding = "0px";
  });
};
faqs.forEach((faq) => {
  faq.addEventListener("click", () => {
    closeAllFaqs();
    openFaq(faq);
  });
});
//open first faq
openFaq(faqs[0]);
