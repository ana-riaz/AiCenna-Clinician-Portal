// ── Live vitals simulation (mockup real-time feed) ────────────────────────────
const _simRules = [
  { patId:'ahmed',  key:'spo2', min:85, max:93,  crit:{val:90, dir:'below'}, unit:'%'   },
  { patId:'ahmed',  key:'hr',   min:96, max:110, crit:{val:100,dir:'above'}, unit:' bpm'},
  { patId:'fatima', key:'hr',   min:83, max:93,  crit:null,                  unit:' bpm'},
  { patId:'sara',   key:'hr',   min:65, max:72,  crit:null,                  unit:' bpm'},
];

function _simTick() {
  const rule = _simRules[Math.floor(Math.random() * _simRules.length)];
  const d    = patientData[rule.patId];
  const v    = d.vitals[rule.key];
  const meta = vitMeta.find(m => m.key === rule.key);

  const cur  = parseInt(v.val);
  const next = Math.max(rule.min, Math.min(rule.max,
    cur + (Math.random() > 0.45 ? 1 : -1) * Math.ceil(Math.random() * 2)));
  if (next === cur) return;

  const prevTc = v.tc;
  v.val = String(next);

  if (rule.crit) {
    v.tc = (rule.crit.dir === 'below' ? next < rule.crit.val : next > rule.crit.val) ? 'c' : 'e';
  }

  // New critical threshold crossing → push live alert
  if (rule.crit && prevTc !== 'c' && v.tc === 'c') {
    addAlert({
      patId: rule.patId, type:'vital', vital:rule.key, severity:'critical',
      title:`${d.name.split(' ')[0]} — ${meta.label} Alert`,
      body:`${meta.label} ${next}${rule.unit} · threshold crossed`,
      time: Date.now(), read:false, panel:true
    });
  }

  // Re-render vitals grid if this patient's overview is currently open
  if (currentPt === rule.patId) {
    const grid = document.getElementById('vgrid-' + rule.patId);
    if (grid) grid.innerHTML = renderVitalsGrid(rule.patId, currentVitalFilter);
  }

  // Update last-vital cell in dashboard table
  const dashVit = document.getElementById('dashvit-' + rule.patId);
  if (dashVit) {
    if (rule.key === 'spo2') {
      dashVit.innerHTML = `<span class="${next < 90 ? 'fl' : ''}">SpO2 ${next}%</span>`;
    } else if (rule.key === 'hr' && rule.patId !== 'ahmed') {
      dashVit.innerHTML = `HR ${next} bpm`;
    }
  }
}

setInterval(_simTick, 6000);
