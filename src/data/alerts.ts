import type { Alert } from '@/types';

export const initialAlerts: Alert[] = [
  {
    id: 'a1',
    patId: 'p1',
    patName: 'Maria Santos',
    type: 'lab',
    severity: 'critical',
    title: 'Critical Troponin Level',
    body: 'Troponin I elevated to 2.4 ng/mL (ref: <0.04). Trending upward from 1.8.',
    time: new Date(Date.now() - 30 * 60000).toISOString(),
    read: false,
    panel: true
  },
  {
    id: 'a2',
    patId: 'p5',
    patName: 'Sarah Thompson',
    type: 'vital',
    severity: 'critical',
    title: 'Seizure Activity Detected',
    body: 'EEG showing electrographic seizure activity. Immediate attention required.',
    time: new Date(Date.now() - 45 * 60000).toISOString(),
    read: false,
    panel: true
  },
  {
    id: 'a3',
    patId: 'p3',
    patName: 'Eleanor Hughes',
    type: 'lab',
    severity: 'warning',
    title: 'Elevated WBC Count',
    body: 'WBC 14.2 K/uL, trending down from 16.8. Monitor for infection resolution.',
    time: new Date(Date.now() - 2 * 3600000).toISOString(),
    read: false,
    panel: true
  },
  {
    id: 'a4',
    patId: 'p2',
    patName: 'James Wilson',
    type: 'lab',
    severity: 'warning',
    title: 'Glucose Level Update',
    body: 'Blood glucose 245 mg/dL, down from 310. Continue insulin drip monitoring.',
    time: new Date(Date.now() - 3 * 3600000).toISOString(),
    read: true,
    panel: true
  },
  {
    id: 'a5',
    patId: 'p1',
    patName: 'Maria Santos',
    type: 'medication',
    severity: 'warning',
    title: 'Anticoagulation Alert',
    body: 'Heparin infusion running. Monitor for bleeding signs. PTT due in 2 hours.',
    time: new Date(Date.now() - 4 * 3600000).toISOString(),
    read: true,
    panel: true
  },
  {
    id: 'a6',
    patId: 'p4',
    patName: 'Robert Chen',
    type: 'summary',
    severity: 'info',
    title: 'Daily Summary Generated',
    body: 'Post-CABG Day 2: Stable vitals, minimal chest tube output, plan for step-down.',
    time: new Date(Date.now() - 5 * 3600000).toISOString(),
    read: true,
    panel: true
  },
  {
    id: 'a7',
    patId: 'p5',
    patName: 'Sarah Thompson',
    type: 'lab',
    severity: 'warning',
    title: 'Low Magnesium',
    body: 'Magnesium 1.6 mg/dL (ref: 1.7-2.2). Consider replacement for seizure threshold.',
    time: new Date(Date.now() - 6 * 3600000).toISOString(),
    read: false,
    panel: true
  },
  {
    id: 'a8',
    patId: 'p3',
    patName: 'Eleanor Hughes',
    type: 'vital',
    severity: 'warning',
    title: 'Oxygen Saturation Dip',
    body: 'SpO2 dropped to 91% briefly. Now 94% on 2L NC. Continue weaning protocol.',
    time: new Date(Date.now() - 8 * 3600000).toISOString(),
    read: true,
    panel: true
  }
];
