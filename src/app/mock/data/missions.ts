import { CycleStandard, Mission } from '../types/fleet';
import { formatDateLocal } from '../utils/truck-status';

function demoDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return formatDateLocal(d);
}

export const STANDARD_CYCLE: CycleStandard = { loading: 10, outbound: 10, unloading: 5, return: 10 };

export const missions: Mission[] = [
{
  id: 'NAVIRE-001',
  name: 'Chargement Salt Star',
  shift: 'morning',
  shipId: 'SHP-01',
  date: demoDate(0),
  start: '08:00',
  end: '20:00',
  stockZoneId: 'STK-01',
  portId: 'PRT-01',
  truckIds: ['TRK-001', 'TRK-002', 'TRK-003', 'TRK-004', 'TRK-005', 'TRK-006', 'TRK-007', 'TRK-008', 'TRK-009', 'TRK-010', 'TRK-011', 'TRK-012'],
  tripsTarget: 96,
  tripsDone: 57,
  status: 'running',
  standardCycle: { loading: 10, outbound: 10, unloading: 5, return: 10 },
  actualCycle: { loading: 10, outbound: 9, unloading: 8, return: 9 },
  notes: 'Sel brut lavé · 2 880 t à charger en cale 2 et 3.'
},
{
  id: 'NAVIRE-002',
  name: 'Chargement Mediterra',
  shift: 'afternoon',
  shipId: 'SHP-02',
  date: demoDate(0),
  start: '09:30',
  end: '18:30',
  stockZoneId: 'STK-02',
  portId: 'PRT-01',
  truckIds: ['TRK-013', 'TRK-014', 'TRK-015', 'TRK-016'],
  tripsTarget: 40,
  tripsDone: 25,
  status: 'running',
  standardCycle: { loading: 10, outbound: 11, unloading: 5, return: 11 },
  actualCycle: { loading: 9.1, outbound: 10.4, unloading: 6.3, return: 9.6 },
  notes: 'Temps de trajet ajustés pour semi-remorques 35 t.'
},
{
  id: 'NAVIRE-003',
  name: 'Complément Atlas',
  shift: 'night',
  shipId: 'SHP-03',
  date: demoDate(0),
  start: '12:00',
  end: '17:00',
  stockZoneId: 'STK-01',
  portId: 'PRT-01',
  truckIds: ['TRK-017', 'TRK-018'],
  tripsTarget: 12,
  tripsDone: 5,
  status: 'running',
  standardCycle: { loading: 10, outbound: 10, unloading: 5, return: 10 },
  actualCycle: { loading: 8.9, outbound: 9.5, unloading: 5.2, return: 9.0 },
  notes: 'Complément de cargaison · porteurs 25 t.'
},
{
  id: 'NAVIRE-004',
  name: 'Chargement Kerkennah',
  shift: 'poste4',
  driverIds: ['DRV-19', 'DRV-20', 'DRV-21'],
  shipId: 'SHP-04',
  date: demoDate(0),
  start: '06:00',
  end: '14:00',
  stockZoneId: 'STK-01',
  portId: 'PRT-01',
  truckIds: ['TRK-019', 'TRK-020', 'TRK-021'],
  tripsTarget: 18,
  tripsDone: 12,
  status: 'done',
  standardCycle: { loading: 10, outbound: 10, unloading: 5, return: 10 },
  actualCycle: { loading: 11, outbound: 12, unloading: 6, return: 10 },
  notes: '2 400 t chargées · un trajet aller rallongé et un passage atelier.'
}];
