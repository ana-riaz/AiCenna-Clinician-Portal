// ── State ─────────────────────────────────────────────────────────────────────
let currentPt = null;
let summaryVerified = false;

// ── Router ────────────────────────────────────────────────────────────────────
function showView(id){
  ['dashView','patientsView','summariesView','labsView'].forEach(v =>
    document.getElementById(v).style.display='none'
  );
  document.getElementById('ptView').classList.remove('vis');
  document.getElementById(id).style.display='flex';
  currentPt = null;
}

function showDash(){
  showView('dashView');
  document.getElementById('htitle').textContent='Dashboard';
  setNavActive('dash');
}

function navPatients(){
  showView('patientsView');
  document.getElementById('htitle').textContent='My Patients';
  document.getElementById('patients-list').innerHTML=renderPatientsView();
  setNavActive('patients');
}

function navSummaries(){
  setNavActive('summaries');
  if(currentPt){
    swTab('sum', document.querySelector('.tab[data-tab="sum"]'));
  } else {
    showView('summariesView');
    document.getElementById('htitle').textContent='AI Summaries';
    document.getElementById('summaries-list').innerHTML=renderSummariesView();
  }
}

function navLabs(){
  setNavActive('labs');
  if(currentPt){
    swTab('labs', document.querySelector('.tab[data-tab="labs"]'));
  } else {
    showView('labsView');
    document.getElementById('htitle').textContent='Lab Reports';
    document.getElementById('labs-list').innerHTML=renderLabsView();
  }
}

function openPt(id, tab){
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
  summaryVerified = false;
  const t = tab||'ov';
  swTab(t, document.querySelector('.tab[data-tab="'+t+'"]'));
  setNavActive(null);
}

function swTab(name, el){
  document.querySelectorAll('.tp').forEach(p=>p.classList.remove('act'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('act'));
  document.getElementById('t-'+name).classList.add('act');
  if(el) el.classList.add('act');
}

function setNavActive(key){
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const map={dash:0,patients:1,labs:2};
  if(key!==null && map[key]!==undefined)
    document.querySelectorAll('.nav-item')[map[key]].classList.add('active');
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function flagClass(flag){
  return flag==='CRITICAL'?'danger':flag==='HIGH'?'warn':'ok';
}

function openReportModal(ptId, testName){
  const d = patientData[ptId];
  let row, labName;
  for(const lab of d.labs){
    const found = lab.rows.find(r=>r.test===testName);
    if(found){ row=found; labName=lab.name; break; }
  }
  if(!row) return;
  const fc = flagClass(row.flag);
  document.getElementById('modal-content').innerHTML=`
    <div class="modal-patient-header">
      <div class="modal-pt-av pav ${d.risk}">${d.init}</div>
      <div><div class="modal-pt-name">${d.name}</div><div class="modal-pt-lab">${labName}</div></div>
    </div>
    <div class="modal-body">
      <div class="modal-test-name">${testName}</div>
      <div class="modal-results-grid">
        <div><div class="modal-result-label">RESULT</div><div class="modal-result-val ${fc}">${row.val}</div></div>
        <div><div class="modal-result-label">REFERENCE RANGE</div><div class="modal-ref">${row.ref}</div></div>
      </div>
      <span class="modal-flag ${row.flag}">${row.flag}</span>
    </div>
    <div class="modal-actions">
      <button class="btn btng full" onclick="closeModal()">Close</button>
    </div>`;
  document.getElementById('reportModal').classList.add('vis');
}

function closeModal(){
  document.getElementById('reportModal').classList.remove('vis');
}

// ── Notifications ─────────────────────────────────────────────────────────────
function toggleNotif(){
  document.getElementById('ndrop').classList.toggle('vis');
}

function markAllRead(){
  document.querySelectorAll('#ndrop .al').forEach(a=>{
    a.classList.remove('unr');
    const dot=a.querySelector('.ud'); if(dot) dot.remove();
  });
  document.querySelector('.ndot').classList.add('hidden');
}

function clearAlerts(){
  const panels=document.querySelectorAll('.panel');
  panels[1].querySelectorAll('.al').forEach(a=>a.remove());
  const c=document.querySelector('.scard.c4 .sv'); if(c) c.textContent='0';
}

document.addEventListener('click',function(e){
  if(!e.target.closest('.icon-btn')&&!e.target.closest('.ndrop'))
    document.getElementById('ndrop').classList.remove('vis');
});

// ── Init ──────────────────────────────────────────────────────────────────────
setNavActive('dash');
