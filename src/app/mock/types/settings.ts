import { AlertLevel, AlertType, CycleStandard, MissionShift } from './fleet';

export interface ShiftConfig {
  id: MissionShift;
  label: string;
  description: string;
  active: boolean;
}

export type UserRole = 'admin' | 'supervisor' | 'park_manager' | 'viewer';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  active: boolean;
  lastLogin: string | null;
}

export interface AlertRecipient {
  id: string;
  name: string;
  email: string;
  phone: string;
  levels: AlertLevel[];
}

export interface AlertRule {
  type: AlertType;
  email: boolean;
  sms: boolean;
}

export interface CycleDefaults {
  cycle: CycleStandard;
  contingency: number;
  normalAlertMin: number;
  criticalAlertMin: number;
}