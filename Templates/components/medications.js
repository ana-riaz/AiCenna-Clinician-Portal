// ── Medications tab ───────────────────────────────────────────────────────────
function renderMedications(id) {
  const d = patientData[id];
  const md = d.medicationDetail;

  const overallAdherence = Math.round(
    md.active.reduce((s, m) => s + m.adherence, 0) / md.active.length
  );
  const ac = overallAdherence >= 80 ? 'ok' : overallAdherence >= 60 ? 'warn' : 'danger';
  const acLabel = overallAdherence >= 80 ? 'Good' : overallAdherence >= 60 ? 'Moderate' : 'Poor';

  function mkDots(dots) {
    return dots.map(v =>
      v === 2 ? `<span class="adh-dot na"></span>`
              : `<span class="adh-dot ${v ? 'taken' : 'missed'}"></span>`
    ).join('');
  }

  const activeCards = md.active.map(m => {
    const mc = m.adherence >= 80 ? 'ok' : m.adherence >= 60 ? 'warn' : 'danger';
    const missC = m.missedLast30 > 8 ? 'danger' : m.missedLast30 > 4 ? 'warn' : 'ok';
    return `<div class="med-card">
      <div class="med-head">
        <div>
          <div class="med-name">${m.name}</div>
          <span class="med-cls">${m.class}</span>
        </div>
        <span class="med-status-badge">Active</span>
      </div>
      <div class="med-meta">
        <div class="med-row"><span>Frequency</span><span>${m.frequency}</span></div>
        <div class="med-row"><span>Prescribed by</span><span>${m.prescribedBy}</span></div>
        <div class="med-row"><span>Since</span><span>${m.since}</span></div>
        ${m.notes ? `<div class="med-row"><span>Notes</span><span class="med-note">${m.notes}</span></div>` : ''}
      </div>
      <div class="adh-wrap">
        <div class="adh-toprow">
          <span class="adh-lbl">Adherence · last 30 days</span>
          <span class="adh-pct ${mc}">${m.adherence}%</span>
        </div>
        <div class="adh-track"><div class="adh-fill ${mc}" style="width:${m.adherence}%"></div></div>
        <div class="adh-dots">${mkDots(m.dots)}</div>
        <div class="adh-axis"><span>14d ago</span><span>today</span></div>
        <div class="adh-stats">
          <span class="adh-last">↻ ${m.lastTaken}</span>
          <span class="adh-miss ${missC}">${m.missedLast30} missed / 30d</span>
        </div>
      </div>
    </div>`;
  }).join('');

  const pastRows = md.past.length
    ? md.past.map(m => `
      <div class="med-past-row">
        <div>
          <div class="med-past-name">${m.name}</div>
          <div class="med-past-sub">${m.class} · ${m.from} – ${m.to}</div>
        </div>
        <div class="med-past-reason">${m.reason}</div>
      </div>`).join('')
    : `<div class="med-empty">No past medications on record</div>`;

  return `<div class="meds-layout">
    <div class="adh-banner">
      <div class="adh-banner-score ${ac}">${overallAdherence}%</div>
      <div>
        <div class="adh-banner-title">Overall Adherence · <span class="${ac}">${acLabel}</span></div>
        <div class="adh-banner-sub">Across ${md.active.length} active medication${md.active.length !== 1 ? 's' : ''} · Last 30 days</div>
      </div>
    </div>
    <div class="med-sec-label">Active Medications</div>
    <div class="med-grid">${activeCards}</div>
    <div class="med-sec-label">Medication History</div>
    <div class="med-past-card">${pastRows}</div>
  </div>`;
}
