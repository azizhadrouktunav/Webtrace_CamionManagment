
export class PaymentModel {
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
    InvoiceRef: string;

       constructor(d: any) {
        this.Id = d.Id;
        this.Car = d.Car;
        this.FirstDriver = d.FirstDriver;
        this.SecondDriver = d.SecondDriver;
        this.Cost = d.Cost;
        this.BorrowedRentalCarContract = d.BorrowedRentalCarContract;
        this.ContratType = d.ContratType;
        this.PaidCost = d.PaidCost;
        this.DateInvoiceGMT = new Date(parseInt(d.DateInvoiceGMT.substr(6)));
        this.InvoiceFromGMT =new Date(parseInt(d.InvoiceFromGMT.substr(6)));
        this.InvoiceToGMT = new Date(parseInt(d.InvoiceToGMT.substr(6)));
        this.OdometerInKm = d.OdometerInKm;
        this.OdometerOutKm = d.OdometerOutKm;
        this.PaidDateGMT = new Date(parseInt(d.PaidDateGMT.substr(6)));
        this.InvoiceRef = d.InvoiceRef;
      }
  }
  