export class Geofence {
    TrakingObject : number;
    Rayon : number;
    Lng2: number;
    Lng1: number;
    Lat2: number;
    Lat1 : number;
    GeofenceTypeInt : number;
    GeofenceName : string;
    GeofenceAlarmType : number;
    CentreLng : number;
    CenterLat :number;
    constructor(data?){
        data = data || {};
        this.TrakingObject = data.TrakingObject;
        this.Rayon = data.Rayon ||0;
        this.Lng2 = data.Lng2 || 0;
        this.Lng1 = data.Lng1 ||0;
        this.Lat1 = data.Lat1 ||0;
        this.Lat2 = data.Lat2 || 0;
        this.GeofenceTypeInt = data.GeofenceTypeInt || -1;
        this.GeofenceName = data.GeofenceName;
        this.GeofenceAlarmType = data.GeofenceAlarmType || -1;
        this.CentreLng = data.CentreLng || 0;
        this.CenterLat = data.CenterLat || 0;
    }
}