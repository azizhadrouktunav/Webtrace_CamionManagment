import { Ship } from '../types/fleet';
import { formatDateLocal } from '../utils/truck-status';

function demoDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return formatDateLocal(d);
}

export const ships: Ship[] = [
{ id: 'SHP-01', name: 'MV SALT STAR', imo: 'IMO 9384721', flag: 'Panama', date: demoDate(0), portId: 'PRT-01', missionId: 'NAVIRE-001', tonnage: 2880, status: 'loading', notes: 'Cales 2 et 3' },
{ id: 'SHP-02', name: 'MV MEDITERRA', imo: 'IMO 9512036', flag: 'Malte', date: demoDate(0), portId: 'PRT-01', missionId: 'NAVIRE-002', tonnage: 1400, status: 'loading', notes: '' },
{ id: 'SHP-03', name: 'MV ATLAS BREEZE', imo: 'IMO 9277804', flag: 'Libéria', date: demoDate(0), portId: 'PRT-01', missionId: 'NAVIRE-003', tonnage: 300, status: 'loading', notes: 'Complément' },
{ id: 'SHP-04', name: 'MV KERKENNAH', imo: 'IMO 9630115', flag: 'Tunisie', date: demoDate(0), portId: 'PRT-01', missionId: 'NAVIRE-004', tonnage: 2400, status: 'departed', notes: 'Chargement terminé' },
{ id: 'SHP-05', name: 'MV HANNIBAL', imo: 'IMO 9418852', flag: 'Tunisie', date: demoDate(0), portId: 'PRT-01', missionId: null, tonnage: 1050, status: 'berthed', notes: 'À quai depuis 13:10' },
{ id: 'SHP-06', name: 'MV GABES SPIRIT', imo: 'IMO 9196473', flag: 'Malte', date: demoDate(-1), portId: 'PRT-01', missionId: null, tonnage: 3300, status: 'departed', notes: '' },
{ id: 'SHP-07', name: 'MV ZARZIS STAR', imo: 'IMO 9301268', flag: 'Panama', date: demoDate(-2), portId: 'PRT-02', missionId: null, tonnage: 1350, status: 'departed', notes: 'Sans mission' }];