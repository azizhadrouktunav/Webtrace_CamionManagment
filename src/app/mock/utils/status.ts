import {
  AlertLevel,
  AlertStatus,
  AlertType,
  DriverStatus,
  GpsStatus,
  HealthLevel,
  MissionStatus,
  ShipStatus,
  Stage,
  TruckStatus
} from '../types/fleet';
import { UserRole } from '../types/settings';

export type Tone = 'brand' | 'accent' | 'info' | 'ok' | 'warn' | 'danger' | 'neutral';

type Meta = { label: string; tone: Tone };

export const userRoleMeta: { [K in UserRole]: Meta & { description: string } } = {
  admin: { label: 'Administrateur', tone: 'brand', description: 'Accès complet, y compris le paramétrage' },
  supervisor: { label: 'Superviseur d’exploitation', tone: 'accent', description: 'Missions, alertes et analytique' },
  park_manager: { label: 'Responsable de parc', tone: 'info', description: 'Lance et clôture les missions, gère camions et chauffeurs' },
  viewer: { label: 'Lecture seule', tone: 'neutral', description: 'Consultation du suivi et des tableaux de bord' }
};

export const healthMeta: { [K in HealthLevel]: Meta } = {
  normal: { label: 'Normal', tone: 'ok' },
  warning: { label: 'Attention', tone: 'warn' },
  alert: { label: 'Alerte', tone: 'danger' },
  offline: { label: 'Hors ligne', tone: 'neutral' }
};

export const healthOrder: { [K in HealthLevel]: number } = { alert: 0, warning: 1, offline: 2, normal: 3 };

export const truckStatusMeta: { [K in TruckStatus]: Meta } = {
  mission: { label: 'En mission', tone: 'brand' },
  available: { label: 'Disponible', tone: 'ok' },
  off_mission: { label: 'Hors mission', tone: 'neutral' }
};

export const gpsMeta: { [K in GpsStatus]: Meta } = {
  online: { label: 'Connecté', tone: 'ok' },
  weak: { label: 'Signal faible', tone: 'warn' },
  offline: { label: 'Hors ligne', tone: 'danger' }
};

export const stageMeta: { [K in Stage]: { label: string; location: string } } = {
  loading: { label: 'Chargement', location: 'Zone de stock' },
  outbound: { label: 'Trajet vers port', location: 'Zone de stock → Port' },
  unloading: { label: 'Déchargement port', location: 'Port de Sfax' },
  return: { label: 'Retour vers stock', location: 'Port → Zone de stock' },
  workshop: { label: 'Passage atelier', location: 'Atelier mécanique' },
  pause: { label: 'En pause', location: 'Zone pause' },
  parked: { label: 'Stationné', location: 'Parc camions Salin' }
};

export const missionStatusMeta: { [K in MissionStatus]: Meta } = {
  planned: { label: 'Planifiée', tone: 'neutral' },
  running: { label: 'En cours', tone: 'brand' },
  done: { label: 'Terminée', tone: 'ok' },
  cancelled: { label: 'Annulée', tone: 'danger' }
};

export const alertLevelMeta: { [K in AlertLevel]: Meta } = {
  critical: { label: 'Critique', tone: 'danger' },
  warning: { label: 'Warning', tone: 'warn' },
  info: { label: 'Information', tone: 'info' }
};

export const alertStatusMeta: { [K in AlertStatus]: Meta } = {
  open: { label: 'Ouverte', tone: 'danger' },
  acknowledged: { label: 'Prise en compte', tone: 'accent' },
  resolved: { label: 'Résolue', tone: 'ok' }
};

export const alertTypeLabel: { [K in AlertType]: string } = {
  route_delay: 'Retard trajet',
  stock_excess: 'Temps excessif zone de stock',
  port_excess: 'Temps excessif port',
  workshop_excess: 'Temps excessif atelier',
  pause_excess: 'Pause excessive',
  zone_exit: 'Sortie de zone',
  off_mission: 'Camion hors mission',
  gps_offline: 'GPS offline',
  long_stop: 'Arrêt prolongé'
};

export const shipStatusMeta: { [K in ShipStatus]: Meta } = {
  expected: { label: 'Attendu', tone: 'neutral' },
  berthed: { label: 'À quai', tone: 'accent' },
  loading: { label: 'En chargement', tone: 'brand' },
  departed: { label: 'Parti', tone: 'ok' }
};

export const driverStatusMeta: { [K in DriverStatus]: Meta } = {
  on_duty: { label: 'En service', tone: 'ok' },
  break: { label: 'En pause', tone: 'warn' },
  off_duty: { label: 'Hors service', tone: 'neutral' }
};

export function delayTone(deltaMin: number): Tone {
  if (deltaMin > 0.05) {
    return 'danger';
  }
  return 'ok';
}
