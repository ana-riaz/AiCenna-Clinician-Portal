// ── Labs tab ──────────────────────────────────────────────────────────────────
function renderLabs(id) {
  const d = patientData[id];
  const fv = {CRITICAL:'c', HIGH:'f', NORMAL:'n'};
  return `<div class="llayout">${d.labs.map((lab, idx) => `
    <div class="lr">
      <div class="lrh">
        <div><div class="lrn">${lab.name}</div><div class="lrd">${lab.date}</div></div>
        <div class="lrh-right">
          <span class="lsb ${lab.statusCls}">${lab.status}</span>
          <button class="vbtn vbtn-sm" onclick="openReportModal('${id}',${idx})">View Report</button>
        </div>
      </div>
      <div class="lrow lhd"><span>Test</span><span>Value</span><span>Reference</span><span>Flag</span></div>
      ${lab.rows.map(r => `<div class="lrow">
        <span>${r.test}</span>
        <span class="lv ${fv[r.flag]||'n'}">${r.val}</span>
        <span class="lr-ref">${r.ref}</span>
        <span class="lfb ${r.flag}">${r.flag}</span>
      </div>`).join('')}
    </div>`).join('')}</div>`;
}
