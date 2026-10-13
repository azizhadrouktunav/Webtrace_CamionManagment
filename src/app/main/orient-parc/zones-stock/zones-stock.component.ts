import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MockStoreService } from 'app/mock/mock-store.service';
import { LatLng, StockZone } from 'app/mock/types/fleet';
import { chipClass } from 'app/main/orient-shared/orient-ui';

@Component({
  selector: 'app-orient-parc-zones-stock',
  templateUrl: './zones-stock.component.html',
  styleUrls: ['../../orient-shared/_orient-page.scss']
})
export class ZonesStockComponent implements OnInit, OnDestroy {
  items: StockZone[] = [];
  columns = ['name', 'active', 'actions'];
  chipClass = chipClass;
  selected: StockZone | null = null;
  mapCoords: LatLng[] = [];

  private sub: Subscription;

  constructor(private store: MockStoreService) {}

  ngOnInit(): void {
    this.sub = this.store.stockZones.subscribe((z) => {
      this.items = z.slice();
      if (this.selected) {
        const found = z.find((x) => x.id === this.selected.id);
        this.selected = found || null;
        this.mapCoords = found ? this.cloneCoords(found.coords) : [];
      } else if (z.length) {
        this.view(z[0]);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  view(row: StockZone): void {
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
