// ── Vital filter state ────────────────────────────────────────────────────────
let currentVitalFilter = '7d';

// ── History slice helper ──────────────────────────────────────────────────────
function getFilterSlice(hist, filter) {
  if (filter === '24h') return hist.hourly;
  if (filter === '7d')  return hist.daily.slice(-7);
  if (filter === '15d') return hist.daily.slice(-15);
  return hist.daily; // 30d
}

// ── Trend text ────────────────────────────────────────────────────────────────
function computeTrend(values, meta, filter) {
  if (!values || values.length < 2) return '→ No data';
  const first = values[0], last = values[values.length - 1];
  const delta = last - first;
  if (Math.abs(delta / Math.max(Math.abs(first), 1)) * 100 < 2) return '→ Stable';
  const labels = {'24h':'24h','7d':'7d','15d':'15d','30d':'30d'};
  return `${delta > 0 ? '↑' : '↓'} ${delta > 0 ? '+' : ''}${Math.round(delta)} ${meta.unit} / ${labels[filter]}`;
}

// ── SVG sparkline ─────────────────────────────────────────────────────────────
function mkSparkline(values, meta, tc, sparkId) {
  if (!values || values.length < 2) return '';
  const W = 100, H = 36, pad = 3;
  const minV = Math.min(...values), maxV = Math.max(...values);
  const range = Math.max(maxV - minV, 1);
  const f = n => n.toFixed(1);

  const pts = values.map((v, i) => [
    (i / (values.length - 1)) * W,
    H - pad - ((v - minV) / range) * (H - pad * 2)
  ]);

  const clr = {n:'var(--success)', e:'var(--warning)', c:'var(--danger)'}[tc] || 'var(--muted)';
  const gid = 'sg' + sparkId;

  let linePath = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const cpx = f((pts[i-1][0] + pts[i][0]) / 2);
    linePath += ` C${cpx},${f(pts[i-1][1])} ${cpx},${f(pts[i][1])} ${f(pts[i][0])},${f(pts[i][1])}`;
  }
  const areaPath = linePath + ` L${W},${H} L0,${H} Z`;
  const [lx, ly] = pts[pts.length - 1];
  const midY = f(H / 2);

  return `<svg class="sparkline" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${clr}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${clr}" stop-opacity="0"/>
    </linearGradient></defs>
    <line x1="0" y1="${f(pad)}"    x2="${W}" y2="${f(pad)}"    stroke="rgba(255,255,255,0.07)" stroke-width="0.5" stroke-dasharray="2,3"/>
    <line x1="0" y1="${midY}"      x2="${W}" y2="${midY}"      stroke="rgba(255,255,255,0.05)" stroke-width="0.5" stroke-dasharray="2,3"/>
    <line x1="0" y1="${f(H-pad)}"  x2="${W}" y2="${f(H-pad)}"  stroke="rgba(255,255,255,0.07)" stroke-width="0.5" stroke-dasharray="2,3"/>
    <path d="${areaPath}" fill="url(#${gid})"/>
    <path d="${linePath}" fill="none" stroke="${clr}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${f(lx)}" cy="${f(ly)}" r="2.5" fill="${clr}"/>
  </svg>`;
}

// ── Vitals shown in overview (must be even count) ─────────────────────────────
const OV_VITALS = ['hr','spo2','bp','glucose','temp','sleep','steps','calories'];

// ── Vitals grid renderer ──────────────────────────────────────────────────────
function renderVitalsGrid(id, filter) {
  const d = patientData[id];
  const periodLabel = {'24h':'current','7d':'7d avg','15d':'15d avg','30d':'30d avg'}[filter];
  const xStart = {'24h':'24h ago','7d':'7d ago','15d':'15d ago','30d':'30d ago'}[filter];

  return vitMeta.filter(m => OV_VITALS.includes(m.key)).map(m => {
    const v = d.vitals[m.key];
    if (!v || !d.vitalHistory[m.key]) return `<div class="vc"><div class="vn">${m.label} <span class="vsrc">${m.src}</span></div><div class="vval-row"><span class="vval" style="color:var(--dim)">—</span></div><div class="vtrend n">No data available</div></div>`;
    const sparkValues = getFilterSlice(d.vitalHistory[m.key], filter);
    const trendText = computeTrend(sparkValues, m, filter);

    const isBP = m.key === 'bp';
    let displayVal = v.val;
    let displayUnit = v.unit || '';
    let label = isBP ? '' : periodLabel;

    if (filter !== '24h' && !isBP) {
      displayVal = Math.round(sparkValues.reduce((a, b) => a + b, 0) / sparkValues.length);
      displayUnit = m.unit;
    }

    const maxV = Math.max(...sparkValues);
    const minV = Math.min(...sparkValues);
    const midV = Math.round((maxV + minV) / 2);

    return `<div class="vc">
      <div class="vn">${m.label} <span class="vsrc">${m.src}</span></div>
      <div class="vval-row">
        <span class="vval">${displayVal}</span>${displayUnit ? `<span class="vunit">${displayUnit}</span>` : ''}
        ${label ? `<span class="vperiod">${label}</span>` : ''}
      </div>
      <div class="spark-wrap">
        <div class="spark-yscale">
          <span>${maxV}</span>
          <span>${midV}</span>
          <span>${minV}</span>
        </div>
        <div class="spark-inner">
          ${mkSparkline(sparkValues, m, v.tc, id + m.key)}
          <div class="spark-xscale">
            <span>${xStart}</span>
            <span>now</span>
          </div>
        </div>
      </div>
      <div class="vtrend ${v.tc}">${trendText}</div>
    </div>`;
  }).join('');
}

function setVitalFilter(ptId, filter, btn) {
  currentVitalFilter = filter;
  document.querySelectorAll('#vfbar-' + ptId + ' .vfbtn').forEach(b => b.classList.remove('act'));
  btn.classList.add('act');
  document.getElementById('vgrid-' + ptId).innerHTML = renderVitalsGrid(ptId, filter);
}
