import * as L from 'leaflet';
import { keyBy } from 'lodash';
import { GpsData, Trajectory } from '../trajectory/trajectory.model';
import { TrajectoryService } from '../trajectory/trajectory.service';
import { GlobalMap } from './map';
import "./snakeAnimation"

export class Traject {

    Map = GlobalMap.globalMap;

    static trajects: any = {};
    static colors = ['#008352', '#5000A0', '#680070', '#FF00FF', '#4040FF', '#1010A0', '#000040'];

    public data: GpsData[];
    public name: string;
    public polyline: L.Polyline;
    public flow: L.Polyline;
    public points: L.LatLng[];
    public stops: L.Marker[] = [];
    public veilles :L.Marker[]=[];
    public SOSMarker: L.Marker[] = [];
    public alertMarker: L.Marker[] = [];
    public start: L.Marker;
    public end: L.Marker;
    public layerGroup: L.LayerGroup = new L.LayerGroup();
    private color: string;
    public isVisible: boolean = true;
    public isAnimating: boolean = true;
    public isPlayingAnimation: boolean = false;
    private currentPlayingPointIndex: number = 0;
    public animationState: string = 'Stop';
    private animatedPiece : L.Polyline;
    private FlagRotator : HTMLDivElement = document.createElement('div');
    private AnimationFlag: L.Marker = new L.Marker([0, 0], {
        icon: new L.DivIcon({
            className: 'TrajectFlag',
            html : this.FlagRotator,
            // iconUrl: 'assets/images/TopDownCar.png',
            // iconSize: [18, 36],
            // iconAnchor: [9, 18],
        }),
    });
    public keepTrakcing : boolean = true;


    constructor(gpsData: GpsData[], name: string, key: string, showStop: boolean = true, showVeille: boolean = true,
        showDirection: boolean = true, showSOS: boolean = true ,showAlert: boolean = false) {

        //console.log(gpsData)
        this.data = gpsData;
        this.name = name;
        this.color = Traject.getColor();
        this.points = gpsData.map((data: GpsData) => {
            let customer = localStorage.getItem("Customer");
           // if (customer == "2055") {
                if (data.StopRunStatusEnumString == 'Stop' ) {
                    if(data.DesAlert=="QlDigitalInput1Off" || data.PeriodInMilliseconds > 0)
                       this.stops.push(this.setStopMarker(data, showStop));
                    

                } else if (data.StopRunStatusEnumString == 'Ralenti' ){
                   // if(data.DesAlert=="" || data.PeriodInMilliseconds == 0)
                    // missing condition here
                       this.veilles.push(this.setVeilleMarker(data, showVeille));

                } 


                else if (data.IsSOSData) {
                    this.SOSMarker.push(this.setSOSMarker(data, showSOS))
                }
                else if (data.IsAlert && data.DesAlert != "Inconnu") {
                    this.alertMarker.push(this.setAlertMarker(data, showAlert));

                }
            //}
           /* else {
                if (data.StopRunStatusEnumString == 'Stop' && data.PeriodInMilliseconds > 0) {
                    this.stops.push(this.setStopMarker(data, showStop));
                }
                else if (data.DesAlert =="" || data.PeriodInMilliseconds == 0) {
                   // this.stops.push(this.setVeilleMarker(data, showVeille));

                }
                
                else if (data.IsSOSData) {
                    this.SOSMarker.push(this.setSOSMarker(data, showSOS))
                }
                else if (data.IsAlert && data.DesAlert != "Inconnu") {
                    this.alertMarker.push(this.setAlertMarker(data, showAlert));

                }
            }*/
            return new L.LatLng(data.Latitude, data.Longitude)
        })

        this.polyline = new L.Polyline(this.points, {
            className: "traject",
            weight: 6,
            color: this.color
        }).addTo(this.layerGroup)
        this.start = new L.Marker(this.points[0], {
            icon: new L.DivIcon({
                html: document.createElement('div'),
                className: 'trajectStart'
            })
        }).addTo(this.layerGroup)
        this.end = new L.Marker(this.points[this.points.length - 1], {
            icon: new L.DivIcon({
                html: document.createElement('div'),
                className: 'trajectEnd'
            })
        }).addTo(this.layerGroup)

        this.Map.focusOn(this.polyline.getLatLngs(), -30);
        this.setDirectionFlow();

        this.FlagRotator.className += 'FlagRotator';

        this.layerGroup.addTo(this.Map.map)
    }

    setStopMarker(data: GpsData, show: boolean): L.Marker {
        let divIcon = document.createElement('div');
        divIcon.style.backgroundImage = "url('assets/images/stop-icon.png')";
        divIcon.className = 'StopPoint';

        let marker = new L.Marker([data.Latitude, data.Longitude], {
            icon: new L.DivIcon({
                html: divIcon
            }),
        })

        marker.bindPopup(`
            Date : ${data.BeginDateLocalString}
            <br>Durée du Stop : ${data.PeriodString}
            <br>Emplacement : ${data.NearestPlaceString}
        `)
        marker.bindTooltip(data.BeginDateLocalString)
        if (show) {
            marker.addTo(this.layerGroup);
        }
        return marker;
    }


    setVeilleMarker(data:GpsData, show:boolean): L.Marker {
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
        if (show) {
            marker.addTo(this.layerGroup);
        }
        return marker;

    }






    setSOSMarker(data: GpsData, show: boolean): L.Marker {
        let divIcon = document.createElement('div');
        divIcon.style.backgroundImage = "url('assets/images/sos.gif')";
        divIcon.className = 'StopPoint';
        // divIcon.style.border = "solid 4px " + this.color;

        let marker = new L.Marker([data.Latitude, data.Longitude], {
            icon: new L.DivIcon({
                html: divIcon
            }),
        })

        marker.bindPopup(`
             Date : ${data.BeginDateLocalString}
            <br>Emplacemnt : ${data.NearestPlaceString}

        `)
        marker.bindTooltip(data.BeginDateLocalString)
        if (show) {
            marker.addTo(this.layerGroup);
        }
        return marker;
    }
    setAlertMarker(data: GpsData, show: boolean): L.Marker {
        let divIcon = document.createElement('div');
        divIcon.style.backgroundImage = "url('assets/images/alert-icon.png')";
        divIcon.className = 'StopPoint';
        // divIcon.style.border = "solid 4px " + this.color;

        let marker = new L.Marker([data.Latitude, data.Longitude], {
            icon: new L.DivIcon({
                html: divIcon
            }),
        })

        marker.bindPopup(`
             Date : ${data.BeginDateLocalString}
            <br>Emplacemnt : ${data.NearestPlaceString}
            <br>Type d'alert : ${data.DesAlert}

        `)
        marker.bindTooltip(data.BeginDateLocalString)
        if (show) {
            marker.addTo(this.layerGroup);
        }
        return marker;
    }
    setDirectionFlow() {

        this.flow = new L.Polyline(this.points, {
            className: "TrajectoryFlow",
        })

        this.flow.addTo(this.layerGroup);
    }

    ToggleVisibility() {
        this.isVisible ? this.hideLayer() : this.showLayer();
    }

    hideLayer() {
        this.layerGroup.removeFrom(this.Map.map);
        this.isVisible = false;
        this.StopAnimator();
    }

    showLayer() {
        this.layerGroup.addTo(this.Map.map)
        this.isVisible = true;
        this.Map.focusOn(this.polyline.getLatLngs(), -30);
    }

    ToggleFlow(value ? : boolean) {
        //console.log(this)
        if (value != undefined)
            this.isAnimating = value;
        else
            this.isAnimating = !this.isAnimating;

        if (!this.isAnimating)
            this.layerGroup.removeLayer(this.flow)
        else
            this.layerGroup.addLayer(this.flow)
    }

    remove() {
        this.layerGroup.remove();
        this.layerGroup.removeFrom(this.Map.map);
        this.isVisible = false;
        this.StopAnimator();
    }

    static getColor() {
        let color = Traject.colors[0];
        let colors = Traject.colors.splice(1)
        colors.push(color);
        Traject.colors = colors;
       // console.log(color)
        return color;
    }

    animate() {
        this.isPlayingAnimation = true;
        this.AnimationFlag.addTo(this.layerGroup)
        this.AnimationFlag.setLatLng(this.points[0])
        // console.log(this.points.length)
        // this.AutoPlay(2);
    }

    resume() {
        this.isPlayingAnimation = true;
    }

    Play(count: number, speed) {
        

        if (this.isPlayingAnimation) {
            let I = this.currentPlayingPointIndex + count;
            if (I > 0 && I < this.points.length - 1) {
                if (I == this.points.length - 2) {
                    this.isPlayingAnimation = false;
                    return 0;
                }
               
                this.AnimatorUpdateStops(I)

                let points = this.points.slice(0, I)
                let pointsToAnimate = points.slice(this.currentPlayingPointIndex - 1, I)
                points = points.slice(0, this.currentPlayingPointIndex)

                this.flow.setLatLngs(points)
                this.polyline.setLatLngs(points)
                


                
                if(this.animatedPiece) this.animatedPiece.remove()
                if(pointsToAnimate.length > 1 && this.polyline.getElement()["getTotalLength"]() > 50){
                    this.animatedPiece = new L.Polyline(pointsToAnimate,{
                        color:'transparent'
                    }).addTo(this.Map.map);
                    
                    let lineOptions : any = {
                        snakingSpeed : this.animatedPiece.getElement()["getTotalLength"]() / speed,
                        className: "traject",
                        weight: 6,
                        color: this.color
                    };
                    this.animatedPiece.remove()
                    this.animatedPiece = new L.Polyline(pointsToAnimate, lineOptions);
                    try{ (this.animatedPiece as any).addTo(this.Map.map).snakeIn() } catch (err) {}
                }
                this.AnimationFlag.setLatLng(this.points[I - 1])
                this.FlagRotator.style.transform = "rotate("+(this.data[I - 1].Direction+180)+"deg)";

                if(this.keepTrakcing && this.animatedPiece && !this.Map.map.getBounds().contains(this.animatedPiece.getLatLngs()[0])){
                    let segmentPoints = this.animatedPiece.getLatLngs();
                    let focusPoints
                    if(segmentPoints.length){
                        if (segmentPoints.length == 1){
                            focusPoints = [this.animatedPiece.getLatLngs()[0], this.points[I]];
                        }else if(segmentPoints.length == 2){
                            focusPoints = [...this.animatedPiece.getLatLngs(), this.points[I]];
                        }
                        //console.log(focusPoints)
                        this.Map.focusOn(focusPoints, 50, -1, true, 0);
                    }
                }

                this.currentPlayingPointIndex = I;
            } else {
                console.log("the Ammount of points to animate are out of path range")
            }
        } else {
            console.log("this Trajectory animation is off , turn it on to play animation")
        }
    }

    AutoPlay(speed: number) {
        this.animationState = "Play"
        let animator = setInterval(() => {
            if (this.isPlayingAnimation){
                this.Play(1, speed);
                this.resume();
            } else clearInterval(animator)
        }, 1000 / speed)

        return animator;
    }

    PauseAnimator() {
        this.isPlayingAnimation = false;
        this.animationState = "Pause";
    }

    StopAnimator() {
        this.isPlayingAnimation = false;
        this.animationState = "Stop"
        this.currentPlayingPointIndex = 0;


        this.AnimationFlag.remove()
        this.flow.setLatLngs(this.points)
        this.polyline.setLatLngs(this.points)
        this.AnimatorUpdateStops(this.points.length)

        this.isVisible ? this.Map.focusOn(this.polyline.getLatLngs(), -30) : false;
        this.Map.AnimationControlsVisibility = false;
    }

    AnimatorUpdateStops(I: number) {
      
        let StopIndex = 0;
        let SOSIndex = 0;
        let AlertIndex = 0;

        this.data.forEach((data: GpsData, index) => {
            if (index < I) {
                if (data.StopRunStatusEnumString == 'Stop'  ) {
                    StopIndex++;
                } else if (data.IsSOSData) {
                    SOSIndex++;
                }
                else if (data.IsAlert) {
                    AlertIndex++;
                }
            }
        })

        this.stops.forEach((StopMarker, index) => {
            if (index >= StopIndex) {
                StopMarker.remove()
            } else {
                StopMarker.addTo(this.layerGroup);
            }
        })

        this.SOSMarker.forEach((SOS, index) => {
            if (index >= SOSIndex) {
                SOS.remove()
            } else {
                SOS.addTo(this.layerGroup);
            }
        })
        this.alertMarker.forEach((Alert, index) => {
            if (index >= AlertIndex) {
                Alert.remove()
            } else {
                Alert.addTo(this.layerGroup);
            }
        })
    }

}