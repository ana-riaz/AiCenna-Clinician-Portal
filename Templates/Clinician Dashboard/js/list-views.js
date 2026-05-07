// ── Patients list view ────────────────────────────────────────────────────────
function renderPatientsView(){
  const vc = {n:'ok', e:'warn', c:'danger'};
  return Object.keys(patientData).map(id => {
    const d = patientData[id];
    const v = d.vitals;
    const sc = d.healthScore>=80?'ok':d.healthScore>=60?'warn':'danger';
    const vitCells = [
      {label:'Heart Rate',     val:v.hr.val,      unit:'bpm',  c:vc[v.hr.tc]},
      {label:'SpO2',           val:v.spo2.val,    unit:'%',    c:vc[v.spo2.tc]},
      {label:'Blood Pressure', val:v.bp.val,      unit:'',     c:vc[v.bp.tc]},
      {label:'Health Score',   val:d.healthScore, unit:'/100', c:sc}
    ].map(x=>`
      <div class="vstat">
        <div class="vstat-label">${x.label}</div>
        <div class="vstat-val ${x.c}">${x.val}<span class="vstat-unit">${x.unit}</span></div>
      </div>`).join('');
    return `<div class="panel list-card" onclick="openPt('${id}')">
      <div class="ph">
        <div class="ph-left">
          <div class="pav lg ${d.risk}">${d.init}</div>
          <div>
            <div class="pt-info-name">${d.name}</div>
            <div class="pt-info-meta">${d.meta}</div>
          </div>
        </div>
        <div class="ph-right">
          <span class="rb ${d.risk}">${d.rl}</span>
          <span class="link-action">View Twin →</span>
        </div>
      </div>
      <div class="vitals-strip">${vitCells}</div>
      <div class="tags-strip">
        ${d.conditions.map(c=>`<span class="tg co">${c}</span>`).join('')}
        ${d.medications.map(m=>`<span class="tg me">${m}</span>`).join('')}
      </div>
    </div>`;
  }).join('');
}

// ── Summaries list view ───────────────────────────────────────────────────────
function renderSummariesView(){
  return Object.keys(patientData).map(id => {
    const d = patientData[id];
    const cLabel = d.summaryBadge==='h'?'High confidence':'Medium confidence';
    return `<div class="panel list-card-lg" onclick="openPt('${id}','sum')">
      <div class="ph">
        <div class="ph-left-sm">
          <div class="pav ${d.risk}">${d.init}</div>
          <div><div class="pn">${d.name}</div><div class="pc">${d.meta}</div></div>
          <span class="rb ${d.risk}">${d.rl}</span>
        </div>
        <div class="ph-right">
          <span class="cbadge ${d.summaryBadge}">${cLabel}</span>
          <span class="link-action">Open →</span>
        </div>
      </div>
      <div class="sum-preview-body">
        <div class="stxt">${d.summaryDoc.substring(0,220)}…</div>
        <div class="finding-tags">
          ${d.findings.slice(0,3).map(f=>`<span class="finding-tag ${f.sev}">${f.txt.split('·')[0].trim()}</span>`).join('')}
        </div>
      </div>
    </div>`;
  }).join('');
}

// ── Labs list view ────────────────────────────────────────────────────────────
function renderLabsView(){
  const fv = {CRITICAL:'c', HIGH:'f', NORMAL:'n'};
  return Object.keys(patientData).map(id => {
    const d = patientData[id];
    const totalFlagged = d.labs.reduce((n,lab)=>n+lab.rows.filter(r=>r.flag!=='NORMAL').length, 0);
    const fc = totalFlagged > 2 ? 'danger' : totalFlagged > 0 ? 'warn' : 'ok';
    const labPanels = d.labs.map(lab => `
      <div class="lab-sub-panel">
        <div class="lab-sub-header">
          <div>
            <div class="lab-sub-name">${lab.name}</div>
            <div class="lab-sub-date">${lab.date}</div>
          </div>
          <span class="lsb ${lab.statusCls}">${lab.status}</span>
        </div>
        <div class="lrow lhd lrow-5"><span>Test</span><span>Value</span><span>Reference</span><span>Status</span><span></span></div>
        ${lab.rows.map(r=>`<div class="lrow lrow-5">
          <span>${r.test}</span>
          <span class="lv ${fv[r.flag]||'n'}">${r.val}</span>
          <span class="lr-ref">${r.ref}</span>
          <span class="lfb ${r.flag}">${r.flag}</span>
          <button class="vbtn vbtn-sm" onclick="openReportModal('${id}','${r.test.replace(/'/g,"\\'")}');event.stopPropagation()">View Report</button>
        </div>`).join('')}
      </div>`).join('');
    return `<div class="panel list-card-lg">
      <div class="ph">
        <div class="ph-left-sm">
          <div class="pav ${d.risk}">${d.init}</div>
          <div><div class="pn">${d.name}</div><div class="pc">${d.meta}</div></div>
          <span class="rb ${d.risk}">${d.rl}</span>
        </div>
        <div class="ph-right">
          <span class="flag-count ${fc}">${totalFlagged} flagged</span>
          <button class="vbtn" onclick="openPt('${id}','labs');event.stopPropagation()">Open →</button>
        </div>
      </div>
      ${labPanels}
    </div>`;
  }).join('');
}
