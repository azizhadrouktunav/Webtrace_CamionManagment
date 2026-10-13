
import { tileLayer, latLng, LatLngBounds, Marker, LatLng, FeatureGroup } from 'leaflet';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { environment } from '../../../../environments/environment';
import { Drawer } from './drawer';
import { Traject } from './traject';
import { GpsData } from '../trajectory/trajectory.model';
import 'leaflet-easyprint';
import * as esri from "esri-leaflet";
//import * as leafletSearch from 'leaflet-search';
// declare module 'leaflet' {
//     namespace control {
//       function browserPrint(options?: any): Control.BrowserPrint;
//     }
//     namespace Control {
//       interface BrowserPrint {
//         addTo(map: L.Map): any;
//       }
//     }
//   }
L["esri"] = esri;
L.Map.include({
    'clearLayers': function () {
      this.eachLayer(function (layer) {
          if(layer instanceof L.TileLayer) {
              return;
          }
          else {
            this.removeLayer(layer);
          }
      }, this);
    }
  });
const iconUrl = environment.iconUrl;

export class GlobalMap {
    
    static globalMap : GlobalMap = new GlobalMap();
    drawer : Drawer;
    counts : number = 0;
   
    MainTrajectory : Traject;
    AnimationControlsVisibility : boolean = false;
    trajectAnimator : any;
    
    map: any;
    
    mapLayers = {
        //'Map': tileLayer('https://maptiles.p.rapidapi.com/local/osm/v1/3/6/3.png?apikey=54021d7778mshfecdb032eaec8adp107b43jsn7f9ca18d7102'),
        'OSM': tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 17}),
        'Satelite': L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }),        //'Satelite': tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
        'CycleMap': tileLayer('https://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'),
        'Hybrid': L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{maxZoom:20, subdomains:['mt0','mt1','mt2','mt3'] }),
        'Terrain': L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{maxZoom:20, subdomains:['mt0','mt1','mt2','mt3'] }),
        'Tunav' : L["esri"].tiledMapLayer({url: 'http://41.226.27.193:6080/arcgis/rest/services/Map_Tunav_18_5_2017/MapServer'}),
        'GMP' : L["esri"].tiledMapLayer({url: 'http://41.226.27.193:6080/arcgis/rest/services/GMP_MAP/MapServer', zIndex:999})
        // 'MapBoxBlue': L.tileLayer('https://api.mapbox.com/styles/v1/alamed/ckfgy7kt12ohh19nkuuuux0gh/tiles/{z}/{x}/{y}?access_token={accessToken}', { id: 'mapbox/streets-v11', accessToken: '' }),
        // 'MapBoxDark': L.tileLayer('https://api.mapbox.com/styles/v1/alamed/ckim00mxk2epi17p98vjsmn7a/tiles/{z}/{x}/{y}?access_token={accessToken}', { id: 'mapbox/streets-v11', accessToken: '' }),
    };

    layerName = 'Terrain';
    layer = this.mapLayers[this.layerName];

    options = {
        center: latLng(36.8363, 10.2024),
        zoomControl: true,
        zoom: 5,
        minZoom: 3,
        zoomSnap:0.01,
        detectRetina: true,
        maxBounds: new LatLngBounds(latLng(-89, -179), latLng(89, 179)),
        maxBoundsViscosity: 0.75,
        layers: [
          this.mapLayers[this.layerName],
        ]
    };

    paddingTopLeft : L.Point = new L.Point(0,0);
    paddingBottomRight : L.Point = new L.Point(0,0);

    trackingObjectsCluster: L.MarkerClusterGroup;
    placesCluster: L.MarkerClusterGroup;
	trackingObjectsMarkers: L.Marker[] = [];
    markerClusterOptions: L.MarkerClusterGroupOptions = {
        iconCreateFunction: this.ClusterIcon("CarsIconCluster"),
        animate:true,
        spiderfyOnMaxZoom : true
    };
    drawnItems: FeatureGroup = new FeatureGroup();
    deletableLayers : any[] = [];
    deletableShapes : any[] =  [];
    placeClusterOptions : L.MarkerClusterGroupOptions = {
        iconCreateFunction: this.ClusterIcon("PlacesIconsCluster"),
        animate:true
    };
    placeMarkers = {};

   // markersLayer : L.LayerGroup;	//layer contain searched elements
    constructor(){
        this.trackingObjectsCluster = L.markerClusterGroup(this.markerClusterOptions);
        this.trackingObjectsCluster.on('clusteradd',(a)=>{
           // console.log(a)
        })

        this.placesCluster = L.markerClusterGroup(this.placeClusterOptions);

        this.drawer = new Drawer(this);
        //this.markersLayer  = new L.LayerGroup();
    }

    ChangeMapLayer(layerName:string){
        this.layer.removeFrom(this.map)
        this.layer = this.mapLayers[layerName].addTo(this.map)
    }
    // AddMapLayer(layerName:string){
    //   //  this.layer.removeFrom(this.map)
    //     this.layer = this.mapLayers[layerName].addTo(this.map)
    // }
    onMapReady(map: L.Map) {
       // L.Control.addInitHook(leafletSearch);
        this.map = map;
        //this.markersLayer.addTo(this.map);
        (L as any).easyPrint({
            title: 'print button',
            position: 'topleft',
            sizeModes: ['A4Portrait', 'A4Landscape'],
            exportOnly: true,
            tileLayer:  this.layer,
            filename: 'Map',
            hideControlContainer:false
            //hideClasses : ['leaflet-control-zoom', 'leaflet-control-attribution', 'RealTimeTrackingObject', 'marker-cluster'],
        }).addTo(this.map);
        this.trackingObjectsCluster.addTo(this.map)
        //this.ChangeMapLayer(this.layerName)
        
        

    //    const provider = new OpenStreetMapProvider();

    //    const searchControl =  GeoSearchControl({
    //             provider: provider,
    //         });
        
    //     this.map.addControl(searchControl);
        // var controlSearch = new L.Control["Search"]({
        //     position:'topleft',		
        //     layer: this.markersLayer,
        //     initial: true,
        //     zoom: 12,
        //     marker: true
        // });
    
        // map.addControl(controlSearch);
        
    }
    CreateMarker(latlng:LatLng,options:any) {
        options.riseOnHover = true
        let marker =  new Marker(latlng,options)
        this.trackingObjectsCluster.addLayer(marker);
        return marker;
    }

    clearTrackingMarkerCluster(){
        this.trackingObjectsCluster.clearLayers();
    }

     /**
     * create place 
     */
    createMarker(name: string, description: string, iconUrl: string, lat: number, lng: number, id: number): void {
        var placeIcon = L.icon({
            iconUrl: iconUrl,
            iconSize: [25, 41],
            iconAnchor: [13, 0]
        });
       var marker: L.Marker = L.marker([lat, lng], {
            icon: placeIcon,
            title: name
        });

        marker.bindPopup('<strong> Name : </strong>' + name +
                         '</br><strong>Description : </strong>' + description).openPopup();
        marker.addTo(this.placesCluster);
        //this.markersLayer.addLayer(marker);
        this.placeMarkers[id] = marker;
    }
    /**
     * show hide place
    */
    togglePlace(id: number, isVisivble: boolean = true) {
        var marker : L.Marker = this.placeMarkers[id];
       if (isVisivble)
        {   this.map.addLayer(marker);
            marker.openPopup();
            this.focusOn([marker.getLatLng()], 0, 16);
        }
        else {
            //this.placesCluster.removeLayer(marker);
            this.map.removeLayer(marker);
        }
    }
    /*
    show hide all place
    */
    toggleAllPlace(isVisivble: boolean = true) {
          
        var positions : L.LatLng[] = [];
            for (let key in this.placeMarkers) {
                var marker : L.Marker = this.placeMarkers[+key];
                    if(isVisivble) {
                        positions.push(marker.getLatLng());
                        this.map.addLayer(marker);
                        
                    }
                    else {
                        this.map.removeLayer(marker);
                    }
            }

            this.focusOn(positions, 0, 16);
    }
    /* hide show place cluster*/
    togglePlaceCluster(isVisivble: boolean) {
        isVisivble ? this.map.addLayer(this.placesCluster) : this.map.removeLayer(this.placesCluster);
    }
    /* hide show vehicle cluster*/
    toggleVehicleCluster(isVisivble: boolean) {
        isVisivble ? this.map.addLayer(this.trackingObjectsCluster) : this.map.removeLayer(this.trackingObjectsCluster);
    }
    ClusterIcon(MyClassName) {
        return function (cluster) {
            var childCount = cluster.getChildCount();

            var c = ' marker-cluster-';
            if (childCount < 10) {
                c += 'small';
            } else if (childCount < 100) {
                c += 'medium';
            } else {
                c += 'large';
            }

            return new L.DivIcon({
                html: '<div><span>' + childCount + '</span></div>',
                className: 'marker-cluster' + c + " " + MyClassName,
                iconSize: new L.Point(40, 40)
            });
        }
    }

    clearPlaces(){
        this.placesCluster.clearLayers();
    }

    drawTrajectory(data: GpsData[], name : string, key : string, showStop: boolean, showDirection:boolean, showSOS:boolean,showAlerts){
        return new Traject(data, name, key, showStop , showDirection,showSOS,showAlerts);
    }

    ResetPadding(value){
        let mapDiv = document.getElementById("map");
        let paddingBottom : number =  mapDiv.parentElement.parentElement.offsetHeight -  mapDiv.offsetHeight;

        this.paddingTopLeft = new L.Point(100 + value, 50 + value)
        this.paddingBottomRight = new L.Point(100 + value, 50 + value + paddingBottom)

        //console.log([this.paddingTopLeft, this.paddingBottomRight])
        return [this.paddingTopLeft, this.paddingBottomRight]
    }

    

    focusOn(obj, padding : Number, zoom? : Number, include0Points? : Boolean, speed? : number){
        if(!speed && speed != 0) speed = 2;
        let pads = this.ResetPadding(padding)
        if(zoom == -1)
        zoom = this.map.getZoom();
        let points = []
        obj.forEach(latlng => {
            if(!include0Points){
                if(latlng.lat != 0 && latlng.lng != 0)
                points.push([latlng.lat, latlng.lng]) 
            }else{
                points.push([latlng.lat, latlng.lng])
            }
        })

    if(points.length)
        this.map.flyToBounds(points, { maxZoom: 15 ,animate: speed!=0?true:false, duration: speed, paddingTopLeft:pads[0], paddingBottomRight: pads[1]})
    }

    GetBounds() : any{
        let mapDiv = document.getElementById("map");
        let paddingBottom : number =  mapDiv.parentElement.parentElement.offsetHeight -  mapDiv.offsetHeight;

       // console.log(this.map.getBounds());

        let bounds = this.ResetPadding(10)
        return L.bounds(bounds[0], bounds[1])
    }

// print map
printMap() : void {
    
}

    //      animation speed is preferable to be between 0 and 10 (Point per second P/sec)
    AnimateTrajectory(T : Traject){
        if(T.isPlayingAnimation) return 0;
        if(this.MainTrajectory) this.MainTrajectory.StopAnimator();

        T.animate();
        this.trajectAnimator = T.AutoPlay(0.5);
        this.AnimationControlsVisibility = true;
        this.MainTrajectory = T;
    }
    
    SetAnimationSpeed(speed : number){
        clearInterval(this.trajectAnimator)
        this.trajectAnimator = this.MainTrajectory.AutoPlay(speed);
    }

    PauseAnimating(){
        this.MainTrajectory.PauseAnimator();
    }

    PlayAnimating(){
        this.MainTrajectory.resume();
        this.MainTrajectory.AutoPlay(1);
    }

    StopAnimating(){
        this.MainTrajectory.StopAnimator();
        this.AnimationControlsVisibility = false;
    }

    PlayBySteps(steps : number){
        this.MainTrajectory.Play(steps, 1)
    }

    deleteShape(shape : any, index : number, $event){
        $event.stopPropagation();
        shape.remove()
        this.deletableShapes.splice(index, 1)
    }

    ClearAll($event){
        $event.stopPropagation();
        this.deletableShapes.forEach( shape => {
            shape.remove();
        })
        this.deletableShapes = [];

        this.deletableLayers.forEach( (layer , index) => {
            this.drawer.clearObject(layer, index)
        })
    }
}

