import * as L from "leaflet";
//import * as PolylineDecorator from "leaflet-polylinedecorator";
import { GpsData } from "../trajectory/trajectory.model";
import * as Moment from 'moment';
import { array } from "@amcharts/amcharts4/core";


export class RunStop {

    static highlightedPart : L.Layer[] = [];

    map! : L.Map;
    points : GpsData[] = [];
    start! : GpsData
    end! : GpsData
    length : number = 0;
    startCoords! : L.LatLng;
    endCoords! : L.LatLng;
    Coords : L.LatLng[] = [];
    polyline! : L.Polyline;
    stopPoints : L.LatLng[] = [];
    stopsData : GpsData[] = [];
    stops : L.Marker[] = [];
    shadowLine! : L.Polyline;
    firstMarker! : L.Marker;
    lastMarker! : L.Marker;
    RunStopPoints : GpsData[] = [];
    startMarker! : L.Marker;
    endMarker! : L.Marker;
    directions : number[] = [];
    directionLine! : any;
    showDirection : boolean = false;
    showStops : boolean = true;
    isVisible : boolean = true;
    highlitedPart : L.Polyline | undefined;
    name : string = "";
    color : string;

    constructor(data : { Matricule: string, AllExtendedGpsDataStopRunState : GpsData[]}, color: string) {
        
        // let arr = data.AllExtendedGpsDataStopRunState.map(item => {
        //     return decodeLatLngs(item.URL)
        // })

        // console.log(arr)




        this.color = color

        this.name = data.Matricule + 'runStop';

        this.initData(data)

        //console.log(data)

        if(this.points.length == 0) return;
        this.initBorders(this.points[0], this.points[this.length-1])

        this.points.forEach(data => {
          this.processPoint(data)
        })
        
        this.initPolylines()
        // this.initDirections()


        this.sortRunStopPoints()
        
        
    }

    initData(data : any){
        this.length = data.AllExtendedGpsDataStopRunState.length;
        this.points = data.AllExtendedGpsDataStopRunState;
    }

    setColor(color : string){
        this.color = color;
        this.polyline.setStyle({
            color : color
        })
    }

    getColor(){
        return ():string => this.color
    }

    shadow : L.Polyline | undefined;

    updateShadow(){
        let line : any = RunStop.highlightedPart[1]
        if(line.getLatLngs().length == 0) {
            this.shadow.remove()
            return;
        }
        this.shadow = new L.Polyline([...line.getLatLngs()], {
            className : 'shadowPulse',
            weight:4,
            color: "#ffffffc9",
        })
        this.shadow.addTo(this.map)
    }

    highlightPart(index : number){
        let id = this.points.findIndex(item=>item.Id == index)
        
        let arr = decodeLatLngs(this.points[id].URL)
        
        if(arr.length == 0) return;

        //RunStop.highlightedPart?RunStop.highlightedPart.forEach(l=>l.remove()):false;

        if(arr.length > 1) {
            let poly = new L.Polyline(arr, {
                weight:6,
                color: "#008000",     // #007fff
                className: 'runStopPart'
            })

            poly.addTo(this.map)
            RunStop.highlightedPart[1] = poly;
            this.map.flyToBounds(poly.getBounds(), {
                padding : [50,50],
                duration : 0,
                animate : false
            })
            this.updateShadow()
        } else {
            let stopId = this.stops.findIndex(e=>this.points[id].Latitude == e.getLatLng().lat && this.points[id].Longitude == e.getLatLng().lng)
            this.stops[stopId].addTo(this.map)
            if(RunStop.highlightedPart[0] != undefined){
                if(RunStop.highlightedPart[2] ! = undefined){
                    RunStop.highlightedPart[0].remove()
                    RunStop.highlightedPart[0] = RunStop.highlightedPart[2]
                }else {
                    RunStop.highlightedPart[2] = this.stops[stopId]
                    RunStop.highlightedPart[2].addTo(this.map)
                }
            }else {
                RunStop.highlightedPart[0] = this.stops[stopId]
                RunStop.highlightedPart[0].addTo(this.map)
            }
            this.map.flyTo(arr[0])
        }
    }

    

    toggleVisiblity(force? : boolean){
        console.log("toggle visibility", this.isVisible)
        if(force != true){
            this.polyline.remove()
            this.shadowLine.remove()
            // this.stops.forEach(stopMarker => {
            //     stopMarker.remove()
            // })
            this.startMarker.remove()
            this.endMarker.remove()
            this.isVisible = false;
        }else{
            this.polyline.addTo(this.map)
            this.shadowLine.addTo(this.map)
            // this.stops.forEach(stopMarker => {
            //     stopMarker.addTo(this.map)
            // })
            this.startMarker.addTo(this.map)
            this.endMarker.addTo(this.map)
            this.isVisible = true;

            this.map.fitBounds(this.polyline.getBounds())
        }
    }
    
    sortRunStopPoints(){
        this.points.forEach(item=>{
            if(item.StopRunStatusEnum == 1){
                this.RunStopPoints.push(item)
            } else if(item.StopRunStatusEnum == 0){
                this.RunStopPoints.push(item)
            }
        })
    }

    getPartSelectedByTime(start : string, end: string) : L.LatLng[] {
        let startD = svc2date(start)
        let endD = svc2date(end)
        let startI = this.points.findIndex(item => {
            return svc2date(item.AcquisitionTime) >= startD
        })
        let endI = this.points.findIndex(item => {
            return svc2date(item.AcquisitionTime) >= endD
        })+1
       // console.log(this.points.slice(startI,endI))

        let coordsIStart;
        let coordsIEnd;

        coordsIStart = this.Coords.findIndex(item => {
            return item.lat == this.points[startI].Latitude && item.lng == this.points[startI].Longitude
        })
        coordsIEnd = this.Coords.findIndex(item => {
            return item.lat == this.points[endI].Latitude && item.lng == this.points[endI].Longitude
        })



        return this.Coords.slice(coordsIStart,coordsIEnd)
    }

    togglePart(part : L.Polyline){
        if(this.highlitedPart)
        this.highlitedPart.removeFrom(this.map)
        this.highlitedPart = part
       // console.log(this.highlitedPart)
        //console.log(this.map)
        this.highlitedPart.addTo(this.map)

        this.map.fitBounds(this.highlitedPart.getBounds())
    }

    remove(){
        this.polyline.remove()
        this.shadowLine.remove()
        this.stops.forEach(stopMarker => {
            stopMarker.remove()
        })
        this.startMarker.remove()
        this.endMarker.remove()
        this.highlitedPart?this.highlitedPart.remove():false;
    }


    // initDirections(){
    //     this.directionLine =  new L.PolylineDecorator(this.polyline,{
    //         patterns: [
    //             {offset: 0, repeat: 30, symbol: new L.Symbol.ArrowHead({ 
    //                 polygon: false,
    //                 pixelSize: 5,
    //                 headAngle: 45,
    //                 pathOptions: {
    //                     stroke: true,
    //                     weight: 2,
    //                     color : "white",
    //                     pane : 'trajectPane',
    //                     className: 'TrajectPath'
    //                 }})}
    //         ]
    //     }) 
    //     let dirs : number[] = [];
    //     this.directions.forEach((dir,index)=>{
    //         if(Math.abs(dir - this.directions[index-1])>20){
    //             dirs.push(dir)
    //         }
    //     })
    // }


    initPolylines(){
        this.polyline = new L.Polyline(this.Coords, {
            weight:6,
            color: this.color,     // #007fff
            className: 'TrajectPath'
        })

        this.shadowLine = new L.Polyline(this.Coords, {
            weight:4,
            color: "#ffffffc9",
            className : 'shadowPulse',
        })
    }

    initBorders(start : GpsData, end : GpsData){
        this.start = start;
        this.end = end

        this.startCoords = new L.LatLng(start.Latitude, start.Longitude)
        this.endCoords = new L.LatLng(end.Latitude, end.Longitude);

        this.startMarker = new L.Marker(this.startCoords,{
            icon : startIcon,
        })
        this.endMarker = new L.Marker(this.endCoords,{
            icon : endIcon,
        })
    }

    processPoint(data : GpsData){
        this.directions.push(data.Direction)
        let coord = new L.LatLng(data.Latitude, data.Longitude);
        this.Coords.push(coord)

        // concat this.Coords + this.decryptUrl(data.URL)

        let arr = decodeLatLngs(data.URL)
        this.Coords.push(...arr)
        

        
        data.SpeedAverageAtRunStatus = parseInt(data.SpeedAverageAtRunStatus.toString());
        data.CumulativeDistanceString = parseInt(data.CumulativeDistanceString.toString());
        
        if(data.StopRunStatusEnumString=='Stop'){
            this.setStop(data);
        }
        if(data.StopRunStatusEnum == 2){
            this.setVeilleMarker(data)
        }
    }

    setVeilleMarker(data:GpsData) {
        let divIcon = document.createElement('div');
       // divIcon.style.backgroundImage = "url('assets/images/veille-icon.gif')";
        //divIcon.className = 'VeillePoint';
        divIcon.className = 'veille';

        let marker = new L.Marker([data.Latitude, data.Longitude], {
            icon: new L.DivIcon({
                html: divIcon
            }),
        })

        marker.bindPopup(`
            Date : ${data.BeginDateLocalString}
            <br>Emplacement : ${data.NearestPlaceString}
        `)
        marker.bindTooltip(data.BeginDateLocalString)

        this.stops.push(marker)
        return marker;

    }

    setStop(data : GpsData){
        let coord = new L.LatLng(data.Latitude, data.Longitude);
        this.stopPoints.push();
        this.stopsData.push(data);
        let marker = new L.Marker(coord,{
            icon : stopIcon,
        })
        //console.log(data.AcquisitionTime)
        marker.bindTooltip(simpleDateFormat(svc2date(data.AcquisitionTime)) + "<br>" + data.PeriodString + "<br>" + data.NearestPlaceString)
        this.stops.push(marker);
    }

    decryptUrl(latLngCompressed) : L.LatLng[]{
        try {
            var allLatLong = latLngCompressed.replace('!', '\\');
            var arrayLatLng;
            var encodedLtLg = getQueryVariable('ltlg', allLatLong);
            if (encodedLtLg != undefined) {
                encodedLtLg = encodedLtLg.replace(/%60/g, '`');
                encodedLtLg = encodedLtLg.replace(/%7D/g, '}');
                encodedLtLg = encodedLtLg.replace(/%7B/g, '{');
                encodedLtLg = encodedLtLg.replace(/%7E/g, '~');
                encodedLtLg = encodedLtLg.replace(/%5C/g, '\\');
                encodedLtLg = encodedLtLg.replace(/%5E/g, '^');

                arrayLatLng = decodeLine(encodedLtLg).split("$");
                //(arrayLatLng)
            }
            
            return extractLatLngs(arrayLatLng)

        }
        catch (err) {
            let txt = "There was an error on showRunOrStopOnMap(latLngCompressed) .\n\n";
            txt += "Error description: " + err.description + "\n\n";
            txt += "Click OK to continue.\n\n";
            alert(txt);
        }
        
    }
}




let stopIcon = new L.DivIcon({
    html: '<img src="assets/images/Stop.png">',
    iconSize: [20, 20],
    iconAnchor: [10,10],
    className: 'stopIcon'
  })

  
let startIcon = new L.DivIcon({
    html: '<img src="assets/images/startFlag.png">',
    iconSize: [0, 0],
    iconAnchor: [10,60],
    className: 'pathStart'
  })

  let endIcon = new L.DivIcon({
    html: '<img src="assets/images/endFlag.png">',
    iconSize: [0, 0],
    iconAnchor: [10,60],
    className: 'pathEnd'
  })

  

export function simpleDateFormat(date : Date){
    // return date in 24 hours format (hh:mm)
    return Moment(date).format('DD MMM HH:mm').toString()
  //return Moment().add(-diff,'milliseconds').format('DD MMM hh:mm').toString()
}

export function svc2date(time : string){
  
    try{
        let stringDate = time.split('/Date(')[1].split(')/')[0];
        let gmt_Str :string='';
        let intDate=0;
        let gmtServeur : number =0;
        if(stringDate.indexOf('+') != -1)
        {
            gmt_Str = stringDate.split('+')[1];
            intDate=parseInt( stringDate.split('+')[0]);
            gmtServeur=parseInt(gmt_Str)/100;

        } else  if(stringDate.indexOf('-') != -1){
            gmt_Str = stringDate.split('-')[1];
            intDate=parseInt( stringDate.split('-')[0]);
            gmtServeur=parseInt(gmt_Str)/100 *-1;
        }
        let gmtTotal = intDate+((gmtServeur + (1 * -1))* 3600000 );
        let myDate= new Date(gmtTotal);
        return myDate;

    }
    catch(err)
    {
        return new Date();

    }
}


function extractLatLngs(array){
    let lats = []
    let lngs = []
    array.forEach((item, index)=>{
        if(index % 2 == 0)
        lats.push(item)
        else
        lngs.push(item)
    })

    let latlngs = []
    for(var i =0; i<lats.length; i++){
        latlngs.push(new L.LatLng(lats[i], lngs[i]))
    }
    return latlngs
}



function decodeLatLngs(latLngCompressed) {
    
    var allLatLong = latLngCompressed.replace('!', '\\');
    var arrayLatLng;
    var encodedLtLg = getQueryVariable('ltlg', allLatLong);
    if (encodedLtLg != undefined) {
        encodedLtLg = encodedLtLg.replace(/%60/g, '`');
        encodedLtLg = encodedLtLg.replace(/%7D/g, '}');
        encodedLtLg = encodedLtLg.replace(/%7B/g, '{');
        encodedLtLg = encodedLtLg.replace(/%7E/g, '~');
        encodedLtLg = encodedLtLg.replace(/%5C/g, '\\');
        encodedLtLg = encodedLtLg.replace(/%5E/g, '^');

        arrayLatLng = decodeLine(encodedLtLg).split("$");;
    }

    return arrayLatLng.map((value, index)=>{
        if(index%2!=1)
            return new L.LatLng(value, arrayLatLng[index+1])
    }).filter(e=>e!=undefined)

    //console.log(latLngCompressed, arrayLatLng)
}


function getQueryVariable(variable, allLatLong) {
    var query = allLatLong.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
}



function decodeLine(encoded) {
    var len = encoded.length;
    var index = 0;
    var latlongString = "";
    var lat = 0;
    var lng = 0;
    try {
        while (index < len) {
            var b;
            var shift = 0;
            var result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += dlng;
            //array.push(new google.maps.LatLng((lat * 1e-5), (lng * 1e-5)));
            if (lat != 0 && lng != 0)
                latlongString += (lat * 1e-5).toString() + '$' + (lng * 1e-5).toString() + '$';
        }
    } catch (ex) {
        //error in encoding.
    }
    return latlongString.substr(0, latlongString.length - 1);
}