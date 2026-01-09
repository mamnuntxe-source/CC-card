document.addEventListener("DOMContentLoaded", () => {

  // ---------- Expiry Auto Format ----------
  const expiryInput = document.getElementById("expiry");

  expiryInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length >= 2) {
      let month = value.substring(0, 2);

      if (month === "00") month = "01";
      if (parseInt(month) > 12) month = "12";

      value =
        month +
        (value.length > 2 ? "/" + value.substring(2, 4) : "");
    }

    e.target.value = value;
  });

});

// ---------- Luhn Check ----------
function luhnCheck(num) {
  let arr = num.split("").reverse().map(Number);
  let sum = arr.reduce((acc, val, i) => {
    if (i % 2 !== 0) {
      val *= 2;
      if (val > 9) val -= 9;
    }
    return acc + val;
  }, 0);
  return sum % 10 === 0;
}

// ---------- Card Brand Detection ----------
function detectBrand(num) {
  if (/^4/.test(num)) return "Visa";
  if (/^5[1-5]/.test(num)) return "MasterCard";
  if (/^3[47]/.test(num)) return "American Express";
  if (/^6/.test(num)) return "Discover";
  return "Unknown";
}

// ---------- Main Validation ----------
async function validateCard() {
  const card = document.getElementById("cardNumber").value.replace(/\D/g, "");
  const expiry = document.getElementById("expiry").value;
  const result = document.getElementById("result");

  if (card.length < 13 || card.length > 19) {
    result.innerHTML = "❌ Invalid card length";
    return;
  }

  if (!luhnCheck(card)) {
    result.innerHTML = "❌ Failed Luhn check";
    return;
  }

  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    result.innerHTML = "❌ Invalid expiry format";
    return;
  }

  const brand = detectBrand(card);
  const bin = card.substring(0, 6);

  result.innerHTML = "✔ Format valid<br>🔍 Loading BIN data...";

  try {
    const response = await fetch(`https://lookup.binlist.net/${bin}`);
    const data = await response.json();

    result.innerHTML = `
      ✔ Format Valid<br>
      💳 Brand: ${brand}<br>
      🏦 Bank: ${data.bank?.name || "N/A"}<br>
      🌍 Country: ${data.country?.name || "N/A"}<br>
      🧾 Type: ${data.type || "N/A"}
    `;
  } catch {
    result.innerHTML += "<br>⚠ BIN lookup failed";
  }
}