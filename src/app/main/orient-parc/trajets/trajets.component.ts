import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MockStoreService } from 'app/mock/mock-store.service';
import { LatLng, RouteLine } from 'app/mock/types/fleet';
import { chipClass } from 'app/main/orient-shared/orient-ui';

@Component({
  selector: 'app-orient-parc-trajets',
  templateUrl: './trajets.component.html',
  styleUrls: ['../../orient-shared/_orient-page.scss']
})
export class TrajetsComponent implements OnInit, OnDestroy {
  items: RouteLine[] = [];
  columns = ['name', 'direction', 'active', 'actions'];
  chipClass = chipClass;
  selected: RouteLine | null = null;
  mapCoords: LatLng[] = [];

  private sub: Subscription;

  constructor(private store: MockStoreService) {}

  ngOnInit(): void {
    this.sub = this.store.routes.subscribe((r) => {
      this.items = r.slice();
      if (this.selected) {
        const found = r.find((x) => x.id === this.selected.id);
        this.selected = found || null;
        this.mapCoords = found ? this.cloneCoords(found.coords) : [];
      } else if (r.length) {
        this.view(r[0]);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  view(row: RouteLine): void {
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
