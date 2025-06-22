// v1.0

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
openFaq(faqs[0]);
