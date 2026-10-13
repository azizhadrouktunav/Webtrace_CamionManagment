import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import * as L from 'leaflet';
import { isUndefined } from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GlobalMap } from '../../map/map';
import { TrackingObjectService } from '../../tracking/tracking-objects.service';
import { GeofenceService } from '../geofence.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit, OnDestroy {
  
  // show delete 
  geofenceZoneForm : FormGroup;
  Map : GlobalMap = GlobalMap.globalMap;
  zoneGoefence : any[];
  vehicles: any[];
  //id
  vehicle: number;
  dialogTitle: string = 'Geofence.DeleteGeofence';
    // Private
    private _unsubscribeAll: Subject<any>;
  constructor(
        public matDialogRef: MatDialogRef<ShowComponent>,
        private _geofenceService: GeofenceService,
        private _trackingObjectService: TrackingObjectService,
        public _matDialog: MatDialog
  ) { 
     // Set the private defaults
     this._unsubscribeAll = new Subject();
    }

  ngOnInit(): void{
    this._trackingObjectService.onTrackingObjectsChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(data => {
            this.vehicles = data.map(item => { return {
              name : item.FullName,
              id :  item.Key   
            }
          });
    });
    this._geofenceService.trakingObject
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(data => {
      this.vehicle = data
      console.log(data);
    });
    this.geofenceZoneForm = this.createGeofenceZoneForm();
  }
  selectedVehicle(e){
    this._geofenceService.getZoneGeofence(e.value);
    this._geofenceService.onZoneGeogenceChanged.subscribe(data => {
      this.zoneGoefence = data;
    });
  }
  createGeofenceZoneForm() : FormGroup {
    return new FormGroup({
       TrakingObject      : new FormControl(this.vehicle),
       zone    : new FormControl('')
    });
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
     /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    deleteZone(form: FormGroup): void{
      const  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent> = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: false,
        width : '250px'
    });
      confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete this geofence area'+form.value.zone[0].Value.Name+'?';
      confirmDialogRef.afterClosed().subscribe(result => {
        if(result) {
          this._geofenceService.deleteGeofence(form.value.zone[0].Value.GeofenceType ,form.value.zone[0].Key, form.value.TrakingObject);
        }
      });
     }
     onGroupsChange(options: MatListOption[]) {
      // map these MatListOptions to their values
      console.log(options.map(o => o.value));
      this.geofenceZoneForm.get('zone').setValue(options.map(o => o.value));
    }
     showGeofence = (function() {
       var circle;
       var rec;

         return function() {

              // do something
              // if(!isUndefined(circle)) {
              //   this.Map.drawer.clearObject(circle);
              // }
              // if(!isUndefined(rec)) {
              //   this.Map.drawer.clearObject(rec);
              // }
              console.log(this.geofenceZoneForm.get('zone'));
              //  let type = this.geofenceZoneForm.get('zone').value.Value.
              if(this.geofenceZoneForm.get('zone').valid) {
                this.geofenceZoneForm.get('zone').value.forEach(zone => {
                       if(zone.Value.GeofenceType === 2) {
                      circle = this.Map.drawer.showCircle(new L.LatLng(zone.Value.LatOrigin, zone.Value.LngOrigin), zone.Value.Rayon*1000, zone.Value.Name);
                            console.log(circle);
                       }
                       else if(zone.Value.GeofenceType === 1) {       
                let point1 = new L.LatLng(zone.Value.PtXYLtLngUpRightOrLeft.Latitude, zone.Value.PtXYLtLngUpRightOrLeft.Longitude);
                let point2 = new L.LatLng(zone.Value.PtXYLtLngDownRightOrLeft.Latitude, zone.Value.PtXYLtLngUpRightOrLeft.Longitude)
                let point3 = new L.LatLng(zone.Value.PtXYLtLngDownRightOrLeft.Latitude, zone.Value.PtXYLtLngDownRightOrLeft.Longitude)
                let point4 = new L.LatLng(zone.Value.PtXYLtLngUpRightOrLeft.Latitude, zone.Value.PtXYLtLngDownRightOrLeft.Longitude)
                      rec =  this.Map.drawer.showPolygon([point1, point2 , point3, point4], zone.Value.Name)
                       }
                });
              }
          //}
      };
  })();
      
}
