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
