import { GeoTool, LayerState } from '../types/map';

export const mapTools: { id: GeoTool; label: string; icon: string; group: 'fleet' | 'zones'; route: string }[] = [
  { id: 'navire', label: 'Navire', icon: 'directions_boat', group: 'fleet', route: 'parc/navires' },
  { id: 'camion', label: 'Camion', icon: 'local_shipping', group: 'fleet', route: 'parc/camions' },
  { id: 'chauffeur', label: 'Chauffeur', icon: 'airline_seat_recline_normal', group: 'fleet', route: 'parc/chauffeurs' },
  { id: 'trajet', label: 'Trajet', icon: 'timeline', group: 'zones', route: 'parc/zones' },
  { id: 'port', label: 'Port', icon: 'anchor', group: 'zones', route: 'parc/zones' },
  { id: 'stock', label: 'Zone de Stock', icon: 'warehouse', group: 'zones', route: 'parc/zones' },
  { id: 'atelier', label: 'Zone Atelier', icon: 'build', group: 'zones', route: 'parc/zones' },
  { id: 'pause', label: 'Zone Pause', icon: 'free_breakfast', group: 'zones', route: 'parc/zones' }
];

export const layerOptions: { key: keyof LayerState; label: string; color: string }[] = [
  { key: 'trucks', label: 'Camions', color: '#22c55e' },
  { key: 'routes', label: 'Trajets', color: '#1d4ed8' },
  { key: 'ports', label: 'Ports', color: '#1e293b' },
  { key: 'stock', label: 'Zones de stock', color: '#ea580c' },
  { key: 'workshops', label: 'Ateliers', color: '#334155' },
  { key: 'pause', label: 'Zones pause', color: '#64748b' },
  { key: 'missions', label: 'Missions (étiquettes)', color: '#93c5fd' },
  { key: 'alerts', label: 'Alertes', color: '#ef4444' },
  { key: 'trails', label: 'Historique des positions', color: '#0f172a' }
];

export const defaultLayers: LayerState = {
  trucks: true,
  routes: true,
  ports: true,
  stock: true,
  workshops: true,
  pause: true,
  missions: true,
  alerts: true,
  trails: true
};
