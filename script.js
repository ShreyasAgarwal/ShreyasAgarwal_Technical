const attendance = new Map();
const statusText = document.getElementById("status");
const tableBody = document.getElementById("attendanceTable");
const startBtn = document.getElementById("startScanBtn");

let scanner = null;
let scanning = false;

startBtn.addEventListener("click", () => {
  if (scanning) return;

  scanner = new Html5QrcodeScanner(
    "reader",
    { fps: 10, qrbox: 250 }
  );

  scanner.render(onScanSuccess);
  scanning = true;

  statusText.textContent = "Scanning… show QR code";
  statusText.style.color = "#39ff14";
});

function onScanSuccess(decodedText) {
  try {
    const participant = JSON.parse(decodedText);
    const { id, name } = participant;

    if (attendance.has(id)) {
      statusText.textContent = `❌ ${name} already checked in`;
      statusText.style.color = "red";
      return;
    }

    attendance.set(id, name);
    addRow(id, name);

    statusText.textContent = `✅ ${name} checked in`;
    statusText.style.color = "#39ff14";

  } catch {
    statusText.textContent = "❌ Invalid QR Code";
    statusText.style.color = "red";
  }
}

function addRow(id, name) {
  const row = tableBody.insertRow();
  row.insertCell(0).textContent = id;
  row.insertCell(1).textContent = name;
  row.insertCell(2).textContent = "Present";
}
