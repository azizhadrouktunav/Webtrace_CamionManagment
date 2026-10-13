import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import * as L from 'leaflet';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GlobalMap } from '../../map/map';
import { TrackingObjectService } from '../../tracking/tracking-objects.service';
import { Geofence } from '../geofence.model';
import { GeofenceService } from '../geofence.service';

import { locale as english } from '../../../../navigation/i18n/en';
import { locale as french } from '../../../../navigation/i18n/fr';
import { locale as arab } from '../../../../navigation/i18n/ar';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { SharedDataService } from '../../shared-data.service';
import { environment } from 'environments/environment';
import { DEMO_TRACKING_OBJECTS } from 'app/mock/data/tracking-demo';
import {
  circleToPolygon,
  GeoZoneAssignService,
  rectangleToPolygon
} from '../../geo-zone-assign';
@Component({
  selector: 'app-geofence-form',
  templateUrl: './geofence-form.component.html',
  styleUrls: ['./geofence-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GeofenceFormComponent implements OnInit,  OnDestroy{

  action: string;
  geofence : Geofence;
  geofenceForm: FormGroup;
  
  dialogTitle: string;
  trackingObjectGeofencing : any[];
  vehicles: any[];
  types: any[];
  zoneGoefence : any[];
  types_alert: any[];
  circle:boolean;
  rectangle:boolean;
  vehicleId: number;
  show : string = 'geofence';
  circleObj : any
  rectObj : any
// Private
private _unsubscribeAll: Subject<any>;

  Map : GlobalMap = GlobalMap.globalMap;
   /**
     * Constructor
     * @param {MatDialog} _matDialog
     * @param {TrackingObjectService} _trackingObjectService
     * @param {GeofenceService} _geofenceService
     * @param {FuseSidebarService} _fuseSidebarService
     */
  constructor(
    public matDialogRef: MatDialogRef<GeofenceFormComponent>,
    private _geofenceService: GeofenceService,
    private _trackingObjectService: TrackingObjectService,
    private _fuseSidebarService: FuseSidebarService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _sharedData: SharedDataService,
    private _geoZoneAssign: GeoZoneAssignService
  ) { 

     // Set the private defaults
     this._unsubscribeAll = new Subject();

    this.dialogTitle ='Geofence.AddGeofence';
    this.geofence = new Geofence();
    this.geofenceForm = this.createGeofenceForm();
    this._fuseTranslationLoaderService.loadTranslations(english, french, arab);
  }

  private buildGeofenceVehicle(item: any): any {
    const eq = item.CurrentEquipmentElement || {};
    return {
      name: item.FullName,
      id: item.Key,
      types: [
        { name: 'Geofence.Circulaire', id: eq.HardwareSupportConfigGeofenceCircleByGPRS === true || environment.mock, value: 2 },
        { name: 'Geofence.Rectangulaire', id: eq.HardwareSupportConfigGeofenceRectangleByGPRS === true || environment.mock, value: 1 }
      ],
      types_alert: [
        { name: 'Geofence.InArea', id: eq.HardwareSupportInsideGeofenceAlarm === true || environment.mock, value: 1 },
        { name: 'Geofence.OutArea', id: eq.HardwareSupportOutsideGeofenceAlarm === true || environment.mock, value: 2 },
        { name: 'Geofence.InAndOutArea', id: eq.HardwareSupportInOutsideGeofenceAlarm === true || environment.mock, value: 3 }
      ]
    };
  }

  private applyVehicleList(data: any[]): void {
    this.trackingObjectGeofencing = data;
    this.vehicles = data.map(item => ({ name: item.name, id: item.id }));
  }

  ngOnInit(){
    this._geofenceService.onLeftSidenavViewChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(data => {
        this.show = data;
      });

    if (environment.mock) {
      const demo = (this._trackingObjectService.trackingObjects && this._trackingObjectService.trackingObjects.length
        ? this._trackingObjectService.trackingObjects
        : DEMO_TRACKING_OBJECTS).map(item => this.buildGeofenceVehicle(item));
      this.applyVehicleList(demo);
      return;
    }

   var promise = new Promise((resolve, reject) => {
    this._trackingObjectService.onTrackingObjectsChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .map(items => 
      items.filter(item => (item.CurrentEquipmentElement == null ? false : item.CurrentEquipmentElement.HardwareSupportConfigGeofenceCircleByGPRS )
    || (item.CurrentEquipmentElement == null ? false : item.CurrentEquipmentElement.HardwareSupportConfigGeofenceRectangleByGPRS)).map(item => this.buildGeofenceVehicle(item)))
    .subscribe(data => {
      this.trackingObjectGeofencing = data;
      resolve(data)
  });  
   })
  promise.then((success) => {
    this.applyVehicleList(this.trackingObjectGeofencing || []);
  }).catch((err) => {
    console.log(err)
  });
 
}
   /**
     * On destroy
     */
    ngOnDestroy(): void
    {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
    }
// -----------------------------------------------------------------------------------------------------
// @ Public methods
// -----------------------------------------------------------------------------------------------------

    /**
     * Create geofence form
     *
     * @returns {FormGroup}
     */
 createGeofenceForm() : FormGroup
 {
  return new FormGroup({
    TrakingObject      : new FormControl(this.geofence.TrakingObject, Validators.required),
    GeofenceName    : new FormControl(this.geofence.GeofenceName, Validators.required),
    GeofenceAlarmType: new FormControl(this.geofence.GeofenceAlarmType),
    GeofenceTypeInt  : new FormControl(this.geofence.GeofenceTypeInt),
    circle: new FormGroup({
      Rayon :  new FormControl(this.geofence.Rayon),
      CentreLng: new FormControl(this.geofence.CentreLng, [Validators.min(-180), Validators.max(180)]),
      CenterLat :  new FormControl(this.geofence.CenterLat, [Validators.min(-90), Validators.max(90)])
    }),
    rectangle : new FormGroup({
      Lng1: new FormControl(this.geofence.Lng1, [Validators.min(-180), Validators.max(180)]),
      Lng2: new FormControl(this.geofence.Lng2, [Validators.min(-180), Validators.max(180)]),
      Lat1: new FormControl(this.geofence.Lat1, [Validators.min(-90), Validators.max(90)]),
      Lat2: new FormControl(this.geofence.Lat2, [Validators.min(-90), Validators.max(90)])
    })
});
 }
 
addGeofence(geofenceForm: FormGroup): void 
{
    const newGeofence = geofenceForm.getRawValue();

    if (environment.mock) {
      let coords = [];
      if (newGeofence.GeofenceTypeInt === 1) {
        coords = rectangleToPolygon(
          +newGeofence.rectangle.Lat1, +newGeofence.rectangle.Lng1,
          +newGeofence.rectangle.Lat2, +newGeofence.rectangle.Lng2
        );
      } else if (newGeofence.GeofenceTypeInt === 2) {
        coords = circleToPolygon(
          +newGeofence.circle.CenterLat,
          +newGeofence.circle.CentreLng,
          +newGeofence.circle.Rayon || 0.5
        );
      }
      if (coords.length) {
        this._geoZoneAssign.persistUnassignedPolygon(newGeofence.GeofenceName, coords);
      }
      this.drawGeofenceOnMap(newGeofence);
      this.matDialogRef.close(newGeofence);
      return;
    }

    this._geofenceService.addGeofence(newGeofence).then(() => {
          this.matDialogRef.close()
          this._sharedData.changeIndex(4);
    });
    this.drawGeofenceOnMap(newGeofence);
}

private drawGeofenceOnMap(newGeofence: any): void {
    if(newGeofence.GeofenceTypeInt === 1) {
        let point1 = new L.LatLng(newGeofence.rectangle.Lat1, newGeofence.rectangle.Lng1)
        let point2 = new L.LatLng(newGeofence.rectangle.Lat2, newGeofence.rectangle.Lng1)
        let point3 = new L.LatLng(newGeofence.rectangle.Lat2, newGeofence.rectangle.Lng2)
        let point4 = new L.LatLng(newGeofence.rectangle.Lat1, newGeofence.rectangle.Lng2)
        
        this.Map.drawer.clearObject(this.rectObj);
        this.Map.drawer.drawRectangle(polygon => {
           
        }, [point1, point2, point3, point4], newGeofence.GeofenceName);
    }
    else if(newGeofence.GeofenceTypeInt === 2){
        let circleCenter = new L.LatLng(newGeofence.circle.CenterLat, +newGeofence.circle.CentreLng)
            this.Map.drawer.clearObject(this.circleObj)
            this.circleObj = this.Map.drawer.DrawCircle(circleCenter, newGeofence.circle.Rayon*1000, newGeofence.GeofenceName);
       };
}
 /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void
    {
        this._fuseSidebarService.getSidebar(key).close();
    }
    /**
     * Change left sidenav view
     *
     * @param view
     */
    changeLeftSidenavView(view): void
    {
        this._geofenceService.onLeftSidenavViewChanged.next(view);
    }

 selected(e): void
 { 
  this.vehicleId = e.value;
  this._geofenceService.trakingObject.next(this.vehicleId);
   this.types = this.trackingObjectGeofencing
       .filter(item => item.id === this.vehicleId)[0].types;
   if(this.types.filter(item => item.name == 'Geofence.Circulaire')[0].id && !this.types.filter(item => item.name == 'Geofence.Rectangulaire')[0].id)
   {
     this.circle = true;
     this.rectangle = false;

     this.circleObj = this.Map.drawer.drawCircle((circle: L.Circle) => {
             
      this.geofenceForm.get('circle').setValue({
            Rayon:    circle.getRadius()/1000,
            CentreLng: circle.getLatLng().lng,
            CenterLat : circle.getLatLng().lat
     });
   });
     this.geofenceForm.get('GeofenceTypeInt').setValue(2);
   }
  else if(!this.types.filter(item => item.name == 'Geofence.Circulaire')[0].id && this.types.filter(item => item.name == 'Geofence.Rectangulaire')[0].id)
   {
     this.rectangle = true;
     this.circle =false;
     this.geofenceForm.get('GeofenceTypeInt').setValue(1);
   }
   else 
   {
     this.rectangle = null;
     this.circle =null;
     this.geofenceForm.get('GeofenceTypeInt').reset()
   }
   
   this.types_alert = this.trackingObjectGeofencing.filter(item => 
     item.id === this.vehicleId
   )[0].types_alert;
 }
 
 selectedType(e): void {
  this.Map.drawer.clearObject(this.rectObj);
  this.Map.drawer.clearObject(this.circleObj);
  if(e.value == 1){
       this.rectangle = true;
       this.circle = false;
   
       this.rectObj = this.Map.drawer.drawingRectangle((rec : L.Polyline) => {
           let A : L.LatLng = (rec.getLatLngs()[0] as L.LatLng)
           let B : L.LatLng = (rec.getLatLngs()[1] as L.LatLng)
           this.geofenceForm.get('rectangle').setValue({
               Lng1: A.lng,
               Lng2: B.lng,
               Lat1: A.lat,
               Lat2: B.lat
            })
       });
  }
  else if(e.value == 2){
      this.circle = true; 
      this.rectangle = false; 
      this.circleObj = this.Map.drawer.drawCircle((circle: L.Circle) => {
          this.geofenceForm.get('circle').setValue({
                Rayon:    circle.getRadius()/1000,
                CentreLng: circle.getLatLng().lng,
                CenterLat : circle.getLatLng().lat
     });
       });
  }
}

}
