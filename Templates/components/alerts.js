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
  if (al.type==='summary')          return {ic:'✦', cls:'s'};
  if (al.type==='lab')              return {ic:'🧪', cls:'l'};
  if (al.severity==='critical')     return {ic:'🚨', cls:'a'};
  return {ic:'⚠', cls:'w'};
}

// ── Render a single alert row ─────────────────────────────────────────────────
function _mkAlRow(al, inDrop) {
  const {ic, cls} = _alIco(al);
  const tab   = al.type==='lab' ? 'labs' : al.type==='summary' ? 'sum' : 'ov';
  const extra = inDrop ? 'toggleNotif();' : '';
  return `<div class="al${al.read?'':' unr'}" id="alrow-${al.id}"
      onclick="openAlertPt('${al.patId}','${tab}','${al.id}');${extra}">
    <div class="ai ${cls}">${ic}</div>
    <div class="al-body">
      <div class="abt">${al.title}</div>
      <div class="abd">${al.body}</div>
      <div class="abt2">${_fmtTime(al.time)}</div>
    </div>
    <div class="al-side">
      ${al.read ? '' : '<div class="ud"></div>'}
      <button class="al-rd-btn" onclick="markAlertRead('${al.id}');event.stopPropagation()" title="Mark read">✓</button>
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

  const filterOpts = [{k:'all',l:'All'},{k:'critical',l:'Critical'},{k:'warning',l:'Warning'},{k:'unread',l:'Unread'}];
  const groupOpts  = [{k:'severity',l:'Severity'},{k:'patient',l:'Patient'}];
  const filterLabel = filterOpts.find(f => f.k === _avFilter)?.l  || 'All';
  const groupLabel  = groupOpts.find(g  => g.k === _avGroupBy)?.l || 'Severity';

  let html = `<div class="av-bar">
    <div class="av-stats">
      <div class="av-stat"><span class="av-n danger">${critical.filter(a=>!a.read).length}</span><span class="av-l">Critical</span></div>
      <div class="av-stat"><span class="av-n warn">${warning.filter(a=>!a.read).length}</span><span class="av-l">Warning</span></div>
      <div class="av-stat"><span class="av-n">${unreadCount}</span><span class="av-l">Unread</span></div>
    </div>
    <div class="av-actions">
      <button class="vbtn" onclick="markAllRead();renderAlertsViewContent()">Mark all read</button>
      <button class="vbtn" onclick="clearAlerts();renderAlertsViewContent()">Clear alerts</button>
    </div>
  </div>
  <div class="av-ctrl-bar">
    <div class="dash-dd" id="av-filter-dd">
      <button class="dash-dd-btn" onclick="toggleAvFilterDD()">
        <span class="dd-pfx">Filter</span>
        <span>${filterLabel}</span>
        <span class="dash-dd-arrow">▾</span>
      </button>
      <div class="dash-dd-menu" id="av-filter-dd-menu">
        ${filterOpts.map(f=>`<div class="dash-dd-item${f.k===_avFilter?' act':''}" onclick="setAvFilter('${f.k}')">${f.l}</div>`).join('')}
      </div>
    </div>
    <div class="dash-dd" id="av-group-dd">
      <button class="dash-dd-btn" onclick="toggleAvGroupDD()">
        <span class="dd-pfx">Group</span>
        <span>${groupLabel}</span>
        <span class="dash-dd-arrow">▾</span>
      </button>
      <div class="dash-dd-menu" id="av-group-dd-menu">
        ${groupOpts.map(g=>`<div class="dash-dd-item${g.k===_avGroupBy?' act':''}" onclick="setAvGroupBy('${g.k}')">${g.l}</div>`).join('')}
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
