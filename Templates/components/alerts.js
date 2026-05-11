// ── Alert store ───────────────────────────────────────────────────────────────
let alertStore = [];
let _aIdN = 0;
function _mkAid() { return 'a' + (++_aIdN); }

// ── Build initial alerts from patient data ────────────────────────────────────
function _buildAlerts() {
  const out = [], now = Date.now();
  const vOrder = ['spo2','hr','bp','glucose','hrv','sleep','stress','rem','recovery'];

  Object.keys(patientData).forEach(patId => {
    const d = patientData[patId];
    let nc = 0, nw = 0;

    vOrder.forEach(key => {
      const v = d.vitals[key], meta = vitMeta.find(m => m.key === key);
      if (!v || !meta) return;
      if (v.tc === 'c' && nc < 2) {
        nc++;
        out.push({ id:_mkAid(), patId, type:'vital', vital:key, severity:'critical',
          title:`${d.name.split(' ')[0]} — ${meta.label}`,
          body:`${v.val}${v.unit||''} · ${v.trend.replace(/^[↑↓→]\s*/,'')}`,
          time: now - (2 + Math.floor(Math.random()*10))*60000, read:false, panel:true });
      } else if (v.tc === 'e' && nw < 1) {
        nw++;
        out.push({ id:_mkAid(), patId, type:'vital', vital:key, severity:'warning',
          title:`${d.name.split(' ')[0]} — ${meta.label} Elevated`,
          body:`${v.val}${v.unit||''}`,
          time: now - (20 + Math.floor(Math.random()*30))*60000, read:false, panel:true });
      }
    });

    // Lab alert — one per patient, highest severity flagged row
    let labDone = false;
    d.labs.forEach(lab => {
      if (labDone) return;
      const r = lab.rows.find(r => r.flag==='CRITICAL') || lab.rows.find(r => r.flag==='HIGH');
      if (r) {
        labDone = true;
        out.push({ id:_mkAid(), patId, type:'lab',
          severity: r.flag==='CRITICAL' ? 'critical' : 'warning',
          title:`${d.name.split(' ')[0]} — Lab ${r.flag}`,
          body:`${r.test} ${r.val} in ${lab.name}`,
          time: now - 18*60000, read:false, panel:true });
      }
    });

    // Summary alert — notification dropdown only
    out.push({ id:_mkAid(), patId, type:'summary', severity:'info',
      title:`Summary ready — ${d.name.split(' ')[0]} ${d.name.split(' ')[1][0]}.`,
      body:'Awaiting verification',
      time: now - (60 + Math.floor(Math.random()*60))*60000, read:false, panel:false });
  });

  const sv = {critical:0, warning:1, info:2};
  return out.sort((a,b) => sv[a.severity] - sv[b.severity] || b.time - a.time);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function _fmtTime(ts) {
  const m = Math.floor((Date.now()-ts)/60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m/60);
  return h < 24 ? h + 'h ago' : Math.floor(h/24) + 'd ago';
}

function _alIco(al) {
  // Using clean SVG icons instead of emojis for a professional look
  const icons = {
    summary: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    lab: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V3z"/><path d="M7 7h10l-1 13a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2L7 7z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>`,
    critical: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    warning: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
  };
  
  if (al.type==='summary')          return {ic: icons.summary, cls:'s'};
  if (al.type==='lab')              return {ic: icons.lab, cls:'l'};
  if (al.severity==='critical')     return {ic: icons.critical, cls:'a'};
  return {ic: icons.warning, cls:'w'};
}

// ── Render a single alert row ─────────────────────────────────────────────────
function _mkAlRow(al, inDrop) {
  const {ic, cls} = _alIco(al);
  const tab   = al.type==='lab' ? 'labs' : al.type==='summary' ? 'sum' : 'ov';
  const extra = inDrop ? 'toggleNotif();' : '';
  const severityLabel = al.severity === 'critical' ? 'Critical' : al.severity === 'warning' ? 'Warning' : 'Info';
  const checkIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  
  return `<div class="al ${al.severity}${al.read?'':' unr'}" id="alrow-${al.id}"
      onclick="openAlertPt('${al.patId}','${tab}','${al.id}');${extra}">
    <div class="al-indicator ${cls}"></div>
    <div class="ai ${cls}">${ic}</div>
    <div class="al-body">
      <div class="al-header">
        <span class="al-severity ${al.severity}">${severityLabel}</span>
        <span class="al-time">${_fmtTime(al.time)}</span>
      </div>
      <div class="abt">${al.title}</div>
      <div class="abd">${al.body}</div>
    </div>
    <div class="al-side">
      ${al.read ? '' : '<div class="ud"></div>'}
      <button class="al-rd-btn" onclick="markAlertRead('${al.id}');event.stopPropagation()" title="Mark read">${checkIcon}</button>
    </div>
  </div>`;
}

// ── Nav badge update ──────────────────────────────────────────────────────────
function _updateNavBadge() {
  const badge = document.getElementById('nav-al-badge');
  if (!badge) return;
  const n = alertStore.filter(a => !a.read && a.severity !== 'info').length;
  badge.textContent = n;
  badge.style.display = n ? '' : 'none';
}

// ── Refresh both UI surfaces ──────────────────────────────────────────────────
function _refreshAlerts() {
  const drop  = document.getElementById('ndrop-alerts');
  const panel = document.getElementById('alerts-panel');

  const notifs = alertStore.filter(a => !a.panel);
  if (drop) drop.innerHTML = notifs.length
    ? notifs.slice(0,8).map(a => _mkAlRow(a, true)).join('')
    : '<div class="al-empty">No new notifications</div>';

  if (panel) {
    const items = alertStore.filter(a => a.panel);
    panel.innerHTML = items.length
      ? items.map(a => _mkAlRow(a, false)).join('')
      : '<div class="al-empty">No active alerts</div>';
  }

  const unread = alertStore.filter(a => !a.read).length;
  const dot = document.querySelector('.ndot');
  if (dot) dot.classList.toggle('hidden', unread === 0);

  const sv = document.querySelector('.scard.c4 .sv');
  if (sv) sv.textContent = alertStore.filter(a => !a.read && a.panel).length;

  _updateNavBadge();
  renderAlertsViewContent();
}

// ── Public API ────────────────────────────────────────────────────────────────
function markAlertRead(id) {
  const a = alertStore.find(a => a.id === id);
  if (a) { a.read = true; _refreshAlerts(); }
}

function markAllRead() {
  alertStore.forEach(a => a.read = true);
  _refreshAlerts();
}

function clearAlerts() {
  alertStore = alertStore.filter(a => !a.panel);
  _refreshAlerts();
}

function addAlert(al) {
  al.id = _mkAid();
  alertStore.unshift(al);
  _refreshAlerts();
}

// ── Alerts full-page view ─────────────────────────────────────────────────────
let _avFilter  = 'all';
let _avGroupBy = 'severity';

function setAvFilter(f) {
  _avFilter = f;
  document.getElementById('av-filter-dd-menu')?.classList.remove('vis');
  renderAlertsViewContent();
}

function setAvGroupBy(g) {
  _avGroupBy = g;
  document.getElementById('av-group-dd-menu')?.classList.remove('vis');
  renderAlertsViewContent();
}

function toggleAvFilterDD() {
  document.getElementById('av-group-dd-menu')?.classList.remove('vis');
  document.getElementById('av-filter-dd-menu')?.classList.toggle('vis');
}

function toggleAvGroupDD() {
  document.getElementById('av-filter-dd-menu')?.classList.remove('vis');
  document.getElementById('av-group-dd-menu')?.classList.toggle('vis');
}

function renderAlertsView() {
  const critical    = alertStore.filter(a => a.severity === 'critical');
  const warning     = alertStore.filter(a => a.severity === 'warning');
  const unreadCount = alertStore.filter(a => a.panel && !a.read).length;
  const totalAlerts = alertStore.filter(a => a.panel).length;

  const filterOpts = [{k:'all',l:'All'},{k:'critical',l:'Critical'},{k:'warning',l:'Warning'},{k:'unread',l:'Unread'}];
  const groupOpts  = [{k:'severity',l:'Severity'},{k:'patient',l:'Patient'}];
  const filterLabel = filterOpts.find(f => f.k === _avFilter)?.l  || 'All';
  const groupLabel  = groupOpts.find(g  => g.k === _avGroupBy)?.l || 'Severity';

  // SVG icons for stats
  const criticalIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  const warningIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  const inboxIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`;
  const checkAllIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L7 17l-5-5"/><path d="m22 10-9.5 9.5L10 17"/></svg>`;
  const clearIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`;

  let html = `<div class="av-header">
    <div class="av-title-section">
      <h1 class="av-title">Alert Center</h1>
      <p class="av-subtitle">${totalAlerts} active alert${totalAlerts !== 1 ? 's' : ''} requiring attention</p>
    </div>
    <div class="av-actions">
      <button class="av-btn secondary" onclick="markAllRead();renderAlertsViewContent()">${checkAllIcon}<span>Mark all read</span></button>
      <button class="av-btn secondary" onclick="clearAlerts();renderAlertsViewContent()">${clearIcon}<span>Clear all</span></button>
    </div>
  </div>
  
  <div class="av-stats-grid">
    <div class="av-stat-card critical">
      <div class="av-stat-icon">${criticalIcon}</div>
      <div class="av-stat-content">
        <span class="av-stat-value">${critical.filter(a=>!a.read).length}</span>
        <span class="av-stat-label">Critical Alerts</span>
      </div>
      <div class="av-stat-bar"><div class="av-stat-fill" style="width:${totalAlerts ? (critical.filter(a=>!a.read).length / totalAlerts * 100) : 0}%"></div></div>
    </div>
    <div class="av-stat-card warning">
      <div class="av-stat-icon">${warningIcon}</div>
      <div class="av-stat-content">
        <span class="av-stat-value">${warning.filter(a=>!a.read).length}</span>
        <span class="av-stat-label">Warnings</span>
      </div>
      <div class="av-stat-bar"><div class="av-stat-fill" style="width:${totalAlerts ? (warning.filter(a=>!a.read).length / totalAlerts * 100) : 0}%"></div></div>
    </div>
    <div class="av-stat-card unread">
      <div class="av-stat-icon">${inboxIcon}</div>
      <div class="av-stat-content">
        <span class="av-stat-value">${unreadCount}</span>
        <span class="av-stat-label">Unread</span>
      </div>
      <div class="av-stat-bar"><div class="av-stat-fill" style="width:${totalAlerts ? (unreadCount / totalAlerts * 100) : 0}%"></div></div>
    </div>
  </div>
  
  <div class="av-toolbar">
    <div class="av-filter-group">
      <div class="dash-dd" id="av-filter-dd">
        <button class="dash-dd-btn" onclick="toggleAvFilterDD()">
          <span class="dd-pfx">Filter</span>
          <span>${filterLabel}</span>
          <span class="dash-dd-arrow">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </button>
        <div class="dash-dd-menu" id="av-filter-dd-menu">
          ${filterOpts.map(f=>`<div class="dash-dd-item${f.k===_avFilter?' act':''}" onclick="setAvFilter('${f.k}')">${f.l}</div>`).join('')}
        </div>
      </div>
      <div class="dash-dd" id="av-group-dd">
        <button class="dash-dd-btn" onclick="toggleAvGroupDD()">
          <span class="dd-pfx">Group by</span>
          <span>${groupLabel}</span>
          <span class="dash-dd-arrow">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </button>
        <div class="dash-dd-menu" id="av-group-dd-menu">
          ${groupOpts.map(g=>`<div class="dash-dd-item${g.k===_avGroupBy?' act':''}" onclick="setAvGroupBy('${g.k}')">${g.l}</div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;

  if (_avGroupBy === 'patient') {
    let items = alertStore.filter(a => a.panel && a.severity !== 'info');
    if (_avFilter === 'critical') items = items.filter(a => a.severity === 'critical');
    if (_avFilter === 'warning')  items = items.filter(a => a.severity === 'warning');
    if (_avFilter === 'unread')   items = items.filter(a => !a.read);

    const byPat = {};
    items.forEach(a => { if (!byPat[a.patId]) byPat[a.patId] = []; byPat[a.patId].push(a); });
    const patIds = Object.keys(byPat);
    if (!patIds.length) {
      html += '<div class="av-empty">No alerts match this filter</div>';
    } else {
      patIds.forEach(patId => {
        const d = patientData[patId];
        const pts = byPat[patId];
        html += `<div class="panel" style="margin-bottom:10px">${pts.map(a => _mkAlRow(a, false)).join('')}</div>`;
      });
    }
  } else {
    const groups = [
      {label:'Critical', items: critical},
      {label:'Warning',  items: warning}
    ];
    let hasContent = false;
    groups.forEach(g => {
      let items = g.items;
      if (_avFilter === 'critical' && g.label !== 'Critical') return;
      if (_avFilter === 'warning'  && g.label !== 'Warning')  return;
      if (_avFilter === 'unread')  items = items.filter(a => !a.read);
      if (!items.length) return;
      hasContent = true;
      html += `<div class="panel" style="margin-bottom:10px">${items.map(a => _mkAlRow(a, false)).join('')}</div>`;
    });
    if (!hasContent)
      html += '<div class="av-empty">No alerts match this filter</div>';
  }

  return html;
}

function renderAlertsViewContent() {
  const el = document.getElementById('alerts-view-body');
  if (el) el.innerHTML = renderAlertsView();
}

// ── Init ──────────────────────────────────────────────────────────────────────
alertStore = _buildAlerts();
_refreshAlerts();
