import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MockStoreService } from 'app/mock/mock-store.service';
import { LatLng, Port } from 'app/mock/types/fleet';
import { chipClass } from 'app/main/orient-shared/orient-ui';

@Component({
  selector: 'app-orient-parc-ports',
  templateUrl: './ports.component.html',
  styleUrls: ['../../orient-shared/_orient-page.scss']
})
export class PortsComponent implements OnInit, OnDestroy {
  items: Port[] = [];
  columns = ['name', 'active', 'actions'];
  chipClass = chipClass;
  selected: Port | null = null;
  mapCoords: LatLng[] = [];

  private sub: Subscription;

  constructor(private store: MockStoreService) {}

  ngOnInit(): void {
    this.sub = this.store.ports.subscribe((p) => {
      this.items = p.slice();
      if (this.selected) {
        const found = p.find((x) => x.id === this.selected.id);
        this.selected = found || null;
        this.mapCoords = found ? this.cloneCoords(found.coords) : [];
      } else if (p.length) {
        this.view(p[0]);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  view(row: Port): void {
    this.selected = row;
    this.mapCoords = this.cloneCoords(row.coords);
  }

  private cloneCoords(coords: LatLng[]): LatLng[] {
    const out: LatLng[] = [];
    for (let i = 0; i < coords.length; i++) {
      out.push([coords[i][0], coords[i][1]]);
    }
    return out;
  }
}
