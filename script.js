// =========================
// Ticket Tool - script.js
// Backend: PHP (save_ticket.php, list_tickets.php)
// =========================

document.addEventListener("DOMContentLoaded", () => {
  // -------------------------
  // TABLE helpers
  // -------------------------
  const tableBody = document.querySelector("#ticketTable tbody");

  function addRowToTable(data) {
    if (!tableBody) return; // safety
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${data.ticketNo || ""}</td>
      <td>${data.reportDate || ""}</td>
      <td>${data.ticketType || ""}</td>
      <td>${data.module || ""}</td>
      <td>${data.priority || ""}</td>
      <td>${data.callDesc || ""}</td>
      <td>${data.clientName || ""}</td>
      <td>${data.status || ""}</td>
      <td>${data.entryBy || ""}</td>
      <td>${data.currOwner || ""}</td>
      <td>${data.targetDate || ""}</td>
      <td>${data.clientTargetDate || ""}</td>
      <td>${data.entryDate || ""}</td>
      <td>${data.source || ""}</td>
      <td>${data.devRemarks || ""}</td>
      <td><button class="action-btn">View</button></td>
    `;
    tableBody.appendChild(tr);
  }

  // Load existing tickets from backend
  function _loadTicketsInternal() {
    if (!tableBody) return;
    // clear old rows
    tableBody.innerHTML = "";

    fetch("list_tickets.php")
      .then((r) => r.json())
      .then((res) => {
        if (res.status !== "success" || !Array.isArray(res.data)) return;
        res.data.forEach((row) => {
          addRowToTable({
            ticketNo: row.ticketNo,
            reportDate: row.reportDate,
            ticketType: row.ticketType,
            module: row.module,
            priority: row.priority,
            callDesc: row.callDesc,
            clientName: row.clientName,
            status: row.status,
            entryBy: row.entryBy,
            currOwner: "",
            targetDate: "",
            clientTargetDate: "",
            entryDate: row.entryDate,
            source: row.source,
            devRemarks: row.devRemarks
          });
        });
      })
      .catch((err) => console.error("loadTickets error:", err));
  }

  // global se bhi call kar sake (console se test, etc.)
  window.loadTickets = _loadTicketsInternal;

  // -------------------------
  // Column search (per header input)
  // -------------------------
  const filterInputs = document.querySelectorAll(".search-row input");

  filterInputs.forEach((input) => {
    input.addEventListener("input", () => {
      const filters = {};
      filterInputs.forEach((inp) => {
        const v = inp.value.trim().toLowerCase();
        if (v) filters[inp.dataset.col] = v;
      });
      if (!tableBody) return;
      tableBody.querySelectorAll("tr").forEach((row) => {
        const cells = row.querySelectorAll("td");
        let visible = true;
        Object.keys(filters).forEach((col) => {
          const text = (cells[col] ? cells[col].textContent : "").toLowerCase();
          if (!text.includes(filters[col])) visible = false;
        });
        row.style.display = visible ? "" : "none";
      });
    });
  });

  // -------------------------
  // Top filter buttons
  // -------------------------
  const resetBtn = document.getElementById("resetBtn");
  const displayBtn = document.getElementById("displayBtn");
  const excelBtn = document.getElementById("excelBtn");

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      document
        .querySelectorAll(
          ".filter-card select, .filter-card input[type='date'], .filter-card input[type='text']"
        )
        .forEach((el) => (el.value = ""));
      const completeChk = document.getElementById("fComplete");
      if (completeChk) completeChk.checked = false;
      filterInputs.forEach((inp) => (inp.value = ""));
      if (!tableBody) return;
      tableBody
        .querySelectorAll("tr")
        .forEach((row) => (row.style.display = ""));
    });
  }

  if (displayBtn) {
    displayBtn.addEventListener("click", () => {
      alert("Display abhi sirf frontend filter ke liye hai.");
    });
  }

  if (excelBtn) {
    excelBtn.addEventListener("click", () => {
      const allRows = document.querySelectorAll("#ticketTable tr");
      const rows = [...allRows].map((tr) =>
        [...tr.children]
          .slice(0, 15) // last action-btn column hata diya
          .map((td) => `"${td.textContent.replace(/"/g, '""')}"`)
          .join(",")
      );
      const blob = new Blob([rows.join("\n")], {
        type: "text/csv;charset=utf-8;"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tickets.csv";
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // -------------------------
  // Modal + ticket no
  // -------------------------
  const modal = document.getElementById("ticketModal");
  const openBtn = document.getElementById("addTicketBtn");
  const closeBtn = document.getElementById("closeModalBtn");
  const clearSourceBtn = document.getElementById("clearSourceBtn");

  let ticketCounter = 1;

  function generateTicketNo() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const seq = String(ticketCounter++).padStart(3, "0");
    return `T-${y}${m}${d}-${seq}`;
  }

  function openModal() {
    if (!modal) return;
    const ticketNoEl = document.getElementById("mTicketNo");
    const reportDateEl = document.getElementById("mReportDate");
    const commitDateEl = document.getElementById("mCommitDate");

    if (ticketNoEl) ticketNoEl.value = generateTicketNo();
    const today = new Date().toISOString().slice(0, 10);
    if (reportDateEl) reportDateEl.value = today;
    if (commitDateEl) commitDateEl.value = today;

    modal.classList.add("show");
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("show");
  }

  if (openBtn) openBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  if (modal) {
    const backdrop = modal.querySelector(".modal-backdrop");
    if (backdrop) {
      backdrop.addEventListener("click", closeModal);
    }
  }

  if (clearSourceBtn) {
    clearSourceBtn.addEventListener("click", () => {
      const src = document.getElementById("mSource");
      if (src) src.selectedIndex = 0;
    });
  }

  // -------------------------
  // Save ticket (frontend + backend)
  // -------------------------
  const ticketForm = document.getElementById("ticketForm");

  if (ticketForm) {
    ticketForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = {
        ticketNo: (document.getElementById("mTicketNo") || {}).value || "",
        reportDate: (document.getElementById("mReportDate") || {}).value || "",
        ticketType: (document.getElementById("mType") || {}).value || "",
        module: (document.getElementById("mModule") || {}).value || "",
        priority: (document.getElementById("mPriority") || {}).value || "",
        callDesc: (document.getElementById("mCallDesc") || {}).value || "",
        clientName: (document.getElementById("mClient") || {}).value || "",
        status:
          (document.getElementById("mStatus") || {}).value || "Pending",
        entryBy: (document.getElementById("mEntryBy") || {}).value || "",
        currOwner: "",
        targetDate: "",
        clientTargetDate: "",
        entryDate: new Date().toISOString().slice(0, 10),
        source: (document.getElementById("mSource") || {}).value || "",
        devRemarks: ""
      };

      // Optional basic validation
      if (!data.reportDate || !data.clientName || !data.callDesc) {
        alert("Please fill required fields.");
        return;
      }

      try {
        const resp = await fetch("save_ticket.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        const res = await resp.json().catch(() => ({}));

        if (!resp.ok || res.status !== "success") {
          console.error("Save error:", res);
          alert("Ticket save failed (backend).");
          return;
        }

        // Table ko refresh kar do latest data se
        _loadTicketsInternal();

        ticketForm.reset();
        closeModal();
        alert("Ticket saved successfully.");
      } catch (err) {
        console.error("Network error:", err);
        alert("Network error while saving ticket.");
      }
    });
  }

  // -------------------------
  // Initial load
  // -------------------------
  _loadTicketsInternal();
});
