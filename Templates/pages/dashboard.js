// ── Patients view state ───────────────────────────────────────────────────────
let ptFilter = 'all';
let ptSort   = 'risk';
let ptQuery  = '';

const riskOrder = {cr:0, hi:1, me:2, st:3, lo:3};

function getFilteredSorted() {
  let ids = Object.keys(patientData);
  if (ptQuery) {
    const q = ptQuery.toLowerCase();
    ids = ids.filter(id => {
      const d = patientData[id];
      return d.name.toLowerCase().includes(q) ||
             d.rl.toLowerCase().includes(q) ||
             d.conditions.some(c => c.toLowerCase().includes(q));
    });
  }
  if (ptFilter !== 'all') {
    const rMap = {critical:'cr', high:'hi', medium:'me', low:'st'};
    const cls  = rMap[ptFilter];
    ids = ids.filter(id => patientData[id].risk === cls || (ptFilter==='low' && patientData[id].risk==='lo'));
  }
  ids.sort((a, b) => {
    const da = patientData[a], db = patientData[b];
    if (ptSort === 'risk') return (riskOrder[da.risk]??4) - (riskOrder[db.risk]??4);
    if (ptSort === 'name') return da.name.localeCompare(db.name);
    if (ptSort === 'age')  return da.age - db.age;
    return 0;
  });
  return ids;
}

function setPtFilter(f, btn) {
  ptFilter = f;
  document.querySelectorAll('.pt-filter-btn').forEach(b => b.classList.remove('act'));
  btn.classList.add('act');
  document.getElementById('pt-cards').innerHTML = renderPatientsCards();
}

function setPtSort(s, btn) {
  ptSort = s;
  document.querySelectorAll('.pt-sort-btn').forEach(b => b.classList.remove('act'));
  btn.classList.add('act');
  document.getElementById('pt-cards').innerHTML = renderPatientsCards();
}

function setPtSearch(q) {
  ptQuery = q;
  const el = document.getElementById('pt-cards');
  if (el) el.innerHTML = renderPatientsCards();
}

// ── Patient cards ─────────────────────────────────────────────────────────────
function renderPatientsCards() {
  const ids = getFilteredSorted();
  if (!ids.length) return `<div class="pt-empty">No patients match this filter.</div>`;
  const vc = {n:'ok', e:'warn', c:'danger'};
  return ids.map(id => {
    const d = patientData[id];
    const v = d.vitals;
    const sc  = d.healthScore   >= 80 ? 'ok' : d.healthScore   >= 60 ? 'warn' : 'danger';
    const bsc = d.baselineScore >= 70 ? 'ok' : d.baselineScore >= 50 ? 'warn' : 'danger';
    const vitCells = [
      {label:'Heart Rate',     val:v.hr.val,   unit:'bpm', c:vc[v.hr.tc]},
      {label:'SpO2',           val:v.spo2.val, unit:'%',   c:vc[v.spo2.tc]},
      {label:'Blood Pressure', val:v.bp.val,   unit:'',    c:vc[v.bp.tc]}
    ].map(x => `
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
          <button class="vbtn vbtn-qv" onclick="openQuickView('${id}');event.stopPropagation()" title="Quick preview">↗</button>
        </div>
      </div>
      <div class="pt-scores-row">
        <div class="pt-score-block">
          <span class="pt-score-lbl">Health Score</span>
          <span class="pt-score-val ${sc}">${d.healthScore}<span class="pt-score-unit">/100</span></span>
        </div>
        <div class="pt-score-sep"></div>
        <div class="pt-score-block">
          <span class="pt-score-lbl">Baseline Score <span class="pt-score-src">onboarding API</span></span>
          <span class="pt-score-val ${bsc}">${d.baselineScore}<span class="pt-score-unit">/100</span></span>
        </div>
      </div>
      <div class="vitals-strip">${vitCells}</div>
      <div class="tags-strip">
        ${d.conditions.map(c => `<span class="tg co">${c}</span>`).join('')}
        ${d.medications.map(m => `<span class="tg me">${m}</span>`).join('')}
      </div>
    </div>`;
  }).join('');
}

// ── Patients list view (controls + cards) ─────────────────────────────────────
function renderPatientsView() {
  const filters = ['all','critical','high','low'];
  const filterBtns = filters.map(f =>
    `<button class="pt-filter-btn${f===ptFilter?' act':''}" onclick="setPtFilter('${f}',this)">${f==='all'?'All':f[0].toUpperCase()+f.slice(1)}</button>`
  ).join('');
  const sorts = [{k:'risk',l:'Risk'},{k:'name',l:'Name'},{k:'age',l:'Age'}];
  const sortBtns = sorts.map(s =>
    `<button class="pt-sort-btn${s.k===ptSort?' act':''}" onclick="setPtSort('${s.k}',this)">${s.l}</button>`
  ).join('');
  return `<div class="pt-controls">
    <div class="pt-filter-bar">${filterBtns}</div>
    <div class="pt-sort-bar"><span class="pt-sort-lbl">Sort by</span>${sortBtns}</div>
  </div>
  <div id="pt-cards">${renderPatientsCards()}</div>`;
}

// ── Dashboard patient list ────────────────────────────────────────────────────
let dashFilter = 'all';
let dashSort   = 'risk';

function toggleDashFilterDD() {
  document.getElementById('dash-sort-menu').classList.remove('vis');
  document.getElementById('dash-dd-menu').classList.toggle('vis');
}

function toggleDashSortDD() {
  document.getElementById('dash-dd-menu').classList.remove('vis');
  document.getElementById('dash-sort-menu').classList.toggle('vis');
}

function setDashFilter(f, el) {
  dashFilter = f;
  document.querySelectorAll('#dash-dd-menu .dash-dd-item').forEach(i => i.classList.remove('act'));
  el.classList.add('act');
  document.getElementById('dash-dd-label').textContent = el.textContent;
  document.getElementById('dash-dd-menu').classList.remove('vis');
  refreshDashPatients();
}

function setDashSort(s, el) {
  dashSort = s;
  document.querySelectorAll('#dash-sort-menu .dash-dd-item').forEach(i => i.classList.remove('act'));
  el.classList.add('act');
  document.getElementById('dash-sort-label').textContent = el.textContent;
  document.getElementById('dash-sort-menu').classList.remove('vis');
  refreshDashPatients();
}

function _dashVitCell(id) {
  const v = patientData[id].vitals;
  if (v.spo2.tc==='c')    return `<span class="fl">SpO2 ${v.spo2.val}%</span>`;
  if (v.hr.tc==='c')      return `<span class="fl">HR ${v.hr.val} bpm</span>`;
  if (v.bp.tc==='c')      return `<span class="fl">BP ${v.bp.val}</span>`;
  if (v.glucose.tc==='c') return `<span class="fl">Glucose ${v.glucose.val}</span>`;
  if (v.spo2.tc==='e')    return `<span class="fl">SpO2 ${v.spo2.val}%</span>`;
  if (v.hr.tc==='e')      return `<span class="fl">HR ${v.hr.val} bpm</span>`;
  return `HR ${v.hr.val} · SpO2 ${v.spo2.val}%`;
}

function refreshDashPatients() {
  const el = document.getElementById('dash-pts-body');
  if (!el) return;
  const rMap = {critical:'cr', high:'hi', medium:'me', low:'st'};
  let ids = Object.keys(patientData);
  if (dashFilter !== 'all') {
    const cls = rMap[dashFilter];
    ids = ids.filter(id => patientData[id].risk===cls ||
      (dashFilter==='low' && (patientData[id].risk==='lo'||patientData[id].risk==='st')));
  }
  ids.sort((a, b) => {
    const da = patientData[a], db = patientData[b];
    if (dashSort === 'name') return da.name.localeCompare(db.name);
    if (dashSort === 'age')  return da.age - db.age;
    return (riskOrder[da.risk]??4) - (riskOrder[db.risk]??4);
  });
  el.innerHTML = ids.map(id => {
    const d = patientData[id];
    return `<div class="ptr" onclick="openPt('${id}')">
      <div class="pp"><div class="pav ${d.risk}">${d.init}</div>
        <div><div class="pn">${d.name}</div><div class="pc">${d.conditions.slice(0,2).join(' · ')}</div></div></div>
      <div><span class="rb ${d.risk}">${d.rl}</span></div>
      <div class="pvit" id="dashvit-${id}">${_dashVitCell(id)}</div>
      <button class="vbtn" onclick="openPt('${id}');event.stopPropagation()">View Twin</button>
    </div>`;
  }).join('');
}

// ── Summaries list view ───────────────────────────────────────────────────────
function renderSummariesView() {
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
          ${d.findings.slice(0,3).map(f => `<span class="finding-tag ${f.sev}">${f.txt.split('·')[0].trim()}</span>`).join('')}
        </div>
      </div>
    </div>`;
  }).join('');
}

// ── Labs list view ────────────────────────────────────────────────────────────
function renderLabsView() {
  const fv = {CRITICAL:'c', HIGH:'f', NORMAL:'n'};
  return Object.keys(patientData).map(id => {
    const d = patientData[id];
    const totalFlagged = d.labs.reduce((n, lab) => n + lab.rows.filter(r => r.flag !== 'NORMAL').length, 0);
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
        ${lab.rows.map(r => `<div class="lrow lrow-5">
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

// ── Quick view renderer ───────────────────────────────────────────────────────
function renderQuickView(ptId) {
  const d  = patientData[ptId];
  const vc = {n:'ok', e:'warn', c:'danger'};
  const sc  = d.healthScore   >= 80 ? 'ok' : d.healthScore   >= 60 ? 'warn' : 'danger';
  const bsc = d.baselineScore >= 70 ? 'ok' : d.baselineScore >= 50 ? 'warn' : 'danger';
  const topVitals = ['hr','spo2','bp'].map(k => {
    const v  = d.vitals[k];
    const vm = vitMeta.find(m => m.key === k);
    return `<div class="qv-vital">
      <div class="qv-vl">${vm.label}</div>
      <div class="qv-vv ${vc[v.tc]||'ok'}">${v.val}</div>
    </div>`;
  }).join('');
  return `
    <div class="qv-pt-head">
      <div class="pav lg ${d.risk}">${d.init}</div>
      <div class="qv-pt-info">
        <div class="qv-pt-name">${d.name}</div>
        <div class="qv-pt-meta">${d.meta}</div>
      </div>
      <span class="rb ${d.risk}">${d.rl}</span>
    </div>
    <div class="qv-scores">
      <div class="qv-score"><span class="qv-sn ${sc}">${d.healthScore}</span><span class="qv-sl">Health</span></div>
      <div class="qv-score-div"></div>
      <div class="qv-score"><span class="qv-sn ${bsc}">${d.baselineScore}</span><span class="qv-sl">Baseline</span></div>
    </div>
    <div class="qv-vitals">${topVitals}</div>
    <div class="qv-section-lbl">AI Summary</div>
    <div class="qv-excerpt">${d.summaryDoc.substring(0,200)}…</div>
    <div class="qv-section-lbl">Key Findings</div>
    <div class="qv-findings">
      ${d.findings.slice(0,3).map(f => `
        <div class="qv-finding">
          <div class="fdot ${f.sev}"></div>
          <div class="qv-ftxt">${f.txt}</div>
        </div>`).join('')}
    </div>
    <button class="btn btnp qv-open-btn" onclick="closeQuickView();openPt('${ptId}')">Open Full Profile →</button>`;
}
