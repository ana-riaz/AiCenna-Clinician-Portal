// ── Overview tab ──────────────────────────────────────────────────────────────
function renderOverview(id) {
  const d = patientData[id];
  const sc = d.healthScore>=80?'ok':d.healthScore>=60?'warn':'danger';
  const obRows = [
    {k:'Age / Sex',        v:`${d.age} · ${d.sex}`},
    {k:'Height / Weight',  v:`${d.height} · ${d.weight}`},
    {k:'Blood Type',       v:d.blood},
    {k:'Sleep Quality',    v:d.sleep,        cls:['Poor','Fair'].includes(d.sleep)?'warn':'ok'},
    {k:'Caffeine',         v:d.caffeine,     cls:d.caffeine==='Daily'?'warn':''},
    {k:'Alcohol',          v:d.alcohol,      cls:['Rarely','None','None known'].includes(d.alcohol)?'ok':'warn'},
    {k:'Nicotine',         v:d.nicotine,     cls:d.nicotine==='None'?'ok':(d.nicotine==='Occasional'?'':'warn')},
    {k:'Doctor Visits',    v:d.doctorVisits, cls:['Monthly','Compliant','As needed'].includes(d.doctorVisits)?'ok':'warn'},
    {k:'Hospitalizations', v:d.hospitalizations}
  ];
  if (d.gender === 'female') obRows.push({k:'Pregnant', v:'No', cls:'ok'});

  const filterBar = ['24h','7d','15d','30d'].map((f, i) =>
    `<button class="vfbtn${i===1?' act':''}" onclick="setVitalFilter('${id}','${f}',this)">${f}</button>`
  ).join('');

  return `<div class="ogrid">
    <div class="twin-card">
      <div class="twin-label">Digital Twin</div>
      <div class="twin-img-wrap" onclick="openTwinFullscreen('${id}')">${mkTwinSVG(id)}</div>
      <div class="score-row">
        <div class="score-block"><div class="scv ${sc}">${d.healthScore}</div><div class="scl">Health Score</div></div>
        <div class="score-block"><div class="scv ok">${d.dataWindow}</div><div class="scl">Data Window</div></div>
      </div>
      <div class="onboard-tags">
        ${obRows.map(r => `<div class="ob-row"><span class="ob-k">${r.k}</span><span class="ob-v${r.cls?' '+r.cls:''}">${r.v}</span></div>`).join('')}
      </div>
    </div>
    <div class="vright">
      <div class="vital-filter-bar" id="vfbar-${id}">${filterBar}</div>
      <div class="vgrid" id="vgrid-${id}">${renderVitalsGrid(id, '7d')}</div>
      <div class="irow">
        <div class="ic"><div class="ict">Active Conditions</div><div class="tags">${d.conditions.map(c => `<span class="tg co">${c}</span>`).join('')}</div></div>
        <div class="ic"><div class="ict">Current Medications</div><div class="tags">${d.medications.map(m => `<span class="tg me">${m}</span>`).join('')}</div></div>
        <div class="ic"><div class="ict">Allergies · Family Risk</div><div class="tags">${d.allergies.map(a => `<span class="tg al">${a}</span>`).join('')}${d.familyRisk.map(r => `<span class="tg fa">${r}</span>`).join('')}</div></div>
      </div>
    </div>
  </div>`;
}

// ── Summary tab ───────────────────────────────────────────────────────────────
function renderSummary(id) {
  const d = patientData[id];
  const cLabel = d.summaryBadge==='h'?'High confidence':'Medium confidence';
  return `<div class="slayout">
    <div>
      <div class="sum-card sum-card-top">
        <div class="sch">
          <div class="sct">AI Health Summary</div>
          <div class="smeta"><span class="cbadge ${d.summaryBadge}" id="sum-badge">${cLabel}</span><span class="mver">claude-sonnet-4-6</span></div>
        </div>
        <div class="sbody">
          <div class="stabs">
            <div class="stab act" onclick="swSType(this,'doc')">Doctor</div>
            <div class="stab" onclick="swSType(this,'pat')">Patient</div>
          </div>
          <div class="stxt" id="stxt-doc">${d.summaryDoc}</div>
          <div class="stxt hidden" id="stxt-pat">${d.summaryPat}</div>
          <div class="srcrow"><span class="srctg">vitals_${d.dataWindow}</span><span class="srctg">medical_history</span><span class="srctg">medications</span><span class="srctg">family_history</span><span class="srctg">lifestyle</span></div>
          <textarea class="nota" rows="3" placeholder="Add a verification note or clinical observation…"></textarea>
          <div class="sacts">
            <button class="btn btnp" id="verifyBtn" onclick="verifySummary()">✓ Verify</button>
            <button class="btn btnd" onclick="discardSummary()">✕ Discard</button>
            <button class="btn btng" id="editBtn" onclick="editSummary()">✎ Edit</button>
          </div>
        </div>
      </div>
      <div class="sum-card">
        <div class="sch"><div class="sct">AI Suggestions</div><div class="sug-hint">Unlocks after verification</div></div>
        <div class="sbody"><div class="locked">Verify the summary above to unlock AI suggestions for this patient</div></div>
      </div>
    </div>
    <div class="fcard">
      <div class="ph"><div class="pt">Key Findings</div></div>
      ${d.findings.map(f => `<div class="fi"><div class="fdot ${f.sev}"></div><div><div class="ftxt">${f.txt}</div><div class="fsrc">${f.src}</div></div></div>`).join('')}
    </div>
  </div>`;
}

function swSType(el, type) {
  document.querySelectorAll('.stab').forEach(t => t.classList.remove('act'));
  el.classList.add('act');
  document.getElementById('stxt-doc').classList.toggle('hidden', type !== 'doc');
  document.getElementById('stxt-pat').classList.toggle('hidden', type !== 'pat');
}

function renderSuggestionItem(text, isCustom, idx) {
  const cls = isCustom ? 'sug-item custom' : 'sug-item';
  const label = isCustom ? `<span class="sug-author">Dr. Ibrahim</span>` : '';
  return `<div class="${cls}" data-idx="${idx}">
    <span>${idx}. ${text}${label}</span>
    ${isCustom ? `<button class="sug-rm" onclick="removeCustomSuggestion(this)" title="Remove">✕</button>` : ''}
  </div>`;
}

function verifySummary() {
  if (summaryVerified) return;
  summaryVerified = true;
  const badge = document.querySelector('#sum-badge');
  badge.textContent = 'Verified'; badge.className = 'cbadge h';
  const btn = document.getElementById('verifyBtn');
  btn.textContent = '✓ Verified'; btn.disabled = true; btn.classList.add('btn-disabled');
  const locked = document.querySelector('.locked');
  locked.classList.remove('locked');
  const aiItems = aiSuggestions.map((s, i) => renderSuggestionItem(s, false, i+1)).join('');
  locked.innerHTML = `<div class="sug-body">
    <div class="sug-header">✦ AI SUGGESTIONS</div>
    <div id="suggestions-list" class="suggestions-list">${aiItems}</div>
    <div class="sug-add">
      <input id="sug-input" class="sug-input" type="text" placeholder="Add your own suggestion…"
        onkeydown="if(event.key==='Enter')addCustomSuggestion()"/>
      <button class="btn btnp btn-add" onclick="addCustomSuggestion()">+ Add</button>
    </div>
  </div>`;
}

function addCustomSuggestion() {
  const input = document.getElementById('sug-input');
  const text = input.value.trim();
  if (!text) return;
  const list = document.getElementById('suggestions-list');
  const idx = list.querySelectorAll('.sug-item').length + 1;
  list.insertAdjacentHTML('beforeend', renderSuggestionItem(text, true, idx));
  input.value = ''; input.focus();
  list.querySelectorAll('.sug-item').forEach((el, i) => {
    const span = el.querySelector('span');
    const author = span.querySelector('.sug-author');
    if (author) author.remove();
    span.childNodes[0].textContent = (i+1) + '. ' + span.childNodes[0].textContent.replace(/^\d+\.\s*/,'');
    if (el.classList.contains('custom'))
      span.insertAdjacentHTML('beforeend','<span class="sug-author">Dr. Ibrahim</span>');
  });
}

function removeCustomSuggestion(btn) {
  btn.closest('.sug-item').remove();
  const list = document.getElementById('suggestions-list');
  if (!list) return;
  list.querySelectorAll('.sug-item').forEach((el, i) => {
    const span = el.querySelector('span');
    const rawText = span.textContent.replace(/^\d+\.\s*/,'').replace(/Dr\. Ibrahim/g,'').trim();
    span.innerHTML = `${i+1}. ${rawText}`;
    if (el.classList.contains('custom'))
      span.insertAdjacentHTML('beforeend','<span class="sug-author">Dr. Ibrahim</span>');
  });
}

function discardSummary() {
  if (!confirm('Discard this AI summary?')) return;
  summaryVerified = false;
  document.getElementById('stxt-doc').textContent = 'Summary discarded.';
  document.getElementById('stxt-pat').textContent = 'Summary discarded.';
  const badge = document.querySelector('#sum-badge');
  badge.textContent = 'Discarded'; badge.className = 'cbadge discarded';
  const btn = document.getElementById('verifyBtn');
  btn.textContent = '✓ Verify'; btn.disabled = false; btn.classList.remove('btn-disabled');
}

function editSummary() {
  const isDoc = !document.getElementById('stxt-doc').classList.contains('hidden');
  const el = document.getElementById(isDoc ? 'stxt-doc' : 'stxt-pat');
  const btn = document.getElementById('editBtn');
  if (el.contentEditable === 'true') {
    el.contentEditable = 'false'; el.classList.remove('editing'); btn.textContent = '✎ Edit';
  } else {
    el.contentEditable = 'true'; el.focus(); el.classList.add('editing'); btn.textContent = '✓ Save';
  }
}

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

// ── History tab ───────────────────────────────────────────────────────────────
function renderHistory(id) {
  const d = patientData[id];
  let h = '<div class="hlayout">';
  h += `<div class="hcard"><div class="ph"><div class="pt">Medical History</div></div>${
    d.medHistory.map(r => `<div class="hrow"><div><div class="hrn">${r.name}</div><div class="hrd">${r.detail}</div></div>${mkTag(r.tag,r.tc)}</div>`).join('')
  }</div>`;
  if (d.famHistory.length)
    h += `<div class="hcard"><div class="ph"><div class="pt">Family History</div></div>${
      d.famHistory.map(r => `<div class="hrow"><div><div class="hrn">${r.name}</div><div class="hrd">${r.detail}</div></div>${mkTag(r.tag,r.tc)}</div>`).join('')
    }</div>`;
  h += `<div class="hcard"><div class="ph"><div class="pt">Lifestyle & Addictions</div></div>${
    d.lifestyle.map(r => `<div class="hrow"><div><div class="hrn">${r.name}</div><div class="hrd">${r.detail}</div></div>${mkTag(r.tag,r.tc)}</div>`).join('')
  }</div>`;
  if (d.femaleSpecific && d.femaleSpecific.length)
    h += `<div class="hcard"><div class="ph"><div class="pt">Female-Specific</div></div>${
      d.femaleSpecific.map(r => `<div class="hrow"><div><div class="hrn">${r.name}</div><div class="hrd">${r.detail}</div></div>${mkTag(r.tag,r.tc)}</div>`).join('')
    }</div>`;
  return h + '</div>';
}
