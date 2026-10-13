export class AlertAccident {
    
    type: string;
    car: string;
    CarMatricule: any;

    constructor(d: any, data) {
        data.forEach(e=>{
            if(e.Key.toString() == d.Car){
              this.CarMatricule = e.FullName;
            }
          });
        this.type = d.AccidentStatusEnumString;
        this.car = this.CarMatricule;
    }

}

export class AlertBorrowed {
    type: string;
    car: string;
    CarMatricule: any;

    constructor(d: any, data) {
        data.forEach(e=>{
            if(e.Key.toString() == d.Car){
              this.CarMatricule = e.FullName;
            }
          });
        this.type = d.ContractTypeString;
        this.car = this.CarMatricule;
    }
}

export class AlertDocument {
 
    type: string;
    car: string;
    CarMatricule: any;

    constructor(d: any, data) {
        data.forEach(e=>{
            if(e.Key.toString() == d.Car){
              this.CarMatricule = e.FullName;
            }
          });
        this.type = d.DocumentTypeString;
        this.car = this.CarMatricule;
    }
}