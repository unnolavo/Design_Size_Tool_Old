
const unitSelect = document.getElementById("unitSelect");
const sideSelect = document.getElementById("sideSelect");
const labelA = document.getElementById("labelA");
const labelS = document.getElementById("labelS");
const labelE = document.getElementById("labelE");
const result = document.getElementById("result");
const form = document.getElementById("calcForm");
const instructionText = document.getElementById("instructionText");

const canvas = document.getElementById("diagramCanvas");
const ctx = canvas.getContext("2d");

function updateLabels() {
  const unit = unitSelect.value;
  const side = sideSelect.value;
  const u = unit === "cm" ? "cm" : "in";
  const sideCap = side === "height" ? "HEIGHT" : "WIDTH";

  labelA.innerText = `TRUE FULL ${sideCap} (${u}):`;
  labelS.innerText = `On-screen FULL ${sideCap} (${u}):`;
  labelE.innerText = `On-screen DESIGN ${sideCap} (${u}):`;
  result.innerText = `ESTIMATED TRUE DESIGN ${sideCap}: –`;

  const inst = `1. Enter the actual measurement of the TRUE FULL ${sideCap} - typically found on product page in the Description or Size drop-down menu.\n2. Enter the onscreen measurement of that TRUE FULL PRODUCT ${sideCap} - taken with a ruler.\n3. Enter the onscreen measurement of the DESIGN ELEMENT'S ${sideCap} - taken with a ruler.\n4. Click "Calculate" to get the ESTIMATED TRUE DESIGN ${sideCap}.`;
  instructionText.innerText = inst;

  document.getElementById("actual").value = "";
  document.getElementById("screen").value = "";
  document.getElementById("element").value = "";
}
unitSelect.addEventListener("change", updateLabels);
sideSelect.addEventListener("change", updateLabels);

function toggleInstructions() {
  const content = document.getElementById("instructionText");
  content.style.display = content.style.display === "block" ? "none" : "block";
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const A = parseFloat(document.getElementById("actual").value);
  const S = parseFloat(document.getElementById("screen").value);
  const E = parseFloat(document.getElementById("element").value);

  if (S === 0) {
    alert("On-screen full measurement cannot be zero.");
    return;
  }

  const side = sideSelect.value;
  const unit = unitSelect.value;
  const calc = (A * E) / S;
  let convertedValue;
  let displayText;

  if (unit === "cm") {
    convertedValue = (calc / 2.54).toFixed(2);
    displayText = `${calc.toFixed(2)} cm / ${convertedValue} in`;
  } else {
    convertedValue = (calc * 2.54).toFixed(2);
    displayText = `${calc.toFixed(2)} in / ${convertedValue} cm`;
  }

  result.innerText = `ESTIMATED TRUE DESIGN ${side.toUpperCase()}: ${displayText}`;


  // Draw visual aid
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#888";

  const fullLength = side === "height" ? canvas.height * 0.8 : canvas.width * 0.8;
  const offset = side === "height" ? canvas.height * 0.1 : canvas.width * 0.1;
  const ratio = E / S;
  const designLength = fullLength * ratio;

  if (side === "height") {
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, offset);
    ctx.lineTo(canvas.width / 2, offset + fullLength);
    ctx.stroke();

    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 + 40, offset);
    ctx.lineTo(canvas.width / 2 + 40, offset + designLength);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(offset, canvas.height / 2);
    ctx.lineTo(offset + fullLength, canvas.height / 2);
    ctx.stroke();

    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(offset, canvas.height / 2 + 40);
    ctx.lineTo(offset + designLength, canvas.height / 2 + 40);
    ctx.stroke();
  }
});

updateLabels();
