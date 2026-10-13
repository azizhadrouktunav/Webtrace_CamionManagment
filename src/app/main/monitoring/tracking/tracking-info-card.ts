import { environment } from "environments/environment";
import { split } from "lodash";
import { GpsData } from "../trajectory/trajectory.model";
import { RealTimeTrackingObject } from "./RealTimeTrackingObject";
import { TrackingObjectService } from './tracking-objects.service';
export class TrackingInfoCard {

    element: HTMLElement;
    background: HTMLElement;
    avatar: HTMLElement;
    content: HTMLElement;
    name: HTMLElement;
    equipment: HTMLElement;
    img: HTMLImageElement;
    details: any = {};
    html: any;
    static Words: string[] = [];
    private _trakcingObjectService: TrackingObjectService;
    Icon: string;
    IconSeal: string;
    carburant: any;

    constructor(private trackingObject: RealTimeTrackingObject) {

        let loop = setInterval(() => {
            //console.log(TrackingInfoCard.Words)
            if (TrackingInfoCard.Words[0] != "undefined") {
                this.html = this.ExtractCarInfoForPopUps(trackingObject.data)
                this.element = (this.html)
                trackingObject.updatePopup()
                clearTimeout(loop);
            }
        }, 100)


        this.html = this.ExtractCarInfoForPopUps(trackingObject.data)
        this.element = (this.html)

    }

    getElem() {
        return this.element;
    }

    getTimeWithGMT(time: string) {
        try {
            let stringDate = time.split('/Date(')[1].split(')/')[0];
            let gmt_Str: string = '';
            let intDate = 0;
            let gmtServeur: number = 0;
            if (stringDate.indexOf('+') != -1) {
                gmt_Str = stringDate.split('+')[1];
                intDate = parseInt(stringDate.split('+')[0]);
                gmtServeur = parseInt(gmt_Str) / 100;

            } else if (stringDate.indexOf('-') != -1) {
                gmt_Str = stringDate.split('-')[1];
                intDate = parseInt(stringDate.split('-')[0]);
                gmtServeur = parseInt(gmt_Str) / 100 * -1;
            }
            let gmtTotal = intDate + ((gmtServeur + (RealTimeTrackingObject.CustomerGmt * -1)) * 3600000);
            let myDate = new Date(gmtTotal);
            return myDate;

        }
        catch (err) {
            return null;

        }
    }

    calculateHorodatage(elem) {
        let date = this.getTimeWithGMT(elem.AcquisitionTimeLocal);
        let seconds = (new Date().getTime() - date.getTime()) / 1000
        if (seconds > 0) {
            if (seconds < 3600)
                if (parseInt((seconds / 60).toString()) == 0) {
                    return `< 1 mn`;

                }
                else {
                    return `${parseInt((seconds / 60).toString())} mn`;
                }

            if (seconds < 3600 * 24)
                return `${parseInt((seconds / 3600).toString())} heures`;

            if (seconds < 3600 * 24 * 30)
                return `${parseInt((seconds / (3600 * 24)).toString())} jours`;

            if (seconds < 3600 * 24 * 30 * 12)
                return `${parseInt((seconds / (3600 * 24 * 30)).toString())} mois`;

            return `${parseInt((seconds / (3600 * 24 * 30 * 12)).toString())} ans`;

        }
       
        return "--"
    }

    ExtractCarInfoForPopUps(element: any): HTMLElement {
        if (element.LockStatus == true) {
            element.LockStatus = "fermé";
            this.Icon = "lock";
        }
        else if (element.LockStatus == false) {
            element.LockStatus = "ouvert";
            this.Icon = "lock_open";
        }
        if (element.SealStatus == true) {
            element.SealStatus = "fermé";
            this.IconSeal = "lock";
        }
        else if (element.SealStatus == false) {
            element.SealStatus = "ouvert";
            this.IconSeal = "lock_open";
        }

        if (element.TearDownStatus == true) { element.TearDownStatus = "non démonté"; }
        else if (element.TearDownStatus == false) { element.TearDownStatus = "démonté"; }

        if (element.StatusConnectedSonde1 == true) { element.StatusConnectedSonde1 = "connectée"; }
        else if (element.StatusConnectedSonde1 == false) { element.StatusConnectedSonde1 = "non connectée"; }

        if (element.waterdetected1 == true) { element.waterdetected1 = "présence d'eau détectée"; }
        else if (element.waterdetected1 == false) { element.waterdetected1 = "pas de présence d'eau"; }

        if (element.CurrentEquipmentElement != undefined) {
            var HTML = "";
            var ClassNames = "";
            var fontSize = 335 / element.FullName.length > 25 ? 25 : 335 / element.FullName.length + 5;
            var maxFuel = element.FuelContainerCapacity;
            var hit = parseInt(element.EngineTemperature);
            if (element.Speed > 120) {
                ClassNames += " DangerSpeed"
            } else
                if (element.Speed > 80) {
                    ClassNames += " HighSpeed"
                } else
                    if (element.Speed > 20) {
                        ClassNames += " NormalSpeed"
                    } else
                        if (element.Speed > 0) {
                            ClassNames += " LowSpeed"
                        }

            ClassNames += (element.IgnOn ? " ContactOn" : " ContactOff")

            maxFuel > 0 ? (ClassNames += (maxFuel * 0.1 > parseFloat(element.FuelLevel) ? " LowFuel" : " EnoughFuel")) : null;

            if (hit > 105) {
                ClassNames += " DangerHit"
            }
            if (hit > 85) {
                ClassNames += " NormalHit"
            }
            if (hit > 20) {
                ClassNames += " LowHit"
            }
            if (hit >= 0) {
                ClassNames += " VeryLowHit"
            }
            /* this._trakcingObjectService.GetWorkspaceParam().subscribe(response=>{
                 let state = response['GetNewWorkspaceParamResult'];
             });*/
            var data = localStorage.getItem('StateGrid');
            var state = null;
            let elem: HTMLElement = document.createElement("div");

            if (data) {
                state = JSON.parse(data);

                /* else
                 {
                     this._trakcingObjectService.GetWorkspaceParam().subscribe(response=>{
                         state = response['GetNewWorkspaceParamResult'];
                        
             
                     });
                 }*/

                // let col=state['columns'].filter(x=>x.dataField =="Latitude");
                let columns = state['columns'];
                let visSpeed = "none";

                if (columns.filter(x => x.dataField == "speed")[0].visible == true)
                    visSpeed = "";
                let visLatitude = "none";
                if (columns.filter(x => x.dataField == "Latitude")[0].visible == true)
                    visLatitude = "";
                let visPositionAddress = "none";
                if (columns.filter(x => x.dataField == "positionAddress")[0].visible == true)
                    visPositionAddress = "";
                let visdate = "none";
                if (columns.filter(x => x.dataField == "date")[0].visible == true)
                    visdate = "";
                let vishorodatage = "none";
                if (columns.filter(x => x.dataField == "horodatage")[0].visible == true)
                    vishorodatage = "";
                let visMileage = "none";
                if (columns.filter(x => x.dataField == "Mileage")[0].visible == true)
                    visMileage = "";
                let visSpecialityName = "none";
                if (columns.filter(x => x.dataField == "SpecialityName")[0].visible == true && element.SpecialityName != '' )
                    visSpecialityName = "";
                let visengineHours = "none";
                if (columns.filter(x => x.dataField == "engineHours")[0].visible == true && (element.engineHours != undefined) && (element.engineHours != 'Indefini'))
                    visengineHours = "";
                let visLastAlert = "none";
                if (columns.filter(x => x.dataField == "LastAlert")[0].visible == true && (element.LastAlert != undefined) && (element.LastAlert != 'Indefini'))
                    visLastAlert = "";
                let visengine = "none";
                if (columns.filter(x => x.dataField == "engine")[0].visible == true && (element.RPM != undefined) && (element.RPM != 'Indefini'))
                    visengine = "";
                let visFuelLevel = "none";
                if (columns.filter(x => x.dataField == "FuelLevel")[0].visible == true)
                    visFuelLevel = "";
                let visTemperature = "none";
                let temp = element.EngineTemperature;
               if (columns.filter(x => x.dataField == "Temperature")[0].visible == true && (element.Temperature != undefined) && (element.Temperature != 'Indefini'))
                   visTemperature = "";
                let visEngineTemperature = "none";
                if (columns.filter(x => x.dataField == "EngineTemperature")[0].visible == true && (element.EngineTemperature != undefined) && (element.EngineTemperature != 'Indefini'))
                    visEngineTemperature = "";
                let visdriver = "none";
                if (columns.filter(x => x.dataField == "driver")[0].visible == true && (element.DriverName != undefined) && (element.DriverName != 'Indefini'))
                    visdriver = "";
                let visLongitude = "none";
                if (columns.filter(x => x.dataField == "Longitude")[0].visible == true)
                    visLongitude = "";
                let visChassisNumber = "none";
                if (columns.filter(x => x.dataField == "ChassisNumber")[0].visible == true)
                    visChassisNumber = "";
                let visBatteryLevel = "none";
                if (columns.filter(x => x.dataField == "BatteryLevel")[0].visible == true && (element.BatteryLevel != null))
                    visBatteryLevel = "";
                let visHumidityLevel = "none";
                if (columns.filter(x => x.dataField == "HumidityLevel")[0].visible == true && (element.HumidityLevel != null))
                    visHumidityLevel = "";
                let visElockBattery = "none";
                if (columns.filter(x => x.dataField == "ElockBattery")[0].visible == true && element.ElockBattery != null)
                    visElockBattery = "";
                let visLockStatus = "none";
                if (columns.filter(x => x.dataField == "LockStatus")[0].visible == true && element.LockStatus != null)
                    visLockStatus = "";
                let visSealStatus = "none";
                if (columns.filter(x => x.dataField == "SealStatus")[0].visible == true && element.SealStatus != null)
                    visSealStatus = "";
                let visTearDownStatus = "none";
                if (columns.filter(x => x.dataField == "TearDownStatus")[0].visible == true && element.TearDownStatus != null)
                    visTearDownStatus = "";
                let visCardId = "none";
                if (columns.filter(x => x.dataField == "CardId")[0].visible == true && element.CardId != null)
                    visCardId = "";
                let visSNSonde1 = "none";
                if (columns.filter(x => x.dataField == "SNSonde1")[0].visible == true && element.SNSonde1 != null)
                    visSNSonde1 = "";
                let visVolumeSonde1 = "none";
                if (columns.filter(x => x.dataField == "VolumeSonde1")[0].visible == true && element.VolumeSonde1 != null)
                    visVolumeSonde1 = "";
                let visTemperatureSonde1 = "none";
                if (columns.filter(x => x.dataField == "TemperatureSonde1")[0].visible == true && element.TemperatureSonde1 != null)
                    visTemperatureSonde1 = "";
                let visBatteryLevelSonde1 = "none";
                if (columns.filter(x => x.dataField == "BatteryLevelSonde1")[0].visible == true && element.BatteryLevelSonde1 != null)
                    visBatteryLevelSonde1 = "";
                let visStatusConnectedSonde1 = "none";
                if (columns.filter(x => x.dataField == "StatusConnectedSonde1")[0].visible == true && element.StatusConnectedSonde1 != null)
                    visStatusConnectedSonde1 = "";

                let viswaterdetected1 = "none";
                if (columns.filter(x => x.dataField == "waterdetected1")[0].visible == true && element.waterdetected1 != null)
                    viswaterdetected1 = "";

                let visSimCardNumber = "none";
                if (columns.filter(x => x.dataField == "SimCardNumber")[0].visible == true && element.CurrentEquipmentElement.SimCardNumber != null)
                    visSimCardNumber = "";

                if (element.CurrentEquipmentElement.EquipementTypeEnumString != "ETBLE")
                    this.carburant = element.FuelLevel;
                else
                    this.carburant = element.VolumeSonde1 + " L";

                HTML = `<div class="background">
            </div>
            <div class="CarCard">
                <div class="CarName" style="font-size:${fontSize}px">${element.FullName}</div>
                <div class="EquiNbr">${element.CurrentEquipmentElement.key}</div>
                <div class="avatarIcon">
                    <img class="CarAvatar" src="${environment.iconUrl}${element.UrlIconName.replace("/32/g", "48")}">
                </div>
                <div class="infoContainer">
                <div class="info" style="overflow:auto">
                    <div style="display:${visPositionAddress}">
                        <div>${TrackingInfoCard.Words["Adress"]}</div>
                        <div>${element.NearestPlace}</div>
                    </div>
                    <div style="display:${visdate}">
                        <div>${TrackingInfoCard.Words["Date"]}</div>
                        <div>${this.getTimeWithGMT(element.AcquisitionTimeLocal).toLocaleString()}</div>
                    </div>
                    <div style="display:${visMileage}">
                        <div>${TrackingInfoCard.Words["Mileage"]} </div>
                        <div>${element.MileageFloat} Km</div>
                    </div>
                    <div style="display:${vishorodatage}">
                        <div>${TrackingInfoCard.Words["Horodatage"]} </div>
                        <div>${this.calculateHorodatage(element)}</div>
                    </div>
                    <div style="display:${visFuelLevel}">
                        <div>${TrackingInfoCard.Words["FuelLevel"]}</div>
                        <div >${this.carburant}</div>

                    </div>
                     <div style="display:${visTemperature}">
                        <div>${TrackingInfoCard.Words["Temperature"]}</div>
                        <div>${element.Temperature}</div>
                    </div>
                    <div style="display:${visengine}">
                        <div>${TrackingInfoCard.Words["RPM"]}</div>
                        <div>${element.RPM}</div>
                    </div>
                     <div style="display:${visSpecialityName}">
                        <div>${TrackingInfoCard.Words["Speciality"]} </div>
                        <div>${element.SpecialityName}</div>
                    </div>
                      <div style="display:${visengineHours}">
                        <div>Compteur horaire du moteur(h)</div>
                        <div>${element.engineHours}</div>
                    </div>
                    <div style="display:${visLastAlert}">
                        <div>Dernière alerte</div>
                        <div>${element.LastAlert}</div>
                    </div>
                    <div style="display:${visEngineTemperature}">
                       <div>Température moteur</div>
                      <div>${element.EngineTemperature}</div>
                   </div>
                    <div style="display:${visdriver}">
                       <div>Chauffeur</div>
                      <div>${element.DriverName}</div>
                   </div>
                    
                    <div style="display:${visSpeed}"> 
                        <div>${TrackingInfoCard.Words["Speed"]}</div>
                        <div>${element.Speed}</div>
                    </div>
                    <div style="display:${visLatitude}">
                        <div>Latitude</div>
                         <div>${element.Latitude}</div>
                   </div>
                    <div style="display:${visLongitude}">
                        <div>Longitude</div>
                         <div>${element.Longitude}</div>
                   </div>
                    <div style="display:${visChassisNumber}">
                       <div>Numéro de châssis</div>
                      <div>${element.ChassisNumber}</div>
                   </div>
                    <div style="display:${visBatteryLevel}">
                       <div>Niveau de batterie</div>
                      <div>${element.BatteryLevel}</div>
                   </div>
                    <div style="display:${visHumidityLevel}">
                       <div>Niveau d'humidité</div>
                      <div>${element.HumidityLevel}</div>
                   </div>
                    <div style="display:${visElockBattery}">
                       <div>Batterie Elock</div>
                      <div>${element.ElockBattery}</div>
                   </div>
                    <div style="display:${visLockStatus}">
                       <div>Etat d'ouverture</div>
                      <div> <mat-icon  class=" mat-icon notranslate material-icons mat-icon-no-color" role="img" aria-hidden="true">${this.Icon}</mat-icon></div>
                     
                   </div>
                    <div style="display:${visSealStatus}">
                       <div>Status d'ouverture par carte</div>
                      <div> <mat-icon  class=" mat-icon notranslate material-icons mat-icon-no-color" role="img" aria-hidden="true">${this.IconSeal}</mat-icon></div>
                   </div>
                    <div style="display:${visTearDownStatus}">
                       <div>Démontage</div>
                      <div>${element.TearDownStatus}</div>
                   </div>
                   <div style="display:${visCardId}">
                   <div>Identifiant de carte</div>
                  <div>${element.CardId}</div>
               </div>
               <div style="display:${visVolumeSonde1}">
               <div>Volume</div>
              <div>${element.VolumeSonde1}</div>
           </div>
           <div style="display:${visTemperatureSonde1}">
           <div>Temperature</div>
          <div>${element.TemperatureSonde1}</div>
       </div>
       <div style="display:${visBatteryLevelSonde1}">
       <div>Niveau de batterie</div>
      <div>${element.BatteryLevelSonde1}</div>
   </div>
   <div style="display:${visStatusConnectedSonde1}">
   <div>Etat de la sonde</div>
  <div>${element.StatusConnectedSonde1}</div>
</div>
<div style="display:${viswaterdetected1}">
   <div>Présence d'eau</div>
  <div>${element.waterdetected1}</div>
</div>
<div style="display:${visSNSonde1}">
   <div>Numéro de série</div>
  <div>${element.SNSonde1}</div>
</div>
<div style="display:${visSimCardNumber}">
   <div>Numéro de puce</div>
  <div>${element.CurrentEquipmentElement.SimCardNumber}</div>
</div>
                </div>
                </div>
                <div class="VisualInfo">
                    <div class="infoIcon Speed">${element.Speed}</div>
                    <mat-icon class="infoIcon power_settings_new mat-icon notranslate material-icons mat-icon-no-color" role="img" aria-hidden="true">power_settings_new</mat-icon>
                    <mat-icon class="infoIcon local_gas_station mat-icon notranslate material-icons mat-icon-no-color" role="img" aria-hidden="true">local_gas_station</mat-icon>
                    <mat-icon class="infoIcon access_alarms mat-icon notranslate material-icons mat-icon-no-color" role="img" aria-hidden="true">access_alarms</mat-icon>
                    <mat-icon class="infoIcon whatshot mat-icon notranslate material-icons mat-icon-no-color" role="img" aria-hidden="true">whatshot</mat-icon>
                </div>
            </div>`


                elem.className = "CarCardContainer BlueTheme " + ClassNames;
                elem.innerHTML = HTML;


            }
            return elem;
        }
    }
}
