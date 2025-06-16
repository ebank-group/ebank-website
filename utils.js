window.cleanInput = (val) => {
  let cleaned = val.replace(/[^\d.]/g, "");

  const decimalIndex = cleaned.indexOf(".");
  if (decimalIndex !== -1) {
    cleaned =
      cleaned.slice(0, decimalIndex + 1) +
      cleaned.slice(decimalIndex + 1).replace(/\./g, "");
  }

  if (cleaned.includes(".")) {
    let [intPart, decPart] = cleaned.split(".");
    intPart = intPart.replace(/^0+/, "") || "0";
    cleaned = `${intPart}.${decPart}`;
  } else {
    cleaned = cleaned.replace(/^0+/, "") || "0";
  }

  return cleaned;
};

window.formatCurrency = (val) => {
  const numStr = typeof val === "number" ? val.toString() : val;
  const cleanValue = window.cleanInput(numStr);

  // Split into integer and decimal parts
  let [intPart, decPart] = cleanValue.split(".");

  // Format integer part with commas
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (decPart) {
    decPart = decPart.slice(0, 2); // 2 decimal places
  }

  return decPart !== undefined ? `${intPart}.${decPart}` : intPart;
};
