  export interface CarGroup {
    department: string;
    car: Vehicle[];
  }

import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import * as shape from 'd3-shape';

import { fuseAnimations } from '@fuse/animations';

import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ProjectDashboardService } from './project.service';
import { decrypt } from 'app/main/parc/Parc';
import { DataChart } from 'app/main/parc/interfaces/depenses-general';
import { json2array } from 'app/main/helpers/must-match.validator';
import { Color, Label } from 'ng2-charts/ng2-charts';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { MatBottomSheet, MatBottomSheetRef, MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { startWith, map } from 'rxjs/operators';
import { BottomSheetOverviewParcComponent } from './bottom-sheet-overview-parc/bottom-sheet-overview-parc.component';
import { Vehicle } from 'app/main/parc/gestio-des-vehicules/model';
import * as _ from 'lodash';
import { DashboardparampopupComponentComponent } from './dashboardparampopup-component/dashboardparampopup-component.component';

@Component({
    selector: 'project-dashboard',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})


export class ProjectDashboardComponent implements OnInit {
    projects: any[];
    selectedProject: any;

    widgets: any;
    widget5: any = {};
    widget6: any = {};
    widget7: any = {};
    widget8: any = {};
    widget9: any = {};
    widget11: any = {};

    dateNow = Date.now();
    data: any;
    carCount: any;
    equipment = 0;
    connected = 0;
    notconnected = 0;
    Alerts = [];
    CarMatricule: any;
    dashboarddata: any;
    datas: ChartDataSets[];
    chartReady = false;
    datasets: ChartDataSets[];
    labels: Label[];
    barChartData: ChartDataSets[];
    maintenance = 0;
    document = 0;
    hbarChartData: ChartDataSets[];
    speedbarChartData: ChartDataSets[];
    RPMbarChartData: ChartDataSets[];
    FuelbarChartData: ChartDataSets[];
    stopbarChartData: ChartDataSets[];

    form: FormGroup;
    maxDate: any;
    minDate: any;
    color: any;
    touchUi: any;
    Selected_chauffeur: any;
    stepMinute: any;
    stepHour: any;
    stepSecond: any;
    showSpinners: any;
    showSeconds: any;
    dateObj = new Date(); noshrink: any;
    trackingobjects = [];
    selected: any[];
    car = [];
    isselect: boolean;
    seletedCars: any;
    Cars = [];
    filteredOptions: Observable<string[]>;
    lastFilter: string = '';
    selectedCars = [];
    connectedeqp: any;
    notconnectedeqp: any;
    public loading = false;
    displayValue: string;
    docomentListReminder = [];
    maintenenceListReminder = [];
    circulationCar = [];
    stopCar = [];
    circulationCarCount: number;
    stopCarCount: number;
    type: any;
    result: any;
    // optgroup
    listcargroup: CarGroup[];
     stateRecord:any = [];
 CarGroupOptions: Observable<CarGroup[]>;
 isExpandCategory: boolean[] = [];
    isMobileResolution: boolean;

    /**
     * Constructor
     *
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {ProjectDashboardService} _projectDashboardService
     */
    constructor(
        private _fuseSidebarService: FuseSidebarService,
        private _projectDashboardService: ProjectDashboardService,
        private _bottomSheet: MatBottomSheet,
        private translateService: TranslateService,
        private _matDialog : MatDialog


    ) {
        this.form = this.createForm();
        /**
         * Widget 5
         */
     
        this.widget5 = {
            currentRange: 'TW',
            xAxis: true,
            yAxis: true,
            gradient: false,
            legend: false,
            showXAxisLabel: false,
            showYAxisLabel: false,
            scheme: {
                domain: ['#42BFF7', '#C6ECFD', '#C7B42C', '#AAAAAA']
            },
            onSelect: (ev) => {

            },
            supporting: {
                currentRange: '',
                xAxis: false,
                yAxis: false,
                gradient: false,
                legend: false,
                showXAxisLabel: false,
                showYAxisLabel: false,
                scheme: {
                    domain: ['#42BFF7', '#C6ECFD', '#C7B42C', '#AAAAAA']
                },
                curve: shape.curveBasis
            }
        };

        /**
         * Widget 6
         */
        this.widget6 = {
            currentRange: 'TW',
            legend: false,
            explodeSlices: false,
            labels: true,
            doughnut: true,
            gradient: false,
            scheme: {
                domain: ['#4caf50', '#039be5 ']
            },
            onSelect: (ev) => {

            }
        };

        /**
         * Widget 7
         */
        this.widget7 = {
            currentRange: 'T'
        };

        /**
         * Widget 8
         */
        this.widget8 = {
            legend: false,
            explodeSlices: false,
            labels: true,
            doughnut: false,
            gradient: false,
            scheme: {
                domain: ['#f44336', '#9c27b0', '#03a9f4', '#e91e63', '#ffc107']
            },
            onSelect: (ev) => {

            }
        };

        /**
         * Widget 9
         */
        this.widget9 = {
            currentRange: 'TW',
            xAxis: false,
            yAxis: false,
            gradient: false,
            legend: false,
            showXAxisLabel: false,
            showYAxisLabel: false,
            scheme: {
                domain: ['#42BFF7', '#C6ECFD', '#C7B42C', '#AAAAAA']
            },
            curve: shape.curveBasis
        };

        setInterval(() => {
            this.dateNow = Date.now();
        }, 1000);

    }
    openBottomSheet(type): void {
        switch (type) {
            case 2:
                {

                    this.data = this.maintenenceListReminder;
                    this.type = type;
                    break;
                }
            case 1:
                {
                    this.data = this.docomentListReminder;
                    this.type = type;
                    break;
                }
            case 3:
                {
                    this.data = this.circulationCar;
                    this.type = type;
                    break;
                }
            case 4:
                {
                    this.data = this.stopCar;
                    this.type = type;
                    break;
                }


        }
        this._bottomSheet.open(BottomSheetOverviewParcComponent, {
            data: {
                data: this.data,
                type: this.type
            }
        });
    }

    createForm(): FormGroup {
        return new FormGroup({


            Car: new FormControl(''),
            StartDateGMT: new FormControl(new Date(this.dateObj.getUTCFullYear(), this.dateObj.getUTCMonth(), this.dateObj.getUTCDate(), 0, 0, 0)),
            EndDateGMT: new FormControl(new Date(this.dateObj.getUTCFullYear(), this.dateObj.getUTCMonth(), this.dateObj.getUTCDate(), 23, 59, 59)),
            Emplacement: new FormControl(1),
            report: new FormControl(1),

        });


    }
    updateDashboard() {
        if (this.form.value.Car != "" && Array.isArray(this.form.value.Car)) {
            this.Cars = [];
            this.form.value.Car.forEach(element => {

                this.Cars.push(element.Key);
            });
        }
        this.seletedCars = this.Cars;
        this.generate(this.seletedCars,this.form.value.StartDateGMT,this.form.value.EndDateGMT)
     
    }

    generate(seletedCars,StartDateGMT,EndDateGMT)
    {
        this.loading = true;
        this.translateService.get(['NAV.Stop'
        , 'NAV.Circulation','NAV.consommationmoyenne', 'NAV.consommationLitre', 'NAV.Distance' , 'NAV.FuelMinValue'
        , 'NAV.FuelMaxValue', 'NAV.connected' ,'NAV.disconnected' , 'NAV.SpeedMax'
        , 'NAV.speeds', 'NAV.stops' ,  'NAV.RPMSTOPmoteurenmarche', 'NAV.RPMSTOP' ,'NAV.RPMMarche','NAV.SpeedOverride','NAV.OverEngineSpeed',
        'NAV.AggressiveDrivingSuddenAcceleration','NAV.AggressiveDrivingSuddenBraking','NAV.AggressiveDrivingAccelerationOrSuddenBraking' ])
        .subscribe(data => { this.data = data }
        );
        let datachar: Array<any> = [];
        let datasets: ChartDataSets[] = [];
        let barChartData: ChartDataSets[] = [];
        let hbarChartData: ChartDataSets[] = [];
        let speedbarChartData: ChartDataSets[] = [];
        let RPMbarChartData: ChartDataSets[] = [];
        let FuelbarChartData: ChartDataSets[] = [];
        let stopbarChartData: ChartDataSets[] = [];

        
        
       
        this._projectDashboardService.GetListObjectDashbord(seletedCars, StartDateGMT, EndDateGMT
        ).subscribe((data) => {
            this.loading = false;
            this.dashboarddata = [];
            this.dashboarddata = decrypt(data);
            if (this.dashboarddata != null) {
                let r1 = [];
                let r2 = [];
                let r3 = [];
                let r4 = [];
                let r5 = [];
                let r6 = [];
                let r7 = [];
                let r8 = [];
                let r9 = [];
                let r15=[];
                let r10 = [];
                let r11 = [];
                let r12 = [];
                let r13 = [];
                let r14 = [];
                let r16 = []; 
                let r17 = [];
                let r18 = [];
                let r19 = [];
                let labels: Label[] = [];

                this.dashboarddata.forEach(element => {



                    r1.push(element["DistanceInKm"]);
                    r2.push(element["FuelConsumptionAvg"]);
                    r3.push(element["FuelConsumptionInL"]);
                    r4.push(element["CirculationPeriodInPercent"].replace("%", ""));
                    r5.push(element["StopPeriodInPercent"].replace("%", ""));
                    r6.push(Math.round(element["CirculationPeriodInHours"]));
                    r7.push(Math.round(element["StopPeriodInHours"]));
                    r8.push(Math.round(element["EngineRunPeriodInStopInHours"]));
                    r9.push(Math.round(element["EngineStopPeriodInHours"]));
                    r15.push(Math.round(element["EngineRunPeriodInHours"]));
                    r10.push(element["MinFuelLevel"]);
                    r11.push(element["MaxFuelLevel"]);
                    r12.push(element["SpeedMax"]);
                    r13.push(element["StopNumber"]);
                    r14.push(element["NbrAlertOverSpeed"]);
                    r16.push(element["AlertRPMOutOfRangeNumber"]);
                    r17.push(element["AlertHarshAccelerationNumber"]);
                    r18.push(element["AlertHarshBrakingNumber"]);
                    r19.push(element["AlertHarshAccelerationOrBrakingNumber"]);
                    labels.push(element["TrackingObjName"]);

                    let r: Array<any> = [];
                    r.push({ 'name': this.data["NAV.Distance"], 'value': element["DistanceInKm"] });
                    r.push({ 'name': "Cosommation moyenne de carburant", 'value': element["FuelConsumptionAvg"] });
                    r.push({ 'name': "Consommation de carburant en L", 'value': element["FuelConsumptionInL"] });
                    r.push({ 'name': this.data["NAV.SpeedMax"], 'value': element["SpeedMax"] });


                    datachar.push({ 'name': element["TrackingObjName"], 'series': r });
                    this.consommation = [...datachar];

                });
                datasets.push({ 'data': r1, 'label': this.data["NAV.Distance"] });
                datasets.push({ 'data': r2, 'label': this.data["NAV.consommationmoyenne"],});
                datasets.push({ 'data': r3, 'label': this.data["NAV.consommationLitre"] });
                barChartData.push({ 'data': r4, 'label': this.data["NAV.Circulation"], stack: 'a' });
                barChartData.push({ 'data': r5, 'label': this.data["NAV.Stop"], stack: 'a' });
                hbarChartData.push({ 'data': r6, 'label': this.data["NAV.Circulation"], stack: 'a' });
                hbarChartData.push({ 'data': r7, 'label': this.data["NAV.Stop"], stack: 'a' });
                RPMbarChartData.push({ 'data': r8, 'label': this.data["NAV.RPMSTOPmoteurenmarche"]});
                RPMbarChartData.push({ 'data': r9, 'label': this.data["NAV.RPMSTOP"] });
                RPMbarChartData.push({ 'data': r15, 'label': this.data["NAV.RPMMarche"] });
                FuelbarChartData.push({ 'data': r10, 'label':  this.data["NAV.FuelMinValue"] });
                FuelbarChartData.push({ 'data': r11, 'label':  this.data["NAV.FuelMaxValue"] });
                stopbarChartData.push({ 'data': r14, 'label':  this.data["NAV.SpeedOverride"] });
                stopbarChartData.push({ 'data': r16, 'label':  this.data["NAV.OverEngineSpeed"] });
                stopbarChartData.push({ 'data': r17, 'label':  this.data["NAV.AggressiveDrivingSuddenAcceleration"] });
                stopbarChartData.push({ 'data': r18, 'label':  this.data["NAV.AggressiveDrivingSuddenBraking"] });
                stopbarChartData.push({ 'data': r19, 'label':  this.data["NAV.AggressiveDrivingAccelerationOrSuddenBraking"] });

                speedbarChartData.push({ 'data': r12, 'label':  this.data["NAV.SpeedMax"]});
                this.chartReady = true;

                this.datasets = datasets;
                this.barChartData = barChartData;
                this.hbarChartData = hbarChartData;
                this.speedbarChartData = speedbarChartData;
                this.RPMbarChartData = RPMbarChartData;
                this.FuelbarChartData = FuelbarChartData;
                this.stopbarChartData = stopbarChartData;

                this.labels = labels;
                this.chartReady = true;

            }
        }, err => {
            this.loading = false;
            //...
        });
    }
    single: DataChart[];

    consommation: DataChart[];



    public lineChartColors: Color[] = [
        { // dark grey
            backgroundColor: 'rgba(247, 185, 36, 0.2)',
            borderColor: '#f7b924',
            borderCapStyle: 'round',
            borderDash: [],
            borderWidth: 4,
            borderDashOffset: 0.0,
            borderJoinStyle: 'round',
            pointBorderColor: '#f7b924',
            pointBackgroundColor: '#fff',
            pointHoverBorderWidth: 4,
            pointRadius: 6,
            pointBorderWidth: 5,
            pointHoverRadius: 8,
            pointHitRadius: 10,
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#f7b924',
        },
    ];
    public options = {
        layout: {
            padding: {
                left: 0,
                right: 8,
                top: 0,
                bottom: 0
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    display: true,
                    beginAtZero: true
                },
                gridLines: {
                    display: false
                }
            }],
            xAxes: [{
                ticks: {
                    display: true
                },
                gridLines: {
                    display: false
                }
            }]
        },
        legend: {
            display: true
        },
        responsive: true,
        maintainAspectRatio: false

    };
    public optionsUsage = {
        layout: {
            padding: {
                left: 0,
                right: 8,
                top: 0,
                bottom: 0
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    display: true,
                    beginAtZero: true
                },
                gridLines: {
                    display: false
                }
            }],
            xAxes: [{
                ticks: {
                    display: true
                },
                gridLines: {
                    display: false
                }
            }]
        },
        legend: {
            display: true
        },
        tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                label: function(tooltipItems, data) { 
                    return tooltipItems.yLabel + ' %';
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false

    };
    public optionsRPM = {
        layout: {
            padding: {
                left: 0,
                right: 8,
                top: 0,
                bottom: 0
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    display: true,
                    beginAtZero: true
                },
                gridLines: {
                    display: false
                },
             
                type: 'time',
                time: {
                  
                   format:"D.hh:mm:ss.fff",
                    displayFormats: {
                        'second': 'ss',
                        'minute': 'mm:ss',
                        'hour': 'hh:mm:ss',
                        'day': 'D j hh:mm:ss',
                    }
                }
            }],
          
            xAxes: [{
                ticks: {
                    display: true
                },
                gridLines: {
                    display: false
                }
            }]
        },
        legend: {
            display: true
        },
        responsive: true,
        maintainAspectRatio: false

    };
    public options1 = {
        layout: {
            padding: {
                left: 0,
                right: 8,
                top: 0,
                bottom: 0
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    display: false,
                    beginAtZero: false
                },
                gridLines: {
                    display: false
                }
            }],
            xAxes: [{
                ticks: {
                    display: false
                },
                gridLines: {
                    display: false
                }
            }]
        },
        legend: {
            display: false
        },
        responsive: true,
        maintainAspectRatio: false

    };
    public barChartOptions: ChartOptions = {
        responsive: true,
    };
    public barChartType: ChartType = 'bar';
    public barChartLegend = true;



    public colors: [
        {
            borderColor: '#4caf50',
            backgroundColor: '#4caf50',
            pointBackgroundColor: '#1e88e5',
            pointHoverBackgroundColor: '#1e88e5',
            pointBorderColor: '#ffffff',
            pointHoverBorderColor: '#ffffff'
        }
    ];
    public colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };
    public view: any[] = [700, 400];
    displayedColumns: string[] = ['TrackingObjectFullName', 'type']
    datasource: MatTableDataSource<unknown>;
    @ViewChild(MatPaginator, null) paginator: MatPaginator;

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        
        if (window.innerWidth < 768) {
            this.isMobileResolution = true;
          } else {
            this.isMobileResolution = false;
          }

        this.translateService.get(['NAV.Stop'
        , 'NAV.Circulation','NAV.consommationmoyenne', 'NAV.consommationLitre', 'NAV.Distance' , 'NAV.FuelMinValue'
        , 'NAV.FuelMaxValue', 'NAV.connected' ,'NAV.disconnected' , 'NAV.SpeedMax'
        , 'NAV.speeds', 'NAV.stops' ,  'NAV.RPMSTOPmoteurenmarche', 'NAV.RPMSTOP'  ])
        .subscribe(data => { this.data = data }
        );
       
        this._projectDashboardService.GetParams().subscribe((result) => {

            this.result = decrypt(result);
            this.carCount = this.result.length;
            this.result.forEach(element => {

                if (Object.keys(element.MaintenanceReminderToDo).length > 0) {

                    this.maintenance = this.maintenance + json2array(element.MaintenanceReminderToDo).length;
                    json2array(element.MaintenanceReminderToDo).forEach(element => {
                        this.maintenenceListReminder.push(element);
                    });

                }

                if (element.CarDocumentReminderJSONToDo != undefined) {
                    this.document = this.document + json2array(element.CarDocumentReminderJSONToDo).length;
                    json2array(element.CarDocumentReminderJSONToDo).forEach(element => {
                        this.docomentListReminder.push(element);
                    });
                }

                if (element.CurrentEquipmentElement != null) {
                    this.equipment = this.equipment + 1;
                    this.trackingobjects.push(element);

                    this.car.push(element.Key);
                    this.selected = [];

                    this.selected = this.trackingobjects;

                }


            });
            this.connectedeqp = [];
            this.notconnectedeqp = [];
            this.trackingobjects.forEach(elm => {
                if (elm.Connected == true) {
                    this.connectedeqp.push(elm);
                    if (elm.Speed > 0) {
                        this.circulationCar.push(elm);
                    }
                    else {
                        this.stopCar.push(elm);
                    }
                }
                else {
                    this.notconnectedeqp.push(elm);
                }
            });
            this.connected = this.connectedeqp.length;
            this.notconnected = this.notconnectedeqp.length;
            this.circulationCarCount = this.circulationCar.length;
            this.stopCarCount = this.stopCar.length;
            let datachar: Array<DataChart> = [];
            datachar.push({ 'name': this.data["NAV.connected"], 'value': this.connected });
            datachar.push({ 'name': this.data["NAV.disconnected"], 'value': this.notconnected });

            this.single = [...datachar];

            this.datasource = new MatTableDataSource(this.Alerts);

            this.datasource.paginator = this.paginator;
            /*this.filteredOptions = this.form.get('Car').valueChanges.pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : this.lastFilter),
                map(filter => this._filter(filter))
            );*/
           
     this.listcargroup =_.chain(this.trackingobjects).groupBy("DepartmentName").map((value,key)=>({department:key,car:value})).value();
     this.CarGroupOptions =  this.form.get('Car').valueChanges.pipe(
        startWith(''),
        map(value =>typeof value === 'string' ? value: this.lastFilter),map(filter => this.filterGroup(filter))
      );           
        });


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
          this.listcargroup = _.chain(this.trackingobjects).groupBy("DepartmentName").map((value, key) => ({
            department: key,
            car: value,
            // Set the 'selected' property based on the existence of selected vehicles
            selected: this.stateRecord.some((vehicle: Vehicle) => vehicle.DepartmentName === key && vehicle.FullName)
          })).value();
        }
      
        console.log("filterGroup", this.listcargroup);
        return this.listcargroup;
      }
      _filter(opt: Vehicle[], val: any) {
        if(val=='')
        {
          let carName = val.FullName || val;
          let test = opt.filter(item => item.FullName.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
          return opt.filter(item => item.FullName.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
        }
        else
        {
         let carName = val[0].FullName || val; 
         let test = opt.filter(item => item.FullName.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
     //  const filterValue = val.toLowerCase();
       return opt.filter(item => item.FullName.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
        }
      
      } 
    displayCar(value) {
        if (Array.isArray(value)) {
            this.displayValue = '';
            value.forEach((v, index) => {
                if (index === 0) {
                    this.displayValue = v.FullName + ' ';
                } else {
                    this.displayValue += ', ' + v.FullName + ' ';
                }
            });
            return this.displayValue;
        } else {
            return this.displayValue;
        }
    }
  /*   optionClicked(event: Event, car) {
        event.stopPropagation();
        this.toggleSelection(car);
    } */

 /*    toggleSelection(car) {
        car.selected = !car.selected;
        if (car.selected) {
            this.selectedCars.push(car);
        } else {
            const i = this.selectedCars.findIndex(value => value.firstname === car.firstname && value.lastname === car.lastname);
            this.selectedCars.splice(i, 1);
        }

        this.form.get('Car').setValue(this.selectedCars);
    } */

    // optgroup
    toggleParent(event: any, group: any) {
        group.checked = event.checked;
        group.selected = event.checked;
        group.car.forEach((x: Vehicle) => {
          this.toggleSelection(event, x, group);
        })
    }

    toggleSelection(event: any, name: any, group: any) {
    //console.log(group);
    //console.log(event.checked);
    // if(event.checked) {
    //   console.log("stastateRecordtelist", this.stateRecord);
    //   this.stateRecord.push(name);
    //   this.form.get('Car').setValue(this.stateRecord);
    //   console.log("toggleselection ", this.form.get('Car').value);
    // }
    // else {
    //     this.stateRecord = this.stateRecord.filter((x:any) => x!== name);
    //     console.log("else toggleselection", name, group, this.form.get('Car').value);
    //     this.form.get('Car').setValue(this.form.get('Car').value.filter((x:any) => x!== name));
    //     console.log("after filter ", this.form.get(
    //       'Car').value);
    //     //this.states.setValue([]);
    // }
    if (event.checked) {
        this.stateRecord.push(name);
        name.checked = true;
        this.form.get('Car').setValue(this.stateRecord);
        this.isExpandCategory[group.department] = true;
        console.log("this.stateRecord", this.stateRecord);
      } else {
        this.stateRecord = this.stateRecord.filter((x: any) => x !== name);
        console.log(this.stateRecord);
        this.form.get('Car').setValue(this.stateRecord);
        name.checked = false;
      }
  }
  expandCars(group: any) {
    console.log("expanding dropdown", group);
    this.isExpandCategory[group.department] = !this.isExpandCategory[group.department];
    // expand only selected parent dropdown category with that childs
  }

  generateDashboard(): void {
    const dialogRef = this._matDialog.open(DashboardparampopupComponentComponent, {
      panelClass: 'custom-dialog-container',  
        data      : {
            trackingobjects:  this.trackingobjects
                 },
      position: {
        bottom: '270px',
        left: '50px'
      }     
    });

    dialogRef.afterClosed().subscribe((result: any) => {
        

        let ListkeyTrackingObject :number[]=[];
        //if(Object.prototype.toString.call(this.form.get('keyTrackingObject').value) === '[object Array]') {
          result.value.keyTrackingObject.forEach(e=>{
            ListkeyTrackingObject.push(e.Key);
    
          })
          this.generate(ListkeyTrackingObject, result.value.dateTo, result.value.dateFrom);

     //   }
       // else{
        //  ListkeyTrackingObject.push(this.form.get('keyTrackingObject').value.Key);
       // }
       });
    
  }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle the sidebar
     *
     * @param name
     */



}