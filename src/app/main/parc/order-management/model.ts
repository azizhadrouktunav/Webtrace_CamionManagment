import { isNullOrUndefined } from 'util';

export class Mission {
    Id: number;
    Account: number;
    Driver: number;
    StartPlaceOfMission: number; // Client/Emplacement de départ
    DestinationPlaceOfMission: number; //  Client/Emplacement à visiter
    ShowNotification: boolean;
    StatusMission: number; // Etat
    TrackingTarget: number;
    Purpose: string; // Objet
    EstimatedDateLocalOfMission: Date;
    RealDateLocalOfMission: Date; // 
    RealDateLocalOfMissionString: string; // 
    MaxDateLocalOfMission: Date; // Date max de visite/mission
    EstimatedDateLocalOfStarting: Date; // Date planifiée de départ
    RealDateLocalOfStarting: Date; // Date réelle de départ
    RealDateLocalOfStartingString: string; // Date réelle de départ
    RealMissionPeriodString: string;
    NumberStr: string;
    OdometerOut: number; // Kilométrage au départ
    OdometerIn: number; //   Kilométrage à l'arrivée
    WeightLoaded: number; // Poids chargé(kg)
    PriceOfWeightLoaded: number; // Valeur du poids chargé
    EstimatedTotalFuelConsumed: number; // Totale carburant consommé estimé(l)
    RealTotalFuelConsumed: number; // Totale carburant consommé réel(l)
    Number: string;
    EstimatedDateLocalOfMissionString: string;
    MaxDateLocalOfMissionString: string; // Date max de visite/mission
    EstimatedDateLocalOfStartingString: string; // Date planifiée de départ
    Cost: number;
    StateOfSend: string;
    DriverName: string; // responsable
    Matricule: string;// matricule
    StartPlaceOfMissionDesc:string;
    DestinationPlaceOfMissionDesc:string;
    StatusMissionStr:string;

    //Default constructor
    constructor(mission?){
        mission = mission || {};
        this.Id = mission.Id ;
        this.Account = mission.Account ;
        this.StartPlaceOfMission = mission.StartPlaceOfMission;
        this.DestinationPlaceOfMission = mission.DestinationPlaceOfMission;
        this.ShowNotification = mission.ShowNotification;
        this.StatusMission = mission.StatusMission || 2;
        this.TrackingTarget = mission.TrackingTarget;
        this.Purpose = mission.Purpose || '';
        this.RealDateLocalOfStarting =  !isNullOrUndefined(mission.RealDateLocalOfStarting)? new Date(parseInt(mission.RealDateLocalOfStarting.substr(6))) : new Date();
        this.RealDateLocalOfStartingString = mission.RealDateLocalOfStartingString || '';
        this.EstimatedDateLocalOfMission =  !isNullOrUndefined(mission.EstimatedDateLocalOfMission)? new Date(parseInt(mission.EstimatedDateLocalOfMission.substr(6))) : new Date();
        this.EstimatedDateLocalOfMissionString = mission.EstimatedDateLocalOfMissionString || '';
        this.RealDateLocalOfMission = !isNullOrUndefined(mission.RealDateLocalOfMission)? new Date(parseInt(mission.RealDateLocalOfMission.substr(6))) : new Date();
        this.EstimatedDateLocalOfStarting = !isNullOrUndefined(mission.EstimatedDateLocalOfStarting)? new Date(parseInt(mission.EstimatedDateLocalOfStarting.substr(6))) : new Date();
        this.EstimatedDateLocalOfStartingString = mission.EstimatedDateLocalOfStartingString || '';
        this.MaxDateLocalOfMission = !isNullOrUndefined(mission.MaxDateLocalOfMission)? new Date(parseInt(mission.MaxDateLocalOfMission.substr(6))) : new Date();
        this.MaxDateLocalOfMissionString = mission.MaxDateLocalOfMissionString || '';
        this.RealMissionPeriodString = mission.RealMissionPeriodString || '';
        this.NumberStr = mission.NumberStr || '';
        this.OdometerOut = mission.OdometerOut || 0;
        this.OdometerIn = mission.OdometerIn || 0;
        this.WeightLoaded = mission.WeightLoaded || 0;
        this.PriceOfWeightLoaded = mission.PriceOfWeightLoaded || 0;
        this.EstimatedTotalFuelConsumed = mission.EstimatedTotalFuelConsumed || 0;
        this.RealTotalFuelConsumed = mission.RealTotalFuelConsumed ||0;
        this.Cost = mission.Cost || 0;
        this.StateOfSend = mission.StateOfSend || '';
        this.Driver = mission.Driver || '';  
         
        this.DriverName = mission.DriverName;
        this.Matricule = mission.Matricule;
        this.StartPlaceOfMissionDesc =  mission.StartPlaceOfMissionDesc;
         this.DestinationPlaceOfMissionDesc=mission.DestinationPlaceOfMissionDesc;
        this.DriverName = mission.DriverName;
        
        this.Number = mission.Number || '';
        this.StatusMissionStr = StatusMission[mission.StatusMission] 
    }
}
export interface PlaceElements { key:number , value:any}
export interface PlannedMission {
    DicoTrackingObjects: any;
    Theme: string;
    AccessRightsOfCurrentAccount: any;
    CurrentAccount: Account;
    LoginAccountElements: any;
    Drivers: any[];
    PlaceElements: PlaceElements;
}
export enum StatusMission
    {
        //Unknown = -1,
        //[Description("Non vérifiée")]
        NotVerified,//cad dans la période entre Start Date et Max Date
        //[Description("Visitée")]
        Visited,
        //[Description("Non visitée")]
        NotVisited,
        //[Description("Non vérifiée(a dépassé date max)")]
        NotVerifiedOutPeriod,
    }