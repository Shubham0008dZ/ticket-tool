// ===================================================
// Ticket Management – Frontend Script (FINAL)
// Backend: Google Apps Script + Google Sheet
// ===================================================

// 🔗 Google Apps Script Web App URL
const BACKEND_URL =
  "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjzC31UUGLyVSN-f17xlQBCVDusr8b0jAifEUkrhvy-yZ9byKegMxAUG9FMGQeumTAqj1iJZiB5758TJf85kcUhAVic6TArljim7NDgvPkb5t_V5n2N4s5dsbitEzEcfu7PLbS9TQJkF2-E0zoBwuU8yiC2PUnmXuP-i-C1Xpq2F69EDPPoSlmynfzPXfp7UHpNKHWOPa7W4qayGmjvBZgDz5F7kifLfFfCKkFtKxAggyLH_zSTsm23WLno2-5zydz6fRkLr0hAnjQjt4kKY-wpj8PVWg1c7etPKnwZ&lib=MHnJorPUKBc4JGOP7dSAYZczhuWBaZJNL";

// ===================================================
// DOM Ready
// ===================================================
document.addEventListener("DOMContentLoaded", () => {
  loadTickets();
  initModal();
  initForm();
});

// ===================================================
// TABLE LOGIC
// ===================================================
const tableBody = document.querySelector("#ticketTable tbody");

function clearTable() {
  tableBody.innerHTML = "";
}

function addRow(ticket) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${ticket.ticketNo || ""}</td>
    <td>${ticket.reportDate || ""}</td>
    <td>${ticket.ticketType || ""}</td>
    <td>${ticket.module || ""}</td>
    <td>${ticket.priority || ""}</td>
    <td>${ticket.callDesc || ""}</td>
    <td>${ticket.clientName || ""}</td>
    <td>${ticket.status || ""}</td>
    <td>${ticket.entryBy || ""}</td>
    <td>${ticket.currOwner || ""}</td>
    <td>${ticket.targetDate || ""}</td>
    <td>${ticket.clientTargetDate || ""}</td>
    <td>${ticket.entryDate || ""}</td>
    <td>${ticket.source || ""}</td>
    <td>${ticket.devRemarks || ""}</td>
  `;
  tableBody.appendChild(tr);
}

// ===================================================
// LOAD TICKETS (GET)
// ===================================================
function loadTickets() {
  fetch(`${BACKEND_URL}&action=list`)
    .then((res) => res.json())
    .then((data) => {
      if (data.status !== "success") {
        alert("Failed to load tickets");
        return;
      }

      clearTable();
      data.data.forEach(addRow);
    })
    .catch((err) => {
      console.error(err);
      alert("Error loading tickets");
    });
}

// ===================================================
// MODAL LOGIC
// ===================================================
function initModal() {
  const modal = document.getElementById("ticketModal");
  const openBtn = document.getElementById("addTicketBtn");
  const closeBtn = document.getElementById("closeModalBtn");

  openBtn.onclick = () => {
    modal.classList.add("show");
    setDefaultValues();
  };

  closeBtn.onclick = () => modal.classList.remove("show");
}

// ===================================================
// FORM LOGIC (POST)
// ===================================================
function initForm() {
  const form = document.getElementById("ticketForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const ticketData = getFormData();

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
      });

      const result = await res.json();

      if (result.status === "success") {
        alert("Ticket saved successfully ✅");
        form.reset();
        document.getElementById("ticketModal").classList.remove("show");
        loadTickets();
      } else {
        alert("Save failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  });
}

// ===================================================
// HELPERS
// ===================================================
function getFormData() {
  return {
    ticketNo: generateTicketNo(),
    reportDate: document.getElementById("mReportDate").value,
    ticketType: document.getElementById("mType").value,
    module: document.getElementById("mModule").value,
    priority: document.getElementById("mPriority").value,
    callDesc: document.getElementById("mCallDesc").value,
    clientName: document.getElementById("mClient").value,
    status: document.getElementById("mStatus").value || "Pending",
    entryBy: document.getElementById("mEntryBy").value,
    currOwner: "",
    targetDate: "",
    clientTargetDate: "",
    entryDate: new Date().toISOString().slice(0, 10),
    source: document.getElementById("mSource").value,
    devRemarks: "",
  };
}

function generateTicketNo() {
  const d = new Date();
  const ymd = d.toISOString().slice(0, 10).replace(/-/g, "");
  return `T-${ymd}-${Math.floor(Math.random() * 900 + 100)}`;
}

function setDefaultValues() {
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById("mReportDate").value = today;
}
