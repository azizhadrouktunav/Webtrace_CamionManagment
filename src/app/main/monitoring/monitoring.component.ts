import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { GlobalMap } from './map/map';
import * as L from 'leaflet';
import { GeofenceService } from './geofence/geofence.service';
import { isNull } from 'util';
import { GeofenceFormComponent } from './geofence/geofence-form/geofence-form.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { TrackingObjectService } from './tracking/tracking-objects.service';
import { Vehicle } from '../parc/gestio-des-vehicules/model';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { SplitAreaDirective, SplitComponent } from 'angular-split';
import { ActivatedRoute } from '@angular/router';
import { PlaceFormComponent } from './places-geometric-shapes-management/places/place-form/place-form.component';
import { PlacesService } from './places-geometric-shapes-management/places/places.service';
import { PlacesGeometricShapesManagementService } from './places-geometric-shapes-management/places-geometric-shapes-management.service';
import { WayDialogComponent } from './places-geometric-shapes-management/ways/way-form/add-way-dialog.component';
import { take, takeUntil } from 'rxjs/operators';
import { MatListOption } from '@angular/material/list';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { FuseUtils } from '@fuse/utils';
import { isEmpty, isUndefined, map } from 'lodash';
import { Subject, Subscription } from 'rxjs';
import { SharedDataService } from './shared-data.service';
import { locale as english } from '../../navigation/i18n/en';
import { locale as french } from '../../navigation/i18n/fr';
import { locale as arab } from '../../navigation/i18n/ar';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Traject } from './map/traject';

import { TrajectoryService } from './trajectory/trajectory.service';
import { TranslateService } from '@ngx-translate/core';
import { TrackingInfoCard } from './tracking/tracking-info-card';
import 'leaflet-routing-machine';
import { RunStop } from './run-stop-state/runStop';
import { RunStopStateService } from './run-stop-state/run-stop-state.service';
import { environment } from 'environments/environment';
import { GeoZoneAssignService } from './geo-zone-assign';
import { LatLng } from 'app/mock/types/fleet';

export class CheckboxCluster {
    id: number;
    checked: boolean;
    label: string;
    constructor(id: number, label: string, checked: boolean = false) {
        this.id = id;
        this.label = label;
        this.checked = checked
    }
}
@Component({
    selector: 'app-monitoring',
    templateUrl: './monitoring.component.html',
    styleUrls: ['./monitoring.component.scss']
})

export class MonitoringComponent implements OnInit, OnDestroy {

    sideBarOpened: boolean = false;
    loading: boolean = true;
    split: SplitComponent;
    area1: SplitAreaDirective;
    area2: SplitAreaDirective;
  
    direction: string = 'horizontal'
   
    sizes = {
        percent: {
            area1: 35,
            area2: 65,
        },
        pixel: {
            area1: 120,
            area2: '*',
            area3: 160,
        }
    }
    Map: GlobalMap = GlobalMap.globalMap;
    selectedIndex: number = 0;
    displayTabPoly: boolean = false;
    displayTabPaths: boolean = false;
    displayTabPlace: boolean = false;
    TabsHeightStates = ["None", "Small", "Full"]; //, "Big"
    HeightStateIndex = 1;
    TabsHeight = this.TabsHeightStates[this.HeightStateIndex];
    vehicles: Vehicle[];
    dialogRef: any;
    polygon: any;
    Geofencing:any;
    _latlngs: any;
    line: any;
    latLngs: any[] = [];
    routing : any;
    // showing hiring the draw control
    shown: boolean = false;
    clusters: CheckboxCluster[] = [new CheckboxCluster(1, 'Regrouper les vehicules en secteurs', true),
        new CheckboxCluster(0, 'Regrouper les emplacements en secteurs', false)
    ];

    Trajects: Traject[] = [];
    RunStops: RunStop[] = [];


    @ViewChild(MatTabGroup, {
        read: MatTabGroup,
        static: true
    })
    public tabGroup: MatTabGroup;
    @ViewChildren(MatTab, {
        read: MatTab
    })
    public tabNodes: QueryList < MatTab > ;
    public tabs = [

        {
            tabType: 0,
            name: 'Common.GeneralState'
        },
        {
            tabType: 1,
            name: 'Common.Alerts'
        },
        {
            tabType: 2,
            name: 'Common.RunStopState'
        },
        {
            tabType: 3,
            name: 'Common.Trajectory'
        },
        {
            tabType: 4,
            name: 'Common.SendingCommand'
        }
    ];
    selected = new FormControl(0);
    subscription: Subscription;
    promiseRowData: any;
    trackingObjectGeofencing: any[];
    // Private
    private _unsubscribeAll: Subject < any > ;
    Customer: any;
    IsAuthorizedToUseGooglePlanMaps: any;
    IsAuthorizedToUseTunavMaps: any;
    IsAuthorizedToUseOSMMaps: any;
    IsAuthorizedToUseHereMaps: any;
    IsAuthorizedToUseGoogleSatelliteMaps: any;
    x: number;
    y: number;
    constructor(library: FaIconLibrary,
        private translateService: TranslateService,
        private _trackingObjectService: TrackingObjectService,
        private _activatedRoute: ActivatedRoute,
        private _matDialog: MatDialog,
        private _runStopStateService: RunStopStateService,
        private _placesService: PlacesService,
        private _placesGeometricShapesManagementService: PlacesGeometricShapesManagementService,
        private _data: SharedDataService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _trajectoryService: TrajectoryService,
        private _SharedDataService: SharedDataService,
        private _geoZoneAssign: GeoZoneAssignService) {
            if (window.innerWidth < 768) {
                this.direction = 'vertical';
                this.x=65;
                this.y=35;

              } else {
                this.direction = 'horizontal';
                this.x=45;
                this.y=55;

              }
        library.addIconPacks(fas);
        this._fuseTranslationLoaderService.loadTranslations(english, french, arab);

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    async ngOnInit() {

        


        this._SharedDataService.fetchMapConf().subscribe(params => {

            this.Customer = params.param1;
            if (this.Customer != undefined) {
                this.IsAuthorizedToUseGooglePlanMaps = this.Customer.IsAuthorizedToUseGooglePlanMaps;
                this.IsAuthorizedToUseGoogleSatelliteMaps = this.Customer.IsAuthorizedToUseGoogleSatelliteMaps;
                this.IsAuthorizedToUseHereMaps = this.Customer.IsAuthorizedToUseHereMaps;
                this.IsAuthorizedToUseOSMMaps = this.Customer.IsAuthorizedToUseOSMMaps;
                this.IsAuthorizedToUseTunavMaps = this.Customer.IsAuthorizedToUseTunavMaps;
                if(this.Customer.Id==2083){
                  this.Map.map.addLayer(this.Map.mapLayers.GMP)
                }
            }
        });
        this.promiseRowData = await this._trackingObjectService.getUITrackingPageParamCompressed().then(() => {
            this._trackingObjectService.onPlacesChanged
                .pipe(takeUntil(this._unsubscribeAll),
                    take(1))
                .subscribe((res: any) => {

                    if (!isEmpty(res)) {
                        res.forEach(p => {
                            this.Map.createMarker(p.NamePlace,
                                p.Description, p.m_icon.m_MediumName, p.Point.Latitude,
                                p.Point.Longitude, p.Id);
                        });
                    }
                });
        });

        this.subscription = this._data.currentIndex.subscribe(index => this.selected.setValue(index))
        this.vehicles = this._activatedRoute.snapshot.data['trackingObj'];
        this._trajectoryService.trajectories.subscribe(trajects => {
            this.Trajects = trajects
            //console.log(this.Trajects)
        })
        this._runStopStateService.onRunStopStatesChanged.subscribe((runStopStates: any) => {
            this.RunStops = runStopStates;
        })
        this.translateService.get(['Adress', 'Date', 'Mileage', 'FuelLevel', 'Horodatage', 'Temperature', 'RPM', 'Speed','Speciality'])
            .subscribe(data => {
                TrackingInfoCard.Words = data;
            });
          

            
    }

    ngOnDestroy() {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        if (this.subscription != undefined) {
            this.subscription.unsubscribe();
        }
        this.Map.clearPlaces();
    }
    // changeMapLayer(layer: string) :void {
    //     this._ms.changeLayerOption(layer);
    // }

    deleteTraject(traject: Traject) {
        traject.remove();
        this._trajectoryService.deleteTraject(traject);
    }

    resize() {

        if (this.HeightStateIndex < this.TabsHeightStates.length - 1)
            this.HeightStateIndex++
        else
            this.HeightStateIndex = 0;
        this.TabsHeight = this.TabsHeightStates[this.HeightStateIndex];
    }
    ChoiceMap(layer) {
      this.Map.ChangeMapLayer(layer);
    }
    geofenceOpen(): void {

        this.dialogRef = this._matDialog.open(GeofenceFormComponent, {
            panelClass: 'app-geofence-form',
            disableClose: true,
            hasBackdrop: false
        });
        this.dialogRef.afterClosed()
            .subscribe((response: any) => {
                if (!response) {
                    return;
                }
            });
    }
    itineraryAdd(): void {

        this._matDialog.closeAll();

        this.line = this.Map.drawer.drawLine((line) => {
            this._latlngs = line._latlngs;
        });
        this.Map.map.once("contextmenu", () => {
            this.dialogRef = this._matDialog.open(WayDialogComponent, {
                disableClose: true,
                hasBackdrop: false,
                panelClass: 'orient-form-dialog',
                data: {
                    action: 'new',
                    names: [],
                    title: 'Common.AddRoute',
                    msgError: 'Route with this name already exists. Try again with a new name.'
                }
            });
            this.dialogRef.afterClosed()
                .pipe(take(1))
                .subscribe((response: any) => {
                    if (!response) {
                        if (this.line) {
                            this.Map.map.removeLayer(this.line.obj);
                            this.line.markers.forEach(element => {
                                this.Map.map.removeLayer(element);
                            });
                        }
                        this.dialogRef = null;
                        return;
                    }
                    const newWay = response.value;
                    if (environment.mock) {
                        const coords = this.leafletToCoords(this._latlngs);
                        this._geoZoneAssign.persistWay(newWay, coords);
                        this.dialogRef = null;
                        return;
                    }
                    this.latLngs = [].concat(...this._latlngs.map(Object.values));
                    this._placesGeometricShapesManagementService.addWay(newWay, this.latLngs, false);
                    this.dialogRef = null;
                });
        });
    }
    /**
     * add New Place
     */
    addPlace(): void {
        var names = this._trackingObjectService.places.map(item => item.NamePlace);
        this.dialogRef = this._matDialog.open(PlaceFormComponent, {
            panelClass: 'app-place-form',
            disableClose: true,
            hasBackdrop: false,
            data: {
                action: 'new',
                names: names
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: any) => {
                if (!response) {
                    return;
                }
                const newPlace = response.getRawValue();
                if (environment.mock) {
                    this._geoZoneAssign.persistUnassignedPlace(
                        newPlace.name,
                        +newPlace.latitude,
                        +newPlace.longitude
                    );
                    return;
                }
                this._placesService.addPlace(newPlace);
            });
    }
    /**
     * add New Polygon
     */
    addGeofencing() : void
    { 
        let radious ;
        this._matDialog.closeAll();
        this.Geofencing= this.Map.drawer.drawCircle((coords)=>{
            this._latlngs = coords._latlng;
            radious=coords.getRadius();

        })
        this.Map.map.once("contextmenu", e => {
            this.dialogRef = this._matDialog.open(WayDialogComponent, {
                disableClose: true,
                hasBackdrop: false,
                data: {
                    action: 'new',
                    title: 'Common.AddNewPolygon',
                    names: [],
                    msgError: 'Polygon with this name already exists. Try again with a new name.'
                }
            });
            this.dialogRef.afterClosed()
            .pipe(take(1))
            .subscribe((response: any) => {

                if (!response) {
                    if (isUndefined(response)) {
                        this.Map.map.removeLayer(this.Geofencing.obj);
                        this.Geofencing.markers.forEach(element => {
                            this.Map.map.removeLayer(element);
                        });
                    }

                    return;

                }
                const newPolygon = response && response.value ? response.value : response;
                if (environment.mock && newPolygon) {
                    const coords = this.leafletToCoords(this._latlngs);
                    this._geoZoneAssign.persistUnassignedPolygon(newPolygon, coords);
                }
                this.Map.drawer.stopDragging(this.Geofencing);
                this.dialogRef = null;
            });
        })


    }
    addPolygon(): void {
        //var names = this._placesGeometricShapesManagementService.polygons.map(item => item.Value.Name);
        this._matDialog.closeAll();

        this.polygon = this.Map.drawer.drawPolygon((coords) => {

            this._latlngs = coords.getLatLngs();
        });
        this.Map.map.once("contextmenu", e => {
         
            this.dialogRef = this._matDialog.open(WayDialogComponent, {
                disableClose: true,
                hasBackdrop: false,
                data: {
                    action: 'new',
                    title: 'Common.AddNewPolygon',
                    names: [],
                    msgError: 'Polygon with this name already exists. Try again with a new name.'
                }
            });
            this.dialogRef.afterClosed()
                .pipe(take(1))
                .subscribe((response: any) => {

                    if (!response) {
                        if (isUndefined(response)) {
                            this.Map.map.removeLayer(this.polygon.obj);
                            this.polygon.markers.forEach(element => {
                                this.Map.map.removeLayer(element);
                            });
                        }

                        return;

                    }
                    const newPolygon = response && response.value ? response.value : response;
                    if (environment.mock && newPolygon) {
                        const coords = this.leafletToCoords(this._latlngs);
                        this._geoZoneAssign.persistUnassignedPolygon(newPolygon, coords);
                        this.Map.drawer.stopDragging(this.polygon);
                        this.dialogRef = null;
                        return;
                    }
                    this.latLngs.pop()
                    var listPoint = ([].concat(...this._latlngs)).map(item =>

                        ({
                            Latitude: item.lat,
                            Longitude: item.lng
                        }));
                    this._placesGeometricShapesManagementService.addPolygon(listPoint, newPolygon, false);
                    this.Map.drawer.stopDragging(this.polygon);
                    this.dialogRef = null;
                });
        });


    }

    /** Flatten Leaflet latlng rings into mock LatLng tuples. */
    private leafletToCoords(latlngs: any): LatLng[] {
        const flat = [].concat(...(Array.isArray(latlngs) ? latlngs : []));
        const out: LatLng[] = [];
        for (let i = 0; i < flat.length; i++) {
            const item = flat[i];
            if (item && typeof item.lat === 'number' && typeof item.lng === 'number') {
                out.push([item.lat, item.lng]);
            }
        }
        return out;
    }
    /**
     * add New Way**/
    addWay(): void {

        this._matDialog.closeAll();

        this.line = this.Map.drawer.drawLine((coords) => {

            this._latlngs = coords._latlngs
        });
        this.Map.map.once("contextmenu", e => {
            this.dialogRef = this._matDialog.open(WayDialogComponent, {
                disableClose: true,
                hasBackdrop: false,
                data: {
                    action: 'new',
                    names: [],
                    title: 'Common.AddRoute',
                    msgError: 'Route with this name already exists. Try again with a new name.'
                }
            });

            this.dialogRef.afterClosed()
                .pipe(take(1))
                .subscribe((response: any) => {
                    if (!response) {
                        this.Map.map.removeLayer(this.line.obj);
                        this.line.markers.forEach(element => {
                            this.Map.map.removeLayer(element);
                        });
                        return;

                    }
                    const newWay = response.value;
                    this.latLngs = [].concat(...this._latlngs.map(Object.values));
                    if (environment.mock) {
                        const coords = this.leafletToCoords(this._latlngs);
                        this._geoZoneAssign.persistWay(newWay, coords);
                        this.dialogRef = null;
                        return;
                    }
                    this._placesGeometricShapesManagementService.addWay(newWay, this.latLngs, false);
                    this.dialogRef = null;
                });

        });

       

    }
    /**
     * disabled visibility
     */
    onSelection(options: MatListOption[], e): void {

        var selectedColumns: string[] = options.map(o => o.value);

    }
    /* clustering declustering */
    toggleSelection(event: any, cluster: any) {
        if (cluster.id == 1) {
            this.Map.toggleVehicleCluster(event.checked);
        } else if (cluster.id == 0) {
            this.Map.togglePlaceCluster(event.checked);
        }

    }
    /**
     * clear map
     * **/
    clearMap(): void {
        // this.Map.drawer.clear();
        this.Map.map.clearLayers();
    }
    dragEnd(unit, {
        sizes
    }) {
        this.sizes.percent.area1 = sizes[0];
        this.sizes.percent.area2 = sizes[1];
        if (this.HeightStateIndex < this.TabsHeightStates.length - 1)
            this.HeightStateIndex++
        else
            this.HeightStateIndex = 0;
        this.TabsHeight = this.TabsHeightStates[this.HeightStateIndex];

        this.Map.map.invalidateSize();
        
    }

    closeTab(index: number, e) {
        e.stopPropagation();
        this.tabs.splice(index, 1);
        this.tabGroup.selectedIndex = this.tabNodes.length - 1;
    }
    addTab(index_: number) {
        var __FOUND = this.tabs.find(tab => tab.tabType == index_);
        if (!isUndefined(__FOUND)) {
            this.selected.setValue(this.tabs.indexOf(__FOUND));
        } else {
            switch (index_) {
                case 5:
                    this.tabs.push({
                        tabType: 5,
                        name: 'Common.PlaceManagement'
                    });
                    break;
                case 6:
                    this.tabs.push({
                        tabType: 6,
                        name: 'Common.PolygonManagement'
                    });
                    break;
                case 7:
                    this.tabs.push({
                        tabType: 7,
                        name: 'Common.WayManagement'
                    });
                    break;
                default:
                    break;
            }

            this.selected.setValue(this.tabs.length - 1);
        }


    }
}