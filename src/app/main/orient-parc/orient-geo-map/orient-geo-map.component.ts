import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-draw';
import { MAP_CENTER } from 'app/mock/data/geo';
import { LatLng } from 'app/mock/types/fleet';

@Component({
  selector: 'app-orient-geo-map',
  templateUrl: './orient-geo-map.component.html',
  styleUrls: ['./orient-geo-map.component.scss', '../../orient-shared/_orient-page.scss']
})
export class OrientGeoMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() coords: LatLng[] = [];
  @Input() mode: 'polygon' | 'polyline' = 'polygon';
  @Input() readOnly = false;
  @Output() coordsChange = new EventEmitter<LatLng[]>();

  mapId = 'orient-geo-map-' + Math.random().toString(36).substr(2, 9);

  private map: L.Map;
  private drawnItems: L.FeatureGroup;
  private drawControl: any;
  private mapReady = false;

  ngAfterViewInit(): void {
    this.initMap();
    this.mapReady = true;
    this.syncShape();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.coords || changes.readOnly) && this.mapReady && this.map) {
      this.syncShape();
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.off();
      this.map.remove();
      this.map = null;
    }
  }

  private initMap(): void {
    const el = document.getElementById(this.mapId);
    if (!el) {
      return;
    }
    this.map = L.map(el, { zoomControl: true }).setView(
      L.latLng(MAP_CENTER[0], MAP_CENTER[1]),
      14
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);

    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);

    if (!this.readOnly) {
      const drawPoly = this.mode === 'polygon';
      const drawLine = this.mode === 'polyline';
      this.drawControl = new (L.Control as any).Draw({
        draw: {
          polygon: drawPoly,
          polyline: drawLine,
          rectangle: false,
          circle: false,
          marker: false,
          circlemarker: false
        },
        edit: {
          featureGroup: this.drawnItems,
          remove: true
        }
      });
      this.map.addControl(this.drawControl);

      const self = this;
      this.map.on(L.Draw.Event.CREATED, function(e: any) {
        self.drawnItems.clearLayers();
        const layer = e.layer;
        self.drawnItems.addLayer(layer);
        self.emitFromLayer(layer);
      });
      this.map.on(L.Draw.Event.EDITED, function() {
        const layers = self.drawnItems.getLayers();
        if (layers.length) {
          self.emitFromLayer(layers[0]);
        }
      });
      this.map.on(L.Draw.Event.DELETED, function() {
        self.coordsChange.emit([]);
      });
    }

    const self = this;
    setTimeout(function() {
      if (self.map) {
        self.map.invalidateSize();
      }
    }, 0);
  }

  private syncShape(): void {
    if (!this.drawnItems) {
      return;
    }
    this.drawnItems.clearLayers();
    if (!this.coords || !this.coords.length) {
      return;
    }
    const latlngs = this.toLeafletLatLngs(this.coords);
    let layer: L.Layer;
    if (this.mode === 'polygon') {
      layer = L.polygon(latlngs, { color: '#039be5', weight: 2, fillOpacity: 0.15 });
    } else {
      layer = L.polyline(latlngs, { color: '#1e3a5f', weight: 4 });
    }
    this.drawnItems.addLayer(layer);
    const bounds = this.drawnItems.getBounds();
    if (bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [24, 24] });
    }
  }

  private toLeafletLatLngs(coords: LatLng[]): L.LatLng[] {
    const out: L.LatLng[] = [];
    for (let i = 0; i < coords.length; i++) {
      out.push(L.latLng(coords[i][0], coords[i][1]));
    }
    return out;
  }

  private emitFromLayer(layer: L.Layer): void {
    let latlngs: L.LatLng[] = [];
    if (this.mode === 'polygon') {
      const raw = (layer as L.Polygon).getLatLngs();
      if (raw.length && Array.isArray(raw[0])) {
        latlngs = raw[0] as L.LatLng[];
      } else {
        latlngs = raw as L.LatLng[];
      }
    } else {
      latlngs = (layer as L.Polyline).getLatLngs() as L.LatLng[];
    }
    const out: LatLng[] = [];
    for (let i = 0; i < latlngs.length; i++) {
      out.push([latlngs[i].lat, latlngs[i].lng]);
    }
    this.coordsChange.emit(out);
  }
}
