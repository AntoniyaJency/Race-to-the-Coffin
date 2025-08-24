// ---------------- Settings, foods, and expectancy ----------------
const foodOptions = [
  { label: "Fruit 🍏", healthy: true }, { label: "Vegetable 🥦", healthy: true }, { label: "Salad 🥗", healthy: true },
  { label: "Oats 🥣", healthy: true }, { label: "Fish 🐟", healthy: true }, { label: "Nuts 🥜", healthy: true },
  { label: "Beans 🫘", healthy: true }, { label: "Pizza 🍕", healthy: false }, { label: "Burger 🍔", healthy: false },
  { label: "Chips 🍟", healthy: false }, { label: "Fried Chicken 🍗", healthy: false }, { label: "Cake 🍰", healthy: false },
  { label: "Cola 🥤", healthy: false }, { label: "Candy 🍬", healthy: false }, { label: "Pastries 🥐", healthy: false }
];

const baseExpectancy = { 
  IN: { male: 70, female: 74, other: 72 }, 
  US: { male: 76, female: 80, other: 78 }, 
  GB: { male: 79, female: 83, other: 81 }, 
  default: { male: 72, female: 75, other: 73 } 
};

let userCountryCode = "default", capturedImageData = null, mediaStream = null;

// ---------------- Elements ----------------
const video = document.getElementById("video"),
      canvas = document.getElementById("photo"),
      photoPreview = document.getElementById("photoPreview");

// ---------------- Setup food items ----------------
function setupFoodItems() {
  const foodsDiv = document.getElementById("foods");
  foodOptions.forEach((food, idx) => {
    let div = document.createElement("div");
    div.className = "food-item"; 
    div.innerText = food.label;
    div.onclick = () => div.classList.toggle("active");
    foodsDiv.appendChild(div);
  });
}
setupFoodItems();

// ---------------- Camera start ----------------
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
      drawFace(null); // show emoji when camera starts
    })
    .catch(() => alert("Could not access camera."));
};

// ---------------- Camera capture ----------------
document.getElementById("captureBtn").onclick = function () {
  canvas.getContext("2d").drawImage(video, 0, 0, 90, 90);
  capturedImageData = canvas.toDataURL("image/png"); 
  photoPreview.innerHTML = `<img src="${capturedImageData}">`;
  
  drawFace(capturedImageData); // <-- update the face

  if (mediaStream) { mediaStream.getTracks().forEach(t => t.stop()); mediaStream = null; }
  video.srcObject = null; 
  video.style.display = "none";
  document.getElementById("captureBtn").style.display = "none"; 
  document.getElementById("startCameraBtn").style.display = "inline-block";
};

// ---------------- Form submission ----------------
document.getElementById("countryForm").onsubmit = function (e) {
  e.preventDefault();

  const foodsSelected = [];
  document.querySelectorAll("#foods .food-item").forEach((el, idx) => {
    if (el.classList.contains("active")) foodsSelected.push(idx);
  });

  window.userFullName = document.getElementById("fullName").value;
  window.userGender = document.getElementById("genderSelect").value;
  window.userAge = parseInt(document.getElementById("ageInput").value);
  let countryField = document.getElementById("countrySelectField");
  userCountryCode = countryField.value || "default";
  window.userFoods = foodsSelected;

  document.getElementById("lifespan-section").scrollIntoView({ behavior: "smooth", block: "start" });
  setTimeout(() => startPersonCoffinAnimation(), 300);
};

// ---------------- Accurate days & minutes calculation ----------------
function calculateDaysLeft({ gender, age, foods, countryCode }) {
  let ccode = baseExpectancy[countryCode] ? countryCode : "default";
  let expectancy = baseExpectancy[ccode][gender] || baseExpectancy[ccode].other;

  let yearsLeft = expectancy - age;
  foods.forEach(idx => { 
    if (foodOptions[idx].healthy) yearsLeft += 1.3; 
    else yearsLeft -= 1.7; 
  });
  yearsLeft = Math.max(0, yearsLeft);

  const days = Math.floor(yearsLeft * 365.25);
  const minutes = Math.floor(yearsLeft * 365.25 * 24 * 60);

  return { yearsLeft, days, minutes, expectancy };
}

// ---------------- Draw face ----------------
function drawFace(imgData) {
  const faceDiv = document.querySelector("#personWrap .animated-face");
  if (!faceDiv) return;

  if (!imgData) {
    faceDiv.style.background = "#f197a2"; // pink background
    faceDiv.textContent = "🙂";            // emoji
    faceDiv.style.backgroundImage = "";
    faceDiv.style.backgroundSize = "cover";
    faceDiv.style.backgroundPosition = "center";
  } else {
    faceDiv.style.background = "none";
    faceDiv.textContent = "";
    faceDiv.style.backgroundImage = `url(${imgData})`;
    faceDiv.style.backgroundSize = "cover";
    faceDiv.style.backgroundPosition = "center";
  }
}

// ---------------- Determine cause of death ----------------
function getCauseOfDeath(foods) {
  let unhealthyCount = foods.filter(idx => !foodOptions[idx].healthy).length;

  if (unhealthyCount >= 5) return "due to excessive junk food 🍔🍕🍟";
  if (unhealthyCount >= 3) return "because of an unhealthy diet 🥤🍰";
  if (unhealthyCount > 0) return "due to some unhealthy eating habits";
  return "naturally 💫"; // mostly healthy
}

// ---------------- Animate person ----------------
function startPersonCoffinAnimation() {
  const personWrap = document.getElementById("personWrap");
  const coffinWrap = document.getElementById("coffinWrap");
  const personFace = document.querySelector("#personWrap .animated-face");
  const resultDiv = document.getElementById("result");

  personWrap.style.left="50px";
  personWrap.style.opacity=1;

  const { yearsLeft, days, minutes, expectancy } = calculateDaysLeft({
    gender: window.userGender,
    age: window.userAge,
    foods: window.userFoods,
    countryCode: userCountryCode
  });

  const bodyBg = days>7300?"linear-gradient(120deg,#edecc7,#f7debe,#e3e0ff)":days>1095?"linear-gradient(120deg,#cbe2ee,#f9e8d9,#f0eecc)":days>30?"linear-gradient(130deg,#f9ded7 10%,#e4e7ef 100%)":days>1?"linear-gradient(110deg,#ffc9c9 10%,#c1c1c1 100%)":"radial-gradient(ellipse at center,#222934 60%,#101019 100%)";
  document.body.style.background=bodyBg;

  const coffinX = coffinWrap.offsetLeft;
  let pos=50, bottomOffset=0, rotateDeg=0;

  if(minutes<=0 || days<=0){
    personWrap.style.opacity=0;
    let cause = getCauseOfDeath(window.userFoods);
    resultDiv.innerHTML = `💀 <b>${window.userFullName}</b> is dead ${cause}!`;
  } else if(days<1){
    pos = coffinX; bottomOffset=220;
    personWrap.style.opacity=1;
    resultDiv.innerHTML=`⚰️ <b>${window.userFullName}</b>, very few minutes left!<br>Expected years left: <b>${yearsLeft.toFixed(1)}</b> (<b>${days}</b> days).`;
  } else {
    const maxDays=36500;
    const fraction = 1 - Math.min(1,days/maxDays);
    const trackWidth = coffinX - 100;
    pos=50+fraction*(trackWidth-personWrap.offsetWidth);

    let healthyCount = window.userFoods.filter(idx=>foodOptions[idx].healthy).length;
    let unhealthyCount = window.userFoods.filter(idx=>!foodOptions[idx].healthy).length;
    pos -= healthyCount*10; pos += unhealthyCount*10;
    pos = Math.max(50, Math.min(pos, coffinX-personWrap.offsetWidth));
    bottomOffset=0;

    let msg="";
    if(days>10950) msg=`🌟 Wow, <b>${window.userFullName}</b>! You have a <b>long, bright future</b> ahead.`;
    else if(days>3650) msg=`😊 <b>${window.userFullName}</b>, there's plenty of life left!`;
    else if(days>30) msg=`🔔 <b>${window.userFullName}</b>, make every day count!`;
    else msg=`⚰️ <b>${window.userFullName}</b>, time is running short...`;
    msg+=`<br>Expected years left: <b>${yearsLeft.toFixed(1)}</b> (<b>${days}</b> days).<br>Country base expectancy: ${expectancy} years.`;
    resultDiv.innerHTML=msg;
  }

  if(capturedImageData){
    personFace.style.backgroundImage=`url(${capturedImageData})`;
    personFace.style.backgroundSize="cover";
    personFace.style.backgroundPosition="center";
    personFace.textContent = "";
  }

  personFace.style.transform=`rotate(${rotateDeg}deg)`;
  personWrap.style.transition="left 1.2s ease, bottom 0.8s ease, opacity 0.8s ease";
  personWrap.style.left = pos+"px";
  personWrap.style.bottom = bottomOffset+"px";

  document.getElementById("restartBtn").classList.add("visible");
}

// ---------------- Restart ----------------
document.getElementById('restartBtn').onclick = () => location.reload();

// ---------------- Default face ----------------
window.onload = () => drawFace(null);
