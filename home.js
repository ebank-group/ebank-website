// v1.2

const calculateReturns = (amount, freq = "daily") => {
  const saveCount = freq === "daily" ? 365 : 12;
  const deposit = amount * saveCount;
  const interest = deposit * 0.1; // 10% interest
  const bonus = interest / 12; // 13th month
  const final = deposit + interest + bonus;
  return {
    totalDeposit: deposit,
    interest,
    bonus,
    final,
  };
};

const handleCalculator = () => {
  const calcText = document.querySelector("[data-calc-input]");
  const calcInputParent = calcText.parentElement;
  const calcInput = document.createElement("input");
  calcInput.classList.add("text-field", "cc-calc_input");
  calcInput.setAttribute("type", "text");
  calcInput.value = "₦100.00";
  calcText.replaceWith(calcInput);
  // calcInputParent.removeChild(calcText);
  // calcInputParent.appendChild(calcInput);

  const calcResult = document.querySelector("[data-calc-result]");
  const calcBonus = document.querySelector("[data-calc-bonus]");

  let currentNumericValue = 0;
  let currentResultValue = 0;
  let currentFreq = "daily";

  calcInput.addEventListener("input", (event) => {
    const value = event.target.value;
    const cleanValue = window.cleanInput(value.slice(1));
    const numericValue = Number(cleanValue);
    currentNumericValue = numericValue;
    const { final, bonus } = calculateReturns(currentNumericValue, currentFreq);
    event.target.value = `₦${formatCurrency(cleanValue)}`;
    calcResult.textContent = `₦${formatCurrency(final)}`;
    calcBonus.textContent = `₦${formatCurrency(bonus)}`;
  });

  const periodTabs = document.querySelectorAll(".calc-select_tab");
  const periodText = document.querySelector(".calc-period");
  const periodIndicator = document.querySelector(".calc-select_indicator");
  periodIndicator.style.left = 0;
  periodIndicator.style.transform = "translateX(4px)";
  periodIndicator.style.transition = "all 0.3s var(--power2-out)";
  const periodTexts = {
    daily: "365 days,",
    monthly: "12 months,",
  };
  periodTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const value = tab.dataset.value;
      currentFreq = value;
      periodText.textContent = periodTexts[value];
      const { width, left } = tab.getBoundingClientRect();
      console.log("tab rect:", width, left, tab.offsetLeft);
      periodTabs.forEach((tab) => tab.classList.remove("cc-active"));
      tab.classList.add("cc-active");
      Object.assign(periodIndicator.style, {
        width: tab.offsetWidth + "px",
        transform: `translateX(${tab.offsetLeft}px)`,
      });
    });
  });
};

// .cc-calc_input .text-field
handleCalculator();
