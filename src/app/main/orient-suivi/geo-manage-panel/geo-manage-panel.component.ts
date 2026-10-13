import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FixedSite, LatLng, Port, RouteLine, StockZone } from 'app/mock/types/fleet';
import { chipClass } from 'app/main/orient-shared/orient-ui';

export type GeoPanelMode = 'places' | 'polygons' | 'routes';

export interface GeoPanelRow {
  id: string;
  title: string;
  subtitle: string;
  active: boolean;
  coords: LatLng[];
  kind: 'port' | 'stock' | 'workshop' | 'pause' | 'route';
}

@Component({
  selector: 'app-orient-geo-manage-panel',
  templateUrl: './geo-manage-panel.component.html',
  styleUrls: ['./geo-manage-panel.component.scss']
})
export class GeoManagePanelComponent {
  @Input() mode: GeoPanelMode = 'polygons';
  @Input() ports: Port[] = [];
  @Input() stockZones: StockZone[] = [];
  @Input() workshops: FixedSite[] = [];
  @Input() pauseZones: FixedSite[] = [];
  @Input() routes: RouteLine[] = [];
  @Input() highlightId: string | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() focusShape = new EventEmitter<{ id: string; coords: LatLng[] }>();
  @Output() toggleVisibility = new EventEmitter<{ id: string; kind: string }>();

  chipClass = chipClass;

  get title(): string {
    if (this.mode === 'places') {
      return 'Gestion des emplacements';
    }
    if (this.mode === 'routes') {
      return 'Gestion des routes';
    }
    return 'Gestion des polygones';
  }

  get rows(): GeoPanelRow[] {
    const out: GeoPanelRow[] = [];
    let i: number;
    if (this.mode === 'places') {
      for (i = 0; i < this.workshops.length; i++) {
        const w = this.workshops[i];
        out.push({
          id: w.id,
          title: w.name,
          subtitle: 'Zone atelier',
          active: w.active,
          coords: w.coords,
          kind: 'workshop'
        });
      }
      for (i = 0; i < this.pauseZones.length; i++) {
        const p = this.pauseZones[i];
        out.push({
          id: p.id,
          title: p.name,
          subtitle: 'Zone pause',
          active: p.active,
          coords: p.coords,
          kind: 'pause'
        });
      }
    } else if (this.mode === 'polygons') {
      for (i = 0; i < this.ports.length; i++) {
        const p = this.ports[i];
        out.push({
          id: p.id,
          title: p.name,
          subtitle: 'Port',
          active: p.active,
          coords: p.coords,
          kind: 'port'
        });
      }
      for (i = 0; i < this.stockZones.length; i++) {
        const z = this.stockZones[i];
        out.push({
          id: z.id,
          title: z.name,
          subtitle: 'Zone de stock',
          active: z.active,
          coords: z.coords,
          kind: 'stock'
        });
      }
    } else {
      for (i = 0; i < this.routes.length; i++) {
        const r = this.routes[i];
        out.push({
          id: r.id,
          title: r.name,
          subtitle: 'Trajet · ' + r.direction,
          active: r.active,
          coords: r.coords,
          kind: 'route'
        });
      }
    }
    return out;
  }

  onClose(): void {
    this.closed.emit();
  }

  onView(row: GeoPanelRow): void {
    this.focusShape.emit({ id: row.id, coords: row.coords });
  }

  onToggle(row: GeoPanelRow): void {
    this.toggleVisibility.emit({ id: row.id, kind: row.kind });
  }
}
