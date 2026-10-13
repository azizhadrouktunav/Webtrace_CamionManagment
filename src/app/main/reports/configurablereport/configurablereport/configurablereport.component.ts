import { Component, NgZone, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Globals } from '../../globals';
import { ConfigurablereportService } from '../configurablereport.service';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Color } from 'ng2-charts/lib/color';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexMarkers, ApexPlotOptions, ApexFill, ApexTooltip, ChartComponent,ApexDataLabels,ApexTitleSubtitle,ApexStroke,ApexAnnotations } from 'ng-apexcharts';
import { ReportService } from '../../services/report.service';
import { decrypt } from 'app/main/parc/Parc';
import { json2array } from 'app/main/helpers/must-match.validator';
import { fuseAnimations } from '@fuse/animations';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { CarGroup } from '../../project/project.component';
export type ChartOptions = {
  colors;
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  labels: string[];
  stroke: any; // ApexStroke;
  markers: ApexMarkers;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  tooltip: ApexTooltip;
  
};
export type ChartOptions2 = {
  series2: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  annotations: ApexAnnotations;
  colors: any;
  toolbar: any;
  labels: string[];
};
export const dataT = [
  [1327359600000, 30.95],
  [1327446000000, 31.34],
  [1327532400000, 31.18],
  [1327618800000, 31.05],
  [1327878000000, 31.0],
  [1327964400000, 30.95],
  [1328050800000, 31.24],
  [1328137200000, 31.29],
  [1328223600000, 31.85],
  [1328482800000, 31.86]
];

@Component({
  selector: 'app-configurablereport',
  templateUrl: './configurablereport.component.html',
  styleUrls: ['./configurablereport.component.scss'],
  animations   : fuseAnimations
})
export class ConfigurablereportComponent implements OnInit {
  @ViewChild("chart", { static: false }) chart: ChartComponent;

  public chartOptions: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions2>;
  dataTest= dataT;
  filteredOptions: Observable<string[]>;
  lastFilter: string = '';
  ListCar: any[];
  ListDriver: any[];
  nametype = "NAV.TrackingObject";
  public loading = false;
  NameObject: string ="Véhicule";

  dateObj = new Date(); noshrink: any;
  selectedCars = [];
  Cars: any;
  displayValue: string;
  trackingObjects: any[]=[];
  form: FormGroup;
  type:string;
  selectedDrivers = [];
  selectByCar: boolean;
  toppings = new FormControl();
  selected2 = "line";
  selected1= "line";
  selected3= "line";
  selected4= "line";
  title = 'test';

 param1: Array<any> = [];
   param2: Array<any> = [];
   param3: Array<any> = [];
    param4: Array<any> = [];
  reportData: any[];
  chartReady: boolean = false;
  series: { name: string; type: string; data: number[];}[] = [];
  seriesDate :{x:Date,y:Number}[]=[];
  size:number[]=[];
 markers:{size:number[]};
  yaxis:{seriesName: string, opposite: boolean,axisTicks:{show:boolean};axisBorder:{show:boolean,color:string},labels:{style:{color:string}};
  title:{text:string,style:{color:string}};tooltip:{enabled:boolean}}[]=[];
  labels: string[] = [];
  SelectionCriteria = [];
  ChartType = [];
  destroy: Subject<boolean> = new Subject<boolean>();
  CarGroupOptions: Observable<CarGroup[]>;
  listcargroup: CarGroup[]=[];
  stateRecord:any = [];
  isExpandCategory: boolean[] = [];
  isChartPrepared: boolean = false;
  progressbarValue=0;
  progressValueInPercent =0;
  constructor(
    private _ConfigurablereportService: ConfigurablereportService,
    private _matSnackBar: MatSnackBar,
    private _translateService: TranslateService,
    private _ReportService: ReportService



  ) {
    this.form = this.createForm();
    this.chartOptions = {
      colors: ['#6141ac', '#ca970d','#2e9be5','#28b650'],
      series: [ ],
      labels: [ ],
      chart: {
        height: 350,
        type: "line",
        stacked: false
      },
      stroke: {
        width: [3,3,3,3],
        curve: "smooth"
      },
      plotOptions: {
        bar: {
          columnWidth: "50%"
        }
      },

      fill: {
        colors: ['#6141ac', '#ca970d','#2e9be5','#28b650'],
        opacity: [0.5,0.5, 0.25, 0.25],
        gradient: {
          inverseColors: false,
          shade: "light",
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100]
        }
      },
      markers: {
        
      },
      xaxis: {
        
      },
      yaxis: {
      
      },
      tooltip: {
        
        shared: true,
        intersect: false,
        y: {
          formatter: function(y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) ;
            }
            return y;
          }
        }
      }
    };
    this.chartOptions2 = {
      series2: [
        {
          data: []
        }
      ],
      labels:[],
      chart: {
        type: "area",
        height: 350
      },
      annotations: {
        yaxis: [
          {
            y: 30,
            borderColor: "#999",
            label: {
              text: "Support",
              style: {
                color: "#fff",
                background: "#00E396"
              }
            }
          }
        ],
        xaxis: 
        [
          {
         
            x: new Date("14 Nov 2012").getTime(),
            borderColor: "#999",
            label: {
              text: "Rally",
              style: {
                color: "#fff",
                background: "#775DD0"
              }
            }
          }
        ]
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0
      },
      xaxis: {
        type: "datetime",
        //min: new Date("01 Mar 2021").getTime(),
        tickAmount: 6
      },
      tooltip: {
        x: {
          format: "dd MMM yyyy"
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100]
        }
      }
    };

    
  }
  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();  
  }
  public generateData(count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = "w" + (i + 1).toString();
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y
      });
      i++;
    }
    return series;
  }
  ngOnInit() {

    this._ReportService.getReportingParam().subscribe((result) => {
      let trackingObjects2 = decrypt(result);
      //let ReportingParam = json2array(trackingObjects2);
      this.ListCar=json2array(trackingObjects2['DicoTrackingObject']);
      this.ListDriver=json2array(trackingObjects2['DicoDrivers']);
      
      this.ListCar.map(e => {
      this.trackingObjects.push({ 'key': e.Key, 'value': e.FullName , 'selectBy': 'car', 'DepartmentName': e.DepartmentFullName  });
      });
      // this.filteredOptions = this.form.get('Car').valueChanges.pipe(
      //   startWith(''),
      //   map(value => typeof value === 'string' ? value : this.lastFilter),
      // map(filter => this._filter(filter))
      // );
      this.listcargroup =_.chain(this.trackingObjects).groupBy("DepartmentName").map((value,key)=>({department:key,car:value})).value();
      this.CarGroupOptions =  this.form.get('Car').valueChanges.pipe(
        startWith(''),
        map(value =>typeof value === 'string' ? value: this.lastFilter),map(filter => this.filterGroup(filter))
      );
    })
   
  }
  OnInputSelect(){
    this.form.get('Car').setValue(''); 
  }
  OnInputDisSelect(){
    this.form.get('Car').setValue(this.stateRecord);
  }
  createForm(): FormGroup {
    return new FormGroup({
      Car: new FormControl(''),
      StartDateGMT: new FormControl(new Date(this.dateObj.getUTCFullYear(), this.dateObj.getUTCMonth(), this.dateObj.getUTCDate(), 0, 0, 0)),
      EndDateGMT: new FormControl(new Date(this.dateObj.getUTCFullYear(), this.dateObj.getUTCMonth(), this.dateObj.getUTCDate(), 23, 59, 59)),
      input1: new FormControl('-1' , Validators.required),
      input2: new FormControl('-1' , Validators.required),
      input3: new FormControl('-1' , Validators.required),
      input4: new FormControl('-1' , Validators.required),
      chart1: new FormControl('line'),
      chart2: new FormControl('line'),
      chart3: new FormControl('line'),
      chart4: new FormControl('line'),
      type:new FormControl(1),
    });


  }
  /*private _filter(car: any) {
    this.lastFilter = car;

    let carName;
    if (car == '') {
      carName = car.value || car;
      return this.trackingObjects.filter(car =>
        car.value.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
    }

    else {

      carName = car[0].value || car;
      return this.trackingObjects.filter(car =>
        car.value.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
    }

  }*/


  /*displayCar(value) {
    this.Cars = [];
    if (Array.isArray(value)) {
      this.displayValue = '';
      value.forEach((v, index) => {
        if (index === 0) {
          this.displayValue = v.value + ' ';
          this.Cars.push(v.Key);
        } else {
          this.displayValue += ', ' + v.value + ' ';
          this.Cars.push(v.Key);
        }
      });
      Globals.Cars = this.Cars;
      return this.displayValue;
    } else {
      return this.displayValue;
    }

  }*/

  optionClicked(event: Event, car) {
    event.stopPropagation();
    this.toggleSelection(car);
  }

  toggleSelection(car) {
    car.selected = !car.selected;
    if (car.selected) {
      if (car.selectBy == 'car') {
        this.selectByCar = true;
        this.selectedCars.push(car);
      }
      else {
        this.selectByCar = false;
        this.selectedDrivers.push(car);
      }
    } 
    else {
  
      if (car.selectBy == 'car') {
        this.selectByCar = true;
  
        const i = this.selectedCars.findIndex(value => value.key === car.key);
        this.selectedCars.splice(i, 1);
      }
      else {
        this.selectByCar = false;
        const i = this.selectedDrivers.findIndex(value => value.key === car.key);
        this.selectedDrivers.splice(i, 1);
      }
  
    }
    
    if (this.selectByCar) { 
      this.form.get('Car').setValue(this.selectedCars); 
    }
    else { 
      this.form.get('Car').setValue(this.selectedDrivers); 
    }
  }
  displayCar(car) {
    return car ? car.FullName : '';
  }
  displayVehicle(v: any) {
    
    let test = v;
   if (Array.isArray(v)) {
    this.displayValue = '';
     v.forEach((v, index) => {
      if (index === 0) {
        this.displayValue = v.value + ',';
      } else {
        this.displayValue += v.value + ',';
      }
    });
    return this.displayValue;
   } else {
    return v;
   };
  }

  toggleParent(event: any, group: any) {
    group.checked = event.checked;
    //group.selected = event.checked;
    group.car.forEach((x: any) => {
      this.toggleSelection2(event, x, group);
    })
  }

  toggleSelection2(event: any, name: any, group: any) {
    if (event.checked) {
      this.stateRecord.push(name);
      name.checked = true;
      this.form.get('Car').setValue(this.stateRecord);
      this.isExpandCategory[group.department] = true;
    } else {
      this.stateRecord = this.stateRecord.filter((x: any) => x !== name);
      this.form.get('Car').setValue(this.stateRecord);
      name.checked = false;
      // Reset the checked property of the checkbox
      //group.checked = this.stateRecord.includes(name);
      //this.states.setValue([]);
    }
  }
  expandDocumentTypes(group: any) {
 
    this.isExpandCategory[group.department] = !this.isExpandCategory[group.department];
    // expand only selected parent dropdown category with that childs
  }
  filterGroup(val: any) {
    this.lastFilter = val;
      
        if (typeof val === 'string' && val !== '' && val.length > 1) {
          // Filtering logic when val has more than 1 character
          let filtered = this.listcargroup.filter(group => ({ department: group.department, car: this._filter(group.car, val) }).car.length > 0);
          for (let index = 0; index < filtered.length; index++) {
            filtered[index].car = filtered[index].car.filter(item => this._filter(filtered[index].car, val).indexOf(item) > -1);
          }
          return filtered;
        } else {
          
          this.listcargroup = _.chain(this.trackingObjects).groupBy("DepartmentName").map((value, key) => ({
            department: key,
            car: value,
            // selected: this.stateRecord.some((vehicle: any) => vehicle.DepartmentName === key)
            selected : this.isDepartmentChecked(key)
          })).value();
        }
        return this.listcargroup;
  }

  isDepartmentChecked(departmentName : string){
    let result = true;
    // get the list of cars that contains to departement name
    let carList = this.trackingObjects.filter((x) => x.DepartmentName == departmentName);

    // check if all carList element into stateRecord list of not
    carList.forEach((car) => {
      if(!this.stateRecord.some((vehicle: any) => vehicle.key === car.key)){
        result = false;
      }
    });    
    return result
  }
  
  private _filter(opt: any[], val: any) {
  if(val=='')
  {
    let carName = val.FullName || val;
    return opt.filter(item => item.value.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
  }
  else
  {
    let carName;
    if(val.includes(',')){
      let splitedArrays = val.split(',');
      carName = splitedArrays[splitedArrays.length - 1];
    }
    else{
      carName =  val[0].FullName || val; 
    }
    //  const filterValue = val.toLowerCase();
    return opt.filter(item => item.value.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
  }

  }

  clearVehiculeInput() {
    this.stateRecord = [];
    this.selectedCars = [];
    this.selectedDrivers = [];
    this.form.get('Car').setValue('');
  }

  onChangeType(type)
  {
    this.clearVehiculeInput();
    switch (type) {
      case '1': {
          this.trackingObjects = [];
          this.selectedCars = [];
          this.nametype = "NAV.TrackingObject";
          this.ListCar.map(e => {
            this.trackingObjects.push({ 'key': e.Key, 'value': e.FullName , 'selectBy': 'car', 'DepartmentName': e.DepartmentFullName  });
            });
       
          // this.filteredOptions = this.form.get('Car').valueChanges.pipe(
          //   startWith(''),
          //   map(value => typeof value === 'string' ? value : this.lastFilter),
          // map(filter => this._filter(filter))
          // );
          this.listcargroup =_.chain(this.trackingObjects).groupBy("DepartmentName").map((value,key)=>({department:key,car:value})).value();
          this.CarGroupOptions =  this.form.get('Car').valueChanges.pipe(
            startWith(''),
            map(value =>typeof value === 'string' ? value: this.lastFilter),map(filter => this.filterGroup(filter))
          );
          this._translateService.get(['NAV.' + this.form.value.input1, 'NAV.' + this.form.value.input2, 'NAV.' + this.form.value.input3, 'NAV.' + this.form.value.input4,'NAV.TrackingObject','NAV.Driver']).subscribe(translations => {
            this.NameObject=translations['NAV.TrackingObject'];
          });
          
          break;
      }
      case '2': {
          this.trackingObjects = [];
         

          this.nametype = "NAV.Driver";
         // this.trackingObjects=this.ListDriver;
         this.ListDriver.map(e => {
           let test = e.key;
          this.trackingObjects.push({ 'key': e.key, 'value': e.FullName , 'selectBy': 'Driver', 'DepartmentName': e.DepartmentString  });
          });
          // this.filteredOptions = this.form.get('Car').valueChanges.pipe(
          //   startWith(''),
          //   map(value => typeof value === 'string' ? value : this.lastFilter),
          // map(filter => this._filter(filter))
          // );
          this.listcargroup =_.chain(this.trackingObjects).groupBy("DepartmentName").map((value,key)=>({department:key,car:value})).value();
          this.CarGroupOptions =  this.form.get('Car').valueChanges.pipe(
            startWith(''),
            map(value =>typeof value === 'string' ? value: this.lastFilter),map(filter => this.filterGroup(filter))
          );
          this._translateService.get(['NAV.' + this.form.value.input1, 'NAV.' + this.form.value.input2, 'NAV.' + this.form.value.input3, 'NAV.' + this.form.value.input4,'NAV.TrackingObject','NAV.Driver']).subscribe(translations => {
            this.NameObject=translations['NAV.Driver'];
          });
          break;
      }}

  }
    async GetParam() {

    /*let KeyTrackingObject: number[] = Array();
    
    this.form.value["Car"].forEach(element => {
      KeyTrackingObject.push(element["Key"]);
    });*/
    this.loading = true;
    this.ChartType = [];
    this.SelectionCriteria = [];
    this.param1=[];
    this.param2=[];
    this.param3=[];
    this.param4=[];
    if (this.form.value["input1"] != '-1') { this.SelectionCriteria.push(this.form.value["input1"]); }
    if (this.form.value["input2"] != '-1') { this.SelectionCriteria.push(this.form.value["input2"]); }
    if (this.form.value["input3"] != '-1') { this.SelectionCriteria.push(this.form.value["input3"]); }
    if (this.form.value["input4"] != '-1') { this.SelectionCriteria.push(this.form.value["input4"]); }

    this.ChartType.push(this.form.value["chart1"]);
    this.ChartType.push(this.form.value["chart2"]);
    this.ChartType.push(this.form.value["chart3"]);
    this.ChartType.push(this.form.value["chart4"]);
    let car = [];
    let test = false;
    let idx=0;

    var StartDateGMT = this.form.value.StartDateGMT._d != undefined ? this.form.value.StartDateGMT._d : this.form.value.StartDateGMT;

    var EndDateGMT = this.form.value.EndDateGMT._d != undefined ? this.form.value.EndDateGMT._d : this.form.value.EndDateGMT;
    
   
    let ListeDataByDate: { x: Date, y: Number }[] = [];
    this.series = [];
    this.yaxis = [];
    this.size = [];

    
   car=  this.form.value.Car.map(x=>(x.key));
    let  testexection = true;
    let tab =[];
    let divider = 150
  let result = []
  let tabNbr = Math.floor(car.length / divider)
  this.isChartPrepared = false;
  
  for(let i = 0; i < tabNbr; i++){
       tab = car.slice(i * divider, (i + 1) * divider)
       await this.getdata(tab,StartDateGMT,EndDateGMT)
      //result.push(await service(tab))
  }

   tab = car.slice(tabNbr * divider, car.length)
   
   if(tab.length >0)
      await this.getdata(tab,StartDateGMT,EndDateGMT)
  
      this.SetDataChart ()
    

/*while (testexection && idx <=2 )
{
 
  if (car.length > 5) {
    if (idx == 0)
      tab = car.slice(0, car.length / 2);

    else
    {
      tab = car.slice(car.length / 2 + 1);
      testexection= false;
    }
  }

  else {
    tab = car;
    testexection = false;
  }

  idx++;
      
   await this.getdata(tab,StartDateGMT,EndDateGMT)

   
 

  if (idx == 2)
  testexection = false;


if (testexection == false) {
    this.SetDataChart ()

}

  
}*/
//});


  }
  async getdata(tab,StartDateGMT,EndDateGMT): Promise<boolean>
  {
    let date1: Date;
    let counter = 0;
    /*let result = await this._ReportService.GeConfigurableReport(tab, StartDateGMT,
      EndDateGMT, this.form.value["type"]).pipe(takeUntil(this.destroy)).toPromise()*/

      // fetch tab and send it to service to get data
      for(let i = 0; i < tab.length; i++){
        
        let result = await this._ReportService.GeConfigurableReportByVeshicule(tab[i], StartDateGMT,EndDateGMT, this.form.value["type"]).pipe(takeUntil(this.destroy)).toPromise();
        if(result !== undefined){
          let data: any = decrypt(result);
          

          this.reportData = data.ListGeneralReport;
  
          this.reportData.forEach(element => {
            if (this.form.value.input1 != -1) {
              this.param1.push(element[this.form.value.input1]);
            }
            if (this.form.value.input2 != -1) {
              this.param2.push(element[this.form.value.input2]);
            }
            if (this.form.value.input3 != -1) {
              this.param3.push(element[this.form.value.input3]);
            }
            if (this.form.value.input4 != -1) {
              this.param4.push(element[this.form.value.input4]);
            }
            if (this.form.value.type == '1')
            {
              if(element["Matricule"] != '')
                 this.labels.push(element["Matricule"]);
                else
                {
                    if(data.ListDrivingQuality.length >0)
                      this.labels.push(data.ListDrivingQuality[0].TrackingObjectName);
                    else
                    this.labels.push(element["Matricule"]);
                }
            }
             
    
            else
              this.labels.push(element["Driver"]);
            
            element.AllExtendedGpsData.forEach(e => {
              date1 = new Date(parseInt(e.AcquisitionTime.split('/Date(')[1].split(')/')[0]));
              // ListeDataByDate.push({x:date1,y:e.FuelLevel});
              this.chartOptions2.series2[0].data.push(e.FuelLevel);
              this.chartOptions2.labels.push(date1.toString());
            });
    
          });
          counter ++;
          this.progressbarValue = ((counter * 100) / tab.length);
          this.SetDataChart()
          this.isChartPrepared = true;
        }else{
          counter ++;
          this.progressbarValue = ((counter * 100) / tab.length);
              //this.labels.push(tab[i].name);
        }
      }
    return true
  }

  SetDataChart ()
  {
   // this.seriesDate = ListeDataByDate;
   // clear chart data
    this.series = [];
    this.yaxis = [];
    this.size = [];
    this.markers = ({ size: this.size });

   this.loading = false;
    this._translateService.get(['NAV.' + this.form.value.input1, 'NAV.' + this.form.value.input2, 'NAV.' + this.form.value.input3, 'NAV.' + this.form.value.input4,'NAV.TrackingObject','NAV.Driver']).subscribe(translations => {

      if (this.param1.length > 0) {
        
        if (this.form.value.chart1 == "chartMark") {
          this.series.push({ data: this.param1, name: translations['NAV.' + this.form.value.input1], type: "line" });
          this.size.push(3);
        }
        else {          
          this.series.push({ data: this.param1, name: translations['NAV.' + this.form.value.input1], type: this.form.value.chart1 });
          this.size.push(0);
        }
          this.yaxis.push({
            seriesName: this.form.value.input1, opposite: false, axisTicks: { show: true }, axisBorder: { show: true, color: "#6141ac" }, labels: { style: { color: "#6141ac" } },
            title: { text: translations['NAV.' + this.form.value.input1], style: { color: "#6141ac" } }, tooltip: { enabled: true }
          });
      }
      if (this.param2.length > 0) {
        if (this.form.value.chart2 == "chartMark") {
          this.series.push({ data: this.param2, name: translations['NAV.' + this.form.value.input2], type: "line" });
          this.size.push(3);
        }
        else {
          this.series.push({ data: this.param2, name: translations['NAV.' + this.form.value.input2], type: this.form.value.chart2 });
          this.size.push(0);
        }
          this.yaxis.push({
            seriesName: this.form.value.input2, opposite: true, axisTicks: { show: true }, axisBorder: { show: true, color: "#ca970d" }, labels: { style: { color: "#ca970d" } },
            title: { text: translations['NAV.' + this.form.value.input2], style: { color: "#ca970d" } }, tooltip: { enabled: true }
          });
      }
      if (this.param3.length > 0) {
        if (this.form.value.chart3 == "chartMark") {
          this.series.push({ data: this.param3, name: translations['NAV.' + this.form.value.input3], type: "line" });
          this.size.push(3);
        }
        else {
          this.series.push({ data: this.param3, name: translations['NAV.' + this.form.value.input3], type: this.form.value.chart3 });
          this.size.push(0);


        }
          this.yaxis.push({
            seriesName: this.form.value.input3, opposite: true, axisTicks: { show: true }, axisBorder: { show: true, color: "#2e9be5" }, labels: { style: { color: "#2e9be5" } },
            title: { text: translations['NAV.' + this.form.value.input3], style: { color: "#2e9be5" } }, tooltip: { enabled: true }
          });
      }
      if (this.param4.length > 0) {
        if (this.form.value.chart4 == "chartMark") {
          this.series.push({ data: this.param4, name: translations['NAV.' + this.form.value.input4], type: "line" });
          this.size.push(3);
        }
        else {
          this.series.push({ data: this.param4, name: translations['NAV.' + this.form.value.input4], type: this.form.value.chart4 });
          this.size.push(0);
        }
          this.yaxis.push({
            seriesName: this.form.value.input4, opposite: true, axisTicks: { show: true }, axisBorder: { show: true, color: "#28b650" }, labels: { style: { color: "#28b650" } },
            title: { text: translations['NAV.' + this.form.value.input4], style: { color: "#28b650" } }, tooltip: { enabled: true }
          });
      }
    });
    this.markers = ({ size: this.size });
    this.chartReady = true;
  }



}






async function something(car: []){

  let divider = 10
  let result = []
  let tabNbr = Math.floor(car.length / divider)

  for(let i = 0; i < tabNbr; i++){
      let tab = car.slice(i * divider, (i + 1) * divider)
      //result.push(await service(tab))
  }

  let tab = car.slice(tabNbr * divider, car.length)
  //result.push(await service(tab))
}