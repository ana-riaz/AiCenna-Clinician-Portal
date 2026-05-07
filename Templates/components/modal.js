// ── Report modal ──────────────────────────────────────────────────────────────
function openReportModal(ptId, labIdx) {
  const d   = patientData[ptId];
  const lab = d.labs[labIdx];
  if (!lab) return;
  const fv = {CRITICAL:'c', HIGH:'f', NORMAL:'n'};
  document.getElementById('modal-content').innerHTML = `
    <div class="modal-patient-header">
      <div class="modal-pt-av pav ${d.risk}">${d.init}</div>
      <div style="flex:1">
        <div class="modal-pt-name">${d.name}</div>
        <div class="modal-pt-lab">${lab.date}</div>
      </div>
      <span class="lsb ${lab.statusCls}">${lab.status}</span>
    </div>
    <div class="modal-rep-title">${lab.name}</div>
    <div class="modal-rep-table">
      <div class="modal-rep-hd"><span>Test</span><span>Value</span><span>Reference</span><span>Flag</span></div>
      ${lab.rows.map(r => `<div class="modal-rep-row">
        <span>${r.test}</span>
        <span class="lv ${fv[r.flag]||'n'}">${r.val}</span>
        <span class="lr-ref">${r.ref}</span>
        <span class="lfb ${r.flag}">${r.flag}</span>
      </div>`).join('')}
    </div>
    <div class="modal-actions">
      <button class="btn btng full" onclick="closeModal()">Close</button>
    </div>`;
  document.getElementById('reportModal').classList.add('vis');
}

function closeModal() {
  document.getElementById('reportModal').classList.remove('vis');
}
