function luhnCheck(num) {
  let arr = num.split('').reverse().map(Number);
  let sum = arr.reduce((acc, val, i) => {
    if (i % 2 !== 0) {
      val *= 2;
      if (val > 9) val -= 9;
    }
    return acc + val;
  }, 0);
  return sum % 10 === 0;
}

function detectBrand(num) {
  if (/^4/.test(num)) return "Visa";
  if (/^5[1-5]/.test(num)) return "MasterCard";
  if (/^3[47]/.test(num)) return "American Express";
  if (/^6/.test(num)) return "Discover";
  return "Unknown";
}

async function validateCard() {
  const cardInput = document.getElementById("cardNumber");
  const expiry = document.getElementById("expiry").value.trim();
  const result = document.getElementById("result");

  const card = cardInput.value.replace(/\D/g, "");

  if (card.length < 13 || card.length > 19) {
    result.innerHTML = "❌ Invalid card length";
    return;
  }

  if (!luhnCheck(card)) {
    result.innerHTML = "❌ Failed Luhn check";
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
      🧾 Type: ${data.type || "N/A"}<br>
      🔐 Scheme: ${data.scheme || "N/A"}
    `;
  } catch (err) {
    result.innerHTML += "<br>⚠ Unable to fetch BIN info";
  }
}
