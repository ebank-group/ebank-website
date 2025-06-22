// v1.0

const headlineSplit = new SplitText(".hero-title", { type: "lines" });
const heroBodySplit = new SplitText(".hero-body > p", { type: "lines" });
gsap.set("#hero-cta", { y: 20, autoAlpha: 0 });
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
    const theme = heroImgs[next].dataset.theme;
    const tl = gsap
      .timeline()
      .to(heroImgs[current], { autoAlpha: 0, duration: 1.2 })
      // .to(heroImgs[next], { autoAlpha: 1, duration: 1.2, scale: 1 }, '<')
      .to(heroImgs[next], { autoAlpha: 1, duration: 1.2 }, "<")
      .to(heroImgs[next], { duration: 9, scale: 1 }, "<")
      .set(".hero-inner", { className: "hero-inner " + theme }, "<")
      .set(heroImgs[current], { scale: 1.05 });
    setTimeout(() => {
      tl.kill();
    }, 9000);
    current = next;
  };
  setInterval(cycleFade, 8000);
};
// intro animation
const heroTl = gsap
  .timeline({ onComplete: createHeroAnimation })
  .from(".hero-img > img", { scale: 1.2, yPercent: -5, duration: 0.8 })
  .from(
    [".mask-left", ".mask-right"],
    { yPercent: 40, duration: 0.8, ease: "power2.out" },
    "<"
  )
  .from([...headlineSplit.lines, ...heroBodySplit.lines], {
    yPercent: 15,
    autoAlpha: 0,
    rotate: 0,
    stagger: 0.1,
    duration: 0.4,
    ease: "power2.out",
  })
  .to("#hero-cta", { y: 0, autoAlpha: 1, ease: "power2.out" });
// page animations
const pageSTs = [];
const sections = Array.from(document.querySelectorAll("[data-bg]"));
const changeBG = (color) => {
  const tl = gsap
    .timeline()
    .to(".page-wrapper, .mask-right, .mask-left", {
      backgroundColor: color,
      duration: 1,
      overwrite: true,
    })
    .to(
      ".mask-center",
      { boxShadow: `0 40px 0 20px ${color}`, duration: 1, overwrite: true },
      "<"
    );
  setTimeout(() => {
    tl.kill();
  }, 1000);
};
sections.forEach((section) => {
  const bgColor = section.dataset.bg || "#fff";
  console.log("for each ran");
  const st = ScrollTrigger.create({
    trigger: section,
    start: "top 70%",
    end: "bottom 71%",
    onEnter: () => {
      changeBG(bgColor);
    },
    onEnterBack: () => {
      changeBG(bgColor);
    },
    onLeave: () => {
      changeBG("white");
    },
    onLeaveBack: () => {
      changeBG("white");
    },
  });
  pageSTs.push(st);
});
window.pageLoadingAnim.add(heroTl, ">-0.2");
