// add comments to all functions in app.js to understand hat they use and do, and how they interact with each other. Also add comments to important lines of code within the functions to explain their purpose and functionality.
let currentPt = null;
let summaryVerified = false;
let _searchOrigin = null; // view to restore when search is cleared
let _ptBack = 'dash';     // where the ← Back button returns to

// ── Router ────────────────────────────────────────────────────────────────────

/**
 * Shows a specific view by ID
 * @param {string} id - The ID of the view to display
 */
function showView(id) {
  ['dashView','patientsView','summariesView','labsView','alertsView'].forEach(v =>
    document.getElementById(v).style.display='none'
  );
  document.getElementById('ptView').classList.remove('vis');
  document.getElementById('headerBack').style.display = 'none';
  document.getElementById('htitle').style.display = 'block';
  document.getElementById(id).style.display='flex';
  currentPt = null;
}

/**
 * Clears the search input and resets the patient search state. 
 * If a search was initiated from a specific view (like labs), 
 * it will restore that view when the search is cleared.
 */
function clearSearch() {
  const input = document.querySelector('.search input');
  if (input) input.value = '';
  setPtSearch('');
  _searchOrigin = null;
}

/**
 * Displays the dashboard view, sets the header title, marks the dashboard 
 * nav item as active, and refreshes the patient list on the dashboard.
 */
function showDash() {
  clearSearch();
  showView('dashView');
  document.getElementById('htitle').textContent='Dashboard';
  setNavActive('dash');
  refreshDashPatients();
}
/**
 * Navigates to the patients view, sets the header title, marks the patients
 */
function navPatients() {
  clearSearch();
  showView('patientsView');
  document.getElementById('htitle').textContent='My Patients';
  document.getElementById('patients-list').innerHTML=renderPatientsView();
  setNavActive('patients');
  closeQuickView();
}

/**
 * Navigates to the summaries view. If a patient is currently selected, 
 * it will switch to the summary tab for that patient.
 */
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

/**
 * Navigates to the labs view. If a patient is currently selected, 
 * it will switch to the labs tab for that patient. Otherwise, it will show the labs view with a list of lab reports.
 */
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

/**
 * Navigates to the alerts view. Clears the search, shows the alerts view, 
 * sets the header title, marks the alerts nav item as active, and renders the alerts view content.
 */
function navAlerts() {
  clearSearch();
  showView('alertsView');
  document.getElementById('htitle').textContent='Active Alerts';
  setNavActive('alerts');
  renderAlertsViewContent();
}

function ptBack() {
  document.getElementById('headerBack').style.display = 'none';
  document.getElementById('htitle').style.display = 'block';
  _ptBack === 'alerts' ? navAlerts() : showDash();
}

/**
 * Opens a patient view for a given patient ID, optionally specifying which tab to open 
 * and where the back button should return to.
 * 
 * @param {*} id 
 * @param {*} tab 
 * @param {*} backTo 
 */
function openPt(id, tab, backTo) {
  _ptBack = backTo || 'dash';
  currentPt = id;
  ['dashView','patientsView','summariesView','labsView','alertsView'].forEach(v =>
    document.getElementById(v).style.display='none'
  );
  document.getElementById('ptView').classList.add('vis');
  const d = patientData[id];
  document.getElementById('headerBack').style.display = 'flex';
  document.getElementById('htitle').style.display = 'none';
  const a = document.getElementById('ptAv');
  a.textContent = d.init;
  a.style.background = d.bg;
  a.style.color = d.rc;
  document.getElementById('ptMeta').textContent = d.name;
  const rb = document.getElementById('ptRisk');
  rb.textContent=d.rl; rb.className='rb '+d.risk;
  // const _sc = d.healthScore>=80?'ok':d.healthScore>=60?'warn':'danger';
  // const _fill = ((d.healthScore/100)*87.96).toFixed(2);
  // document.getElementById('ptScoreRing').innerHTML =
  //   `<svg viewBox="0 0 36 36" class="psring-svg"><circle cx="18" cy="18" r="14" class="psring-bg"/><circle cx="18" cy="18" r="14" class="psring-fill ${_sc}" stroke-dasharray="${_fill} 87.96"/></svg><span class="psring-num ${_sc}">${d.healthScore}</span>`;
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

/**
 * Switches the active tab to the specified tab name and element. 
 * If the digital twin tab is selected, it also renders the digital twin SVG for the current patient.
 * @param {*} name 
 * @param {*} el 
 */
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
