// ── History generator (deterministic seeded RNG) ─────────────────────────────
function gen(seed, from, to, n, noise) {
  let s = (seed * 1664525 + 1013904223) | 0; s = s >>> 0;
  return Array.from({length: n}, (_, i) => {
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    const b = from + (to - from) * (i / Math.max(n - 1, 1));
    return Math.round(b + ((s >>> 0) / 4294967296 - 0.5) * noise * 2);
  });
}

// ── Patient records ───────────────────────────────────────────────────────────
const patientData = {
  ahmed: {
    init:'AK', name:'Ahmed Khan', meta:'55 yrs · Male · A+ · Hypertension · Diabetes',
    risk:'cr', rl:'Critical', rc:'var(--danger)', bg:'rgba(251,113,133,0.2)',
    gender:'male', age:55, sex:'Male', blood:'A+',
    height:'172cm', weight:'89kg', healthScore:58, baselineScore:38, dataWindow:'7d',
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
      recovery:{val:'28',  unit:'/100',  trend:'↓ Critical recovery',      tc:'c', bars:[70,63,55,48,42,35,28]},
      temp:    {val:'99',  unit:'°F',    trend:'↑ Mildly elevated',         tc:'e', bars:[98,99,99,99,99,99,99]},
      steps:   {val:'2800',unit:'steps', trend:'↓ Low activity',            tc:'e', bars:[3200,3100,3000,2900,2860,2820,2800]},
      calories:{val:'185', unit:'kcal',  trend:'↓ Low energy expenditure',  tc:'e', bars:[220,210,200,196,192,188,185]}
    },
    vitalHistory:{
      hr:      {daily:gen(101,84,102,30,4),  hourly:gen(102,100,103,24,2)},
      spo2:    {daily:gen(103,96,88,30,1),   hourly:gen(104,89,88,24,1)},
      bp:      {daily:gen(105,82,95,30,3),   hourly:gen(106,93,96,24,2)},
      sleep:   {daily:gen(107,68,42,30,4),   hourly:gen(108,40,43,24,2)},
      glucose: {daily:gen(109,162,218,30,8), hourly:gen(110,212,220,24,5)},
      stress:  {daily:gen(111,62,82,30,4),   hourly:gen(112,80,84,24,2)},
      hrv:     {daily:gen(113,38,19,30,2),   hourly:gen(114,18,21,24,2)},
      rem:     {daily:gen(115,62,32,30,4),   hourly:gen(116,30,34,24,2)},
      recovery:{daily:gen(117,58,28,30,4),   hourly:gen(118,27,30,24,2)},
      temp:    {daily:gen(701,98,99,30,1),    hourly:gen(702,98,100,24,1)},
      steps:   {daily:gen(703,3200,2800,30,300), hourly:gen(704,80,380,24,100)},
      calories:{daily:gen(705,220,185,30,20), hourly:gen(706,6,22,24,5)}
    },
    conditions:['Hypertension','Type 2 Diabetes'],
    medications:['Metformin 500mg','Lisinopril 10mg','Aspirin 81mg'],
    allergies:['Penicillin'],
    familyRisk:['Heart Disease ↗','Diabetes ↗'],
    summaryDoc:'A 55-year-old male with Type 2 Diabetes and Hypertension presents with critical SpO2 at 88%, 14% below the clinical threshold. Resting heart rate at 102 bpm (+28% above baseline), blood pressure at 158/95 mmHg (Stage 2 Hypertension), and blood glucose severely elevated at 218 mg/dL indicate poor multi-system control. HRV RMSSD critically low at 19ms. Sleep and recovery scores indicate exhaustion. Immediate cardiorespiratory review and medication adjustment recommended.',
    summaryPat:'Your oxygen levels are dangerously low and your heart is working much harder than it should. Your blood pressure and blood sugar are both very high. You need to see your doctor urgently — these are signs that your body is under serious stress and requires immediate attention.',
    summaryConf:'High', summaryBadge:'h',
    findings:[
      {sev:'h', txt:'SpO2 88% — critical, below 90% threshold',                      src:'vitals · watch'},
      {sev:'h', txt:'BP 158/95 — Stage 2 Hypertension',                               src:'vitals · manual'},
      {sev:'h', txt:'Platelet Count 52 ×10⁹/L — critically low (ref 157–371)',        src:'labs · CBC'},
      {sev:'h', txt:'Undifferentiated Blasts 5% — haematology review required',       src:'labs · CBC'},
      {sev:'h', txt:'Blood Glucose 218 mg/dL — severely elevated',                    src:'vitals · glucometer'},
      {sev:'m', txt:'Serum Creatinine 1.63 — eGFR 58, early diabetic nephropathy',   src:'labs · KFT'},
      {sev:'m', txt:'HRV RMSSD 19ms — critically low autonomic tone',                 src:'vitals · watch'},
      {sev:'l', txt:'Sleep 42/100 — compounding recovery deficit',                    src:'vitals · watch'}
    ],
    labs:[
      {
        name:'CBC with Differential', date:'May 7, 2026 · Mayo Clinic Laboratories',
        status:'5 Flagged', statusCls:'f',
        rows:[
          {test:'Hemoglobin',              val:'15.1 g/dL',     ref:'11.6–15.0',   flag:'HIGH'},
          {test:'Hematocrit',              val:'45.4 %',        ref:'35.5–44.9',   flag:'HIGH'},
          {test:'WBC (Leukocytes)',        val:'10.4 ×10⁹/L',  ref:'3.4–9.6',     flag:'HIGH'},
          {test:'Platelet Count',          val:'52 ×10⁹/L',    ref:'157–371',     flag:'CRITICAL'},
          {test:'Erythrocytes (RBC)',      val:'4.82 ×10¹²/L', ref:'3.92–5.13',   flag:'NORMAL'},
          {test:'MCV',                     val:'94.0 fL',       ref:'78.2–97.9',   flag:'NORMAL'},
          {test:'Lymphocytes',             val:'67 %',          ref:'18–42',       flag:'HIGH'},
          {test:'Neutrophilic Segs',       val:'11 %',          ref:'50–75',       flag:'HIGH'},
          {test:'Undifferentiated Blasts', val:'5 %',           ref:'< 1',         flag:'CRITICAL'}
        ]
      },
      {
        name:'Kidney Function Test', date:'Oct 10, 2024 · Labsmart Diagnostics',
        status:'2 Flagged', statusCls:'f',
        rows:[
          {test:'Serum Urea',             val:'19.27 mg/dL',  ref:'7.0–25',     flag:'NORMAL'},
          {test:'Serum Creatinine',       val:'1.63 mg/dL',   ref:'0.55–1.02',  flag:'HIGH'},
          {test:'eGFR',                   val:'58.03',         ref:'> 60',       flag:'HIGH'},
          {test:'Serum Calcium',          val:'9.29 mg/dL',   ref:'8.4–10.2',   flag:'NORMAL'},
          {test:'Serum Potassium',        val:'3.6 mmol/L',   ref:'3.5–5.1',    flag:'NORMAL'},
          {test:'Serum Uric Acid',        val:'4.0 mg/dL',    ref:'2.6–6.0',    flag:'NORMAL'},
          {test:'BUN / Creatinine Ratio', val:'10.17',         ref:'6–22',       flag:'NORMAL'}
        ]
      }
    ],
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
    femaleSpecific: null,
    medicationDetail: {
      active: [
        {
          name: 'Metformin 500mg', class: 'Antidiabetic',
          frequency: 'Twice daily · with meals',
          prescribedBy: 'Dr. Sarah Johnson', since: 'Jan 2022',
          adherence: 64, missedLast30: 11, lastTaken: 'Today, 8:00 AM',
          notes: 'Take with food',
          dots: [1,0,1,1,0,1,1,0,1,0,1,1,0,1]
        },
        {
          name: 'Lisinopril 10mg', class: 'ACE Inhibitor',
          frequency: 'Once daily · morning',
          prescribedBy: 'Dr. Sarah Johnson', since: 'Mar 2021',
          adherence: 71, missedLast30: 9, lastTaken: 'Today, 8:05 AM',
          notes: null,
          dots: [1,1,0,1,1,1,0,1,1,1,0,1,1,0]
        },
        {
          name: 'Aspirin 81mg', class: 'Antiplatelet',
          frequency: 'Once daily · evening',
          prescribedBy: 'Dr. Sarah Johnson', since: 'Jun 2022',
          adherence: 58, missedLast30: 13, lastTaken: 'Yesterday, 9:00 PM',
          notes: 'Take after food',
          dots: [1,0,1,0,1,1,0,0,1,1,0,1,0,0]
        }
      ],
      past: [
        {name:'Glibenclamide 5mg', class:'Sulfonylurea', from:'Mar 2020', to:'Nov 2021',
         reason:'Discontinued — recurrent hypoglycemic episodes'}
      ]
    }
  },

  fatima: {
    init:'FR', name:'Fatima Rehman', meta:'38 yrs · Female · B+ · Prediabetes · Neuropathy',
    risk:'hi', rl:'High', rc:'var(--warning)', bg:'rgba(251,191,36,0.2)',
    gender:'female', age:38, sex:'Female', blood:'B+',
    height:'165cm', weight:'68kg', healthScore:72, baselineScore:61, dataWindow:'14d',
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
      recovery:{val:'44',  unit:'/100',  trend:'↓ Poor recovery',        tc:'c', bars:[75,70,65,58,52,47,44]},
      temp:    {val:'99',  unit:'°F',    trend:'→ Normal range',           tc:'n', bars:[98,99,99,98,99,99,99]},
      steps:   {val:'4500',unit:'steps', trend:'↓ Below average activity', tc:'e', bars:[5200,5100,4900,4800,4700,4600,4500]},
      calories:{val:'260', unit:'kcal',  trend:'→ Moderate activity',      tc:'n', bars:[300,285,278,272,268,264,260]}
    },
    vitalHistory:{
      hr:      {daily:gen(201,78,88,30,3),   hourly:gen(202,86,90,24,2)},
      spo2:    {daily:gen(203,97,96,30,1),   hourly:gen(204,95,97,24,1)},
      bp:      {daily:gen(205,79,85,30,2),   hourly:gen(206,83,87,24,2)},
      sleep:   {daily:gen(207,76,58,30,4),   hourly:gen(208,56,60,24,2)},
      glucose: {daily:gen(209,118,142,30,6), hourly:gen(210,138,145,24,4)},
      stress:  {daily:gen(211,55,68,30,3),   hourly:gen(212,66,70,24,2)},
      hrv:     {daily:gen(213,48,28,30,3),   hourly:gen(214,26,30,24,2)},
      rem:     {daily:gen(215,68,48,30,4),   hourly:gen(216,46,50,24,3)},
      recovery:{daily:gen(217,62,44,30,4),   hourly:gen(218,42,46,24,3)},
      temp:    {daily:gen(711,98,99,30,1),    hourly:gen(712,98,100,24,1)},
      steps:   {daily:gen(713,5200,4500,30,300), hourly:gen(714,100,480,24,120)},
      calories:{daily:gen(715,300,260,30,25), hourly:gen(716,8,28,24,6)}
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
    labs:[
      {
        name:'HbA1c & Biochemistry', date:'Nov 11, 2024 · Labsmart Software',
        status:'2 Flagged', statusCls:'f',
        rows:[
          {test:'HbA1c (Glycosylated Hb)', val:'6.0 %',        ref:'< 5.7%',   flag:'HIGH'},
          {test:'Est. Average Glucose',    val:'126.55 mg/dL', ref:'< 100',    flag:'HIGH'}
        ]
      },
      {
        name:'Lipid Profile', date:'Nov 11, 2024 · Labsmart Software',
        status:'All Normal', statusCls:'ok',
        rows:[
          {test:'Total Cholesterol',  val:'125 mg/dL', ref:'125–200',  flag:'NORMAL'},
          {test:'Triglycerides',      val:'80 mg/dL',  ref:'30–200',   flag:'NORMAL'},
          {test:'HDL Cholesterol',    val:'40 mg/dL',  ref:'35–80',    flag:'NORMAL'},
          {test:'LDL Cholesterol',    val:'69 mg/dL',  ref:'< 100',    flag:'NORMAL'},
          {test:'VLDL',               val:'16 mg/dL',  ref:'5–40',     flag:'NORMAL'},
          {test:'Total / HDL Ratio',  val:'3.13',       ref:'< 5.0',    flag:'NORMAL'}
        ]
      }
    ],
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
    ],
    medicationDetail: {
      active: [
        {
          name: 'Lisinopril 10mg', class: 'ACE Inhibitor',
          frequency: 'Once daily · morning',
          prescribedBy: 'Dr. Sarah Johnson', since: 'Feb 2023',
          adherence: 78, missedLast30: 7, lastTaken: 'Today, 7:45 AM',
          notes: null,
          dots: [1,1,1,1,0,1,1,1,1,0,1,1,1,0]
        }
      ],
      past: [
        {name:'Metformin 250mg', class:'Antidiabetic', from:'Jan 2023', to:'Feb 2023',
         reason:'Discontinued — GI intolerance (nausea, diarrhea)'}
      ]
    }
  },

  sara: {
    init:'SM', name:'Sara Malik', meta:'34 yrs · Female · B+ · Post-op monitoring',
    risk:'st', rl:'Low', rc:'var(--success)', bg:'rgba(94,234,212,0.2)',
    gender:'female', age:34, sex:'Female', blood:'B+',
    height:'161cm', weight:'58kg', healthScore:86, baselineScore:82, dataWindow:'5d',
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
      recovery:{val:'78', unit:'/100',  trend:'↑ Good recovery',       tc:'n', bars:[55,58,62,66,70,74,78]},
      temp:    {val:'98',  unit:'°F',    trend:'→ Normal',                tc:'n', bars:[98,98,98,98,98,98,98]},
      steps:   {val:'7200',unit:'steps', trend:'↑ Improving post-recovery',tc:'n', bars:[5500,5800,6200,6500,6800,7000,7200]},
      calories:{val:'380', unit:'kcal',  trend:'↑ Increasing activity',   tc:'n', bars:[300,320,340,355,365,374,380]}
    },
    vitalHistory:{
      hr:      {daily:gen(301,74,68,30,2),  hourly:gen(302,67,70,24,1)},
      spo2:    {daily:gen(303,95,97,30,1),  hourly:gen(304,96,98,24,1)},
      bp:      {daily:gen(305,80,76,30,2),  hourly:gen(306,75,78,24,1)},
      sleep:   {daily:gen(307,45,75,30,4),  hourly:gen(308,73,78,24,2)},
      glucose: {daily:gen(309,95,92,30,3),  hourly:gen(310,90,94,24,2)},
      stress:  {daily:gen(311,55,34,30,3),  hourly:gen(312,33,36,24,2)},
      hrv:     {daily:gen(313,35,52,30,3),  hourly:gen(314,50,54,24,2)},
      rem:     {daily:gen(315,58,72,30,4),  hourly:gen(316,70,74,24,3)},
      recovery:{daily:gen(317,45,78,30,5),  hourly:gen(318,76,80,24,3)},
      temp:    {daily:gen(721,97,98,30,1),   hourly:gen(722,97,99,24,1)},
      steps:   {daily:gen(723,5500,7200,30,300), hourly:gen(724,150,600,24,120)},
      calories:{daily:gen(725,300,380,30,25), hourly:gen(726,10,40,24,8)}
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
    labs:[
      {
        name:'Post-Operative CBC Panel', date:'April 26, 2026 · IDC · Dr. Sarah Johnson',
        status:'2 Flagged', statusCls:'f',
        rows:[
          {test:'WBC',        val:'11.2 ×10⁹/L', ref:'4.5–11.0',  flag:'HIGH'},
          {test:'Hemoglobin', val:'11.8 g/dL',   ref:'12.0–16.0', flag:'HIGH'},
          {test:'Platelets',  val:'342 ×10⁹/L',  ref:'150–400',   flag:'NORMAL'},
          {test:'CRP',        val:'2.1 mg/L',     ref:'< 3.0',     flag:'NORMAL'},
          {test:'ESR',        val:'28 mm/hr',     ref:'< 20',      flag:'HIGH'}
        ]
      },
      {
        name:'Serology Panel', date:'Apr 9, 2026 · Al-Khidmat Raazi Diagnostics · Dr. Hasaan Zia',
        status:'All Normal', statusCls:'ok',
        rows:[
          {test:'RA Factor', val:'< 15.0 IU/mL', ref:'Negative: < 15 · Positive: > 15', flag:'NORMAL'}
        ]
      }
    ],
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
    ],
    medicationDetail: {
      active: [
        {
          name: 'Amoxicillin 500mg', class: 'Antibiotic',
          frequency: 'Three times daily · every 8h',
          prescribedBy: 'Dr. Sarah Johnson', since: 'Apr 21, 2026',
          adherence: 96, missedLast30: 1, lastTaken: 'Today, 10:00 AM',
          notes: '7-day post-op course',
          dots: [2,2,2,2,2,2,2,2,2,1,1,1,1,1]
        },
        {
          name: 'Paracetamol 500mg', class: 'Analgesic',
          frequency: 'As needed · up to 4× daily',
          prescribedBy: 'Dr. Sarah Johnson', since: 'Apr 21, 2026',
          adherence: 92, missedLast30: 2, lastTaken: 'Today, 10:00 AM',
          notes: 'Pain management post-surgery',
          dots: [2,2,2,2,2,2,2,2,2,1,1,1,0,1]
        }
      ],
      past: []
    }
  },

  omar: {
    init:'OF', name:'Omar Farooq', meta:'47 yrs · Male · O+ · Pre-hypertension · Dyslipidemia',
    risk:'me', rl:'Medium', rc:'var(--warning)', bg:'rgba(251,191,36,0.15)',
    gender:'male', age:47, sex:'Male', blood:'O+',
    height:'175cm', weight:'84kg', healthScore:71, baselineScore:65, dataWindow:'7d',
    sleep:'Fair', caffeine:'Daily', alcohol:'Occasionally', nicotine:'None',
    doctorVisits:'Quarterly', hospitalizations:'0 · Surgeries 0',
    vitals:{
      hr:      {val:'82',  unit:'bpm',   trend:'↑ Slightly elevated',          tc:'e', bars:[72,74,76,78,80,81,82]},
      spo2:    {val:'96',  unit:'%',     trend:'→ Normal range',                tc:'n', bars:[97,97,96,97,96,97,96]},
      bp:      {val:'138/88',            trend:'↑ Pre-hypertension',            tc:'e', bars:[75,76,78,80,82,85,88]},
      sleep:   {val:'63',  unit:'/100',  trend:'→ Below average',               tc:'n', bars:[70,68,66,65,64,63,63]},
      glucose: {val:'102', unit:'mg/dL', trend:'→ Normal fasting',              tc:'n', bars:[95,96,98,99,100,101,102]},
      stress:  {val:'58',  unit:'/100',  trend:'↑ Moderate stress',             tc:'e', bars:[42,45,48,50,53,56,58]},
      hrv:     {val:'38',  unit:'ms',    trend:'→ Moderate autonomic balance',  tc:'n', bars:[44,42,40,40,39,38,38]},
      rem:     {val:'56',  unit:'min',   trend:'→ Below average',               tc:'n', bars:[62,61,60,58,57,57,56]},
      recovery:{val:'64',  unit:'/100',  trend:'→ Moderate recovery',           tc:'n', bars:[68,67,66,65,65,64,64]},
      temp:    {val:'99',  unit:'°F',    trend:'→ Normal',                       tc:'n', bars:[98,99,98,99,99,98,99]},
      steps:   {val:'5800',unit:'steps', trend:'→ Moderate activity',            tc:'n', bars:[6200,6000,5900,5850,5830,5810,5800]},
      calories:{val:'320', unit:'kcal',  trend:'→ Moderate',                     tc:'n', bars:[340,335,330,328,325,322,320]}
    },
    vitalHistory:{
      hr:      {daily:gen(201,72,82,30,3),  hourly:gen(202,80,84,24,2)},
      spo2:    {daily:gen(203,97,96,30,1),  hourly:gen(204,95,97,24,1)},
      bp:      {daily:gen(205,78,88,30,3),  hourly:gen(206,86,90,24,2)},
      sleep:   {daily:gen(207,70,63,30,4),  hourly:gen(208,62,65,24,2)},
      glucose: {daily:gen(209,95,102,30,4), hourly:gen(210,99,104,24,3)},
      stress:  {daily:gen(211,42,58,30,4),  hourly:gen(212,56,61,24,2)},
      hrv:     {daily:gen(213,44,38,30,2),  hourly:gen(214,37,40,24,2)},
      rem:     {daily:gen(215,62,56,30,4),  hourly:gen(216,55,58,24,2)},
      recovery:{daily:gen(217,68,64,30,3),  hourly:gen(218,63,66,24,2)},
      temp:    {daily:gen(731,98,99,30,1),   hourly:gen(732,98,100,24,1)},
      steps:   {daily:gen(733,6200,5800,30,300), hourly:gen(734,100,560,24,120)},
      calories:{daily:gen(735,340,320,30,20), hourly:gen(736,10,30,24,6)}
    },
    conditions:['Pre-hypertension','Dyslipidemia'],
    medications:['Atorvastatin 10mg','Aspirin 81mg'],
    allergies:['None known'],
    familyRisk:['Heart Disease ↗','Hypertension ↗'],
    summaryDoc:'A 47-year-old male with pre-hypertension (BP 138/88 mmHg) and dyslipidemia currently managed on Atorvastatin 10mg. Resting HR mildly elevated at 82 bpm. SpO2 and fasting glucose within normal range. Moderate stress levels (58/100) and below-average sleep quality. HRV trending downward, suggesting early autonomic stress. Recommend lifestyle modification, dietary review, and BP re-evaluation in 4 weeks.',
    summaryPat:'Your blood pressure is a bit high and your cholesterol is being managed with medication. Your oxygen levels and blood sugar are normal. Your stress levels are moderate and your sleep could be better. Focus on reducing salt intake, exercising regularly, and managing stress.',
    summaryConf:'High', summaryBadge:'h',
    findings:[
      {sev:'m', txt:'BP 138/88 — pre-hypertension stage',         src:'vitals · manual'},
      {sev:'m', txt:'HR 82 — mildly elevated resting rate',       src:'vitals · watch'},
      {sev:'l', txt:'Stress 58/100 — moderate, trending up',      src:'vitals · watch'},
      {sev:'l', txt:'HRV declining over 7d — early autonomic signal', src:'vitals · watch'},
      {sev:'l', txt:'Dyslipidemia — maintained on statin',        src:'clinical'}
    ],
    labs:[{
      name:'Lipid Profile', date:'March 12, 2026 · HealthFirst Labs · Dr. Ibrahim',
      status:'2 Flagged', statusCls:'f',
      rows:[
        {test:'Total Cholesterol', val:'214 mg/dL', ref:'< 200',  flag:'HIGH'},
        {test:'LDL',               val:'138 mg/dL', ref:'< 130',  flag:'HIGH'},
        {test:'HDL',               val:'48 mg/dL',  ref:'> 40',   flag:'NORMAL'},
        {test:'Triglycerides',     val:'152 mg/dL', ref:'< 150',  flag:'NORMAL'}
      ]
    }],
    medHistory:[
      {name:'Dyslipidemia',     detail:'Diagnosed 2023 · Managed on Atorvastatin', tag:'Chronic',  tc:'me'},
      {name:'Pre-hypertension', detail:'Diagnosed 2024 · Lifestyle management',    tag:'Monitor',  tc:'al'}
    ],
    famHistory:[
      {name:'Father', detail:'MI at 61 · Hypertension', tag:'Cardiac Risk', tc:'al'}
    ],
    lifestyle:[
      {name:'Caffeine',      detail:'Daily — 2 cups',                       tag:'Moderate',  tc:'me'},
      {name:'Alcohol',       detail:'Occasionally',                          tag:'Low Risk',  tc:'me'},
      {name:'Nicotine',      detail:'None',                                  tag:'Clear',     tc:'ok'},
      {name:'Exercise',      detail:'Light — walks 3×/week',                 tag:'Moderate',  tc:'me'},
      {name:'Doctor Visits', detail:'Quarterly — BP and lipid monitoring',   tag:'Compliant', tc:'ok'}
    ],
    femaleSpecific:[],
    medicationDetail:{
      active:[
        {name:'Atorvastatin 10mg', class:'Statin', frequency:'Once daily · evening',
         prescribedBy:'Dr. Ibrahim', since:'Jan 2024', adherence:91, missedLast30:3,
         lastTaken:'Yesterday, 9:00 PM', notes:'Lipid management — recheck in 3 months',
         dots:[2,2,1,2,2,2,2,2,2,2,2,0,2,2]},
        {name:'Aspirin 81mg', class:'Antiplatelet', frequency:'Once daily · morning',
         prescribedBy:'Dr. Ibrahim', since:'Mar 2024', adherence:95, missedLast30:1,
         lastTaken:'Today, 8:00 AM', notes:'Cardiovascular prophylaxis',
         dots:[2,2,2,2,2,2,2,2,2,2,2,2,2,1]}
      ],
      past:[]
    }
  },

  nadia: {
    init:'NH', name:'Nadia Hassan', meta:'52 yrs · Female · B+ · Type 2 Diabetes · Obesity',
    risk:'hi', rl:'High', rc:'var(--danger)', bg:'rgba(251,113,133,0.12)',
    gender:'female', age:52, sex:'Female', blood:'B+',
    height:'162cm', weight:'94kg', healthScore:61, baselineScore:52, dataWindow:'7d',
    sleep:'Poor', caffeine:'Daily', alcohol:'Rarely', nicotine:'None',
    doctorVisits:'Monthly', hospitalizations:'1 · Surgeries 0',
    vitals:{
      hr:      {val:'95',  unit:'bpm',   trend:'↑ Elevated resting rate',       tc:'e', bars:[82,84,86,88,90,92,95]},
      spo2:    {val:'94',  unit:'%',     trend:'↓ Below optimal',               tc:'e', bars:[97,97,96,96,95,94,94]},
      bp:      {val:'148/94',            trend:'↑ Stage 1 Hypertension',        tc:'c', bars:[70,74,78,82,86,90,94]},
      sleep:   {val:'49',  unit:'/100',  trend:'↓ Poor quality',                tc:'e', bars:[65,62,58,56,53,51,49]},
      glucose: {val:'192', unit:'mg/dL', trend:'↑ Significantly elevated',      tc:'c', bars:[55,60,67,73,80,88,100]},
      stress:  {val:'74',  unit:'/100',  trend:'↑ High chronic stress',         tc:'e', bars:[52,56,60,64,68,71,74]},
      hrv:     {val:'22',  unit:'ms',    trend:'↓ Reduced autonomic function',  tc:'e', bars:[38,35,32,29,27,24,22]},
      rem:     {val:'42',  unit:'min',   trend:'↓ Reduced REM sleep',           tc:'e', bars:[58,55,52,50,47,44,42]},
      recovery:{val:'39',  unit:'/100',  trend:'↓ Poor recovery score',         tc:'e', bars:[55,52,48,46,43,41,39]},
      temp:    {val:'99',  unit:'°F',    trend:'→ Normal range',                 tc:'n', bars:[98,99,99,98,99,99,99]},
      steps:   {val:'3200',unit:'steps', trend:'↓ Below target — mobility',     tc:'e', bars:[3600,3500,3400,3350,3300,3250,3200]},
      calories:{val:'230', unit:'kcal',  trend:'↓ Low activity',                tc:'e', bars:[270,265,258,252,246,238,230]}
    },
    vitalHistory:{
      hr:      {daily:gen(301,78,95,30,4),   hourly:gen(302,92,97,24,3)},
      spo2:    {daily:gen(303,97,94,30,1),   hourly:gen(304,93,95,24,1)},
      bp:      {daily:gen(305,78,94,30,4),   hourly:gen(306,92,96,24,3)},
      sleep:   {daily:gen(307,65,49,30,4),   hourly:gen(308,47,52,24,2)},
      glucose: {daily:gen(309,145,192,30,8), hourly:gen(310,185,197,24,5)},
      stress:  {daily:gen(311,52,74,30,4),   hourly:gen(312,72,77,24,2)},
      hrv:     {daily:gen(313,38,22,30,2),   hourly:gen(314,21,24,24,2)},
      rem:     {daily:gen(315,58,42,30,4),   hourly:gen(316,40,44,24,2)},
      recovery:{daily:gen(317,55,39,30,4),   hourly:gen(318,37,42,24,2)},
      temp:    {daily:gen(741,98,99,30,1),    hourly:gen(742,98,100,24,1)},
      steps:   {daily:gen(743,3600,3200,30,250), hourly:gen(744,80,320,24,80)},
      calories:{daily:gen(745,270,230,30,20), hourly:gen(746,7,22,24,5)}
    },
    conditions:['Type 2 Diabetes','Obesity','Hypertension Stage 1'],
    medications:['Metformin 1000mg','Amlodipine 5mg','Vitamin D3'],
    allergies:['Sulfa drugs'],
    familyRisk:['Diabetes ↗','Obesity ↗','Hypertension ↗'],
    summaryDoc:'A 52-year-old female with Type 2 Diabetes, Obesity (BMI 35.8), and Stage 1 Hypertension. Blood glucose significantly elevated at 192 mg/dL despite Metformin 1000mg. BP 148/94 mmHg. SpO2 mildly suppressed at 94%, compounded by obesity. HRV 22ms and recovery score 39/100 indicate chronic physiological stress. Sleep quality poor at 49/100. Weight management counselling and endocrinology referral recommended.',
    summaryPat:'Your blood sugar is too high and your blood pressure has also gone up. Your oxygen levels are slightly low and your body is not recovering well from daily stress. Take your medications as directed, focus on eating healthier, and try to walk more each day.',
    summaryConf:'High', summaryBadge:'h',
    findings:[
      {sev:'h', txt:'Glucose 192 mg/dL — significantly elevated',  src:'vitals · manual'},
      {sev:'h', txt:'BP 148/94 — Stage 1 Hypertension',            src:'vitals · manual'},
      {sev:'m', txt:'SpO2 94% — suppressed, monitor closely',      src:'vitals · watch'},
      {sev:'m', txt:'HRV 22ms — reduced autonomic function',       src:'vitals · watch'},
      {sev:'m', txt:'Sleep 49/100 — poor quality, weight-related', src:'vitals · watch'}
    ],
    labs:[{
      name:'HbA1c & Metabolic Panel', date:'April 14, 2026 · CityPath Diagnostics · Dr. Ibrahim',
      status:'2 Critical', statusCls:'f',
      rows:[
        {test:'HbA1c',          val:'8.2%',       ref:'< 5.7 normal · 5.7–6.4 pre-diabetes', flag:'CRITICAL'},
        {test:'Fasting Glucose', val:'188 mg/dL',  ref:'70–99',                                flag:'CRITICAL'},
        {test:'Creatinine',     val:'0.92 mg/dL', ref:'0.5–1.1',                              flag:'NORMAL'},
        {test:'eGFR',           val:'74 mL/min',  ref:'> 60',                                 flag:'NORMAL'}
      ]
    }],
    medHistory:[
      {name:'Type 2 Diabetes',     detail:'Diagnosed 2019 · HbA1c trending up', tag:'Poorly Controlled', tc:'al'},
      {name:'Obesity',             detail:'BMI 35.8 · Ongoing weight management', tag:'Chronic',          tc:'me'},
      {name:'Hypertension Stage 1',detail:'Newly diagnosed Apr 2026',             tag:'New',              tc:'al'}
    ],
    famHistory:[
      {name:'Mother', detail:'Type 2 Diabetes · Hypertension',    tag:'Genetic Risk', tc:'al'},
      {name:'Brother',detail:'Obesity · MI at 58',                 tag:'Cardiac Risk', tc:'al'}
    ],
    lifestyle:[
      {name:'Caffeine',      detail:'Daily — 3 cups',                         tag:'Moderate',  tc:'me'},
      {name:'Alcohol',       detail:'Rarely',                                  tag:'Low Risk',  tc:'ok'},
      {name:'Nicotine',      detail:'None',                                    tag:'Clear',     tc:'ok'},
      {name:'Exercise',      detail:'Sedentary — no structured activity',      tag:'High Risk', tc:'al'},
      {name:'Diet',          detail:'High carbohydrate, processed foods',      tag:'High Risk', tc:'al'},
      {name:'Doctor Visits', detail:'Monthly — diabetes and BP monitoring',    tag:'Compliant', tc:'ok'}
    ],
    femaleSpecific:[
      {name:'Menopause',   detail:'Post-menopausal since 2022',           tag:'Post-menopausal', tc:'me'},
      {name:'Mammography', detail:'Last screening Nov 2025 — Normal',     tag:'Up to date',      tc:'ok'}
    ],
    medicationDetail:{
      active:[
        {name:'Metformin 1000mg', class:'Biguanide', frequency:'Twice daily · with meals',
         prescribedBy:'Dr. Ibrahim', since:'Mar 2020', adherence:82, missedLast30:5,
         lastTaken:'Today, 8:30 AM', notes:'Dose escalated — glucose still suboptimal',
         dots:[2,2,1,2,2,2,2,0,2,2,1,2,2,2]},
        {name:'Amlodipine 5mg', class:'Calcium Channel Blocker', frequency:'Once daily · morning',
         prescribedBy:'Dr. Ibrahim', since:'Apr 2026', adherence:94, missedLast30:1,
         lastTaken:'Today, 8:30 AM', notes:'Initiated for Stage 1 Hypertension',
         dots:[2,2,2,2,2,2,2,2,2,2,2,2,2,1]},
        {name:'Vitamin D3 1000 IU', class:'Supplement', frequency:'Once daily',
         prescribedBy:'Dr. Ibrahim', since:'Jan 2026', adherence:78, missedLast30:6,
         lastTaken:'Yesterday', notes:'Deficiency correction',
         dots:[2,0,2,2,2,1,2,2,0,2,2,1,2,2]}
      ],
      past:[]
    }
  },

  khalid: {
    init:'KM', name:'Khalid Mirza', meta:'29 yrs · Male · AB+ · Anxiety (Mild) · Routine',
    risk:'st', rl:'Low', rc:'var(--success)', bg:'rgba(74,222,128,0.1)',
    gender:'male', age:29, sex:'Male', blood:'AB+',
    height:'178cm', weight:'72kg', healthScore:88, baselineScore:85, dataWindow:'7d',
    sleep:'Good', caffeine:'Daily', alcohol:'Rarely', nicotine:'None',
    doctorVisits:'As needed', hospitalizations:'0 · Surgeries 0',
    vitals:{
      hr:      {val:'68',  unit:'bpm',   trend:'→ Normal resting rate',           tc:'n', bars:[70,69,68,68,67,68,68]},
      spo2:    {val:'98',  unit:'%',     trend:'→ Excellent oxygenation',          tc:'n', bars:[98,98,99,98,98,98,98]},
      bp:      {val:'118/76',            trend:'→ Optimal blood pressure',         tc:'n', bars:[72,74,75,76,75,76,76]},
      sleep:   {val:'79',  unit:'/100',  trend:'→ Good sleep quality',             tc:'n', bars:[80,80,79,78,79,79,79]},
      glucose: {val:'91',  unit:'mg/dL', trend:'→ Normal fasting',                 tc:'n', bars:[92,91,90,91,92,91,91]},
      stress:  {val:'42',  unit:'/100',  trend:'→ Mild — managed with CBT',        tc:'n', bars:[48,46,44,43,43,42,42]},
      hrv:     {val:'54',  unit:'ms',    trend:'→ Good autonomic variability',     tc:'n', bars:[52,53,54,54,53,54,54]},
      rem:     {val:'74',  unit:'min',   trend:'→ Good REM sleep duration',        tc:'n', bars:[72,73,74,74,74,74,74]},
      recovery:{val:'84',  unit:'/100',  trend:'→ Strong recovery score',          tc:'n', bars:[82,83,84,84,84,84,84]},
      temp:    {val:'98',  unit:'°F',    trend:'→ Normal',                          tc:'n', bars:[98,98,98,98,98,98,98]},
      steps:   {val:'9200',unit:'steps', trend:'↑ Very active',                    tc:'n', bars:[8800,8900,9000,9100,9150,9180,9200]},
      calories:{val:'480', unit:'kcal',  trend:'↑ High activity',                  tc:'n', bars:[450,455,460,465,470,476,480]}
    },
    vitalHistory:{
      hr:      {daily:gen(401,68,68,30,3),  hourly:gen(402,66,70,24,2)},
      spo2:    {daily:gen(403,98,98,30,1),  hourly:gen(404,97,99,24,1)},
      bp:      {daily:gen(405,74,76,30,2),  hourly:gen(406,74,78,24,2)},
      sleep:   {daily:gen(407,78,79,30,3),  hourly:gen(408,78,80,24,2)},
      glucose: {daily:gen(409,89,91,30,3),  hourly:gen(410,89,93,24,2)},
      stress:  {daily:gen(411,40,42,30,5),  hourly:gen(412,40,45,24,3)},
      hrv:     {daily:gen(413,52,54,30,2),  hourly:gen(414,52,56,24,2)},
      rem:     {daily:gen(415,72,74,30,3),  hourly:gen(416,72,76,24,2)},
      recovery:{daily:gen(417,82,84,30,3),  hourly:gen(418,82,86,24,2)},
      temp:    {daily:gen(751,98,98,30,1),   hourly:gen(752,97,99,24,1)},
      steps:   {daily:gen(753,8800,9200,30,350), hourly:gen(754,200,900,24,150)},
      calories:{daily:gen(755,450,480,30,25), hourly:gen(756,15,50,24,8)}
    },
    conditions:['Anxiety (Mild)'],
    medications:['Escitalopram 5mg'],
    allergies:['None known'],
    familyRisk:['Anxiety ↗'],
    summaryDoc:'A 29-year-old male with mild generalised anxiety disorder managed on Escitalopram 5mg and CBT. All vitals within normal parameters: HR 68 bpm, SpO2 98%, BP 118/76 mmHg. Sleep quality good (79/100) and recovery score strong at 84/100. Stress levels moderate at 42/100, trending down with ongoing therapy. No significant physical health concerns. Continue current regimen and monitor stress trajectory.',
    summaryPat:'Your overall health looks great. Your heart rate, oxygen levels, blood pressure, and blood sugar are all normal. Your sleep and recovery are both strong. Your stress is moderate but has been improving with your therapy. Keep doing what you are doing.',
    summaryConf:'High', summaryBadge:'h',
    findings:[
      {sev:'l', txt:'All vitals within normal range',                 src:'vitals · watch'},
      {sev:'l', txt:'Stress 42/100 — mild, trending down with CBT',  src:'vitals · watch'},
      {sev:'l', txt:'Good sleep (79/100) and HRV (54ms)',            src:'vitals · watch'},
      {sev:'l', txt:'Anxiety well-controlled on current dose',       src:'clinical'}
    ],
    labs:[{
      name:'Routine Blood Panel', date:'February 10, 2026 · MedLab · Dr. Ibrahim',
      status:'All Normal', statusCls:'ok',
      rows:[
        {test:'WBC',             val:'6.2 ×10⁹/L', ref:'4.5–11.0', flag:'NORMAL'},
        {test:'Hemoglobin',      val:'15.1 g/dL',   ref:'13.0–17.0',flag:'NORMAL'},
        {test:'Fasting Glucose', val:'91 mg/dL',    ref:'70–99',    flag:'NORMAL'},
        {test:'Total Cholesterol',val:'168 mg/dL',  ref:'< 200',    flag:'NORMAL'}
      ]
    }],
    medHistory:[
      {name:'Anxiety (Mild GAD)', detail:'Diagnosed 2023 · CBT + Escitalopram', tag:'Managed', tc:'me'}
    ],
    famHistory:[
      {name:'Mother', detail:'Anxiety disorder', tag:'Mild Risk', tc:'me'}
    ],
    lifestyle:[
      {name:'Caffeine',      detail:'Daily — 1 cup',          tag:'Low',      tc:'ok'},
      {name:'Alcohol',       detail:'Rarely',                  tag:'Low Risk', tc:'ok'},
      {name:'Nicotine',      detail:'None',                    tag:'Clear',    tc:'ok'},
      {name:'Exercise',      detail:'Regular — gym 4×/week',  tag:'Active',   tc:'ok'},
      {name:'Doctor Visits', detail:'As needed',               tag:'Monitored',tc:'me'}
    ],
    femaleSpecific:[],
    medicationDetail:{
      active:[
        {name:'Escitalopram 5mg', class:'SSRI', frequency:'Once daily · morning',
         prescribedBy:'Dr. Ibrahim', since:'Jun 2023', adherence:97, missedLast30:1,
         lastTaken:'Today, 9:00 AM', notes:'Low-dose — good response to CBT combination',
         dots:[2,2,2,2,2,2,2,2,2,2,2,2,2,1]}
      ],
      past:[]
    }
  },

  layla: {
    init:'LB', name:'Layla Bakr', meta:'61 yrs · Female · A- · Post-MI · Atrial Fibrillation',
    risk:'me', rl:'Medium', rc:'var(--warning)', bg:'rgba(251,191,36,0.15)',
    gender:'female', age:61, sex:'Female', blood:'A-',
    height:'158cm', weight:'71kg', healthScore:69, baselineScore:58, dataWindow:'7d',
    sleep:'Fair', caffeine:'Occasionally', alcohol:'None', nicotine:'None',
    doctorVisits:'Monthly', hospitalizations:'2 · Surgeries 1',
    vitals:{
      hr:      {val:'88',  unit:'bpm',   trend:'↑ Elevated — AFib rate',            tc:'e', bars:[76,78,80,82,84,86,88]},
      spo2:    {val:'95',  unit:'%',     trend:'→ Acceptable — monitor',             tc:'n', bars:[96,96,96,95,95,95,95]},
      bp:      {val:'134/82',            trend:'↑ Elevated — post-cardiac',          tc:'e', bars:[72,74,76,78,79,81,82]},
      sleep:   {val:'61',  unit:'/100',  trend:'→ Below average',                    tc:'n', bars:[66,65,64,63,62,62,61]},
      glucose: {val:'108', unit:'mg/dL', trend:'→ Normal — slight elevation',        tc:'n', bars:[100,102,104,106,106,107,108]},
      stress:  {val:'64',  unit:'/100',  trend:'↑ Moderate-high — post-cardiac',    tc:'e', bars:[48,50,54,57,60,62,64]},
      hrv:     {val:'29',  unit:'ms',    trend:'↓ Reduced — AFib effect',           tc:'e', bars:[40,38,36,34,32,30,29]},
      rem:     {val:'50',  unit:'min',   trend:'→ Below average REM',               tc:'n', bars:[58,56,54,52,52,51,50]},
      recovery:{val:'58',  unit:'/100',  trend:'→ Below average — cardiac rehab',   tc:'n', bars:[62,61,61,60,59,59,58]},
      temp:    {val:'99',  unit:'°F',    trend:'→ Normal',                           tc:'n', bars:[98,99,99,98,99,98,99]},
      steps:   {val:'3800',unit:'steps', trend:'↓ Limited — cardiac rehab',         tc:'e', bars:[4200,4100,4000,3950,3900,3850,3800]},
      calories:{val:'260', unit:'kcal',  trend:'→ Moderate — rehab guided',         tc:'n', bars:[290,280,275,270,267,263,260]}
    },
    vitalHistory:{
      hr:      {daily:gen(501,74,88,30,4),  hourly:gen(502,86,91,24,3)},
      spo2:    {daily:gen(503,96,95,30,1),  hourly:gen(504,94,96,24,1)},
      bp:      {daily:gen(505,74,82,30,3),  hourly:gen(506,80,85,24,2)},
      sleep:   {daily:gen(507,66,61,30,3),  hourly:gen(508,60,63,24,2)},
      glucose: {daily:gen(509,98,108,30,4), hourly:gen(510,106,110,24,3)},
      stress:  {daily:gen(511,48,64,30,4),  hourly:gen(512,62,67,24,2)},
      hrv:     {daily:gen(513,40,29,30,2),  hourly:gen(514,28,31,24,2)},
      rem:     {daily:gen(515,58,50,30,4),  hourly:gen(516,49,52,24,2)},
      recovery:{daily:gen(517,62,58,30,3),  hourly:gen(518,57,60,24,2)},
      temp:    {daily:gen(761,98,99,30,1),   hourly:gen(762,98,100,24,1)},
      steps:   {daily:gen(763,4200,3800,30,250), hourly:gen(764,90,380,24,90)},
      calories:{daily:gen(765,290,260,30,20), hourly:gen(766,8,28,24,6)}
    },
    conditions:['Post-MI (3 months)','Atrial Fibrillation'],
    medications:['Warfarin 5mg','Bisoprolol 5mg','Ramipril 5mg','Aspirin 75mg'],
    allergies:['Ibuprofen','NSAIDs'],
    familyRisk:['Heart Disease ↗','AFib ↗'],
    summaryDoc:'A 61-year-old female, 3 months post-myocardial infarction, managed for Atrial Fibrillation. HR elevated at 88 bpm consistent with AFib rate control on Bisoprolol. BP 134/82 mmHg. HRV significantly reduced at 29ms — expected in AFib. SpO2 stable at 95%. Sleep quality below average (61/100) and stress elevated (64/100), likely post-cardiac anxiety. Cardiac rehabilitation ongoing. INR monitoring required monthly for Warfarin.',
    summaryPat:'You are recovering from your heart attack and managing your irregular heartbeat. Your heart rate is slightly high which is normal with your condition. Your oxygen levels are stable. Stress and sleep are areas to focus on — stress affects heart recovery. Continue your rehabilitation and take all medications as prescribed.',
    summaryConf:'High', summaryBadge:'h',
    findings:[
      {sev:'m', txt:'HR 88 — elevated, AFib rate management ongoing', src:'vitals · watch'},
      {sev:'m', txt:'HRV 29ms — reduced due to AFib',                 src:'vitals · watch'},
      {sev:'m', txt:'BP 134/82 — post-cardiac elevation',             src:'vitals · manual'},
      {sev:'l', txt:'Stress 64/100 — post-cardiac anxiety likely',    src:'vitals · watch'},
      {sev:'l', txt:'INR monitoring required — Warfarin ongoing',     src:'clinical'}
    ],
    labs:[{
      name:'Cardiac & Coagulation Panel', date:'April 28, 2026 · HeartCare Institute · Dr. Ibrahim',
      status:'2 Flagged', statusCls:'f',
      rows:[
        {test:'INR',        val:'2.4',        ref:'2.0–3.0 (therapeutic)', flag:'NORMAL'},
        {test:'BNP',        val:'186 pg/mL',  ref:'< 100',                 flag:'HIGH'},
        {test:'Troponin I', val:'0.02 ng/mL', ref:'< 0.04',               flag:'NORMAL'},
        {test:'CK-MB',      val:'4.1 ng/mL',  ref:'< 3.6',               flag:'HIGH'}
      ]
    }],
    medHistory:[
      {name:'Myocardial Infarction', detail:'Jan 28, 2026 · STEMI · Stented LAD', tag:'Recent',  tc:'al'},
      {name:'Atrial Fibrillation',   detail:'Chronic — rate controlled',            tag:'Chronic', tc:'me'},
      {name:'Hypertension',          detail:'Pre-existing · Now managed',            tag:'Managed', tc:'me'}
    ],
    famHistory:[
      {name:'Father', detail:'MI at 64 · Fatal cardiac event',        tag:'High Risk', tc:'al'},
      {name:'Sister', detail:'AFib — on anticoagulation',             tag:'Genetic',   tc:'me'}
    ],
    lifestyle:[
      {name:'Caffeine',      detail:'Occasionally — 1 cup',                        tag:'Low',       tc:'ok'},
      {name:'Alcohol',       detail:'None — stopped post-MI',                      tag:'Clear',     tc:'ok'},
      {name:'Nicotine',      detail:'None — quit 10 years ago',                    tag:'Clear',     tc:'ok'},
      {name:'Exercise',      detail:'Cardiac rehab — 3×/week supervised',          tag:'Monitored', tc:'me'},
      {name:'Doctor Visits', detail:'Monthly — cardiac follow-up, INR monitoring', tag:'Compliant', tc:'ok'}
    ],
    femaleSpecific:[
      {name:'Menopause',   detail:'Post-menopausal since 2018',       tag:'Post-menopausal', tc:'me'},
      {name:'Mammography', detail:'Last screening Feb 2026 — Normal', tag:'Up to date',      tc:'ok'}
    ],
    medicationDetail:{
      active:[
        {name:'Warfarin 5mg', class:'Anticoagulant', frequency:'Once daily · fixed time',
         prescribedBy:'Dr. Ibrahim', since:'Feb 2026', adherence:98, missedLast30:0,
         lastTaken:'Today, 8:00 AM', notes:'INR target 2.0–3.0 · monthly check',
         dots:[2,2,2,2,2,2,2,2,2,2,2,2,2,2]},
        {name:'Bisoprolol 5mg', class:'Beta-Blocker', frequency:'Once daily · morning',
         prescribedBy:'Dr. Ibrahim', since:'Jan 2026', adherence:99, missedLast30:0,
         lastTaken:'Today, 8:00 AM', notes:'Rate control for AFib — HR target < 80 bpm',
         dots:[2,2,2,2,2,2,2,2,2,2,2,2,2,2]},
        {name:'Ramipril 5mg', class:'ACE Inhibitor', frequency:'Once daily · evening',
         prescribedBy:'Dr. Ibrahim', since:'Jan 2026', adherence:96, missedLast30:1,
         lastTaken:'Yesterday, 9:00 PM', notes:'Post-MI cardioprotection',
         dots:[2,2,2,2,2,2,2,2,2,2,2,2,2,1]},
        {name:'Aspirin 75mg', class:'Antiplatelet', frequency:'Once daily · morning',
         prescribedBy:'Dr. Ibrahim', since:'Jan 2026', adherence:100, missedLast30:0,
         lastTaken:'Today, 8:00 AM', notes:'Post-MI secondary prevention',
         dots:[2,2,2,2,2,2,2,2,2,2,2,2,2,2]}
      ],
      past:[
        {name:'Clopidogrel 75mg', class:'Antiplatelet', stoppedDate:'April 2026',
         reason:'Dual antiplatelet therapy completed post-stent'}
      ]
    }
  },

  hasan: {
    init:'HY', name:'Hassan Yousuf', meta:'38 yrs · Male · O+ · Chronic Kidney Disease · Hypertension',
    risk:'cr', rl:'Critical', rc:'var(--danger)', bg:'rgba(251,113,133,0.2)',
    gender:'male', age:38, sex:'Male', blood:'O+',
    height:'170cm', weight:'87kg', healthScore:51, baselineScore:39, dataWindow:'7d',
    sleep:'Poor', caffeine:'Daily', alcohol:'Rarely', nicotine:'Occasional',
    doctorVisits:'Monthly', hospitalizations:'3 · Surgeries 0',
    vitals:{
      hr:      {val:'109', unit:'bpm',   trend:'↑ Critical tachycardia',           tc:'c', bars:[92,96,100,104,106,108,109]},
      spo2:    {val:'87',  unit:'%',     trend:'↓ Critical hypoxia',               tc:'c', bars:[96,95,93,91,90,89,87]},
      bp:      {val:'165/102',           trend:'↑ Stage 2 Hypertension',           tc:'c', bars:[60,68,75,82,88,95,102]},
      sleep:   {val:'44',  unit:'/100',  trend:'↓ Very poor recovery',             tc:'c', bars:[65,60,56,52,49,46,44]},
      glucose: {val:'142', unit:'mg/dL', trend:'↑ Elevated — stress response',     tc:'e', bars:[98,106,112,118,124,132,142]},
      stress:  {val:'79',  unit:'/100',  trend:'↑ Critically high',                tc:'c', bars:[52,58,63,67,72,76,79]},
      hrv:     {val:'17',  unit:'ms',    trend:'↓ Severely reduced',               tc:'c', bars:[34,30,26,24,21,19,17]},
      rem:     {val:'31',  unit:'min',   trend:'↓ Very low REM sleep',             tc:'c', bars:[58,53,47,42,38,35,31]},
      recovery:{val:'31',  unit:'/100',  trend:'↓ Critical recovery',              tc:'c', bars:[58,52,46,41,37,34,31]},
      temp:    {val:'100', unit:'°F',    trend:'↑ Elevated — inflammatory',        tc:'c', bars:[99,99,100,100,100,100,100]},
      steps:   {val:'1500',unit:'steps', trend:'↓ Critically low activity',        tc:'c', bars:[2200,2000,1900,1800,1700,1600,1500]},
      calories:{val:'98',  unit:'kcal',  trend:'↓ Minimal activity',               tc:'c', bars:[150,140,130,120,110,104,98]}
    },
    vitalHistory:{
      hr:      {daily:gen(521,84,109,30,5),   hourly:gen(522,106,112,24,3)},
      spo2:    {daily:gen(523,96,87,30,2),    hourly:gen(524,86,89,24,1)},
      bp:      {daily:gen(525,82,102,30,4),   hourly:gen(526,100,105,24,3)},
      sleep:   {daily:gen(527,68,44,30,4),    hourly:gen(528,42,47,24,2)},
      glucose: {daily:gen(529,110,142,30,6),  hourly:gen(530,138,146,24,4)},
      stress:  {daily:gen(531,52,79,30,4),    hourly:gen(532,77,82,24,2)},
      hrv:     {daily:gen(533,34,17,30,2),    hourly:gen(534,16,19,24,1)},
      rem:     {daily:gen(535,58,31,30,4),    hourly:gen(536,30,33,24,2)},
      recovery:{daily:gen(537,58,31,30,4),    hourly:gen(538,30,33,24,2)},
      temp:    {daily:gen(771,98,100,30,1),    hourly:gen(772,99,101,24,1)},
      steps:   {daily:gen(773,2200,1500,30,200), hourly:gen(774,40,200,24,60)},
      calories:{daily:gen(775,150,98,30,15),   hourly:gen(776,3,14,24,4)}
    },
    conditions:['Chronic Kidney Disease (Stage 3B)','Hypertension Stage 2'],
    medications:['Amlodipine 10mg','Furosemide 40mg','Erythropoietin 4000IU'],
    allergies:['ACE Inhibitors'],
    familyRisk:['CKD ↗','Hypertension ↗','Diabetes ↗'],
    summaryDoc:'A 38-year-old male with Chronic Kidney Disease Stage 3B and uncontrolled Stage 2 Hypertension. SpO2 critically low at 87%, HR 109 bpm (tachycardia), BP 165/102 mmHg despite Amlodipine 10mg. HRV 17ms and recovery score 31/100 indicate severe physiological stress. Sleep quality critically poor (44/100). eGFR estimated at 32 mL/min — continued decline warrants nephrology review. Immediate blood pressure management and urgent cardio-renal assessment required.',
    summaryPat:'Your oxygen levels are dangerously low and your blood pressure is very high. Your kidneys are under significant stress. You need urgent medical attention — please contact your doctor or go to the emergency department if you feel chest pain, shortness of breath, or severe headache.',
    summaryConf:'High', summaryBadge:'h',
    findings:[
      {sev:'h', txt:'SpO2 87% — critical, immediate review needed',  src:'vitals · watch'},
      {sev:'h', txt:'BP 165/102 — Stage 2, poorly controlled',       src:'vitals · manual'},
      {sev:'h', txt:'HR 109 — tachycardia, linked to CKD burden',    src:'vitals · watch'},
      {sev:'m', txt:'HRV 17ms — severely reduced autonomic function',src:'vitals · watch'},
      {sev:'m', txt:'Glucose 142 — elevated, stress-related',        src:'vitals · manual'}
    ],
    labs:[{
      name:'Renal Function Panel', date:'April 30, 2026 · NephroPath Labs · Dr. Ibrahim',
      status:'3 Critical', statusCls:'f',
      rows:[
        {test:'Creatinine',  val:'2.84 mg/dL', ref:'0.7–1.3',   flag:'CRITICAL'},
        {test:'eGFR',        val:'28 mL/min',  ref:'> 60',       flag:'CRITICAL'},
        {test:'BUN',         val:'42 mg/dL',   ref:'7–25',       flag:'CRITICAL'},
        {test:'Potassium',   val:'5.2 mEq/L',  ref:'3.5–5.0',   flag:'HIGH'},
        {test:'Hemoglobin',  val:'9.8 g/dL',   ref:'13.0–17.0', flag:'HIGH'}
      ]
    }],
    medHistory:[
      {name:'CKD Stage 3B',         detail:'Diagnosed 2021 · Declining eGFR trend', tag:'Progressive', tc:'al'},
      {name:'Hypertension Stage 2', detail:'Poorly controlled — escalating therapy', tag:'Uncontrolled',tc:'al'},
      {name:'Renal Anaemia',        detail:'Managed with Erythropoietin',            tag:'Managed',     tc:'me'}
    ],
    famHistory:[
      {name:'Father', detail:'CKD · Dialysis since 2018',      tag:'High Risk', tc:'al'},
      {name:'Mother', detail:'Hypertension · Diabetes Type 2', tag:'Risk',      tc:'me'}
    ],
    lifestyle:[
      {name:'Caffeine',      detail:'Daily — 3 cups',                         tag:'Moderate',  tc:'me'},
      {name:'Alcohol',       detail:'Rarely',                                  tag:'Low Risk',  tc:'ok'},
      {name:'Nicotine',      detail:'Occasional — 3–4/week',                  tag:'Risk',      tc:'al'},
      {name:'Diet',          detail:'High sodium — poor compliance with renal diet', tag:'High Risk', tc:'al'},
      {name:'Doctor Visits', detail:'Monthly — nephrology + cardiology',       tag:'Compliant', tc:'ok'}
    ],
    femaleSpecific:[],
    medicationDetail:{
      active:[
        {name:'Amlodipine 10mg', class:'Calcium Channel Blocker', frequency:'Once daily · morning',
         prescribedBy:'Dr. Ibrahim', since:'Feb 2022', adherence:88, missedLast30:4,
         lastTaken:'Today, 8:00 AM', notes:'BP still inadequately controlled — review dose',
         dots:[2,2,2,2,2,1,2,2,2,2,0,2,2,1]},
        {name:'Furosemide 40mg', class:'Loop Diuretic', frequency:'Once daily · morning',
         prescribedBy:'Dr. Ibrahim', since:'Jan 2023', adherence:85, missedLast30:4,
         lastTaken:'Today, 8:00 AM', notes:'Fluid overload management',
         dots:[2,2,2,1,2,2,2,2,0,2,2,2,1,2]},
        {name:'Erythropoietin 4000 IU', class:'ESA', frequency:'Subcutaneous · 3×/week',
         prescribedBy:'Dr. Ibrahim', since:'Jun 2023', adherence:91, missedLast30:3,
         lastTaken:'Yesterday', notes:'Renal anaemia — Hb target 10–12 g/dL',
         dots:[2,0,2,2,0,2,2,0,2,2,0,2,2,0]}
      ],
      past:[]
    }
  },

  amina: {
    init:'AS', name:'Amina Siddiqui', meta:'45 yrs · Female · AB- · PCOS · Hypothyroidism',
    risk:'me', rl:'Medium', rc:'var(--warning)', bg:'rgba(251,191,36,0.15)',
    gender:'female', age:45, sex:'Female', blood:'AB-',
    height:'163cm', weight:'78kg', healthScore:67, baselineScore:60, dataWindow:'7d',
    sleep:'Fair', caffeine:'Daily', alcohol:'None', nicotine:'None',
    doctorVisits:'Quarterly', hospitalizations:'0 · Surgeries 1',
    vitals:{
      hr:      {val:'79',  unit:'bpm',   trend:'↑ Mildly elevated at rest',        tc:'e', bars:[72,73,74,75,76,77,79]},
      spo2:    {val:'96',  unit:'%',     trend:'→ Normal range',                   tc:'n', bars:[97,97,97,96,96,97,96]},
      bp:      {val:'130/82',            trend:'↑ High normal',                    tc:'e', bars:[72,74,76,77,79,80,82]},
      sleep:   {val:'58',  unit:'/100',  trend:'→ Below average',                  tc:'n', bars:[64,62,61,60,59,58,58]},
      glucose: {val:'106', unit:'mg/dL', trend:'→ Mildly elevated — IR pattern',  tc:'n', bars:[94,96,98,100,102,104,106]},
      stress:  {val:'62',  unit:'/100',  trend:'↑ Moderate-high chronic stress',   tc:'e', bars:[44,48,52,55,58,60,62]},
      hrv:     {val:'41',  unit:'ms',    trend:'→ Low-normal',                     tc:'n', bars:[46,45,44,43,43,42,41]},
      rem:     {val:'54',  unit:'min',   trend:'→ Below average',                  tc:'n', bars:[60,58,57,56,55,55,54]},
      recovery:{val:'61',  unit:'/100',  trend:'→ Below average',                  tc:'n', bars:[66,65,64,63,62,62,61]},
      temp:    {val:'97',  unit:'°F',    trend:'↓ Below normal — hypothyroid',     tc:'e', bars:[98,97,97,97,97,97,97]},
      steps:   {val:'5500',unit:'steps', trend:'→ Moderate activity',              tc:'n', bars:[5000,5100,5200,5300,5400,5450,5500]},
      calories:{val:'310', unit:'kcal',  trend:'→ Moderate',                       tc:'n', bars:[280,290,295,300,305,308,310]}
    },
    vitalHistory:{
      hr:      {daily:gen(541,70,79,30,3),  hourly:gen(542,77,81,24,2)},
      spo2:    {daily:gen(543,97,96,30,1),  hourly:gen(544,95,97,24,1)},
      bp:      {daily:gen(545,72,82,30,3),  hourly:gen(546,80,85,24,2)},
      sleep:   {daily:gen(547,64,58,30,3),  hourly:gen(548,57,60,24,2)},
      glucose: {daily:gen(549,93,106,30,4), hourly:gen(550,103,109,24,3)},
      stress:  {daily:gen(551,44,62,30,4),  hourly:gen(552,60,65,24,2)},
      hrv:     {daily:gen(553,46,41,30,2),  hourly:gen(554,40,43,24,2)},
      rem:     {daily:gen(555,60,54,30,3),  hourly:gen(556,53,56,24,2)},
      recovery:{daily:gen(557,66,61,30,3),  hourly:gen(558,60,63,24,2)},
      temp:    {daily:gen(781,98,97,30,1),   hourly:gen(782,96,98,24,1)},
      steps:   {daily:gen(783,5000,5500,30,300), hourly:gen(784,100,540,24,110)},
      calories:{daily:gen(785,280,310,30,20), hourly:gen(786,9,32,24,7)}
    },
    conditions:['PCOS','Hypothyroidism','Insulin Resistance'],
    medications:['Levothyroxine 75mcg','Metformin 500mg','Vitamin D3'],
    allergies:['None known'],
    familyRisk:['Thyroid Disease ↗','Diabetes ↗'],
    summaryDoc:'A 45-year-old female with Polycystic Ovary Syndrome, Hypothyroidism (TSH controlled on Levothyroxine), and mild Insulin Resistance. HR mildly elevated at 79 bpm. BP 130/82 mmHg (high normal). Fasting glucose 106 mg/dL — consistent with insulin resistance. Stress levels elevated at 62/100; sleep quality below average at 58/100. HRV trending down (41ms). Weight management and regular physical activity remain key pillars of management alongside thyroid monitoring.',
    summaryPat:'Your thyroid is being managed with medication. Your blood sugar is slightly high — this is related to your PCOS and is something to watch carefully. Your stress levels are a bit high and your sleep could be better, both of which affect your hormones. Continue your medications and try to include light exercise regularly.',
    summaryConf:'High', summaryBadge:'h',
    findings:[
      {sev:'m', txt:'Glucose 106 — insulin resistance pattern',    src:'vitals · manual'},
      {sev:'m', txt:'Stress 62/100 — elevated, hormonal link',     src:'vitals · watch'},
      {sev:'l', txt:'BP 130/82 — high normal, monitor',           src:'vitals · manual'},
      {sev:'l', txt:'HR 79 — mildly elevated',                    src:'vitals · watch'},
      {sev:'l', txt:'HRV declining — early autonomic signal',     src:'vitals · watch'}
    ],
    labs:[{
      name:'Thyroid & Hormonal Panel', date:'March 20, 2026 · HormoneFirst Labs · Dr. Ibrahim',
      status:'2 Flagged', statusCls:'f',
      rows:[
        {test:'TSH',          val:'4.8 mIU/L',  ref:'0.4–4.0',  flag:'HIGH'},
        {test:'Free T4',      val:'0.9 ng/dL',  ref:'0.8–1.8',  flag:'NORMAL'},
        {test:'Testosterone', val:'68 ng/dL',   ref:'< 60 (F)', flag:'HIGH'},
        {test:'Fasting Insulin',val:'18 µIU/mL',ref:'2–25',     flag:'NORMAL'},
        {test:'HbA1c',        val:'5.8%',       ref:'< 5.7',    flag:'NORMAL'}
      ]
    }],
    medHistory:[
      {name:'Hypothyroidism', detail:'Diagnosed 2018 · Levothyroxine — TSH borderline high', tag:'Managed',tc:'me'},
      {name:'PCOS',           detail:'Diagnosed 2015 · Managed hormonally',                   tag:'Chronic',tc:'me'},
      {name:'Insulin Resistance',detail:'Pre-diabetic marker — dietary management',            tag:'Monitor',tc:'al'}
    ],
    famHistory:[
      {name:'Mother', detail:'Hypothyroidism · Type 2 Diabetes', tag:'Genetic Risk', tc:'me'}
    ],
    lifestyle:[
      {name:'Caffeine',      detail:'Daily — 2 cups',                           tag:'Moderate',  tc:'me'},
      {name:'Alcohol',       detail:'None',                                     tag:'Clear',     tc:'ok'},
      {name:'Nicotine',      detail:'None',                                     tag:'Clear',     tc:'ok'},
      {name:'Exercise',      detail:'Moderate — walks + yoga 3×/week',          tag:'Active',    tc:'ok'},
      {name:'Doctor Visits', detail:'Quarterly — thyroid and hormonal panels',  tag:'Compliant', tc:'ok'}
    ],
    femaleSpecific:[
      {name:'Menstrual Cycle', detail:'Irregular — PCOS-related, 45–60 day cycles', tag:'Irregular', tc:'al'},
      {name:'Mammography',     detail:'Not due — screening starts at 50',            tag:'Not Due',   tc:'me'},
      {name:'Pregnancy',       detail:'Not pregnant — on contraception',             tag:'N/A',       tc:'me'}
    ],
    medicationDetail:{
      active:[
        {name:'Levothyroxine 75mcg', class:'Thyroid Hormone', frequency:'Once daily · fasting',
         prescribedBy:'Dr. Ibrahim', since:'Jan 2019', adherence:93, missedLast30:2,
         lastTaken:'Today, 7:00 AM', notes:'Take 30 min before food — TSH borderline, review dose',
         dots:[2,2,2,2,2,2,2,2,1,2,2,2,2,1]},
        {name:'Metformin 500mg', class:'Biguanide', frequency:'Once daily · with dinner',
         prescribedBy:'Dr. Ibrahim', since:'Sep 2024', adherence:88, missedLast30:4,
         lastTaken:'Yesterday, 7:00 PM', notes:'Insulin sensitiser for PCOS + insulin resistance',
         dots:[2,2,1,2,2,2,2,1,2,2,2,1,2,2]},
        {name:'Vitamin D3 2000 IU', class:'Supplement', frequency:'Once daily',
         prescribedBy:'Dr. Ibrahim', since:'Mar 2025', adherence:81, missedLast30:5,
         lastTaken:'Yesterday', notes:'Deficiency common in hypothyroidism + PCOS',
         dots:[2,0,2,2,1,2,2,0,2,2,1,2,0,2]}
      ],
      past:[]
    }
  },

  tariq: {
    init:'TN', name:'Tariq Nadeem', meta:'68 yrs · Male · B- · COPD · Chronic Heart Failure',
    risk:'hi', rl:'High', rc:'var(--danger)', bg:'rgba(251,113,133,0.12)',
    gender:'male', age:68, sex:'Male', blood:'B-',
    height:'168cm', weight:'81kg', healthScore:57, baselineScore:46, dataWindow:'7d',
    sleep:'Poor', caffeine:'Occasionally', alcohol:'None', nicotine:'None',
    doctorVisits:'Monthly', hospitalizations:'5 · Surgeries 1',
    vitals:{
      hr:      {val:'93',  unit:'bpm',   trend:'↑ Elevated — CHF related',          tc:'e', bars:[80,83,86,88,90,91,93]},
      spo2:    {val:'91',  unit:'%',     trend:'↓ Below optimal — COPD baseline',   tc:'e', bars:[96,95,94,93,92,91,91]},
      bp:      {val:'143/89',            trend:'↑ Elevated — cardiac loading',      tc:'e', bars:[72,75,78,81,83,86,89]},
      sleep:   {val:'43',  unit:'/100',  trend:'↓ Poor — nocturnal desaturation',   tc:'e', bars:[58,55,52,49,47,45,43]},
      glucose: {val:'118', unit:'mg/dL', trend:'→ Normal — slight post-meal rise',  tc:'n', bars:[98,102,106,110,113,115,118]},
      stress:  {val:'72',  unit:'/100',  trend:'↑ High chronic burden',             tc:'e', bars:[48,53,58,62,66,69,72]},
      hrv:     {val:'16',  unit:'ms',    trend:'↓ Critical — severe CHF marker',    tc:'c', bars:[28,25,22,20,19,17,16]},
      rem:     {val:'38',  unit:'min',   trend:'↓ Reduced REM',                     tc:'e', bars:[54,51,48,45,43,40,38]},
      recovery:{val:'34',  unit:'/100',  trend:'↓ Very poor recovery',              tc:'e', bars:[50,47,44,41,39,36,34]},
      temp:    {val:'99',  unit:'°F',    trend:'↑ Mildly elevated — COPD/CHF',     tc:'e', bars:[98,99,99,99,100,99,99]},
      steps:   {val:'1200',unit:'steps', trend:'↓ Severely limited — COPD',        tc:'c', bars:[1600,1500,1400,1350,1300,1250,1200]},
      calories:{val:'85',  unit:'kcal',  trend:'↓ Exercise intolerant',             tc:'c', bars:[120,110,100,95,90,88,85]}
    },
    vitalHistory:{
      hr:      {daily:gen(561,78,93,30,4),  hourly:gen(562,91,96,24,3)},
      spo2:    {daily:gen(563,96,91,30,2),  hourly:gen(564,90,92,24,1)},
      bp:      {daily:gen(565,74,89,30,3),  hourly:gen(566,87,92,24,2)},
      sleep:   {daily:gen(567,58,43,30,4),  hourly:gen(568,42,45,24,2)},
      glucose: {daily:gen(569,98,118,30,5), hourly:gen(570,115,121,24,3)},
      stress:  {daily:gen(571,48,72,30,4),  hourly:gen(572,70,75,24,2)},
      hrv:     {daily:gen(573,28,16,30,2),  hourly:gen(574,15,18,24,1)},
      rem:     {daily:gen(575,54,38,30,4),  hourly:gen(576,37,40,24,2)},
      recovery:{daily:gen(577,50,34,30,4),  hourly:gen(578,33,36,24,2)},
      temp:    {daily:gen(791,98,99,30,1),   hourly:gen(792,98,100,24,1)},
      steps:   {daily:gen(793,1600,1200,30,150), hourly:gen(794,20,160,24,40)},
      calories:{daily:gen(795,120,85,30,12),  hourly:gen(796,2,12,24,3)}
    },
    conditions:['COPD (Stage 2)','Chronic Heart Failure (EF 38%)'],
    medications:['Tiotropium 18mcg','Salbutamol inhaler PRN','Carvedilol 6.25mg','Furosemide 40mg','Spironolactone 25mg'],
    allergies:['Aspirin','NSAIDs'],
    familyRisk:['Heart Disease ↗','COPD ↗'],
    summaryDoc:'A 68-year-old male with COPD Stage 2 and Chronic Heart Failure (EF 38%). SpO2 chronically suppressed at 91% — consistent with COPD baseline. HR elevated at 93 bpm; BP 143/89 mmHg. HRV critically low at 16ms — severe indicator of cardiac autonomic dysfunction. Sleep quality poor at 43/100 with likely nocturnal desaturation. Recovery score 34/100. Pulmonology review for COPD optimisation and cardiology reassessment of HF medications recommended. 6-minute walk test pending.',
    summaryPat:'Your heart and lungs are both under strain. Your oxygen levels are lower than ideal and your heart rate is a bit high. Your sleep quality is poor, which is partly due to your breathing condition at night. Please continue all medications and use your inhaler as directed. Avoid exertion and contact your doctor if you feel any worsening breathlessness.',
    summaryConf:'High', summaryBadge:'h',
    findings:[
      {sev:'h', txt:'HRV 16ms — critical cardiac autonomic dysfunction', src:'vitals · watch'},
      {sev:'h', txt:'SpO2 91% — COPD baseline, nocturnal risk',         src:'vitals · watch'},
      {sev:'m', txt:'HR 93 — elevated, CHF rate response',              src:'vitals · watch'},
      {sev:'m', txt:'BP 143/89 — elevated, cardiac loading',            src:'vitals · manual'},
      {sev:'m', txt:'Sleep 43/100 — poor, nocturnal desaturation likely', src:'vitals · watch'}
    ],
    labs:[{
      name:'Cardiac & Pulmonary Panel', date:'May 2, 2026 · Cardio Diagnostics · Dr. Ibrahim',
      status:'3 Flagged', statusCls:'f',
      rows:[
        {test:'BNP',         val:'412 pg/mL', ref:'< 100',         flag:'CRITICAL'},
        {test:'Troponin I',  val:'0.06 ng/mL',ref:'< 0.04',        flag:'HIGH'},
        {test:'FEV1/FVC',    val:'0.64',      ref:'> 0.70 (normal)',flag:'HIGH'},
        {test:'Hemoglobin',  val:'11.2 g/dL', ref:'13.0–17.0',     flag:'HIGH'},
        {test:'Creatinine',  val:'1.18 mg/dL',ref:'0.7–1.3',       flag:'NORMAL'}
      ]
    }],
    medHistory:[
      {name:'COPD Stage 2',         detail:'Diagnosed 2018 · Ex-smoker 20 pack-year history',  tag:'Chronic',  tc:'me'},
      {name:'Chronic Heart Failure',detail:'EF 38% · Diagnosed 2022 · Multiple hospitalisations', tag:'Severe', tc:'al'},
      {name:'Previous MI',          detail:'2019 · Treated medically, no intervention',           tag:'History', tc:'me'}
    ],
    famHistory:[
      {name:'Father', detail:'Died of MI at 70',               tag:'High Risk', tc:'al'},
      {name:'Brother',detail:'COPD · O2-dependent since 2023', tag:'Genetic',   tc:'me'}
    ],
    lifestyle:[
      {name:'Caffeine',      detail:'Occasionally — 1 cup',                         tag:'Low',       tc:'ok'},
      {name:'Alcohol',       detail:'None — stopped 2019',                          tag:'Clear',     tc:'ok'},
      {name:'Nicotine',      detail:'None — quit 2015 · 20 pack-year history',      tag:'Ex-smoker', tc:'me'},
      {name:'Exercise',      detail:'Very limited — dyspnoea on exertion',           tag:'Restricted',tc:'al'},
      {name:'Doctor Visits', detail:'Monthly — pulmonology + cardiology',            tag:'Compliant', tc:'ok'}
    ],
    femaleSpecific:[],
    medicationDetail:{
      active:[
        {name:'Tiotropium 18mcg', class:'LAMA Bronchodilator', frequency:'Once daily · inhaler',
         prescribedBy:'Dr. Ibrahim', since:'Mar 2019', adherence:94, missedLast30:2,
         lastTaken:'Today, 8:00 AM', notes:'COPD maintenance — do not use as rescue',
         dots:[2,2,2,2,2,2,2,2,2,1,2,2,2,2]},
        {name:'Salbutamol 100mcg', class:'SABA Bronchodilator', frequency:'PRN · rescue inhaler',
         prescribedBy:'Dr. Ibrahim', since:'Mar 2019', adherence:null, missedLast30:null,
         lastTaken:'3 days ago', notes:'Use only for acute breathlessness',
         dots:[0,0,0,0,0,0,0,0,0,0,0,2,0,0]},
        {name:'Carvedilol 6.25mg', class:'Beta-Blocker', frequency:'Twice daily',
         prescribedBy:'Dr. Ibrahim', since:'Jun 2022', adherence:97, missedLast30:1,
         lastTaken:'Today, 8:00 AM', notes:'CHF — titrate to HR 60–70 target',
         dots:[2,2,2,2,2,2,2,2,2,2,2,2,2,1]},
        {name:'Furosemide 40mg', class:'Loop Diuretic', frequency:'Once daily · morning',
         prescribedBy:'Dr. Ibrahim', since:'Jun 2022', adherence:95, missedLast30:2,
         lastTaken:'Today, 8:00 AM', notes:'Fluid overload control in CHF',
         dots:[2,2,2,2,2,2,2,2,2,2,1,2,2,2]},
        {name:'Spironolactone 25mg', class:'Aldosterone Antagonist', frequency:'Once daily',
         prescribedBy:'Dr. Ibrahim', since:'Aug 2022', adherence:93, missedLast30:2,
         lastTaken:'Today, 8:00 AM', notes:'HF with reduced EF — monitor K+',
         dots:[2,2,2,2,2,2,1,2,2,2,2,2,1,2]}
      ],
      past:[
        {name:'Ramipril 5mg', class:'ACE Inhibitor', stoppedDate:'June 2022',
         reason:'Replaced by Carvedilol following ACE inhibitor intolerance'}
      ]
    }
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
  {key:'hr',       label:'Heart Rate',     src:'watch',  unit:'bpm',   min:40,  max:130},
  {key:'spo2',     label:'SpO2',           src:'watch',  unit:'%',     min:80,  max:100},
  {key:'bp',       label:'Blood Pressure', src:'manual', unit:'mmHg',  min:60,  max:105},
  {key:'sleep',    label:'Sleep Score',    src:'watch',  unit:'/100',  min:0,   max:100},
  {key:'glucose',  label:'Blood Glucose',  src:'manual', unit:'mg/dL', min:60,  max:250},
  {key:'stress',   label:'Stress Score',   src:'watch',  unit:'/100',  min:0,   max:100},
  {key:'hrv',      label:'HRV RMSSD',      src:'watch',  unit:'ms',    min:5,   max:75},
  {key:'rem',      label:'Sleep REM',      src:'watch',  unit:'min',   min:0,   max:100},
  {key:'recovery', label:'Recovery Score', src:'watch',  unit:'/100',  min:0,   max:100},
  {key:'temp',     label:'Temperature',    src:'watch',  unit:'°F',    min:96,  max:103},
  {key:'steps',    label:'Daily Steps',    src:'watch',  unit:'steps', min:0,   max:15000},
  {key:'calories', label:'Active Cal.',    src:'watch',  unit:'kcal',  min:0,   max:600}
];

function mkBars(arr, tc) {
  return '<div class="mbar">' +
    arr.map((h, i) =>
      `<span style="height:${h}%" class="${i===arr.length-1?'bar-'+tc:''}"></span>`
    ).join('') + '</div>';
}

function mkTag(tag, tc) {
  return `<span class="tg ${tc}">${tag}</span>`;
}
