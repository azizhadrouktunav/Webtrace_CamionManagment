import { STANDARD_CYCLE } from './missions';
import { AlertRecipient, AlertRule, CycleDefaults, ShiftConfig, UserAccount } from '../types/settings';

export const shifts: ShiftConfig[] = [
{ id: 'morning', label: 'Poste 1 · Matin', description: 'Équipe du matin', active: true },
{ id: 'afternoon', label: 'Poste 2 · Après-midi', description: 'Équipe de l’après-midi', active: true },
{ id: 'night', label: 'Poste 3 · Nuit', description: 'Équipe de nuit', active: true },
{ id: 'poste4', label: 'Poste 4', description: 'Équipe du poste 4', active: true },
{ id: 'poste5', label: 'Poste 5', description: 'Équipe du poste 5', active: true }];


export const users: UserAccount[] = [
{ id: 'USR-01', name: 'Amine Mabrouk', email: 'amine.mabrouk@tunav.tn', phone: '+216 98 100 200', role: 'supervisor', active: true, lastLogin: 'Aujourd’hui · 07:42' },
{ id: 'USR-02', name: 'Leila Ben Salah', email: 'leila.bensalah@tunav.tn', phone: '+216 97 315 482', role: 'admin', active: true, lastLogin: 'Hier · 18:05' },
{ id: 'USR-03', name: 'Khaled Hamdi', email: 'khaled.hamdi@tunav.tn', phone: '+216 55 902 341', role: 'park_manager', active: true, lastLogin: 'Aujourd’hui · 05:58' },
{ id: 'USR-04', name: 'Sonia Ayari', email: 'sonia.ayari@tunav.tn', phone: '+216 22 418 667', role: 'park_manager', active: true, lastLogin: 'Aujourd’hui · 13:51' },
{ id: 'USR-05', name: 'Omar Jlassi', email: 'omar.jlassi@tunav.tn', phone: '+216 50 774 120', role: 'viewer', active: false, lastLogin: null }];


export const recipients: AlertRecipient[] = [
{ id: 'REC-01', name: 'Amine Mabrouk', email: 'amine.mabrouk@tunav.tn', phone: '+216 98 100 200', levels: ['critical', 'warning'] },
{ id: 'REC-02', name: 'Khaled Hamdi', email: 'khaled.hamdi@tunav.tn', phone: '+216 55 902 341', levels: ['critical'] },
{ id: 'REC-03', name: 'Astreinte exploitation', email: 'astreinte@tunav.tn', phone: '+216 71 000 111', levels: ['critical', 'warning', 'info'] }];


export const cycleDefaultsSeed: CycleDefaults = {
  cycle: Object.assign({}, STANDARD_CYCLE),
  contingency: 0,
  normalAlertMin: 2,
  criticalAlertMin: 5
};

export const alertRules: AlertRule[] = [
{ type: 'route_delay', email: true, sms: false },
{ type: 'stock_excess', email: true, sms: false },
{ type: 'port_excess', email: true, sms: false },
{ type: 'workshop_excess', email: true, sms: false },
{ type: 'pause_excess', email: true, sms: false },
{ type: 'zone_exit', email: true, sms: true },
{ type: 'off_mission', email: true, sms: true },
{ type: 'gps_offline', email: true, sms: true },
{ type: 'long_stop', email: true, sms: false }];