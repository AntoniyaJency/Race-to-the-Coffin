// --- Settings and Food set ---

const foodOptions = [
  { label: "Fruit 🍏", healthy: true },
  { label: "Vegetable 🥦", healthy: true },
  { label: "Salad 🥗", healthy: true },
  { label: "Oats 🥣", healthy: true },
  { label: "Fish 🐟", healthy: true },
  { label: "Nuts 🥜", healthy: true },
  { label: "Beans 🫘", healthy: true },
  { label: "Pizza 🍕", healthy: false },
  { label: "Burger 🍔", healthy: false },
  { label: "Chips 🍟", healthy: false },
  { label: "Fried Chicken 🍗", healthy: false },
  { label: "Cake 🍰", healthy: false },
  { label: "Cola 🥤", healthy: false },
  { label: "Candy 🍬", healthy: false },
  { label: "Pastries 🥐", healthy: false }
];

const baseExpectancy = {
  IN: { male: 70, female: 74, other: 72 },
  US: { male: 76, female: 80, other: 78 },
  GB: { male: 79, female: 83, other: 81 },
  default: { male: 72, female: 75, other: 73 }
};

let userCountryCode = "default";
let userCountryName = "";

const video = document.getElementById("video");
const canvas = document.getElementById("photo");
const photoPreview = document.getElementById("photoPreview");
const faceCanvas = document.getElementById("faceCanvas");

let capturedImageData = null;
let mediaStream = null;

// --- Page navigation ---

document.getElementById("scrollDownBtn").onclick = () => {
  document.getElementById("country-section").scrollIntoView({ behavior: "smooth" });
};

// Country section form
document.getElementById("countryForm").onsubmit = function (e) {
  e.preventDefault();
  const countrySelect = document.getElementById("countrySelect");
  if (!countrySelect.value) {
    alert("Please select a country to continue.");
    return;
  }

  userCountryCode = countrySelect.value;
  userCountryName = countrySelect.options[countrySelect.selectedIndex].text;

  // Fill country input in lifespan form
  document.getElementById("country").value = userCountryName;

  // Reveal lifespan section and scroll to it
  document.getElementById("lifespan-section").classList.remove("hidden");
  document.getElementById("lifespan-section").scrollIntoView({ behavior: "smooth" });
};

// Setup food buttons in lifespan form
function setupFoodItems() {
  const foodsDiv = document.getElementById("foods");
  foodOptions.forEach((food, idx) => {
    let div = document.createElement("div");
    div.className = "food-item";
    div.innerText = food.label;
    div.onclick = function () {
      div.classList.toggle("active");
    };
    foodsDiv.appendChild(div);
  });
}
setupFoodItems();

// --- Camera controls ---
document.getElementById("startCameraBtn").onclick = function () {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      mediaStream = stream;
      video.srcObject = stream;
      video.style.display = "block";
      document.getElementById("captureBtn").style.display = "inline-block";
      document.getElementById("startCameraBtn").style.display = "none";
      photoPreview.innerHTML = "";
      capturedImageData = null;
      drawFace(null, false);
    })
    .catch(() => alert("Could not access camera."));
};

document.getElementById("captureBtn").onclick = function () {
  canvas.getContext("2d").drawImage(video, 0, 0, 80, 80);
  capturedImageData = canvas.toDataURL("image/png");
  photoPreview.innerHTML = `<img src="${capturedImageData}">`;

  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }
  video.srcObject = null;
  video.style.display = "none";
  document.getElementById("captureBtn").style.display = "none";
  document.getElementById("startCameraBtn").style.display = "inline-block";
};

// --- Lifespan calculation ---
function calculateDaysLeft({ gender, age, foods, countryCode }) {
  let ccode = baseExpectancy[countryCode] ? countryCode : "default";
  let expectancy = baseExpectancy[ccode][gender] || baseExpectancy[ccode].other;
  let yearsLeft = expectancy - age;

  foods.forEach(idx => {
    if (foodOptions[idx].healthy) yearsLeft += 1.3;
    else yearsLeft -= 1.7;
  });

  yearsLeft = Math.max(0, yearsLeft);
  let days = Math.round(yearsLeft * 365.25);
  return { yearsLeft, days, expectancy };
}

// --- Visual scene setup ---
function setScene(daysLeft) {
  const personDiv = document.getElementById("person");
  let left, top;

  let bodyBg, textColor, shovelColor, coffinFilter = "brightness(1) saturate(1.2)";
  if (daysLeft > 7300) {
    left = 25; top = 150;
    bodyBg = "linear-gradient(120deg,#e0ffe0,#e3e0ff)";
    textColor = "#234524";
    shovelColor = "#34795c";
  } else if (daysLeft > 1095) {
    left = 140; top = 170;
    bodyBg = "linear-gradient(120deg,#cbe2ee,#f9e8d9)";
    textColor = "#374460";
    shovelColor = "#747229";
    coffinFilter = "saturate(.93)";
  } else if (daysLeft > 30) {
    left = 225; top = 210;
    bodyBg = "linear-gradient(130deg,#f9ded7 10%,#e4e7ef 100%)";
    textColor = "#666252";
    shovelColor = "#9c8443";
    coffinFilter = "saturate(0.8)";
  } else if (daysLeft > 1) {
    left = 315; top = 244;
    bodyBg = "linear-gradient(110deg,#ffc9c9 10%,#c1c1c1 100%)";
    textColor = "#9a2100";
    shovelColor = "#9a2100";
    coffinFilter = "saturate(.7) brightness(.9)";
  } else {
    left = 350; top = 285;
    bodyBg = "radial-gradient(ellipse at center,#222934 60%,#101019 100%)";
    textColor = "#fafaff";
    shovelColor = "#34323a";
    coffinFilter = "brightness(0.77) grayscale(0.62)";
  }

  personDiv.style.top = top + "px";
  document.body.style.background = bodyBg;
  document.body.style.color = textColor;
  document.getElementById("shovel").style.color = shovelColor;
  document.getElementById("coffinImg").style.filter = coffinFilter;

  return { left, top };
}

// --- Draw avatar face ---
function drawFace(imgData, lyingDown) {
  const ctx = faceCanvas.getContext("2d");
  ctx.clearRect(0, 0, 80, 80);
  if (!imgData) {
    ctx.beginPath();
    ctx.arc(40, 40, 35, 0, 2 * Math.PI);
    ctx.fillStyle = "#e1beae";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(40, 35, 20, 0, Math.PI, true);
    ctx.fillStyle = "#a8773b";
    ctx.fill();
    ctx.font = "15px sans-serif";
    ctx.fillStyle = "#392902";
    ctx.fillText("🙂", 22, 50);
    return;
  }
  let img = new window.Image();
  img.onload = function () {
    ctx.save();
    if (lyingDown) {
      ctx.translate(80, 0);
      ctx.rotate(Math.PI / 2);
    }
    ctx.drawImage(img, 0, 0, 80, 80);
    ctx.restore();
  };
  img.src = imgData;
}

// --- Animate avatar movement ---
function animatePersonToCoffin(startLeft, endLeft, top, callback) {
  const personDiv = document.getElementById("person");
  personDiv.style.top = top + "px";
  let left = startLeft;
  personDiv.style.left = left + "px";

  function step() {
    if (left < endLeft) {
      left += 7;
      personDiv.style.left = left + "px";
      requestAnimationFrame(step);
    } else {
      if (callback) callback();
    }
  }
  step();
}

// --- Lifespan form submission ---
document.getElementById("lifeForm").onsubmit = function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const gender = document.getElementById("gender").value;
  const age = parseInt(document.getElementById("age").value);

  let selectedFoods = [];
  document.querySelectorAll(".food-item").forEach((el, idx) => {
    if (el.classList.contains("active")) selectedFoods.push(idx);
  });

  let cc = userCountryCode || "default";

  const { yearsLeft, days, expectancy } = calculateDaysLeft({
    gender, age, foods: selectedFoods, countryCode: cc
  });

  let startLeft = 25;

  let endLeft;
  if (days > 7300) endLeft = 25;
  else if (days > 1095) endLeft = 140;
  else if (days > 30) endLeft = 225;
  else if (days > 1) endLeft = 315;
  else endLeft = 350;

  let top = endLeft === 350 ? 285 :
            endLeft === 315 ? 244 :
            endLeft === 225 ? 210 :
            endLeft === 140 ? 170 : 150;

  animatePersonToCoffin(startLeft, endLeft, top, () => {
    setScene(days);
    let lying = days <= 1;
    drawFace(capturedImageData, lying);

    let msg = "";
    if (days > 10950)
      msg = `🌟 Wow, <b>${name}</b>! You have a <b>long, bright future</b> ahead.`;
    else if (days > 3650) msg = `😊 <b>${name}</b>, there's plenty of life left!`;
    else if (days > 30) msg = `🔔 <b>${name}</b>, make every day count!`;
    else if (days > 1) msg = `⚰️ <b>${name}</b>, time is running short...`;
    else msg = `💀 <b>${name}</b>, it's nearly your time! Every second is precious.`;

    msg += `<br>Expected years left: <b>${yearsLeft.toFixed(1)}</b> (<b>${days}</b> days).<br>Country base expectancy: ${expectancy} years.<br><span style="font-size:0.99em;">(Fun calculation—live well!)</span>`;
    document.getElementById("result").innerHTML = msg;
  });
};

// Initialize face with default smiley on page load
window.onload = () => {
  drawFace(null, false);
};
