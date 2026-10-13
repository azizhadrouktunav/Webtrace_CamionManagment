import { Marker, LatLng, latLng, DivIcon, Point, Icon } from 'leaflet';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs';
import { GlobalMap } from '../map/map';
import { TrackingInfoCard } from './tracking-info-card';
import { isNullOrUndefined } from 'util';


export class RealTimeTrackingObject {
    static CustomerGmt : number; 
    Key: number;
    map: GlobalMap = GlobalMap.globalMap;
    data: any = {};
    Marker: Marker;
    visibleOnMap: boolean;
    speed: number;
    position: LatLng;
    positionAddress: string;
    Equipment: number;
    FuelLevel: any;
    date: string;
    dateUTC: Date;
    horodatage: string;
    Contact: boolean;
    icon: DivIcon;
    name: string;
    EngineTemperature: number;
    InfoCard: TrackingInfoCard;
    Mileage: number;
    SpecialityName:string;
    Department: string;
    alerts: HTMLInputElement;
    hasMaintenance : boolean;
    driver: string;
    engineHours : number;
    LastAlert : string;
    engine : string;
    horodatageValue:number;
    isClosed : boolean = true;
    Latitude : number;
    Longitude: number;
    ChassisNumber:string;
    BatteryLevel:number;
    HumidityLevel:number;
    ElockBattery:number;
    Temperature:number;
    TotalFuel:number;
    LockStatus:string;
    SealStatus:string;
    TearDownStatus:string;
    CardId: string;
    SNSonde1: string;
    StatusConnectedSonde1: string;
    waterdetected1: string;
    VolumeSonde1: number;
    TemperatureSonde1: number;
    BatteryLevelSonde1: number;
    Dashboard:Object=null;
    direction : any;
    AdBlueLevel: number;
    AxleWeight1st: number;
    AxleWeight: number;
    AxleWeight3rd: number;
    AxleWeight4th: number;
    RapidBrackings: number;
    RapidAccelerations: number;
    

    static Instances : RealTimeTrackingObject[] = [];
    SimCardNumber: string;
    constructor(data: any) {
        let found = RealTimeTrackingObject.Instances.find(e=>e.Key == data.Key)
        if(found)
        {
            found.update(data);
            if(found.Marker)
            found.map.trackingObjectsCluster.addLayer(found.Marker);
            return found
        }

        else 

        try {
            RealTimeTrackingObject.Instances.push(this);
            this.data = data;
            
            this.Key = data.Key;
            this.name = data.FullName;
            this.speed = data.Speed;
            this.positionAddress = data.NearestPlace;
            this.position = latLng(data.Latitude, data.Longitude)
            this.speed = data.Speed;
            this.Equipment = data.CurrentEquipmentSerialNumber;
            if(data.CurrentEquipmentElement.EquipementTypeEnumString != "ETBLE")
            this.FuelLevel = data.FuelLevelString;
            else
            this.FuelLevel = "" +data.VolumeSonde1 + " L";

            this.EngineTemperature = data.EngineTemperature;
            if(data.CurrentEquipmentElement.EquipementTypeEnumString != "ETBLE")
            this.Temperature = data.Temperature;
            else
            this.Temperature = data.TemperatureSonde1 ;
            this.Contact = data.IgnOn;
            this.visibleOnMap = true;
            this.Mileage = data.MileageFloat;
            this.SpecialityName= data.SpecialityName;
            this.Department = data.DepartmentFullName;
            
            //this.date = new Date(parseInt(data.AcquisitionTimeLocal.split('/Date(')[1].split(')/')[0]));
            this.dateUTC = this.getTimeWithGMT(data.AcquisitionTimeLocal);
            this.date = this.getTimeWithGMT(data.AcquisitionTimeLocal).toLocaleString();
            this.horodatage = this.calculateHorodatage()
            this.data.horodatage = this.calculateHorodatage()
            this.GenerateMapIcon(data)
            this.driver = data.DriverName;
            this.engineHours = data.EngineHours?data.EngineHours:0;
            this.LastAlert = data.LastAlertDescription
            this.engine = data.IsEngineOn;
            this.Latitude = data.Latitude;
            this.Longitude = data.Longitude;
            this.ChassisNumber=data.ChassisNumber;
            this.BatteryLevel=data.BatteryLevel;
            this.HumidityLevel =data.HumidityLevel;
            this.ElockBattery=data.ElockBattery;
            this.SNSonde1=data.SNSonde1;
            
            this.VolumeSonde1=!isNullOrUndefined(data.VolumeSonde1) ? data.VolumeSonde1.toFixed(2) : 0;
            this.TemperatureSonde1=data.TemperatureSonde1;
            this.BatteryLevelSonde1=data.BatteryLevelSonde1;
            this.AdBlueLevel=data.AdBlueLevel;
            this.AxleWeight=!isNullOrUndefined(data.AxleWeight) ? data.AxleWeight : 0;
            this.AxleWeight1st=data.AxleWeight1st;
            this.AxleWeight1st=data.AxleWeight1st;
            this.AxleWeight=data.AxleWeight;
            this.AxleWeight3rd=data.AxleWeight3rd;
            this.AxleWeight4th=data.AxleWeight4th;
            this.RapidBrackings=data.RapidBrackings;
            this.RapidAccelerations=data.RapidAccelerations;

            if(data.StatusConnectedSonde1== true)
            this.StatusConnectedSonde1="Connecté";
            else
            this.StatusConnectedSonde1="non connecté";
            if(data.waterdetected1== true)
            this.waterdetected1="présence d'eau détectée";
            else
            this.waterdetected1="pas de présence d'eau";     
            
            if(data.LockStatus== true)
            this.LockStatus="fermé";
            else
            this.LockStatus="ouvert";
            if(data.SealStatus== true)
            this.SealStatus="fermé";
            else
            this.SealStatus="ouvert";
            
            if(data.TearDownStatus == true)
            this.TearDownStatus="non démonté"
            else
            this.TearDownStatus="démonté"
            this.CardId=data.CardId;
            let obj = data.MaintenanceReminderToDo;
            if(data.CurrentEquipmentElement != undefined)
            {
                if(data.CurrentEquipmentElement.LastRefreshJSON != undefined)
                this.TotalFuel=data.CurrentEquipmentElement.LastRefreshJSON.TotalFuel;
                this.SimCardNumber =  data.CurrentEquipmentElement.SimCardNumber;
            }
           
            else
             {this.TotalFuel=0;
                this.SimCardNumber = "";
            }
            this.hasMaintenance = (obj && (Object.keys(obj).length === 0))? false:true;
            this.alerts = document.createElement("input")
            this.alerts.type = "checkbox"
            this.Marker = this.map.CreateMarker(this.position, {
                icon: this.icon
            });
            this.InfoCard = new TrackingInfoCard(this);


            if (this.InfoCard.getElem())
                this.Marker.bindPopup(this.InfoCard.getElem().innerHTML, {
                    maxWidth: 900,
                    className: this.InfoCard.getElem().className
                })

            this.Marker.bindTooltip(this.name)
            // console.log(this.map.trackingObjectsCluster.getLayers())
            // console.log(this.Marker)
            
            this.Marker.on("popupclose", ()=>{
                if(this.isClosed && this.map.trackingObjectsCluster.getLayers().find(e=> e == this.Marker) == undefined){
                    this.map.map.removeLayer(this.Marker)
                    this.map.trackingObjectsCluster.addLayer(this.Marker)
                    this.isClosed = true;
                }
            })


        } catch (err) {
            console.log('error creating tracking object of this data', data)
            console.log('error : ', err)
        }



    }

    updatePopup(){
        if (this.InfoCard != undefined) {
            if (this.InfoCard.getElem()) {
                this.Marker.bindPopup(this.InfoCard.getElem().innerHTML, {
                    maxWidth: 900,
                    className: this.InfoCard.getElem().className
                })
            }
        }
    }

    GenerateMapIcon(coords) {
        var icon = document.createElement('div');
        this.direction = document.createElement('div');
        this.direction.className = "visionDirection"
        var img = document.createElement('img');

        icon.className = 'RealTimeTrackingObject';
        img.src = environment.iconUrl  + coords.UrlIconName;
       this.direction.style.transform = `rotate( ${coords.Direction}deg)`;
        icon.append(this.direction, img);

        this.icon = new DivIcon({
            html: icon
        });
    }

    getTimeWithGMT(time : string){
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
            let gmtTotal = intDate+((gmtServeur + (RealTimeTrackingObject.CustomerGmt * -1))* 3600000 );
            let myDate= new Date(gmtTotal);
            return myDate;

        }
        catch(err)
        {
            return null;

        }
      /*  console.log(RealTimeTrackingObject.CustomerGmt);
        let sign = time.includes('+')?'+':'-';
        let parts;
        if(sign == '+')
            parts = time.split('/Date(')[1].split(')/')[0].split('+');
        else
            parts = time.split('/Date(')[1].split(')/')[0].split('-');

        let seconds : any = parts[0];
        let GMTSeconds : any = 0;
        if(parts.length > 1){
            let GMT : any = parts[1];
            GMTSeconds += (GMT[0]*36000 + GMT[1]*3600 + GMT[2]*600 + GMT[3]*60) * 1000;
            console.log(parts[1] +" ==> "+ GMTSeconds)
        }
        seconds = parseInt(seconds)
        console.log( this.Equipment + " ==> " + new Date(seconds).toLocaleTimeString())
        GMTSeconds = parseInt(GMTSeconds);
        GMTSeconds += RealTimeTrackingObject.CustomerGmt * 3600 * 1000;
        if(sign == '+') seconds += GMTSeconds;
        else seconds -= GMTSeconds;

        return new Date(seconds)*/
    }
   
    calculateHorodatage() {
        let seconds = (new Date().getTime() - this.dateUTC.getTime()) / 1000
        this.horodatageValue = seconds;
        if (seconds > 0) {
            if (seconds < 3600)
                if(parseInt((seconds/60).toString()) ==0)
                {
                    return `< 1 mn`;

                }
                else
                {
                   return `${parseInt((seconds/60).toString())} mn`;
                }

            if (seconds < 3600 * 24)
                return `${parseInt((seconds/3600).toString())} h`;

            if (seconds < 3600 * 24 * 30)
                return `${parseInt((seconds/(3600 * 24)).toString())} j`;

            if (seconds < 3600 * 24 * 30 * 12)
                return `${parseInt((seconds/(3600 * 24 * 30)).toString())} mois`;

            return `${parseInt((seconds/(3600 * 24 * 30 * 12)).toString())} ans`;

        }

        return "--"
    }


  

    Focus() {
        if(this.data.CurrentEquipmentElement && this.data.CurrentEquipmentElement.IsAssignedToClient){
            if(this.Marker.getPopup()){
                if(this.map.trackingObjectsCluster.getLayers().find(e=> e == this.Marker) == this.Marker){
                    
                        this.map.trackingObjectsCluster.removeLayer(this.Marker)
                        
                    this.map.map.addLayer(this.Marker)
                }
                this.map.trackingObjectsCluster.bringToBack()
            }
            //console.log(this.Marker)
            this.map.focusOn([this.position], 0, 20, true,0);
            this.Marker.openPopup()
            this.isClosed = false;
            
            //setTimeout( this.map.map.off('moveend',this.Marker.openPopup()), 2100)
        }
        
    }

    update(newData) {
       
        
        this.data = newData;
        try {
            this.name= newData.FullName;
            this.speed = newData.Speed;
            this.positionAddress = newData.NearestPlace;
            this.position = latLng(newData.Latitude, newData.Longitude)
            if(newData.CurrentEquipmentElement.EquipementTypeEnumString != "ETBLE")
            this.FuelLevel = newData.FuelLevelString;
            else
            this.FuelLevel = "" +newData.VolumeSonde1 + " L";

            this.EngineTemperature = newData.EngineTemperature;
            if(newData.CurrentEquipmentElement.EquipementTypeEnumString != "ETBLE")
            this.Temperature = newData.Temperature;
            else
            this.Temperature = newData.TemperatureSonde1 ;           
             this.EngineTemperature = newData.EngineTemperature;
            this.Contact = newData.IgnOn;
            this.Mileage = newData.MileageFloat;
            this.SpecialityName=newData.SpecialityName;
            this.date = this.getTimeWithGMT(this.data.AcquisitionTimeLocal).toLocaleString();
            this.dateUTC = this.getTimeWithGMT(newData.AcquisitionTimeLocal);
            this.horodatage = this.calculateHorodatage()
            this.data.horodatage = this.calculateHorodatage()

            // this.date = this.getTimeWithGMT(data.AcquisitionTimeLocal);
            // this.horodatage = this.calculateHorodatage()
            // this.data.horodatage = this.calculateHorodatage()

            //  this.GenerateMapIcon(newData)
            this.driver = newData.DriverName;
            this.engineHours = newData.EngineHours?newData.EngineHours:0;
            this.LastAlert = newData.LastAlertDescription
            this.engine = newData.IsEngineOn;
            this.Latitude = newData.Latitude;
            this.Longitude = newData.Longitude;
            this.ChassisNumber= newData.ChassisNumber;

            let obj = newData.MaintenanceReminderToDo;
            this.hasMaintenance = (obj && (Object.keys(obj).length === 0))? false:true;
            
            this.Marker.setLatLng(this.position);
            this.direction.style.transform = `rotate( ${newData.Direction}deg)`;

            this.InfoCard = new TrackingInfoCard(this);


            if (this.InfoCard.getElem())
                this.Marker.bindPopup(this.InfoCard.getElem().innerHTML, {
                    maxWidth: 900,
                    className: this.InfoCard.getElem().className
                })

            this.Marker.bindTooltip(this.name)
            if(newData.LockStatus== true)
    this.LockStatus="fermé";
    else
    this.LockStatus="ouvert";
    if(newData.SealStatus== true)
            this.SealStatus="fermé";
            else
            this.SealStatus="ouvert";
    if(newData.TearDownStatus == true)
    this.TearDownStatus="non démonté"
    else
    this.TearDownStatus="démonté"


        } catch (err) {
            console.log('error creating tracking object of this data', newData)
            console.log('error : ', err)
        }

      if(this.InfoCard != undefined)
      this.InfoCard.ExtractCarInfoForPopUps(this)
    }

    openSpeedReport(){
        console.log("redirect me to SpeedReport please :'(")
    }
    
    autoStop(){
        console.log("This Car needs To STOP")
    }

    remove(){
        //console.log(this.Marker)
        this.map.trackingObjectsCluster.removeLayer(this.Marker);
        this.Marker.remove();

        //delete this.Marker;
    }

}