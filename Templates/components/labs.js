// ── Labs tab ──────────────────────────────────────────────────────────────────
function renderLabs(id) {
  const d = patientData[id];
  const fv = {CRITICAL:'c', HIGH:'f', NORMAL:'n'};
  return `<div class="llayout">${d.labs.map(lab => `
    <div class="lr">
      <div class="lrh">
        <div><div class="lrn">${lab.name}</div><div class="lrd">${lab.date}</div></div>
        <span class="lsb ${lab.statusCls}">${lab.status}</span>
      </div>
      <div class="lrow lhd lrow-5"><span>Test</span><span>Value</span><span>Reference</span><span>Status</span><span></span></div>
      ${lab.rows.map(r => `<div class="lrow lrow-5">
        <span>${r.test}</span>
        <span class="lv ${fv[r.flag]||'n'}">${r.val}</span>
        <span class="lr-ref">${r.ref}</span>
        <span class="lfb ${r.flag}">${r.flag}</span>
        <button class="vbtn vbtn-sm" onclick="openReportModal('${id}','${r.test.replace(/'/g,"\\'")}')">View Report</button>
      </div>`).join('')}
    </div>`).join('')}</div>`;
}
