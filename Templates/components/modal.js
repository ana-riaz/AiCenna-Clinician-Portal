// ── Report modal ──────────────────────────────────────────────────────────────
function flagClass(flag) {
  return flag==='CRITICAL'?'danger':flag==='HIGH'?'warn':'ok';
}

function openReportModal(ptId, testName) {
  const d = patientData[ptId];
  let row, labName;
  for (const lab of d.labs) {
    const found = lab.rows.find(r => r.test === testName);
    if (found) { row = found; labName = lab.name; break; }
  }
  if (!row) return;
  const fc = flagClass(row.flag);
  document.getElementById('modal-content').innerHTML = `
    <div class="modal-patient-header">
      <div class="modal-pt-av pav ${d.risk}">${d.init}</div>
      <div><div class="modal-pt-name">${d.name}</div><div class="modal-pt-lab">${labName}</div></div>
    </div>
    <div class="modal-body">
      <div class="modal-test-name">${testName}</div>
      <div class="modal-results-grid">
        <div><div class="modal-result-label">RESULT</div><div class="modal-result-val ${fc}">${row.val}</div></div>
        <div><div class="modal-result-label">REFERENCE RANGE</div><div class="modal-ref">${row.ref}</div></div>
      </div>
      <span class="modal-flag ${row.flag}">${row.flag}</span>
    </div>
    <div class="modal-actions">
      <button class="btn btng full" onclick="closeModal()">Close</button>
    </div>`;
  document.getElementById('reportModal').classList.add('vis');
}

function closeModal() {
  document.getElementById('reportModal').classList.remove('vis');
}
