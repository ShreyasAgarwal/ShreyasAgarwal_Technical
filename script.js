const attendance = new Map();

const statusText = document.getElementById("status");
const tableBody = document.getElementById("attendanceTable");
const toggleBtn = document.getElementById("scanToggleBtn");

const html5QrCode = new Html5Qrcode("reader");
let scanning = false;

toggleBtn.addEventListener("click", async () => {
  if (!scanning) {
    await startScanning();
  } else {
    await stopScanning();
  }
});

async function startScanning() {
  try {
    await html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 220 },
      onScanSuccess
    );

    scanning = true;
    toggleBtn.textContent = "Stop Scanning";
    statusText.textContent = "Scanner is running";
    statusText.style.color = "#39ff14";

  } catch (err) {
    statusText.textContent = "Camera access failed";
    statusText.style.color = "red";
  }
}

async function stopScanning() {
  if (scanning) {
    await html5QrCode.stop();
    await html5QrCode.clear();
  }

  scanning = false;
  toggleBtn.textContent = "Start Scanning";
  statusText.textContent = "Scanner is stopped";
  statusText.style.color = "#aaa";
}

function onScanSuccess(decodedText) {
  try {
    const { id, name } = JSON.parse(decodedText);

    if (attendance.has(id)) {
      statusText.textContent = "Participant already checked in";
      statusText.style.color = "red";
      return;
    }

    attendance.set(id, name);
    addRow(id, name);

    statusText.textContent = "Check-in successful";
    statusText.style.color = "#39ff14";

  } catch {
    statusText.textContent = "Invalid QR code";
    statusText.style.color = "red";
  }
}

function addRow(id, name) {
  const row = tableBody.insertRow();
  row.insertCell(0).textContent = id;
  row.insertCell(1).textContent = name;
  row.insertCell(2).textContent = "Present";
}
