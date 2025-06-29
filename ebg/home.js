// v0

const areaSlider = () => {
  const sliderDesktop = () => {
    const titles = Array.from(document.querySelectorAll(".area-slider_title"));
    const cards = Array.from(document.querySelectorAll(".area-slider_card"));

    titles.forEach((title, i) => {
      title.addEventListener("mouseover", () => {
        const tl = gsap
          .timeline()
          .to(titles, { className: "area-slider_title" })
          .to(
            cards,
            { className: "area-slider_card", scale: 0.9, duration: 0.25 },
            "<"
          )
          .to(titles[i], { className: "area-slider_title cc-active" }, "<")
          .to(
            cards[i],
            {
              className: "area-slider_card cc-active",
              scale: 1,
              duration: 0.25,
            },
            "<"
          );
      });
    });
  };

  if (window.innerWidth > 767) {
    sliderDesktop();
  } else {
    sliderMobile();
  }
};

areaSlider();
