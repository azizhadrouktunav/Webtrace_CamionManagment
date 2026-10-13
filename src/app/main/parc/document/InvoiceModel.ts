import { isNullOrUndefined } from "util";

export class InvoiceModel {
    Id: number;
    Car: number;
    FirstDriver: number;
    SecondDriver: number;
    Cost: number;
    BorrowedRentalCarContract: number;
    ContratType: number;
    PaidCost: number;
    DateInvoiceGMT: Date;
    InvoiceFromGMT: Date;
    InvoiceToGMT: Date;
    OdometerInKm: number;
    OdometerOutKm: number;
    PaidDateGMT: Date;
    DateInvoiceLocal: Date;
    InvoiceFromLocal: Date;
    InvoiceToLocal: Date;
    PaidDateLocal: Date;
    ContratTypeString: string;
    InvoiceRef: string;
     
     constructor(d: any) {
       
        this.Id = d.Id || -1;
        this.Car = d.Car || -1;
        this.FirstDriver = d.FirstDriver || -1;
        this.SecondDriver = d.SecondDriver || -1;
        this.Cost = d.Cost || 0;
        this.BorrowedRentalCarContract = d.BorrowedRentalCarContract || 0;
        this.ContratType = d.ContratType || -1;
        this.PaidCost = d.PaidCost || 0;
        this.DateInvoiceGMT = !isNullOrUndefined(d.DateInvoiceGMT)? new Date(parseInt(d.DateInvoiceGMT.substr(6))) : new Date();
        this.InvoiceFromGMT =!isNullOrUndefined(d.InvoiceFromGMT)? new Date(parseInt(d.InvoiceFromGMT.substr(6))) : new Date();
        this.InvoiceToGMT = !isNullOrUndefined(d.InvoiceToGMT)? new Date(parseInt(d.InvoiceToGMT.substr(6))) : new Date();
        this.OdometerInKm = d.OdometerInKm || 0;
        this.OdometerOutKm = d.OdometerOutKm || 0;
        this.PaidDateGMT = !isNullOrUndefined(d.PaidDateGMT)? new Date(parseInt(d.PaidDateGMT.substr(6))) : new Date();
        this.DateInvoiceLocal = !isNullOrUndefined(d.DateInvoiceLocal)? new Date(parseInt(d.DateInvoiceLocal.substr(6))) : new Date();
        this.InvoiceFromLocal = !isNullOrUndefined(d.InvoiceFromLocal)? new Date(parseInt(d.InvoiceFromLocal.substr(6))) : new Date();
        this.InvoiceToLocal = !isNullOrUndefined(d.InvoiceToLocal)? new Date(parseInt(d.InvoiceToLocal.substr(6))) : new Date();
        this.PaidDateLocal = !isNullOrUndefined(d.PaidDateLocal)? new Date(parseInt(d.PaidDateLocal.substr(6))) : new Date();
        this.ContratTypeString = d.ContratTypeString || '';
        this.InvoiceRef = d.InvoiceRef || '';

      }
  }
  