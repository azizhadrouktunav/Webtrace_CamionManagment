import { DepartmentmanagmentComponent } from "app/main/administration/departementmanagment/departmentmanagment/departmentmanagment.component";
import { isNullOrUndefined } from "util";

export class Tank {
    Id: number;
    Name: string;
    FuelType: number;
    FuelTypeString: string;
    FuelContainerCapacityInL: number;
    TotalFuelConsumptionInL: number;
    Customer: number;
    FuelLevelInL: number;
    EmptyQuantity: number;
    FuelLevelInPercent: string;
    Threshold_Refuelling: number;
    Threshold_Draining: number;
    CreatedDate: Date;
    Status: string;
    Department: number;
    DepartmentObj: any;
      /**
     * Constructor
     *
     * @param data
     */
    constructor(data?)
    {
        data = data || {};
        this.Id = data.Id || -1;
        this.Name = data.Name || "";
        this.FuelType = data.FuelType || -1;
        this.FuelTypeString = data.FuelTypeString || (data.FuelType ? Fuel.find(t => t.id == data.FuelType).name : '') ;
        this.FuelContainerCapacityInL = data.FuelContainerCapacityInL || 0;
        this.TotalFuelConsumptionInL = data.TotalFuelConsumptionInL || 0;
        this.Customer = data.Customer;
        this.FuelLevelInL = data.FuelLevelInL || 0;
        this.EmptyQuantity = data.EmptyQuantity || 0;
        this.FuelLevelInPercent = data.FuelLevelInPercent || '';
        // %
        this.Threshold_Refuelling = data.Threshold_Refuelling || null;
        // %
        this.Threshold_Draining = data.Threshold_Draining || null;

        // created date
        this.CreatedDate = !isNullOrUndefined(data.CreatedDate)? new Date(parseInt(data.CreatedDate.substr(6))) : null;
        this.DepartmentObj = data.Department || new Department({});
        //this.Status = !isNullOrUndefined(data.LatestFuelLevelPercent)? Status.Unknown
         if(!isNullOrUndefined(data.LatestFuelLevelPercent)) {
             
              if(data.LatestFuelLevelPercent>= 0 && data.LatestFuelLevelPercent < 40) {
                      this.Status = Status[0];
              }
              else if(data.LatestFuelLevelPercent>= 40 && data.LatestFuelLevelPercent < 75.5) {
                this.Status = Status[1];
            }
            else if(data.LatestFuelLevelPercent>= 75.5 && data.LatestFuelLevelPercent <= 100) {
                this.Status = Status[2];
            }
            else {
                this.Status = Status[-1];
            }
         }
         else {
            this.Status = Status[-1];
        }
        this.Department = data.Department || null;
    }
}

/*
thresholdConfig = {
    '0': {color: 'red'},
    '40': {color: 'orange'},
    '75.5': {color: 'green'}
  };
*/

export class ChartDataModel {
    public data: SerieModel[];
    constructor(data:  SerieModel[]) {
        this.data = data;
    }
}

export class SerieModel {
    public name: string;
    public series: SeriersChildModel[];
    constructor(name:  string, series: SeriersChildModel[]) {
        this.name = name;
        this.series = series;
    }
}

export class SeriersChildModel {
    public name: string;
    public value: number;
    constructor(name:  string, value: number) {
        this.name = name;
        this.value = value;
    }
}
export const Fuel = [
    {id: 1, name: "Gasoline"},
    {id: 2, name: "Diesel"},
    {id: 3, name: "Hybrid"},
    {id: -1, name: "Unknown"}
];

export enum Status {
    Normal = 0,
    Warning = 1,
    Critical = 2,
    Unknown = -1,
}
export class Series {
    name :string;
    levels: number[];
    dates: string[];

    constructor(levels_:  number[], dates_: string[], name_: string) {
        this.levels = levels_;
        this.dates = dates_;
        this.name = name_;
    }
}
export class Department {
    Id: number;
    Name: string;
    Customer: number;
    ExternalId: number;
    ExternalId2: number;
    ParentDep: number;
    Type: number;
    FullName: string;

    constructor(data) {
        data = data || {};
        this.Id = data.Id || -1;
        this.Name = data.Name || '';
        this.Customer = data.Customer || -1;
        this.ExternalId = data.ExternalId || -1;
        this.ParentDep = data.ParentDep || -1;
        this.Type = data.Type || -1;
        this.Name = data.FullName || '';
    }
}
