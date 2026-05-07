// ── Patient records ───────────────────────────────────────────────────────────
const patientData = {
  ahmed: {
    init:'AK', name:'Ahmed Khan', meta:'55 yrs · Male · A+ · Hypertension · Diabetes',
    risk:'cr', rl:'Critical', rc:'var(--danger)', bg:'rgba(251,113,133,0.2)',
    gender:'male', age:55, sex:'Male', blood:'A+',
    height:'172cm', weight:'89kg', healthScore:58, dataWindow:'7d',
    sleep:'Poor', caffeine:'Daily', alcohol:'Weekly', nicotine:'10/day',
    doctorVisits:'Monthly', hospitalizations:'2 · Surgeries 1',
    vitals:{
      hr:      {val:'102', unit:'bpm',   trend:'↑ +28% above baseline',    tc:'c', bars:[40,45,50,55,65,80,100]},
      spo2:    {val:'88',  unit:'%',     trend:'↓ Critical — below 90%',   tc:'c', bars:[97,96,94,93,91,90,88]},
      bp:      {val:'158/95',            trend:'↑ Stage 2 Hypertension',   tc:'c', bars:[55,60,65,70,78,87,95]},
      sleep:   {val:'42',  unit:'/100',  trend:'↓ Very poor recovery',     tc:'c', bars:[75,70,65,58,52,46,42]},
      glucose: {val:'218', unit:'mg/dL', trend:'↑ Severely elevated',      tc:'c', bars:[65,70,75,80,86,92,100]},
      stress:  {val:'82',  unit:'/100',  trend:'↑ Critically high',        tc:'c', bars:[50,55,60,65,70,75,82]},
      hrv:     {val:'19',  unit:'ms',    trend:'↓ Severely low autonomic', tc:'c', bars:[55,48,42,36,30,24,19]},
      rem:     {val:'32',  unit:'min',   trend:'↓ Very low REM sleep',     tc:'c', bars:[72,68,62,55,48,40,32]},
      recovery:{val:'28',  unit:'/100',  trend:'↓ Critical recovery',      tc:'c', bars:[70,63,55,48,42,35,28]}
    },
    conditions:['Hypertension','Type 2 Diabetes'],
    medications:['Metformin 500mg','Lisinopril 10mg','Aspirin 81mg'],
    allergies:['Penicillin'],
    familyRisk:['Heart Disease ↗','Diabetes ↗'],
    summaryDoc:'A 55-year-old male with Type 2 Diabetes and Hypertension presents with critical SpO2 at 88%, 14% below the clinical threshold. Resting heart rate at 102 bpm (+28% above baseline), blood pressure at 158/95 mmHg (Stage 2 Hypertension), and blood glucose severely elevated at 218 mg/dL indicate poor multi-system control. HRV RMSSD critically low at 19ms. Sleep and recovery scores indicate exhaustion. Immediate cardiorespiratory review and medication adjustment recommended.',
    summaryPat:'Your oxygen levels are dangerously low and your heart is working much harder than it should. Your blood pressure and blood sugar are both very high. You need to see your doctor urgently — these are signs that your body is under serious stress and requires immediate attention.',
    summaryConf:'High', summaryBadge:'h',
    findings:[
      {sev:'h', txt:'SpO2 88% — critical, below 90% threshold',      src:'vitals · watch'},
      {sev:'h', txt:'BP 158/95 — Stage 2 Hypertension',               src:'vitals · manual'},
      {sev:'h', txt:'Blood Glucose 218 mg/dL — severely elevated',    src:'vitals · glucometer'},
      {sev:'h', txt:'HR 102 bpm — +28% above baseline',               src:'vitals · watch'},
      {sev:'m', txt:'HRV RMSSD 19ms — critically low autonomic tone', src:'vitals · watch'},
      {sev:'l', txt:'Sleep 42/100 — compounding recovery deficit',    src:'vitals · watch'}
    ],
    labs:[{
      name:'HbA1c & Metabolic Panel', date:'April 20, 2026 · IDC · Dr. Sarah Johnson',
      status:'3 Flagged', statusCls:'f',
      rows:[
        {test:'HbA1c',           val:'8.2%',       ref:'< 5.7%',     flag:'CRITICAL'},
        {test:'Fasting Glucose', val:'198 mg/dL',  ref:'70–99',      flag:'CRITICAL'},
        {test:'Creatinine',      val:'1.4 mg/dL',  ref:'0.7–1.2',    flag:'HIGH'},
        {test:'LDL Cholesterol', val:'142 mg/dL',  ref:'< 100',      flag:'HIGH'},
        {test:'Hemoglobin',      val:'13.8 g/dL',  ref:'13.5–17.5',  flag:'NORMAL'}
      ]
    }],
    medHistory:[
      {name:'Type 2 Diabetes', detail:'Active · on Metformin 500mg',      tag:'Active', tc:'co'},
      {name:'Hypertension',    detail:'Active · on Lisinopril 10mg',       tag:'Active', tc:'co'},
      {name:'Hospitalization', detail:'2 prior · 1 surgery (CABG 2019)',   tag:'Past',   tc:'me'}
    ],
    famHistory:[
      {name:'Heart Disease', detail:'Father — significantly elevated personal risk', tag:'Risk ↗', tc:'fa'},
      {name:'Diabetes',      detail:'Both parents — high genetic predisposition',    tag:'Risk ↗', tc:'fa'}
    ],
    lifestyle:[
      {name:'Nicotine',      detail:'10 cigarettes/day — major cardiovascular risk',   tag:'High Risk', tc:'co'},
      {name:'Caffeine',      detail:'Daily — may affect blood pressure and sleep',      tag:'Monitor',   tc:'al'},
      {name:'Alcohol',       detail:'Weekly — monitor given diabetes and hypertension', tag:'Monitor',   tc:'al'},
      {name:'Doctor Visits', detail:'Monthly — adequate given critical status',         tag:'Compliant', tc:'me'}
    ],
    femaleSpecific: null
  },

  fatima: {
    init:'FR', name:'Fatima Rehman', meta:'38 yrs · Female · B+ · Prediabetes · Neuropathy',
    risk:'hi', rl:'High', rc:'var(--warning)', bg:'rgba(251,191,36,0.2)',
    gender:'female', age:38, sex:'Female', blood:'B+',
    height:'165cm', weight:'68kg', healthScore:72, dataWindow:'14d',
    sleep:'Fair', caffeine:'Daily', alcohol:'Rarely', nicotine:'None',
    doctorVisits:'Yearly', hospitalizations:'1 · Surgeries 0',
    vitals:{
      hr:      {val:'88',  unit:'bpm',   trend:'↑ +14% above baseline',  tc:'e', bars:[60,65,68,72,75,80,88]},
      spo2:    {val:'96',  unit:'%',     trend:'→ Within normal range',   tc:'n', bars:[95,100,98,96,95,97,96]},
      bp:      {val:'138/85',            trend:'↑ Mildly elevated',       tc:'e', bars:[50,55,60,65,70,75,85]},
      sleep:   {val:'58',  unit:'/100',  trend:'↓ −23% below baseline',  tc:'c', bars:[90,85,78,70,65,62,58]},
      glucose: {val:'142', unit:'mg/dL', trend:'↑ Post-meal elevated',   tc:'e', bars:[60,65,70,75,80,85,90]},
      stress:  {val:'68',  unit:'/100',  trend:'↑ Elevated',              tc:'e', bars:[40,45,50,55,60,65,68]},
      hrv:     {val:'28',  unit:'ms',    trend:'↓ Low autonomic tone',    tc:'c', bars:[70,65,60,55,48,40,35]},
      rem:     {val:'48',  unit:'min',   trend:'↓ Below optimal',         tc:'e', bars:[80,75,70,65,58,52,48]},
      recovery:{val:'44',  unit:'/100',  trend:'↓ Poor recovery',        tc:'c', bars:[75,70,65,58,52,47,44]}
    },
    conditions:['Hypertension','Insulin Resistance'],
    medications:['Lisinopril 10mg'],
    allergies:['Pollen'],
    familyRisk:['Diabetes ↗','Hypertension ↗'],
    summaryDoc:'A 38-year-old female with hypertension on Lisinopril presents with elevated resting heart rate at +14% above personal baseline, mildly raised blood pressure at 138/85 mmHg, and declining sleep quality at −23% over 11 days with REM reduced to 48 minutes. HRV RMSSD at 28ms indicates impaired autonomic regulation. Recovery score at 44/100 and elevated stress score suggest cumulative physiological load. Family history of diabetes and hypertension increases long-term cardiometabolic risk.',
    summaryPat:'Your blood pressure is slightly above target and your heart has been working harder than usual over the past two weeks. Your sleep has been less restful than normal, with less deep sleep recorded. Your body is showing signs of needing more recovery time. These are early signals worth discussing with your doctor.',
    summaryConf:'Medium', summaryBadge:'m',
    findings:[
      {sev:'h', txt:'Sleep −23% since 11 days · REM only 48 min', src:'vitals · watch'},
      {sev:'h', txt:'HRV RMSSD 28ms — poor autonomic tone',        src:'vitals · watch'},
      {sev:'m', txt:'HR resting +14% above 14-day baseline',       src:'vitals · watch'},
      {sev:'m', txt:'BP 138/85 — above Lisinopril target',         src:'vitals · manual'},
      {sev:'m', txt:'Recovery score 44/100 — cumulative load',     src:'vitals · watch'},
      {sev:'l', txt:'Family history: diabetes + hypertension',     src:'onboarding'}
    ],
    labs:[{
      name:'Complete Blood Count — CBC Panel', date:'April 15, 2026 · IDC · Dr. Sarah Johnson',
      status:'2 Flagged', statusCls:'f',
      rows:[
        {test:'HbA1c',           val:'6.4%',        ref:'< 5.7%',    flag:'HIGH'},
        {test:'Fasting Insulin', val:'18.2 µIU/mL', ref:'2.6–24.9',  flag:'NORMAL'},
        {test:'hs-CRP',          val:'4.1 mg/L',    ref:'< 3.0',     flag:'HIGH'},
        {test:'Vitamin B12',     val:'198 pg/mL',   ref:'200–900',   flag:'NORMAL'},
        {test:'Hemoglobin',      val:'13.1 g/dL',   ref:'12.0–16.0', flag:'NORMAL'}
      ]
    }],
    medHistory:[
      {name:'Hypertension',    detail:'Active · on Lisinopril 10mg', tag:'Active',   tc:'co'},
      {name:'Hospitalization', detail:'1 prior · no surgeries',       tag:'Resolved', tc:'me'}
    ],
    famHistory:[
      {name:'Diabetes',     detail:'First-degree relative — elevated personal risk', tag:'Risk ↗', tc:'fa'},
      {name:'Hypertension', detail:'First-degree relative — monitor closely',        tag:'Risk ↗', tc:'fa'}
    ],
    lifestyle:[
      {name:'Caffeine',      detail:'Daily — may affect sleep and HRV',                tag:'Monitor',    tc:'al'},
      {name:'Alcohol',       detail:'Rarely — low concern',                            tag:'Low Risk',   tc:'me'},
      {name:'Nicotine',      detail:'None',                                            tag:'Clear',      tc:'ok'},
      {name:'Doctor Visits', detail:'Yearly — recommend increasing given risk profile', tag:'Infrequent', tc:'al'}
    ],
    femaleSpecific:[
      {name:'Pregnancy',   detail:'Not pregnant',                     tag:'N/A',        tc:'me'},
      {name:'Mammography', detail:'Adherent — screenings up to date', tag:'Adherent ✓', tc:'ok'}
    ]
  },

  sara: {
    init:'SM', name:'Sara Malik', meta:'34 yrs · Female · B+ · Post-op monitoring',
    risk:'st', rl:'Stable', rc:'var(--success)', bg:'rgba(94,234,212,0.2)',
    gender:'female', age:34, sex:'Female', blood:'B+',
    height:'161cm', weight:'58kg', healthScore:86, dataWindow:'5d',
    sleep:'Good', caffeine:'Occasional', alcohol:'Rarely', nicotine:'None',
    doctorVisits:'As needed', hospitalizations:'1 · Surgeries 1',
    vitals:{
      hr:      {val:'68', unit:'bpm',   trend:'→ Within normal range',   tc:'n', bars:[72,70,70,68,68,68,68]},
      spo2:    {val:'97', unit:'%',     trend:'→ Normal',                tc:'n', bars:[96,97,97,98,97,97,97]},
      bp:      {val:'118/76',           trend:'→ Normal',                tc:'n', bars:[55,56,57,58,57,57,58]},
      sleep:   {val:'75', unit:'/100',  trend:'↑ Improving post-op',    tc:'n', bars:[55,58,62,65,68,72,75]},
      glucose: {val:'92', unit:'mg/dL', trend:'→ Normal fasting',       tc:'n', bars:[88,90,91,92,91,92,92]},
      stress:  {val:'34', unit:'/100',  trend:'→ Low — recovering well',tc:'n', bars:[55,50,45,42,38,35,34]},
      hrv:     {val:'52', unit:'ms',    trend:'↑ Improving daily',      tc:'n', bars:[38,40,43,46,48,50,52]},
      rem:     {val:'72', unit:'min',   trend:'→ Adequate',             tc:'n', bars:[65,67,68,70,71,72,72]},
      recovery:{val:'78', unit:'/100',  trend:'↑ Good recovery',       tc:'n', bars:[55,58,62,66,70,74,78]}
    },
    conditions:['Post-op: Appendectomy'],
    medications:['Amoxicillin 500mg','Paracetamol 500mg'],
    allergies:['None known'],
    familyRisk:[],
    summaryDoc:'A 34-year-old female, 5 days post-appendectomy, showing satisfactory recovery trajectory. All vitals within normal parameters: HR 68 bpm, SpO2 97%, BP 118/76 mmHg. Sleep and recovery scores trending upward daily. Mild post-surgical leukocytosis (WBC 11.2 ×10⁹/L) and elevated ESR 28 mm/hr consistent with expected inflammatory response. No signs of secondary infection. Continue current antibiotic course and monitor daily vitals.',
    summaryPat:'You are recovering well after your surgery. Your heart rate, oxygen levels, and blood pressure are all normal. Your sleep is improving each day and your stress levels are low. Your blood tests show some expected mild changes after surgery — this is completely normal. Keep resting and taking your medications as prescribed.',
    summaryConf:'High', summaryBadge:'h',
    findings:[
      {sev:'l', txt:'WBC mildly elevated — expected post-surgical response', src:'labs · CBC'},
      {sev:'l', txt:'ESR 28 mm/hr — normal post-operative range',            src:'labs · ESR'},
      {sev:'l', txt:'Recovery trending up +23 pts over 5 days',              src:'vitals · watch'},
      {sev:'l', txt:'All vitals within normal range',                         src:'vitals · watch'},
      {sev:'l', txt:'No signs of infection or complications',                 src:'clinical assessment'}
    ],
    labs:[{
      name:'Post-Operative CBC Panel', date:'April 26, 2026 · IDC · Dr. Sarah Johnson',
      status:'2 Flagged', statusCls:'f',
      rows:[
        {test:'WBC',        val:'11.2 ×10⁹/L', ref:'4.5–11.0',  flag:'HIGH'},
        {test:'Hemoglobin', val:'11.8 g/dL',   ref:'12.0–16.0', flag:'HIGH'},
        {test:'Platelets',  val:'342 ×10⁹/L',  ref:'150–400',   flag:'NORMAL'},
        {test:'CRP',        val:'2.1 mg/L',     ref:'< 3.0',     flag:'NORMAL'},
        {test:'ESR',        val:'28 mm/hr',     ref:'< 20',       flag:'HIGH'}
      ]
    }],
    medHistory:[
      {name:'Appendectomy', detail:'April 21, 2026 · Laparoscopic · Uncomplicated', tag:'Recent', tc:'al'}
    ],
    famHistory:[],
    lifestyle:[
      {name:'Caffeine',      detail:'Occasional',                                tag:'Low Risk',  tc:'me'},
      {name:'Alcohol',       detail:'Rarely',                                    tag:'Low Risk',  tc:'me'},
      {name:'Nicotine',      detail:'None',                                      tag:'Clear',     tc:'ok'},
      {name:'Doctor Visits', detail:'Currently under active post-op monitoring', tag:'Compliant', tc:'me'}
    ],
    femaleSpecific:[
      {name:'Pregnancy',   detail:'Not pregnant — confirmed pre-op',  tag:'N/A',     tc:'me'},
      {name:'Mammography', detail:'Not due — screening starts at 40', tag:'Not Due', tc:'me'}
    ]
  }
};

// ── Shared constants ──────────────────────────────────────────────────────────
const aiSuggestions = [
  'Review medication dosage in context of current vitals.',
  'Consider referral to relevant specialist if trends persist.',
  'Schedule follow-up within 2 weeks to reassess.',
  'Patient education on lifestyle risk factors recommended.'
];

// ── Render helpers ────────────────────────────────────────────────────────────
const TC = {n:'var(--success)', e:'var(--warning)', c:'var(--danger)'};

const vitMeta = [
  {key:'hr',       label:'Heart Rate',     src:'watch'},
  {key:'spo2',     label:'SpO2',           src:'watch'},
  {key:'bp',       label:'Blood Pressure', src:'manual'},
  {key:'sleep',    label:'Sleep Score',    src:'watch'},
  {key:'glucose',  label:'Blood Glucose',  src:'manual'},
  {key:'stress',   label:'Stress Score',   src:'watch'},
  {key:'hrv',      label:'HRV RMSSD',      src:'watch'},
  {key:'rem',      label:'Sleep REM',      src:'watch'},
  {key:'recovery', label:'Recovery Score', src:'watch'}
];

function mkBars(arr, tc){
  return '<div class="mbar">' +
    arr.map((h,i) =>
      `<span style="height:${h}%" class="${i===arr.length-1?'bar-'+tc:''}"></span>`
    ).join('') + '</div>';
}

function mkTag(tag, tc){
  return `<span class="tg ${tc}">${tag}</span>`;
}

