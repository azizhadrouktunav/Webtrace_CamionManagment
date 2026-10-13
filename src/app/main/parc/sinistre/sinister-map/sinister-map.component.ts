import { AfterViewInit, Component, OnInit, EventEmitter, Output } from '@angular/core';
import { outputs } from '@syncfusion/ej2-angular-lineargauge/src/linear-gauge/lineargauge.component';
import * as L from 'leaflet';
import { AccidentdetailsService } from '../../services/accidentdetails.service';

@Component({
  selector: 'app-sinister-map',
  templateUrl: './sinister-map.component.html',
  styleUrls: ['./sinister-map.component.scss']
})
export class SinisterMapComponent implements OnInit,AfterViewInit  {
   map;
   latitude :number;
   Longitude:number;
  static sinisterMapComponent :SinisterMapComponent = new SinisterMapComponent();
  constructor() 
  { 
    
    
  }
 // _accidentdetailsService: AccidentdetailsService = new AccidentdetailsService() ;

  @Output()
  longLatEmitter : EventEmitter<any[]> = new EventEmitter<any[]>();
  myMarker;
 

  private initMap(): void {
    this.map = L.map('map', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
    if(this.latitude && this.Longitude)
    {
      this.map.setView(new L.LatLng(this.latitude,this.Longitude), 10);
      this.myMarker = L.marker([this.latitude, this.Longitude], {
        icon: L.icon({
          iconUrl: './assets/images/marker.png',
          iconSize: [24, 36],
          iconAnchor: [12, 36],
         // popupAnchor: [-3, -76],
        })
      });
      this.map.addLayer(this.myMarker);
    
    }
    else
    {
      navigator.geolocation.getCurrentPosition(resp => {
        this.map.setView(new L.LatLng(resp.coords.latitude,resp.coords.longitude), 10);
  
      })
    }
    
    this.map.on('click', (e) =>{
      if (this.myMarker) { // check
        this.map.removeLayer(this.myMarker); // remove
      }
      this.myMarker = L.marker([e.latlng.lat, e.latlng.lng], {
        icon: L.icon({
          iconUrl: './assets/images/marker.png',
          iconSize: [24, 36],
          iconAnchor: [12, 36],
         // popupAnchor: [-3, -76],
        })
      }).addTo(this.map);
      this.longLatEmitter.emit([e.latlng.lat, e.latlng.lng]);
    });
  }

  showInMap(lat,lng)
  {
    this.initMap();
    if (this.myMarker) { // check
      this.map.removeLayer(this.myMarker); // remove
    }
    this.myMarker = L.marker([lat, lng], {
      icon: L.icon({
        iconUrl: './assets/images/marker.png',
        iconSize: [24, 36],
        iconAnchor: [12, 36],
       // popupAnchor: [-3, -76],
      })
    }).addTo(this.map);
    this.longLatEmitter.emit([lat,lng]);
  }
  ngOnInit() {
  /*  this._accidentdetailsService.getPosition().then(pos=>
    {
      
      
      this.map.setView(new L.LatLng(pos.lat,pos.lng), 10);
    });*/
   
    
  }
  ngAfterViewInit(): void {
  
   
    this.Longitude =SinisterMapComponent.sinisterMapComponent.Longitude;
    this.latitude=SinisterMapComponent.sinisterMapComponent.latitude;
    this.initMap();
  }
}
