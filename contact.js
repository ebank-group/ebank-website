// v1.2

const contactForm = document.querySelector("#wf-form-Contact-Form");
const contactFormBtn = contactForm.querySelector("a");

const replaceAnchorWithSubmit = (link) => {
  const button = document.createElement("button");
  button.type = "submit";
  button.innerHTML = link.innerHTML;
  button.className = link.className;
  button.style.cssText = link.style.cssText;

  for (const attr of link.attributes) {
    if (attr.name !== "href") {
      button.setAttribute(attr.name, attr.value);
    }
  }

  link.replaceWith(button);
};

moveLoader(contactForm);
replaceAnchorWithSubmit(contactFormBtn);

contactForm.addEventListener("submit", (e) => {
  console.log("contact submitted");
  e.preventDefault();
  handleSubmit(e, "contact");
});
