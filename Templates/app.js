// ── State ─────────────────────────────────────────────────────────────────────
let currentPt = null;
let summaryVerified = false;
let _searchOrigin = null; // view to restore when search is cleared
let _ptBack = 'dash';     // where the ← Back button returns to

// ── Router ────────────────────────────────────────────────────────────────────
function showView(id) {
  ['dashView','patientsView','summariesView','labsView','alertsView'].forEach(v =>
    document.getElementById(v).style.display='none'
  );
  document.getElementById('ptView').classList.remove('vis');
  document.getElementById(id).style.display='flex';
  currentPt = null;
}

function clearSearch() {
  const input = document.querySelector('.search input');
  if (input) input.value = '';
  setPtSearch('');
  _searchOrigin = null;
}

function showDash() {
  clearSearch();
  showView('dashView');
  document.getElementById('htitle').textContent='Dashboard';
  setNavActive('dash');
  refreshDashPatients();
}

function navPatients() {
  clearSearch();
  showView('patientsView');
  document.getElementById('htitle').textContent='My Patients';
  document.getElementById('patients-list').innerHTML=renderPatientsView();
  setNavActive('patients');
  closeQuickView();
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
  clearSearch();
  setNavActive('labs');
  if (currentPt) {
    swTab('labs', document.querySelector('.tab[data-tab="labs"]'));
  } else {
    showView('labsView');
    document.getElementById('htitle').textContent='Lab Reports';
    document.getElementById('labs-list').innerHTML=renderLabsView();
  }
}

function navAlerts() {
  clearSearch();
  showView('alertsView');
  document.getElementById('htitle').textContent='Active Alerts';
  setNavActive('alerts');
  renderAlertsViewContent();
}

function ptBack() {
  _ptBack === 'alerts' ? navAlerts() : showDash();
}

function openPt(id, tab, backTo) {
  _ptBack = backTo || 'dash';
  currentPt = id;
  ['dashView','patientsView','summariesView','labsView','alertsView'].forEach(v =>
    document.getElementById(v).style.display='none'
  );
  document.getElementById('ptView').classList.add('vis');
  const d = patientData[id];
  const a = document.getElementById('ptAv');
  a.textContent=d.init; a.style.background=d.bg; a.style.color=d.rc;
  document.getElementById('ptMeta').textContent=`${d.age} yrs · ${d.sex} · ${d.height} · ${d.weight} · ${d.blood}`;
  const rb = document.getElementById('ptRisk');
  rb.textContent=d.rl; rb.className='rb '+d.risk;
  const _sc = d.healthScore>=80?'ok':d.healthScore>=60?'warn':'danger';
  const _fill = ((d.healthScore/100)*87.96).toFixed(2);
  document.getElementById('ptScoreRing').innerHTML =
    `<svg viewBox="0 0 36 36" class="psring-svg"><circle cx="18" cy="18" r="14" class="psring-bg"/><circle cx="18" cy="18" r="14" class="psring-fill ${_sc}" stroke-dasharray="${_fill} 87.96"/></svg><span class="psring-num ${_sc}">${d.healthScore}</span>`;
  document.getElementById('htitle').textContent=d.name;
  document.getElementById('ov-content').innerHTML   = renderOverview(id);
  document.getElementById('labs-content').innerHTML = renderLabs(id);
  document.getElementById('hist-content').innerHTML = renderHistory(id);
  document.getElementById('meds-content').innerHTML = renderMedications(id);
  summaryVerified = false;
  currentVitalFilter = '7d';
  const t = (tab === 'sum' ? 'ov' : tab) || 'ov';
  swTab(t, document.querySelector('.tab[data-tab="'+t+'"]'));
  setNavActive(null);
}

function swTab(name, el) {
  document.querySelectorAll('.tp').forEach(p=>p.classList.remove('act'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('act'));
  document.getElementById('t-'+name).classList.add('act');
  if (el) el.classList.add('act');
  if (name === 'twin' && currentPt) {
    document.getElementById('twin-content').innerHTML = `<div class="twin-tab-view">${mkTwinSVG(currentPt)}</div>`;
  }
}

function setNavActive(key) {
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const map = {dash:0, alerts:1, labs:2};
  if (key !== null && map[key] !== undefined)
    document.querySelectorAll('.nav-item')[map[key]].classList.add('active');
}

// ── Notifications ─────────────────────────────────────────────────────────────
function toggleNotif() {
  document.getElementById('ndrop').classList.toggle('vis');
}

function openAlertPt(patId, tab, alertId) {
  markAlertRead(alertId);
  openPt(patId, tab, 'alerts');
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('.icon-btn') && !e.target.closest('.ndrop'))
    document.getElementById('ndrop').classList.remove('vis');
  if (!e.target.closest('.qv-panel') && !e.target.closest('.vbtn-qv'))
    closeQuickView();
  if (!e.target.closest('.dash-dd')) {
    document.getElementById('dash-dd-menu')?.classList.remove('vis');
    document.getElementById('dash-sort-menu')?.classList.remove('vis');
    document.getElementById('av-filter-dd-menu')?.classList.remove('vis');
    document.getElementById('av-group-dd-menu')?.classList.remove('vis');
  }
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

// ── Search ────────────────────────────────────────────────────────────────────
function onSearch(q) {
  setPtSearch(q);

  if (!q.trim()) {
    // Restore origin view when search is cleared
    if (_searchOrigin !== null) {
      const origin = _searchOrigin;
      _searchOrigin = null;
      if (origin === 'labs') { navLabs(); return; }
      showDash();
    }
    return;
  }

  const patientsVisible = document.getElementById('patientsView').style.display !== 'none';
  if (!patientsVisible) {
    // Record where to return before forcing navigation
    if (_searchOrigin === null) {
      _searchOrigin = document.getElementById('labsView').style.display !== 'none' ? 'labs' : 'dash';
    }
    showView('patientsView');
    document.getElementById('htitle').textContent = 'My Digital Twins';
    document.getElementById('patients-list').innerHTML = renderPatientsView();
    setNavActive('patients');
    closeQuickView();
  }
}

// ── Quick view ────────────────────────────────────────────────────────────────
function openQuickView(ptId) {
  document.getElementById('qv-body').innerHTML = renderQuickView(ptId);
  document.getElementById('qvPanel').classList.add('vis');
}

function closeQuickView() {
  document.getElementById('qvPanel').classList.remove('vis');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeTwinOverlay(); closeQuickView(); }
});

// ── Sidebar collapse ──────────────────────────────────────────────────────────
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const collapsed = sb.classList.toggle('collapsed');
  document.querySelector('.sidebar-toggle').textContent = collapsed ? '▶' : '◀';
}

// ── Init ──────────────────────────────────────────────────────────────────────
showDash();
