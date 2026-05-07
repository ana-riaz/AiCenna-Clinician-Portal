// ── State ─────────────────────────────────────────────────────────────────────
let currentPt = null;
let summaryVerified = false;

// ── Router ────────────────────────────────────────────────────────────────────
function showView(id) {
  ['dashView','patientsView','summariesView','labsView'].forEach(v =>
    document.getElementById(v).style.display='none'
  );
  document.getElementById('ptView').classList.remove('vis');
  document.getElementById(id).style.display='flex';
  currentPt = null;
}

function showDash() {
  showView('dashView');
  document.getElementById('htitle').textContent='Dashboard';
  setNavActive('dash');
}

function navPatients() {
  showView('patientsView');
  document.getElementById('htitle').textContent='My Patients';
  document.getElementById('patients-list').innerHTML=renderPatientsView();
  setNavActive('patients');
}

function navSummaries() {
  setNavActive('summaries');
  if (currentPt) {
    swTab('sum', document.querySelector('.tab[data-tab="sum"]'));
  } else {
    showView('summariesView');
    document.getElementById('htitle').textContent='AI Summaries';
    document.getElementById('summaries-list').innerHTML=renderSummariesView();
  }
}

function navLabs() {
  setNavActive('labs');
  if (currentPt) {
    swTab('labs', document.querySelector('.tab[data-tab="labs"]'));
  } else {
    showView('labsView');
    document.getElementById('htitle').textContent='Lab Reports';
    document.getElementById('labs-list').innerHTML=renderLabsView();
  }
}

function openPt(id, tab) {
  currentPt = id;
  ['dashView','patientsView','summariesView','labsView'].forEach(v =>
    document.getElementById(v).style.display='none'
  );
  document.getElementById('ptView').classList.add('vis');
  const d = patientData[id];
  const a = document.getElementById('ptAv');
  a.textContent=d.init; a.style.background=d.bg; a.style.color=d.rc;
  document.getElementById('ptName').textContent=d.name;
  document.getElementById('ptMeta').textContent=d.meta;
  const rb = document.getElementById('ptRisk');
  rb.textContent=d.rl; rb.className='rb '+d.risk;
  document.getElementById('htitle').textContent=d.name;
  document.getElementById('ov-content').innerHTML   = renderOverview(id);
  document.getElementById('sum-content').innerHTML  = renderSummary(id);
  document.getElementById('labs-content').innerHTML = renderLabs(id);
  document.getElementById('hist-content').innerHTML = renderHistory(id);
  document.getElementById('meds-content').innerHTML = renderMedications(id);
  summaryVerified = false;
  currentVitalFilter = '7d';
  const t = tab||'ov';
  swTab(t, document.querySelector('.tab[data-tab="'+t+'"]'));
  setNavActive(null);
}

function swTab(name, el) {
  document.querySelectorAll('.tp').forEach(p=>p.classList.remove('act'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('act'));
  document.getElementById('t-'+name).classList.add('act');
  if (el) el.classList.add('act');
}

function setNavActive(key) {
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const map = {dash:0, patients:1, labs:2};
  if (key !== null && map[key] !== undefined)
    document.querySelectorAll('.nav-item')[map[key]].classList.add('active');
}

// ── Notifications ─────────────────────────────────────────────────────────────
function toggleNotif() {
  document.getElementById('ndrop').classList.toggle('vis');
}

function markAllRead() {
  document.querySelectorAll('#ndrop .al').forEach(a => {
    a.classList.remove('unr');
    const dot = a.querySelector('.ud'); if (dot) dot.remove();
  });
  document.querySelector('.ndot').classList.add('hidden');
}

function clearAlerts() {
  const panels = document.querySelectorAll('.panel');
  panels[1].querySelectorAll('.al').forEach(a => a.remove());
  const c = document.querySelector('.scard.c4 .sv'); if (c) c.textContent='0';
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('.icon-btn') && !e.target.closest('.ndrop'))
    document.getElementById('ndrop').classList.remove('vis');
});

// ── Digital twin overlay ──────────────────────────────────────────────────────
function openTwinFullscreen(ptId) {
  const d = patientData[ptId];
  document.getElementById('twinOvTitle').textContent = d.name + ' · Digital Twin';
  document.getElementById('twinOvBody').innerHTML = mkTwinSVG(ptId);
  document.getElementById('twinOverlay').classList.add('vis');
}

function closeTwinOverlay() {
  document.getElementById('twinOverlay').classList.remove('vis');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeTwinOverlay();
});

// ── Init ──────────────────────────────────────────────────────────────────────
setNavActive('dash');
