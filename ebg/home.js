// v1.0

const areaSlider = () => {
  const titles = Array.from(document.querySelectorAll(".area-slider_title"));
  const cards = Array.from(document.querySelectorAll(".area-slider_card"));
  const sliderIndex = document.querySelector("#sliderIndex");

  const handlers = [];
  let currentIndex = 0;

  const transition = (i) => {
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
    if (i !== currentIndex) {
      currentIndex = i;
    }
    sliderIndex.textContent = String(i + 1).padStart(2, "0");
  };

  const sliderDesktop = () => {
    titles.forEach((title, i) => {
      const handler = () => transition(i);
      title.addEventListener("mouseover", handler);
      handlers.push({ element: title, handler });
    });
  };

  const destroyListeners = () => {
    handlers.forEach(({ element, handler }) => {
      element.removeEventListener("mouseover", handler);
    });
    handlers.length = 0;
  };

  const sliderMobile = () => {
    const prevBtn = document.querySelector(
      '.area-slider_pointer[data-btn="left"]'
    );
    const nextBtn = document.querySelector(
      '.area-slider_pointer[data-btn="right"]'
    );

    const handlerNext = () => {
      currentIndex = (currentIndex + 1) % cards.length;
      transition(currentIndex);
    };

    const handlerPrev = () => {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      transition(currentIndex);
    };

    nextBtn.addEventListener("click", handlerNext);
    prevBtn.addEventListener("click", handlerPrev);

    handlers.push({ element: nextBtn, handlerNext });
    handlers.push({ element: prevBtn, handlerPrev });
  };

  if (window.innerWidth > 767) {
    sliderDesktop();
  } else {
    sliderMobile();
  }

  window.addEventListener("resize", () => {
    destroyListeners();

    if (window.innerWidth > 767) {
      sliderDesktop();
    } else {
      sliderMobile();
    }
  });
};

areaSlider();
