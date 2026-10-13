import * as L from 'leaflet';
import { isEmpty, isUndefined, map } from 'lodash';
import { GlobalMap } from './map';

export class Drawer {

    Map: GlobalMap;
    private draws: L.Path[] = [];
    private markers: L.Marker[] = [];
    public drawnItems: any = {};
    private drawsId: number = 0;
    private traffics: L.Polyline[] = [];
    private alertMarker: L.Marker;
    private shapes = {};
    AlertDes: any;
    routing = [];
    constructor(map: GlobalMap) {
        this.Map = map
    }


    drawPoint(callBack) {
        let point = new L.Marker([0, 0], {
            icon: L.divIcon({
                className: 'Point',
                iconAnchor: L.point(30, 60),
            }),
            draggable: true
        })
        point.addTo(this.Map.map);
        this.Map.map.on("mousemove", event => {
            callBack(event.latlng)
            point.setLatLng(event.latlng);
        })

        this.Map.map.once("click", click => {
            callBack(click.latlng)
            this.Map.map.removeEventListener("mousemove")
        })

        point.on("drag", event => {
            callBack(event["latlng"])
        });
        point.on("dragend", event => {
            callBack(event["latlng"])
        })


        this.drawnItems[this.drawsId++] = {
            obj: point,
            name: 'point'
        }
        this.Map.deletableLayers.push(this.drawnItems[this.drawsId - 1])

        this.markers.push(point)
        return this.drawnItems[this.drawsId - 1];
    }

    /* show alert */
    showAlert(data: any, iconUrl: string, coords: {
        
        lat: number,
        lng: number
    }, key: number): void {
        var placeIcon = L.icon({
            iconUrl: iconUrl,
            iconSize: [25, 30],
            iconAnchor: [13, 0]
        });
        var latLng = new L.LatLng(coords.lat, coords.lng);
        //Clear existing marker, 
        if (!isUndefined(this.alertMarker)) {
            this.Map.map.removeLayer(this.alertMarker);
        }
        // create new marker
        this.alertMarker = L.marker(latLng, {
            icon: placeIcon
        });
        this.markers.push(this.alertMarker);
        this.Map.focusOn([this.alertMarker.getLatLng()], 0, 16);

        //Add a marker to show where you clicked.
        this.Map.map.addLayer(this.alertMarker);
        this.alertMarker["name"] = data.type + " : " + data.adress
        this.Map.deletableShapes.push(this.alertMarker)
        this.alertMarker.bindPopup('<strong> Date : </strong>' + data.date +
            "</br><strong> Type d'alerte : </strong>" + data.type +
            '</br><strong>  Addresse : </strong>' + data.address+
            '</br><strong>  Vitesse : </strong>' + data.speed).openPopup();
    }
    /* show position */
    showPosition(position): void {
        if(position.IsAlert && position.DesAlert != "Inconnu" )
        {
            var iconUrl = 'assets/images/alert-icon.png' ;
             this.AlertDes = position.DesAlert;
        }
        else
        {
            var iconUrl = 'assets/images/gps.png' ;
            this.AlertDes = '';

        }
        var placeIcon = L.icon({
            iconUrl: iconUrl,
            iconSize: [25, 30],
            iconAnchor: [0, 0]
        });
        var latLng = new L.LatLng(position.Latitude, position.Longitude);
        //Clear existing marker, 
        if (!isUndefined(this.alertMarker)) {
            this.Map.map.removeLayer(this.alertMarker);
        }
        // create new marker
        this.alertMarker = L.marker(latLng, {
            icon: placeIcon
        });
        this.markers.push(this.alertMarker);
        this.Map.focusOn([this.alertMarker.getLatLng()], 0, 16);

        //Add a marker to show where you clicked.
        this.Map.map.addLayer(this.alertMarker);
        this.alertMarker["name"] = position.NearestPlaceString
        this.Map.deletableShapes.push(this.alertMarker)
        this.alertMarker.bindPopup('<strong> Date : </strong>' + position.BeginDateLocalString +
            '</br><strong>  Addresse : </strong>' + position.NearestPlaceString+
            '</br><strong>  Vitesse : </strong>' + position.Speed +
            '</br><strong>  </strong>' + this.AlertDes).openPopup();
    }
    /**
     * show stop marker**/
    showStop(start: string, duration: string, nearPlace: string, latlng: L.LatLng, iconUrl: string, id: number): void {

        let divIcon = document.createElement('div');
        divIcon.style.backgroundImage = "url('assets/images/stop-icon.png')";
        divIcon.className = 'StopPoint';

        var popup = L.popup().setContent("<strong>" + 'Starting :' + "</strong>" + start +
            "<br><strong>" + ' Période :' + "</strong>" + duration +
            "<br><strong>" + 'Emplacement :' + "</strong>" + nearPlace);
        var stopMarker = new L.Marker(latlng, {
            icon: new L.DivIcon({
                html: divIcon
            })
        }).addTo(this.Map.map).bindPopup(popup).openPopup();
        stopMarker["name"] = start + " : " + nearPlace;
        this.Map.deletableShapes.push(stopMarker)
        this.Map.focusOn([stopMarker.getLatLng()], 0, 16);
        this.shapes[id] = stopMarker;
    }
    /**
     * show traffic**/
    showTraffic(obj, icon: string, latlng: L.LatLng, id: number) {
        var trafficIcon = L.icon({
            iconUrl: icon,
            iconSize: [25, 41],
            iconAnchor: [13, 0]
        });
        var popup = L.popup().setContent('<strong>' + obj.key + '</strong>' + obj.value);

        var trafficMarker = new L.Marker(latlng, {
            icon: trafficIcon
        }).addTo(this.Map.map).bindPopup(popup);
        trafficMarker["name"] = obj.key + ' : ' + obj.value
        this.Map.deletableShapes.push(trafficMarker)
        this.shapes[id] = trafficMarker;
    }
    /**
     * show polyline traffic**/
    showPolylineTraffic(latlngs: L.LatLng[], archived: boolean = true): void {
        var polyline = L.polyline(latlngs, {
            className: "traject",
            weight: 6,
            color: 'red'
        });
        if (!archived && !isEmpty(this.traffics)) {
            this.traffics.forEach(traffic => this.Map.map.removeLayer(traffic));
            this.traffics.length = 0;
        }
        this.traffics.push(polyline);
        this.Map.focusOn(latlngs, 0),
            polyline.addTo(this.Map.map);
            polyline["name"] = "NoName Polyline"
            this.Map.deletableShapes.push(polyline)
    }
    drawLine(callBack) {

        let id = this.drawsId++;
        let points: L.Marker[] = [];
        points[0] = this.initMarker("LineStart", L.point(10, 10), LineRefresh)
        points.push(this.initMarker("LineStart", L.point(10, 10), LineRefresh))


        let Line = L.polyline(points.map(marker => {
            return marker.getLatLng()
        }), {
            weight: 5,
            color: 'blue',
            className: 'Line'
        }).addTo(this.Map.map)

        function LineRefresh() {
            callBack(Line)
            Line.setLatLngs(points.map(marker => {
                return marker.getLatLng()
            }));
        }

        let startPointPinned: Boolean = false;

        this.Map.map.on("mousemove", event => {
            if (!startPointPinned)
                points[0].setLatLng(event.latlng);
            points[points.length - 1].setLatLng(event.latlng);
        })

        this.Map.map.once("click", click => {
            startPointPinned = true;
            this.Map.map.on("click", click => {
                let point = this.initMarker('LinePoint', L.point(10, 10), LineRefresh);
                points.push(point);
                this.markers.push(point);
                this.drawnItems[id].markers.push(point)
            })
        })

        this.Map.map.once("contextmenu", lastClick => {
            this.Map.map.removeEventListener("click");
            this.Map.map.removeEventListener("mousemove");
            callBack(Line)
        })

        this.markers = this.markers.concat(points);
        this.draws.push(Line);

        this.drawnItems[id - 1] = {
            obj: Line,
            markers: points,
            name: 'Line'
        }
        this.Map.deletableLayers.push(this.drawnItems[id - 1]);
        return this.drawnItems[id - 1];
    }
    
    showCircle(center: L.LatLng, radius: number, name: string) {

        let circle: L.Circle = new L.Circle(center, {
            radius,
            color: "red",
            weight: 4
        }).addTo(this.Map.map);
        this.draws.push(circle);
        this.Map.focusOn([center], 0)

        circle.bindPopup(name)

        this.drawnItems[this.drawsId++] = {
            obj: circle,
        }
        circle["name"] = "NoName circle"
        this.Map.deletableShapes.push(circle)

        return this.drawnItems[this.drawsId - 1];
    }
    // give the use the hand to draw a circle
    drawCircle(callBack) {
        let circleCenter = this.initMarker("circleCenter", L.point(10, 10), refresher);
        let rayonPoint = this.initMarker("rayonPoint", L.point(10, 10), refresher);
        let line: L.Polyline = L.polyline([circleCenter.getLatLng(), rayonPoint.getLatLng()], {
            color: 'blue',
            weight: 5,
        }).addTo(this.Map.map);
        let circle: L.Circle = new L.Circle(circleCenter.getLatLng(), {
            radius: 0
        }).addTo(this.Map.map)

        let centerPinned = false;

        this.Map.map.on("mousemove", event => {
            if (!centerPinned) circleCenter.setLatLng(event.latlng);
            rayonPoint.setLatLng(event.latlng);
        })

        this.Map.map.once("click", event => {
            centerPinned = true;
            this.Map.map.once("click", click => {
                this.Map.map.removeEventListener("mousemove")
            })
        })

        this.markers.push(circleCenter, rayonPoint)
        this.draws.push(line, circle)

        let obj = {
            obj: circle,
            markers: [circleCenter, rayonPoint],
            paths: [line],
            name: 'Circle'
        }
        this.drawnItems[this.drawsId++] = obj
        this.Map.deletableLayers.push(obj)
        return obj;

        function refresher() {
            let bounds = [circleCenter.getLatLng(), rayonPoint.getLatLng()];
            line.setLatLngs(bounds)
            circle.setRadius(this._map.distance(bounds[0], bounds[1]))
            circle.setLatLng(circleCenter.getLatLng())
            callBack(circle, line)
        }

    }

    // drawa circle using specific coordinates
    DrawCircle(center: L.LatLng, radius: number, name: string) {
        let circle: L.Circle = new L.Circle(center, {
            radius,
            color: "red",
            weight: 4
        }).addTo(this.Map.map);
        this.draws.push(circle);

        let bounds = circle.getBounds()
        this.Map.focusOn([bounds.getNorthEast(), bounds.getSouthWest()], 0)

        circle.bindTooltip(name)
        circle.bindPopup(name)

        let obj = {
            obj: circle,
            name: 'Circle'
        }
        this.drawnItems[this.drawsId++] = obj;
        this.Map.deletableLayers.push(obj)
        return obj;
    }

    drawRectangle(callback: Function, points: L.LatLng[], name: string) {

        let polygon: L.Polygon = new L.Polygon(points, {
            color: "red",
            weight: 4
        }).addTo(this.Map.map);
        this.draws.push(polygon);

       
        this.Map.focusOn(polygon.getLatLngs()[0], 0)

        polygon.bindTooltip(name)
        polygon.bindPopup(name)

        let obj = {
            obj: polygon,
            name: 'rectangle'
        }
        this.drawnItems[this.drawsId++] = obj
        this.Map.deletableLayers.push(obj)
        return obj;
    }

    drawPolygon(callBack) {

        let id = this.drawsId++;

        let points: L.Marker[] = [];
        points[0] = this.initMarker("polyPoint", L.point(8, 8), polyRefresh)
        points.push(this.initMarker("polyPoint", L.point(8, 8), polyRefresh))


        let poly: L.Polygon = L.polygon(points.map(marker => {
            return marker.getLatLng()
        }), {
            weight: 4,
            color: 'blue',
            className: 'Polygon'
        });
        poly.addTo(this.Map.map)

        function polyRefresh() {
            callBack(poly)
            poly.setLatLngs(points.map(marker => {
                return marker.getLatLng()
            }));
        }

        let startPointPinned: Boolean = false;

        this.Map.map.on("mousemove", event => {
            if (!startPointPinned)
                points[0].setLatLng(event.latlng);
            points[points.length - 1].setLatLng(event.latlng);
        })

        this.Map.map.once("click", click => {
            startPointPinned = true;

            this.Map.map.on("click", click => {
                let point = this.initMarker('polyPoint', L.point(10, 10), polyRefresh)
                points.push(point);
                this.drawnItems[id].markers.push(point)
            })
        })

        this.Map.map.once("contextmenu", lastClick => {
            this.Map.map.removeEventListener("click");
            this.Map.map.removeEventListener("mousemove");
            callBack(poly)
        });
        this.markers = this.markers.concat(points);
        this.draws.push(poly);

        this.drawnItems[id] = {
            obj: poly,
            markers: points,
            name: 'Polygon'
        }

        this.Map.deletableLayers.push(this.drawnItems[id])
        return this.drawnItems[id];
    }

    editPolygon(coords , callBack){

        // coords.pop()
        // coords.pop()

        let poly: L.Polygon = L.polygon(coords, {
            weight: 4,
            color: 'blue',
            className: 'Polygon'
        });

        console.log('started drawing', coords)

        let points: L.Marker[] = [];

        points = coords.map((c)=>{
            let m = this.initMarker("polyPoint", L.point(8, 8), polyRefresh)
            m.setLatLng(c)
            return m
        })
        
        function polyRefresh() {
            callBack(poly)
            poly.setLatLngs(points.map(marker => {
                return marker.getLatLng()
            }));
        }

        poly.addTo(this.Map.map)
    }

    initMarker(ClassName: string, anchor: L.Point, fn) {
        let marker = new L.Marker([0, 0], {
            icon: L.divIcon({
                className: ClassName,
                iconAnchor: anchor,
            }),
            draggable: true
        }).addTo(this.Map.map);

        marker.on("move", fn)
        return marker;
    }

    showPolyline(points, name, id: number) {
        let polyline: L.Polyline = new L.Polyline(points, {
            color: "red",
            weight: 4
        }).addTo(this.Map.map);
        this.shapes[id] = polyline;

        this.Map.focusOn(polyline.getLatLngs(), 0)
        polyline["name"] = name;
        this.Map.deletableShapes.push(polyline)
        polyline.bindPopup(name)

    }
    showPolygon(points, name, id: number) {
        let polygon: L.Polygon = new L.Polygon(points, {
            color: "red",
            weight: 4
        }).addTo(this.Map.map);

        this.shapes[id] = polygon;
        this.Map.focusOn(points, 0, 16)
        polygon.bindPopup(name).openPopup();
        polygon["name"] = name
        this.Map.deletableShapes.push(polygon)

    }
    hideShape(id: number) {
        var shape: L.Layer = this.shapes[id]
        if (isUndefined(shape)) {
            return;
        }
        this.Map.map.removeLayer(shape);
    }


    drawingRectangle(callback) {
        let A = this.initMarker("circleCenter", L.point(10, 10), refresher);
        let B = this.initMarker("rayonPoint", L.point(10, 10), refresher);
        let line: L.Polyline = L.polyline([A.getLatLng(), B.getLatLng()], {
            color: 'blue',
            weight: 5,
        }).addTo(this.Map.map);
        let rectangle: L.Polygon = L.polygon([
            [B.getLatLng().lat, A.getLatLng().lng], A.getLatLng(), [A.getLatLng().lat, B.getLatLng().lng], B.getLatLng()
        ], {
            weight: 4,
            color: 'blue',
            className: 'Polygon'
        }).addTo(this.Map.map)

        let isFirstPointPined = false;

        this.Map.map.on("mousemove", event => {
            if (!isFirstPointPined) A.setLatLng(event.latlng);
            B.setLatLng(event.latlng);
        })

        this.Map.map.once("click", event => {
            isFirstPointPined = true;
            this.Map.map.once("click", click => {
                this.Map.map.removeEventListener("mousemove")
            })
        })

        this.markers.push(A, B)
        this.draws.push(line, rectangle)

        let obj = {
            obj: rectangle,
            markers: [A, B],
            paths: [line],
            name: 'Rectangle'
        }
        this.drawnItems[this.drawsId++] = obj

        this.Map.deletableLayers.push(obj)
        return obj;

        function refresher() {
            let bounds = [A.getLatLng(), B.getLatLng()];
            line.setLatLngs(bounds)
            rectangle.setLatLngs([
                [B.getLatLng().lat, A.getLatLng().lng], A.getLatLng(), [A.getLatLng().lat, B.getLatLng().lng], B.getLatLng()
            ])
            callback(line)
        }

    }
    /**
     * draw rectangle**/
    DrawRectangle(fn) {
        var oneCorner;
        var twoCorner;
        var bounds
        var rec: L.Rectangle
        this.Map.map.on('mousedown', setOneCorner);
        this.Map.map.on('mouseup', setTwoCorner);

        this.Map.map.dragging.disable();

        function setOneCorner(e) {
            oneCorner = e.latlng;
        }

        function setTwoCorner(e) {
            twoCorner = e.latlng;
            var bounds = [oneCorner, twoCorner];
            fn(rec);
            rec = L.rectangle(bounds, {
                color: "red",
                weight: 4
            });
        }
        rec.addTo(this.Map.map);
    }
    stopDragging(obj: any) {
        if (obj.markers)
            obj.markers.forEach((marker: L.Marker) => {
                marker.dragging.disable();
            });
    }

    clearObject(obj: any, i ? : number, $event?){
        if($event)
        $event.stopPropagation();
        if (obj) {
            if (  this.routing.length >= i+1) {
            this.Map.map.removeControl(this.routing[i]);
            this.routing.splice(i,1);
            }

            if (obj.markers)
                obj.markers.forEach((marker: L.Marker) => {
                    marker.remove()
                });

            if (obj.paths)
                obj.paths.forEach((line: L.Path) => {
                    line.remove()
                });

            obj.obj.remove()
        }
        this.Map.deletableLayers.splice(i, 1)
    }
}