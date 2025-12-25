
/* =========================
   script.js — Complete + Updated
   Replace your existing script.js with this file
   ========================= */

/* ---------- Initialization ---------- */
document.addEventListener('DOMContentLoaded', () => {
    // Set today's date for all date inputs
    document.querySelectorAll('input[type="date"]').forEach(el => el.valueAsDate = new Date());
});

/* ---------- PARTICIPANT MODAL LOGIC ---------- */
let editingRow = null;

function toggleLateInput() {
    const status = document.getElementById('modal-status').value;
    const lateContainer = document.getElementById('late-time-container');
    if (status === 'Late Join') lateContainer.classList.remove('hidden');
    else { lateContainer.classList.add('hidden'); document.getElementById('modal-late-min').value = ''; }
}

function openParticipantModal(rowElement = null) {
    const modal = document.getElementById('participant-modal');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    document.body.classList.add('modal-active');
    if (rowElement) {
        editingRow = rowElement;
        document.getElementById('modal-title').innerText = 'Edit Participant';
        const statusBadge = rowElement.querySelector('.status-badge');
        const fullStatus = statusBadge ? statusBadge.innerText.trim() : 'Present';
        let statusVal = fullStatus; let timeVal = '';
        if (fullStatus.includes('Late Join')) {
            statusVal = 'Late Join';
            const match = fullStatus.match(/\((\d+)\s*min\)/);
            if (match) timeVal = match[1];
        } else if (!['Present','Absent','External'].includes(fullStatus)) statusVal = 'Present';
        document.getElementById('modal-status').value = statusVal;
        document.getElementById('modal-name').value = rowElement.cells[1].innerText;
        document.getElementById('modal-role').value = rowElement.cells[2].innerText;
        document.getElementById('modal-late-min').value = timeVal;
    } else {
        editingRow = null;
        document.getElementById('modal-title').innerText = 'Add Participant';
        document.getElementById('modal-status').value = 'Present';
        document.getElementById('modal-name').value = '';
        document.getElementById('modal-role').value = '';
        document.getElementById('modal-late-min').value = '';
    }
    toggleLateInput();
}

function closeParticipantModal() {
    document.getElementById('participant-modal').classList.add('opacity-0','pointer-events-none');
    document.body.classList.remove('modal-active');
}

function saveParticipant() {
    const status = document.getElementById('modal-status').value;
    const name = document.getElementById('modal-name').value.trim();
    const role = document.getElementById('modal-role').value.trim();
    const lateMin = document.getElementById('modal-late-min').value;
    if (!name) return alert('Name is required');
    if (status === 'Late Join' && !lateMin) return alert('Please specify minutes late');
    if (editingRow) updateParticipantHTML(editingRow, status, name, role, lateMin);
    else addParticipantRow(status, name, role, lateMin);
    closeParticipantModal();
}

function addParticipantRow(status, name, role, lateMin = '') {
    const tbody = document.getElementById('participants-list');
    const tr = document.createElement('tr');
    tr.className = 'group hover:bg-slate-50 transition-colors';
    updateParticipantHTML(tr, status, name, role, lateMin);
    tbody.appendChild(tr);
}

function updateParticipantHTML(tr, status, name, role, lateMin) {
    let badgeClass = '';
    let statusDisplay = status;
    if (status === 'Present') badgeClass = 'bg-green-100 text-green-700';
    else if (status === 'Absent') badgeClass = 'bg-red-100 text-red-700';
    else if (status === 'External') badgeClass = 'bg-blue-100 text-blue-700';
    else if (status === 'Late Join') { badgeClass = 'bg-orange-100 text-orange-700 border border-orange-200'; statusDisplay = `Late Join <span class="text-[10px] ml-1 opacity-75">(${lateMin} min)</span>`; }

    tr.innerHTML = `
        <td class="p-3"><span class="status-badge inline-flex items-center px-2 py-1 rounded text-xs font-bold ${badgeClass}">${statusDisplay}</span></td>
        <td class="p-3 font-medium text-slate-800">${name}</td>
        <td class="p-3 text-slate-500">${role}</td>
        <td class="p-3 text-center no-print">
            <button onclick="openParticipantModal(this.closest('tr'))" class="text-blue-500 hover:text-blue-700 mx-1"><i class="fa-solid fa-pen"></i></button>
            <button onclick="this.closest('tr').remove(); updateSummary()" class="text-slate-400 hover:text-red-500 mx-1"><i class="fa-solid fa-trash"></i></button>
        </td>
    `;
}

/* ---------- DEMO DATA ---------- */
/* ---------- UPDATED DEMO DATA FUNCTION ---------- */
function loadDemoData() {
    document.getElementById('meeting-title').value = 'Q3 Product Roadmap Review';
    document.getElementById('meeting-id').value = 'MOM-2025-Q3-08';
    document.getElementById('venue').value = 'Zoom Call';
    document.getElementById('chairperson').value = 'Sarah Jenkins';
    document.getElementById('start-time').value = '10:00';
    document.getElementById('end-time').value = '11:30';

    const list = document.getElementById('participants-list'); list.innerHTML = '';
    addParticipantRow('Present','Sarah Jenkins','Product Lead');
    addParticipantRow('Present','Mike Ross','Lead Developer');
    addParticipantRow('Absent','Jessica Pearson','Legal Counsel');
    addParticipantRow('Late Join','Tom Holland','Intern','15');
    addParticipantRow('External','David Chen','UX Consultant');

    document.getElementById('agenda-list').innerHTML = '';
    addAgendaItem('Review Q2 performance metrics');
    addAgendaItem('Discuss blockage in API integration');
    addAgendaItem('Budget approval for new marketing campaign');

    document.getElementById('discussion-text').value = 'The team reviewed the Q2 metrics and found a 15% increase in user retention. Mike raised concerns about the legacy API latency. It was agreed that refactoring the authentication module is a priority.';

    document.getElementById('decisions-list').innerHTML = '';
    addDecision('Approve Q3 Budget of $50k','ROI projected at 120%');

    // FIX: Use addActionRow instead of addActionItem to avoid opening modal
    document.getElementById('action-list').innerHTML = '';
    addActionRow('Refactor Auth Module','Mike Ross','High','2025-11-15');
    addActionRow('Finalize Vendor Contract','Sarah J.','Med','2025-10-30');

    // FIX: Use addRiskRow instead of addRisk to avoid opening modal
    document.getElementById('risks-list').innerHTML = '';
    addRiskRow('Server Latency','Scale AWS Instances','DevOps');

    document.getElementById('dependencies-list').innerHTML = '';
    addDependency('Legal approval for GDPR compliance');

    document.getElementById('metrics-list').innerHTML = '';
    addMetric('User Uptime','99.98%');

    document.getElementById('attachment-names').value = 'Q3_Budget.xlsx, Specs.pdf';
    document.getElementById('docs-list').innerHTML = '';
    addDocLink('Jira Board #422');

    document.getElementById('next-purpose').value = 'Final Sign-off';
    document.getElementById('next-outcome').value = 'Go/No-Go Decision';

    document.getElementById('prepared-by').value = 'John Admin';
    document.getElementById('reviewed-by').value = 'Sarah Jenkins';
    document.getElementById('approved-by').value = 'Board of Directors';

    updateSummary();
}


/* ---------- DYNAMIC SECTIONS ---------- */
function addAgendaItem(text = '') {
    const ul = document.getElementById('agenda-list');
    const li = document.createElement('li');
    li.className = 'box-item group';
    
    // Auto-numbering handled visually or via CSS counters, here we use a simple index icon
    li.innerHTML = `
        <span class="text-slate-400 text-xs font-bold w-4">#</span>
        <input type="text" value="${escapeHtml(text)}" placeholder="New Agenda Item" class="box-input">
        <button onclick="this.closest('li').remove();" class="text-slate-300 hover:text-red-500 no-print transition-colors"><i class="fa-solid fa-trash"></i></button>
    `;
    ul.appendChild(li);
}

/* Replace the existing addDecision function with this updated version: */

function addDecision(title = '', rationale = '') {
    const container = document.getElementById('decisions-list');
    const div = document.createElement('div');
    div.className = 'decision-item group';
    
    // Updated innerHTML with proper styling classes for inputs
    div.innerHTML = `
        <input type="text" value="${escapeHtml(title)}" placeholder="Decision Title" class="font-bold text-slate-800 w-full bg-transparent mb-1 outline-none border-b border-transparent hover:border-slate-300 focus:border-blue-400 transition-colors">
        <input type="text" value="${escapeHtml(rationale)}" placeholder="Rationale (Optional)" class="text-sm text-slate-600 w-full bg-transparent outline-none border-b border-transparent hover:border-slate-300 focus:border-blue-400 transition-colors">
        <button onclick="this.closest('div').remove(); updateSummary()" class="text-slate-400 hover:text-red-500 no-print px-2" style="position:absolute; right:8px; top:8px;"><i class="fa-solid fa-trash"></i></button>
    `;
    container.appendChild(div);
    updateSummary();
}


function addActionItem() { addActionRow(); }

function addActionRow(task='', owner='', pri='Med', date='') {
    const tbody = document.getElementById('action-list');
    const tr = document.createElement('tr'); tr.className='group hover:bg-slate-50';
    tr.innerHTML = `
        <td class="p-2"><input type="text" value="${escapeHtml(task)}" class="bg-transparent w-full outline-none" placeholder="Task description"></td>
        <td class="p-2"><input type="text" value="${escapeHtml(owner)}" class="bg-transparent w-full outline-none" placeholder="Owner"></td>
        <td class="p-2"><input type="text" value="${escapeHtml(pri)}" class="bg-transparent w-full outline-none" placeholder="High/Med/Low"></td>
        <td class="p-2"><input type="date" value="${escapeHtml(date)}" class="bg-transparent w-full outline-none"></td>
        <td class="p-2 text-center no-print"><button onclick="this.closest('tr').remove(); updateSummary()" class="text-slate-400 hover:text-red-500"><i class="fa-solid fa-trash"></i></button></td>
    `;
    tbody.appendChild(tr);
    updateSummary();
}

function addRisk(desc='', mitigation='', owner='') {
    const list = document.getElementById('risks-list');
    const div = document.createElement('div'); div.className='risk-item relative group';
    div.innerHTML = `
        <input type="text" value="${escapeHtml(desc)}" class="font-bold text-slate-800 w-full bg-transparent mb-1 outline-none" placeholder="Risk Description">
        <div class="flex gap-2">
            <input type="text" value="${escapeHtml(mitigation)}" class="text-slate-600 w-2/3 bg-transparent text-xs outline-none" placeholder="Mitigation Plan">
            <input type="text" value="${escapeHtml(owner)}" class="text-slate-500 w-1/3 bg-transparent text-xs text-right outline-none" placeholder="Owner">
        </div>
        <button onclick="this.closest('div').remove()" class="text-slate-400 hover:text-red-500 no-print px-2" style="position:absolute; right:6px; top:6px;"><i class="fa-solid fa-trash"></i></button>
    `;
    list.appendChild(div);
}

function addDependency(text='') {
    const ul = document.getElementById('dependencies-list');
    const li = document.createElement('li');
    li.className = 'box-item group';
    
    li.innerHTML = `
        <i class="fa-solid fa-link text-slate-400 text-xs"></i>
        <input type="text" value="${escapeHtml(text)}" placeholder="Dependency (e.g. Legal Approval)" class="box-input">
        <button onclick="this.closest('li').remove()" class="text-slate-300 hover:text-red-500 no-print transition-colors"><i class="fa-solid fa-trash"></i></button>
    `;
    ul.appendChild(li);
}

function addMetric(name='', val='') {
    const list = document.getElementById('metrics-list');
    const div = document.createElement('div');
    div.className = 'box-item group justify-between'; // justify-between keeps value on right
    
    div.innerHTML = `
        <input type="text" value="${escapeHtml(name)}" class="box-input" placeholder="Metric Name">
        <div class="flex items-center gap-3 pl-4 border-l border-slate-100">
            <input type="text" value="${escapeHtml(val)}" class="w-24 text-right font-mono font-bold text-blue-600 bg-transparent outline-none text-sm" placeholder="Value">
            <button onclick="this.closest('div').remove()" class="text-slate-300 hover:text-red-500 no-print transition-colors"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;
    list.appendChild(div);
}

function addDocLink(text='') {
    const list = document.getElementById('docs-list');
    const div = document.createElement('div'); div.className='group flex items-center gap-2';
    div.innerHTML = `
        <i class="fa-solid fa-link text-xs text-slate-400"></i>
        <input type="text" value="${escapeHtml(text)}" class="text-blue-600 underline cursor-pointer bg-transparent w-full outline-none" placeholder="Reference URL / Doc Name">
        <button onclick="this.closest('div').remove()" class="text-slate-400 hover:text-red-500 no-print px-2"><i class="fa-solid fa-trash"></i></button>
    `;
    list.appendChild(div);
}

function updateSummary() {
    const decisionCount = document.getElementById('decisions-list').children.length;
    const actionCount = document.getElementById('action-list').children.length;
    document.getElementById('sum-decisions').innerText = decisionCount;
    document.getElementById('sum-actions').innerText = actionCount;
}

/* ---------- SECTION REMOVE / RESTORE ---------- */
const removedSections = new Set();
function removeSection(id) { document.getElementById(id).classList.add('section-removed'); removedSections.add(id); renderRestorePanel(); }
function restoreSection(id) { document.getElementById(id).classList.remove('section-removed'); removedSections.delete(id); renderRestorePanel(); }
function renderRestorePanel() {
    const panel = document.getElementById('restore-panel');
    const list = document.getElementById('restore-list'); list.innerHTML = '';
    if (removedSections.size === 0) { panel.classList.add('hidden'); return; }
    panel.classList.remove('hidden');
    removedSections.forEach(id => {
        const name = id.replace('sec-','').toUpperCase();
        const btn = document.createElement('button'); btn.className='flex items-center justify-between bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded text-left transition-colors text-xs w-full';
        btn.innerHTML = `<span>${name}</span> <i class="fa-solid fa-rotate-left text-green-400"></i>`;
        btn.onclick = () => restoreSection(id);
        list.appendChild(btn);
    });
}

/* ---------- PRINT / PDF ---------- */
function generatePDF() {
    const element = document.getElementById('document-root');
    document.body.classList.add('generating-pdf');
    const opt = {
        margin:[10,10,10,10], filename:'MOM_Report.pdf', image:{type:'jpeg',quality:0.98},
        html2canvas:{ scale:2, useCORS:true, windowWidth:1123 }, jsPDF:{ unit:'mm', format:'a4', orientation:'portrait'}, pagebreak:{ mode:['css','legacy']}
    };
    html2pdf().set(opt).from(element).save().then(()=>{ document.body.classList.remove('generating-pdf'); });
}

function printPDF() { window.print(); }

/* ---------- ATTACHMENTS (file input handler) ---------- */
function openAttachmentPicker() { const el = document.getElementById('attachment-input'); if(el) el.click(); }

function handleAttachmentUpload(event) {
    const files = event.target.files; if(!files || !files.length) return;
    const container = document.getElementById('docs-list');
    Array.from(files).forEach(file => {
        const div = document.createElement('div'); div.className='group flex items-center gap-2';
        const ext = (file.name.split('.').pop()||'').toLowerCase();
        let icon = 'fa-file'; if(['pdf'].includes(ext)) icon='fa-file-pdf'; else if(['xls','xlsx','csv'].includes(ext)) icon='fa-file-excel'; else if(['doc','docx'].includes(ext)) icon='fa-file-word'; else if(['png','jpg','jpeg','gif','webp'].includes(ext)) icon='fa-image';
        div.innerHTML = `
            <i class="fa-solid ${icon} text-slate-400 text-xs"></i>
            <span class="text-slate-700 text-sm">${escapeHtml(file.name)}</span>
            <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-red-500 no-print px-2"><i class="fa-solid fa-trash"></i></button>
        `;
        container.appendChild(div);
    });
    event.target.value = '';
}

/* ---------- UTIL ---------- */
function escapeHtml(str){ if(!str) return ''; return String(str).replace(/[&<>"'`]/g, function(ch){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;",'`':'&#96;'}[ch]; }); }





/* =========================================
   NEW ACTION MODAL LOGIC (Paste at End)
   ========================================= */

// Override existing function to open modal instead of adding row directly
function addActionItem() {
    openActionModal();
}

// Variables for modal logic
let editingActionRow = null;

function openActionModal(rowElement = null) {
    const modal = document.getElementById('action-modal');
    // Ensure modal exists before trying to open it
    if (!modal) { console.error("Action modal not found in HTML"); return; }
    
    modal.classList.remove('opacity-0', 'pointer-events-none');
    document.body.classList.add('modal-active');

    if (rowElement) {
        editingActionRow = rowElement;
        document.getElementById('action-modal-title').innerText = 'Edit Action Item';
        
        // Extract values from existing row inputs
        const inputs = rowElement.querySelectorAll('input');
        // Inputs order: 0=Task, 1=Owner, 2=Priority, 3=Date
        document.getElementById('action-task').value = inputs[0].value;
        document.getElementById('action-owner').value = inputs[1].value;
        document.getElementById('action-priority').value = inputs[2].value;
        document.getElementById('action-date').value = inputs[3].value;
    } else {
        editingActionRow = null;
        document.getElementById('action-modal-title').innerText = 'Add Action Item';
        // Clear form
        document.getElementById('action-task').value = '';
        document.getElementById('action-owner').value = '';
        document.getElementById('action-priority').value = 'Med';
        document.getElementById('action-date').value = '';
    }
}

function closeActionModal() {
    const modal = document.getElementById('action-modal');
    if (modal) modal.classList.add('opacity-0', 'pointer-events-none');
    document.body.classList.remove('modal-active');
}

function saveActionItem() {
    const task = document.getElementById('action-task').value.trim();
    const owner = document.getElementById('action-owner').value.trim();
    const priority = document.getElementById('action-priority').value;
    const date = document.getElementById('action-date').value;

    if (!task) return alert('Task description is required');

    if (editingActionRow) {
        // Update existing row
        const inputs = editingActionRow.querySelectorAll('input');
        inputs[0].value = task;
        inputs[1].value = owner;
        inputs[2].value = priority;
        inputs[3].value = date;
        
        // Update priority color visually
        inputs[2].className = `bg-transparent w-full outline-none cursor-default text-center text-xs font-bold ${getPriorityColor(priority)} px-2 py-1 rounded`;
    } else {
        // Add new row
        addActionRow(task, owner, priority, date);
    }
    closeActionModal();
    updateSummary();
}

// Helper to get color classes
function getPriorityColor(pri) {
    if(pri === 'High') return 'bg-red-100 text-red-700';
    if(pri === 'Med') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
}

// Updated Row Creator (With Edit Button)
function addActionRow(task='', owner='', pri='Med', date='') {
    const tbody = document.getElementById('action-list');
    const tr = document.createElement('tr'); 
    tr.className = 'group hover:bg-slate-50 transition-colors';
    
    tr.innerHTML = `
        <td class="p-3"><input type="text" value="${escapeHtml(task)}" readonly class="bg-transparent w-full outline-none cursor-default font-medium text-slate-800"></td>
        <td class="p-3"><input type="text" value="${escapeHtml(owner)}" readonly class="bg-transparent w-full outline-none cursor-default text-slate-600"></td>
        <td class="p-3"><input type="text" value="${escapeHtml(pri)}" readonly class="bg-transparent w-full outline-none cursor-default text-center text-xs font-bold ${getPriorityColor(pri)} px-2 py-1 rounded"></td>
        <td class="p-3"><input type="date" value="${escapeHtml(date)}" readonly class="bg-transparent w-full outline-none cursor-default text-slate-500 text-sm"></td>
        <td class="p-3 text-center no-print">
            <button onclick="openActionModal(this.closest('tr'))" class="text-blue-500 hover:text-blue-700 mx-1"><i class="fa-solid fa-pen"></i></button>
            <button onclick="this.closest('tr').remove(); updateSummary()" class="text-slate-400 hover:text-red-500 mx-1"><i class="fa-solid fa-trash"></i></button>
        </td>
    `;
    tbody.appendChild(tr);
    updateSummary();
}


/* =========================================
   RISK MODAL LOGIC (Paste at End)
   ========================================= */

// Override existing function
function addRisk() {
    openRiskModal();
}

let editingRiskRow = null;

function openRiskModal(rowElement = null) {
    const modal = document.getElementById('risk-modal');
    if (!modal) { console.error("Risk modal not found in HTML"); return; }
    
    modal.classList.remove('opacity-0', 'pointer-events-none');
    document.body.classList.add('modal-active');

    if (rowElement) {
        editingRiskRow = rowElement;
        document.getElementById('risk-modal-title').innerText = 'Edit Risk';
        
        // Extract values from hidden inputs or text elements
        // Structure: div > inputs[0]=desc, inputs[1]=mitigation, inputs[2]=owner
        const inputs = rowElement.querySelectorAll('input');
        document.getElementById('risk-desc').value = inputs[0].value;
        document.getElementById('risk-mitigation').value = inputs[1].value;
        document.getElementById('risk-owner').value = inputs[2].value;
    } else {
        editingRiskRow = null;
        document.getElementById('risk-modal-title').innerText = 'Add Risk / Blocker';
        document.getElementById('risk-desc').value = '';
        document.getElementById('risk-mitigation').value = '';
        document.getElementById('risk-owner').value = '';
    }
}

function closeRiskModal() {
    const modal = document.getElementById('risk-modal');
    if (modal) modal.classList.add('opacity-0', 'pointer-events-none');
    document.body.classList.remove('modal-active');
}

function saveRiskItem() {
    const desc = document.getElementById('risk-desc').value.trim();
    const mitigation = document.getElementById('risk-mitigation').value.trim();
    const owner = document.getElementById('risk-owner').value.trim();

    if (!desc) return alert('Risk description is required');

    if (editingRiskRow) {
        // Update existing item
        const inputs = editingRiskRow.querySelectorAll('input');
        inputs[0].value = desc;
        inputs[1].value = mitigation;
        inputs[2].value = owner;
    } else {
        // Create new risk item
        addRiskRow(desc, mitigation, owner);
    }
    closeRiskModal();
}

// Updated Risk Row Creator (Box Style + Edit Button)
function addRiskRow(desc='', mitigation='', owner='') {
    const list = document.getElementById('risks-list');
    const div = document.createElement('div'); 
    div.className = 'risk-item relative group border-l-4 border-red-500 bg-red-50 p-3 rounded mb-2';
    
    div.innerHTML = `
        <!-- Inputs are readonly, acting as display fields -->
        <input type="text" value="${escapeHtml(desc)}" readonly class="font-bold text-slate-900 w-full bg-transparent mb-1 outline-none cursor-default block text-base">
        
        <div class="flex flex-wrap gap-y-1 text-sm">
             <span class="font-semibold text-red-700 mr-2">Mitigation:</span>
             <input type="text" value="${escapeHtml(mitigation)}" readonly class="text-slate-700 flex-1 bg-transparent outline-none cursor-default min-w-[150px]">
        </div>
        
        <div class="flex items-center mt-1">
             <span class="text-xs text-slate-500 mr-2">Owner:</span>
             <input type="text" value="${escapeHtml(owner)}" readonly class="text-xs font-medium text-slate-600 bg-transparent outline-none cursor-default">
        </div>

        <div class="absolute right-2 top-2 no-print flex gap-1">
            <button onclick="openRiskModal(this.closest('.risk-item'))" class="text-blue-500 hover:text-blue-700 p-1"><i class="fa-solid fa-pen"></i></button>
            <button onclick="this.closest('.risk-item').remove()" class="text-slate-400 hover:text-red-500 p-1"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;
    list.appendChild(div);
}





/* end of script.js */
