import type { Patient } from '@/types';

export const patients: Patient[] = [
  {
    id: 'p1',
    name: 'Maria Santos',
    age: 67,
    sex: 'F',
    condition: 'Acute Myocardial Infarction',
    status: 'critical',
    room: 'ICU-204',
    admitDate: '2024-01-15',
    riskScore: 78,
    aiSummary: 'Patient admitted with STEMI, underwent PCI with stent placement. Currently on anticoagulation therapy with close monitoring for bleeding complications.',
    vitals: {
      hr: 92,
      hrTrend: [88, 90, 92, 95, 92, 90, 92],
      bp: { sys: 142, dia: 88 },
      bpTrend: { sys: [138, 140, 142, 145, 142, 140, 142], dia: [85, 86, 88, 90, 88, 87, 88] },
      spo2: 96,
      spo2Trend: [95, 96, 96, 97, 96, 96, 96],
      temp: 37.2,
      tempTrend: [37.0, 37.1, 37.2, 37.3, 37.2, 37.1, 37.2],
      rr: 18,
      rrTrend: [16, 17, 18, 19, 18, 17, 18],
      lastUpdated: new Date().toISOString()
    },
    medications: [
      { id: 'm1', name: 'Aspirin', dose: '81mg', route: 'PO', frequency: 'Daily', status: 'active', startDate: '2024-01-15', prescriber: 'Dr. Chen' },
      { id: 'm2', name: 'Metoprolol', dose: '25mg', route: 'PO', frequency: 'BID', status: 'active', startDate: '2024-01-15', prescriber: 'Dr. Chen' },
      { id: 'm3', name: 'Heparin', dose: '5000 units', route: 'IV', frequency: 'Q8H', status: 'active', startDate: '2024-01-15', prescriber: 'Dr. Chen' },
      { id: 'm4', name: 'Atorvastatin', dose: '80mg', route: 'PO', frequency: 'Daily', status: 'active', startDate: '2024-01-15', prescriber: 'Dr. Chen' }
    ],
    labs: [
      { id: 'l1', name: 'Troponin I', value: 2.4, unit: 'ng/mL', reference: '<0.04', status: 'critical', date: '2024-01-16', trend: [0.8, 1.2, 1.8, 2.4] },
      { id: 'l2', name: 'BNP', value: 890, unit: 'pg/mL', reference: '<100', status: 'high', date: '2024-01-16', trend: [650, 720, 810, 890] },
      { id: 'l3', name: 'Creatinine', value: 1.4, unit: 'mg/dL', reference: '0.7-1.3', status: 'high', date: '2024-01-16' },
      { id: 'l4', name: 'Potassium', value: 4.2, unit: 'mEq/L', reference: '3.5-5.0', status: 'normal', date: '2024-01-16' }
    ],
    notes: [
      { id: 'n1', type: 'progress', author: 'Dr. Chen', role: 'Cardiologist', date: '2024-01-16 08:00', content: 'Patient stable overnight. Troponin trending up but expected post-PCI. Continue current management.' }
    ],
    timeline: [
      { id: 't1', type: 'admission', title: 'Admitted to ICU', description: 'STEMI with chest pain', date: '2024-01-15 14:30' },
      { id: 't2', type: 'procedure', title: 'PCI with Stent', description: 'LAD stent placement successful', date: '2024-01-15 16:45' }
    ]
  },
  {
    id: 'p2',
    name: 'James Wilson',
    age: 54,
    sex: 'M',
    condition: 'Diabetic Ketoacidosis',
    status: 'improving',
    room: 'ICU-208',
    admitDate: '2024-01-14',
    riskScore: 45,
    aiSummary: 'DKA resolving with insulin drip. Anion gap closing, glucose levels improving. Monitor for cerebral edema.',
    vitals: {
      hr: 78,
      hrTrend: [85, 82, 80, 78, 77, 78, 78],
      bp: { sys: 128, dia: 76 },
      bpTrend: { sys: [135, 132, 130, 128, 127, 128, 128], dia: [82, 80, 78, 76, 75, 76, 76] },
      spo2: 98,
      spo2Trend: [97, 97, 98, 98, 98, 98, 98],
      temp: 36.8,
      tempTrend: [37.2, 37.0, 36.9, 36.8, 36.8, 36.8, 36.8],
      rr: 16,
      rrTrend: [20, 18, 17, 16, 16, 16, 16],
      lastUpdated: new Date().toISOString()
    },
    medications: [
      { id: 'm5', name: 'Insulin Regular', dose: '0.1 units/kg/hr', route: 'IV', frequency: 'Continuous', status: 'active', startDate: '2024-01-14', prescriber: 'Dr. Patel' },
      { id: 'm6', name: 'Potassium Chloride', dose: '20 mEq', route: 'IV', frequency: 'Q4H', status: 'active', startDate: '2024-01-14', prescriber: 'Dr. Patel' },
      { id: 'm7', name: 'Normal Saline', dose: '250 mL/hr', route: 'IV', frequency: 'Continuous', status: 'active', startDate: '2024-01-14', prescriber: 'Dr. Patel' }
    ],
    labs: [
      { id: 'l5', name: 'Glucose', value: 245, unit: 'mg/dL', reference: '70-100', status: 'high', date: '2024-01-16', trend: [520, 380, 310, 245] },
      { id: 'l6', name: 'pH', value: 7.32, unit: '', reference: '7.35-7.45', status: 'low', date: '2024-01-16', trend: [7.18, 7.24, 7.28, 7.32] },
      { id: 'l7', name: 'Anion Gap', value: 14, unit: 'mEq/L', reference: '8-12', status: 'high', date: '2024-01-16', trend: [24, 20, 16, 14] },
      { id: 'l8', name: 'Bicarbonate', value: 18, unit: 'mEq/L', reference: '22-28', status: 'low', date: '2024-01-16', trend: [10, 13, 15, 18] }
    ],
    notes: [
      { id: 'n2', type: 'progress', author: 'Dr. Patel', role: 'Endocrinologist', date: '2024-01-16 07:30', content: 'DKA resolving. Anion gap 14, trending down. Plan to transition to SQ insulin when gap closes.' }
    ],
    timeline: [
      { id: 't3', type: 'admission', title: 'Admitted to ICU', description: 'DKA with glucose >500', date: '2024-01-14 22:15' },
      { id: 't4', type: 'lab', title: 'Critical Lab', description: 'Initial pH 7.18', date: '2024-01-14 22:30' }
    ]
  },
  {
    id: 'p3',
    name: 'Eleanor Hughes',
    age: 82,
    sex: 'F',
    condition: 'Pneumonia with Sepsis',
    status: 'stable',
    room: 'ICU-212',
    admitDate: '2024-01-13',
    riskScore: 62,
    aiSummary: 'Community-acquired pneumonia with sepsis. Responding to antibiotics. Weaning from supplemental oxygen.',
    vitals: {
      hr: 84,
      hrTrend: [95, 92, 88, 86, 84, 84, 84],
      bp: { sys: 118, dia: 72 },
      bpTrend: { sys: [105, 110, 115, 118, 118, 118, 118], dia: [65, 68, 70, 72, 72, 72, 72] },
      spo2: 94,
      spo2Trend: [90, 91, 92, 93, 94, 94, 94],
      temp: 37.8,
      tempTrend: [38.9, 38.5, 38.2, 37.9, 37.8, 37.8, 37.8],
      rr: 20,
      rrTrend: [24, 23, 22, 21, 20, 20, 20],
      lastUpdated: new Date().toISOString()
    },
    medications: [
      { id: 'm8', name: 'Ceftriaxone', dose: '2g', route: 'IV', frequency: 'Daily', status: 'active', startDate: '2024-01-13', prescriber: 'Dr. Kim' },
      { id: 'm9', name: 'Azithromycin', dose: '500mg', route: 'IV', frequency: 'Daily', status: 'active', startDate: '2024-01-13', prescriber: 'Dr. Kim' },
      { id: 'm10', name: 'Acetaminophen', dose: '650mg', route: 'PO', frequency: 'Q6H PRN', status: 'prn', startDate: '2024-01-13', prescriber: 'Dr. Kim' }
    ],
    labs: [
      { id: 'l9', name: 'WBC', value: 14.2, unit: 'K/uL', reference: '4.5-11.0', status: 'high', date: '2024-01-16', trend: [18.5, 16.8, 15.2, 14.2] },
      { id: 'l10', name: 'Procalcitonin', value: 1.8, unit: 'ng/mL', reference: '<0.1', status: 'high', date: '2024-01-16', trend: [8.2, 5.4, 3.1, 1.8] },
      { id: 'l11', name: 'Lactate', value: 1.4, unit: 'mmol/L', reference: '0.5-2.0', status: 'normal', date: '2024-01-16', trend: [4.2, 2.8, 1.9, 1.4] }
    ],
    notes: [
      { id: 'n3', type: 'progress', author: 'Dr. Kim', role: 'Pulmonologist', date: '2024-01-16 09:00', content: 'Sepsis resolving. Procalcitonin trending down. Continue antibiotics, wean O2 as tolerated.' }
    ],
    timeline: [
      { id: 't5', type: 'admission', title: 'Admitted to ICU', description: 'Sepsis secondary to pneumonia', date: '2024-01-13 11:20' }
    ]
  },
  {
    id: 'p4',
    name: 'Robert Chen',
    age: 71,
    sex: 'M',
    condition: 'Post-CABG Day 2',
    status: 'stable',
    room: 'CVICU-301',
    admitDate: '2024-01-14',
    riskScore: 35,
    aiSummary: 'Post-operative day 2 from 3-vessel CABG. Hemodynamically stable, extubated. Pain well controlled.',
    vitals: {
      hr: 72,
      hrTrend: [70, 71, 72, 73, 72, 72, 72],
      bp: { sys: 122, dia: 74 },
      bpTrend: { sys: [118, 120, 122, 124, 122, 122, 122], dia: [72, 73, 74, 75, 74, 74, 74] },
      spo2: 97,
      spo2Trend: [96, 97, 97, 97, 97, 97, 97],
      temp: 37.0,
      tempTrend: [36.8, 36.9, 37.0, 37.0, 37.0, 37.0, 37.0],
      rr: 14,
      rrTrend: [14, 14, 14, 15, 14, 14, 14],
      lastUpdated: new Date().toISOString()
    },
    medications: [
      { id: 'm11', name: 'Aspirin', dose: '325mg', route: 'PO', frequency: 'Daily', status: 'active', startDate: '2024-01-14', prescriber: 'Dr. Martinez' },
      { id: 'm12', name: 'Metoprolol', dose: '12.5mg', route: 'PO', frequency: 'BID', status: 'active', startDate: '2024-01-15', prescriber: 'Dr. Martinez' },
      { id: 'm13', name: 'Morphine', dose: '2mg', route: 'IV', frequency: 'Q4H PRN', status: 'prn', startDate: '2024-01-14', prescriber: 'Dr. Martinez' }
    ],
    labs: [
      { id: 'l12', name: 'Hemoglobin', value: 10.2, unit: 'g/dL', reference: '13.5-17.5', status: 'low', date: '2024-01-16' },
      { id: 'l13', name: 'Creatinine', value: 1.1, unit: 'mg/dL', reference: '0.7-1.3', status: 'normal', date: '2024-01-16' }
    ],
    notes: [
      { id: 'n4', type: 'progress', author: 'Dr. Martinez', role: 'Cardiac Surgeon', date: '2024-01-16 06:30', content: 'POD2, doing well. Chest tubes draining minimal. Plan for step-down transfer tomorrow.' }
    ],
    timeline: [
      { id: 't6', type: 'procedure', title: '3-Vessel CABG', description: 'LIMA-LAD, SVG-OM, SVG-RCA', date: '2024-01-14 08:00' }
    ]
  },
  {
    id: 'p5',
    name: 'Sarah Thompson',
    age: 45,
    sex: 'F',
    condition: 'Status Epilepticus',
    status: 'critical',
    room: 'NICU-105',
    admitDate: '2024-01-16',
    riskScore: 85,
    aiSummary: 'Refractory status epilepticus requiring continuous EEG monitoring and propofol infusion. Evaluate for underlying etiology.',
    vitals: {
      hr: 88,
      hrTrend: [95, 92, 90, 88, 88, 88, 88],
      bp: { sys: 135, dia: 82 },
      bpTrend: { sys: [145, 140, 138, 135, 135, 135, 135], dia: [88, 85, 83, 82, 82, 82, 82] },
      spo2: 99,
      spo2Trend: [98, 99, 99, 99, 99, 99, 99],
      temp: 37.4,
      tempTrend: [37.8, 37.6, 37.5, 37.4, 37.4, 37.4, 37.4],
      rr: 12,
      rrTrend: [12, 12, 12, 12, 12, 12, 12],
      lastUpdated: new Date().toISOString()
    },
    medications: [
      { id: 'm14', name: 'Propofol', dose: '50 mcg/kg/min', route: 'IV', frequency: 'Continuous', status: 'active', startDate: '2024-01-16', prescriber: 'Dr. Nguyen' },
      { id: 'm15', name: 'Levetiracetam', dose: '1500mg', route: 'IV', frequency: 'BID', status: 'active', startDate: '2024-01-16', prescriber: 'Dr. Nguyen' },
      { id: 'm16', name: 'Lacosamide', dose: '200mg', route: 'IV', frequency: 'BID', status: 'active', startDate: '2024-01-16', prescriber: 'Dr. Nguyen' }
    ],
    labs: [
      { id: 'l14', name: 'Ammonia', value: 45, unit: 'umol/L', reference: '11-35', status: 'high', date: '2024-01-16' },
      { id: 'l15', name: 'Magnesium', value: 1.6, unit: 'mg/dL', reference: '1.7-2.2', status: 'low', date: '2024-01-16' }
    ],
    notes: [
      { id: 'n5', type: 'progress', author: 'Dr. Nguyen', role: 'Neurologist', date: '2024-01-16 10:00', content: 'Seizures controlled on propofol. No electrographic seizures on cEEG for 6 hours. MRI pending.' }
    ],
    timeline: [
      { id: 't7', type: 'admission', title: 'Admitted to NICU', description: 'Status epilepticus, intubated', date: '2024-01-16 03:45' }
    ]
  }
];

export function getPatientById(id: string): Patient | undefined {
  return patients.find(p => p.id === id);
}

export function getPatientsByStatus(status: Patient['status']): Patient[] {
  return patients.filter(p => p.status === status);
}
