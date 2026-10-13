import * as _ from 'lodash';
import { getDriverString } from './borrowedrentalModel';
import { isNullOrUndefined } from 'util';

export class AccidentDetails {
    Id: number;
    Car: number;
    Driver: number;
    AccidentDateGMT: string;
    AccidentLocation: number;
    Details: string;
    Status: number;
    Dammage: string;
    AccidentReportRef: string;
    AccidentReportImg?: null;
    Customer: number;
    AccidentType: number;
    AccidentStatusEnum: number;
    AccidentTypeEnum: number;
    AccidentDateLocal: string;
    ShowReminder: boolean;
    AccidentStatusEnumString: string;
    AccidentTypeEnumString: string;
    AccidentLocationFullName: string;
    LastGeneratedAlertByExternAppGMT: string;
    Attachment?: null;
    Department?: null;

     public constructor(d: any) {
        this.Id = d.Id;
        this.Car = d.Car;
        this.Driver = d.Driver;
        this.AccidentDateGMT = d.AccidentDateGMT;
        this.AccidentLocation = d.AccidentLocation;
        this.Details = d.Details;
        this.Status = d.Status;
        this.Dammage = d.Dammage;
        this.AccidentReportRef = d.AccidentReportRef;
        this.AccidentReportImg = d.AccidentReportImg;
        this.Customer = d.Customer;
        this.AccidentType = d.AccidentType;
        this.AccidentStatusEnum = d.AccidentStatusEnum;
        this.AccidentTypeEnum = d.AccidentTypeEnum;
        this.AccidentDateLocal = d.AccidentDateLocal;
        this.ShowReminder = d.ShowReminder;
        this.AccidentStatusEnumString = d.AccidentStatusEnumString;
        this.AccidentTypeEnumString = d.AccidentTypeEnumString;
        this.AccidentLocationFullName = d.AccidentLocationFullName;
        this.LastGeneratedAlertByExternAppGMT = d.LastGeneratedAlertByExternAppGMT;
        this.Attachment = d.Attachment;
        this.Department = d.Department;
      }
  }


export class AccidentDetailsExtended {
    Id: number;
    Car: number;
    Driver: number;
    DriverString: string;
    AccidentDateGMT: Date;
    AccidentLocation: number;
    Details: string;
    Status: number;
   // StatusObj : any;
    StatusString: string;
    Dammage: string;
    AccidentReportRef: string;
    AccidentReportImg?: null;
    Customer: number;
    AccidentType: number;
   // AccidentTypeObj: any;
    AccidentTypeString: string;
    AccidentLocationFullName: string;
    LastGeneratedAlertByExternAppGMT?: null;
    Attachment: string;
    Department?: null;
    InsertDate?: null;
    InsurerNameA?: null;
    //InsurerNameAObj: any;
    InsurerNameAstring: string;
    InsurerNameB?: null;
    Injured?: null;
    Otherdamage?: null;
    DriverB?: null;
    DriverBAdress?: null;
    DriverBLicenseNumber?: null;
    DriverLicenseExpirationDate?: null;
    CarBType?: null;
    Model?: null;
    ModelYear?: null;
    Expertisesdate?: Date;
    ContreExpertisedate?: Date;
    Damages?: string;
    EstimatedDamageCost?: string;
    ExpertDecision: number;
    DamagesContreExpert?: string;
    ContreEstimatedDamageCost?: string;
    ContreExpertDecision: number;
    Reglementdate?: Date;
    Reglementdescription?: string;

   /* AccidentStatusEnum  = [
        {id : 1, status: 'Déclaration'},
        {id : 2, status: "Vue par l'expert"},
        {id : 3, status: "Vue par un contre expert"},
        {id : 4, status: 'Réglement'},
        {id : 5, status: 'Achevé'},
        {id : -1, status: 'Inconnu'}
    ];

    AccidentTypeEnum = [
        {id : 1, type: 'Accident de la route'},
        {id : 2, type: 'Bris de glaces'},
        {id : 3, type: 'Dégât des eaux'},
        {id : 4, type: 'Incendie'},
        {id : 5, type: 'Vol'},
        {id : 6, type: 'Accident avec autre voiture'},
        {id : -1, type: 'Autre'}
    ];

    InsurerNameEnum = [
        {id : 1, name: 'Hayett'},
        {id : 2, name: 'Comar'},
        {id : 3, name: 'Gat'},
        {id : 4, name: 'Star'},
        {id : 5, name: 'Lloyd'},
        {id : 6, name: 'Carte'},
        {id : 7, name: 'Astree'},
        {id : -1, name: 'Autre'}
    ];*/

   
    constructor(d: any) {
        

    this.Id = d.Id ;
    this.Car = d.Car;
    this.Driver = d.Driver;
    this.DriverString = getDriverString(d.Driver);
    this.AccidentDateGMT = !isNullOrUndefined(d.AccidentDateGMT)? new Date(parseInt(d.AccidentDateGMT.substr(6))) : new Date();
    this.AccidentLocation = d.AccidentLocation;
    this.Details = d.Details;
    this.Status = d.Status;
  //  this.StatusObj = _.find(this.AccidentStatusEnum, {id: d.Status}) || '';
    //this.StatusString =  this.StatusObj.status;
    this.Dammage = d.Dammage;
    this.AccidentReportRef = d.AccidentReportRef;
    this.AccidentReportImg = d.AccidentReportImg;
    this.Customer = d.Customer;
    this.AccidentType = d.AccidentType;
   // this.AccidentTypeObj = _.find(this.AccidentTypeEnum, {id: d.AccidentType}) || '';
   // this.AccidentTypeString =this.AccidentTypeObj.type;
    this.AccidentLocationFullName = d.AccidentLocationFullName;
    this.LastGeneratedAlertByExternAppGMT = d.LastGeneratedAlertByExternAppGMT;
    this.Attachment = d.Attachment;
    this.Department = d.Department;
    this.InsertDate = d.InsertDate;
    this.InsurerNameA = d.InsurerNameA;
   // this.InsurerNameAObj = _.find(this.InsurerNameEnum, {id:  d.InsurerNameA}) || '';
   // this.InsurerNameAstring = this.InsurerNameAObj.name;
    this.InsurerNameB = d.InsurerNameB || 0;
    this.Injured = d.Injured || false;
    this.Otherdamage = d.Otherdamage || false;
    this.DriverB = d.DriverB;
    this.DriverBAdress = d.DriverBAdress;
    this.DriverBLicenseNumber = d.DriverBLicenseNumber;
    this.DriverLicenseExpirationDate = d.DriverLicenseExpirationDate;
    this.CarBType = d.CarBType;
    this.Model = d.Model;
    this.ModelYear = d.ModelYear;
    this.Expertisesdate = !isNullOrUndefined(d.Expertisesdate)? new Date(parseInt(d.Expertisesdate.substr(6))) : new Date();
    this.ContreExpertisedate =!isNullOrUndefined(d.ContreExpertisedate)? new Date(parseInt(d.ContreExpertisedate.substr(6))) : new Date();
    this.Damages = d.Damages || '';
    this.EstimatedDamageCost = d.EstimatedDamageCost || '';
    this.ExpertDecision = d.ExpertDecision;
    this.DamagesContreExpert = d.DamagesContreExpert;
    this.ContreEstimatedDamageCost =  d.ContreEstimatedDamageCost;
    this.ContreExpertDecision = d.ContreExpertDecision;
    this.Reglementdate =!isNullOrUndefined(d.Reglementdate)? new Date(parseInt(d.Reglementdate.substr(6))) : new Date();
    this.Reglementdescription = d.Reglementdescription;
      }
  }
  