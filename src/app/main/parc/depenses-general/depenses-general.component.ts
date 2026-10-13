import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GeneralCost, ListTracking, ListTypeSelected, ListSupplier, ListCostAndDetails, ListDetailsCostRepairMaintenanceLog, ListDetailsCostCarDocumentLog, ListDetailsCost, DataChart, DataLine, DataChart2 } from '../interfaces/depenses-general';
import { DepensesGeneralService } from '../services/depenses-general.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../i18n/en';
import { locale as french } from'../i18n/fr';
import { locale as arab } from '../i18n/ar';
import { json2array } from  'app/main/helpers/must-match.validator';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
@Component({
    selector: 'app-depenses-general',
    templateUrl: './depenses-general.component.html',
    styleUrls: ['./depenses-general.component.scss'],
    animations: [
        trigger('animate', [
            state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ]
})
export class DepensesGeneralComponent implements OnInit {

    Types: any[] = [{name:'PARC.Supplier' , value:'1'}, {name:'PARC.Category' , value:'2'}, {name:'PARC.Model' , value:'3'}, {name:'Account' , value:'4'}, {name:'Vehicle' , value:'5'}, {name:'PARC.Departement' , value:'6'}, {name:'PARC.Driver' , value:'7'}];
    MyShema = {
        domain: ['#8BB7F9', '#039BE5', '#115E87', '#184058', '#1E2129']
      };
    displayedColumns: string[] = ['Name', 'TotalCost'];
    displayedColumns2: string[] = ['ActionDate', 'Reference', 'Quantity', 'PUTTC', 'TotalCost'];
    displayedColumnsType: string[] = ['carLib','ActionDate',  'Quantity', 'PUTTC', 'TotalCost'];
    dataSource: MatTableDataSource<ListTypeSelected>;
    dataSourceDetails: MatTableDataSource<ListDetailsCost>;
    dataSourceDetails2: MatTableDataSource<ListDetailsCost>;
    dataSourceDetailsType: MatTableDataSource<ListDetailsCost>;
    driverList: any;
    generalCost: GeneralCost ;
    ListTracking: ListTracking[];
    ListTypeSelected: Array<ListTypeSelected> = [];
    lastFilter: string = '';


    ListSupplier: ListSupplier[];
    ListDetailsCostRepairMaintenanceLog: ListDetailsCostRepairMaintenanceLog[];
    ListDetailsCostCarDocumentLog: ListDetailsCostCarDocumentLog[];
    NameObject: string;
    SelectCar = new FormControl();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    StartDateGMT;
    form: FormGroup;
    ObjListCostAndDetails: ListCostAndDetails;
    single: DataChart[];
    view: any[] = [innerHeight, innerWidth];
    gradient: boolean = false;
    showLegend: boolean = true;
    showLabels: boolean = true;
    isDoughnut: boolean = false;
    barChartData2: DataChart[];
    viewBar: any[] = [400, 400];
    showXAxis = true;
    showYAxis = true;
    gradientBar = false;
    showLegendBar = true;
    showXAxisLabel = true;
    legendPosition = 'below';
     filtreObject:string;
     selectedObj = [];
    showYAxisLabel = false;
    ObjetsSelected :any[];

    DataLine: DataLine[];
    viewLine: any[] = [1000, 400];

    // options
    legendLine: boolean = false;
  
    animations: boolean = true;
    xAxis: boolean = true;
    yAxis: boolean = true;
    
    flip = false;
    flip2 = false;
    colorLine = {
        domain: ['rgb(66, 191, 247)']
    };
    searchkey;
    filteredOptions: Observable<ListTypeSelected[]>;

    constructor(private _depensesGeneralService: DepensesGeneralService, 
        private fb: FormBuilder, private _fuseTranslationLoaderService : FuseTranslationLoaderService) {
            this._fuseTranslationLoaderService.loadTranslations(english, french, arab);
    }

    ngOnInit() {
        this.buildForm();
        this.NameObject = "PARC.Supplier";
       
       

        this._depensesGeneralService.getData().subscribe((data: GeneralCost) => {
            this.generalCost = data;
            if(this.generalCost != undefined)
            this.ListSupplier = this.generalCost.ListSupplier;
            let date = new Date();
            //this.StartDateGMT = date.toDateString();
            try {
                this.ListSupplier.forEach(item => {
                   
                    this.ListTypeSelected.push({ 'ID': item.ID, 'Name': item.Name });
                });
            }
            catch (err) {
                console.log("error " + err);
            }

            //console.log(this.ListTypeSelected);
            if(data != undefined)
            this.ListTracking = data.ListTracking;
           // this.test = json2array(data.ListDepartment);
           // console.log(json2array(data.ListDepartment));
            
           // console.log(this.ListTracking);
         
            
        });
       
        this.filteredOptions = this.form.get('ListFourOrCatgOrMdlOrCmpOrTTOrDepOrDri').valueChanges.pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : this.lastFilter),
          map(filter => this._filter(filter))
          );
    }
    private _filter(obj: any) {
        this.lastFilter = obj;
    
        let carName ;
        if(obj == '')
      
       {
         carName = obj.Name || obj;
         return this.ListTypeSelected.filter(x =>
          x.Name.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
       } 
       
       else{
         
         carName = obj[0].Name || obj; 
         return this.ListTypeSelected.filter(x =>
          x.Name.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
        }
        
      }

 
    buildForm(): void {
        this.form = this.fb.group({
            StartDateGMT: new FormControl('') ,
            EndDateGMT: new FormControl(''),
            Type: new FormControl(''),
            ListFourOrCatgOrMdlOrCmpOrTTOrDepOrDri: new FormControl(''),
            
        });
    }
    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    onSelectPie(data): void {
       // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
        let dataSelect = JSON.parse(JSON.stringify(data));
       // console.log(this.ObjListCostAndDetails.ListCost.filter(x => x.Name == dataSelect.name)[0].ListDetailsCost);
        this.flip = !this.flip;
        this.dataSourceDetails2 = new MatTableDataSource(this.ObjListCostAndDetails.ListCost.filter(x => x.Name == dataSelect.name)[0].ListDetailsCost);

        this.dataSourceDetails2.paginator = this.paginator;
        this.dataSourceDetails2.sort = this.sort;
        document.getElementById("car").innerHTML = dataSelect.name ;
        document.getElementById("cost").innerHTML = "Total dépenses :" + Math.floor(dataSelect.value);
    }
    onSelectBar(event) {
        this.flip2 = !this.flip2;
        if(event.name != undefined)
        {
            document.getElementById("TypeDep").innerHTML = event.name;
            document.getElementById("costType").innerHTML = "Total dépenses :" + Math.floor(event.value);
            let ListDetailsCost: Array<ListDetailsCost> = [];
            this.ObjListCostAndDetails.ListCost.forEach(row => {
               
                row.ListDetailsCost.forEach(item => {
                    if (item.Reference == event.name) {
                        item.carLib = row.Name;
                        ListDetailsCost.push(item);
                    }
                });
            });
            this.dataSourceDetailsType = new MatTableDataSource(ListDetailsCost);
    
            this.dataSourceDetailsType.paginator = this.paginator;
            this.dataSourceDetailsType.sort = this.sort;
        }
        else
        {
            document.getElementById("TypeDep").innerHTML = event;
          //  document.getElementById("costType").innerHTML = "Total dépenses :" + Math.floor(event.value);
            let ListDetailsCost: Array<ListDetailsCost> = [];
            let som =0;
            this.ObjListCostAndDetails.ListCost.forEach(row => {
             
                row.ListDetailsCost.forEach(item => {
                    if (item.Reference == event) {
                        item.carLib = row.Name;
                        ListDetailsCost.push(item);
                        som+=item.TotalCost;
                    }
                });
            });
            document.getElementById("costType").innerHTML = "Total dépenses :" + Math.floor(som);
            this.dataSourceDetailsType = new MatTableDataSource(ListDetailsCost);
    
            this.dataSourceDetailsType.paginator = this.paginator;
            this.dataSourceDetailsType.sort = this.sort;
        }
       
    }
    applyFilterDetail(filterValue: string) {
        this.dataSourceDetails2.filter = filterValue.trim().toLowerCase();

        if (this.dataSourceDetails2.paginator) {
            this.dataSourceDetails2.paginator.firstPage();
        }
    }
    applyFilterDetailType(filterValue: string) {
        this.dataSourceDetailsType.filter = filterValue.trim().toLowerCase();

        if (this.dataSourceDetailsType.paginator) {
            this.dataSourceDetailsType.paginator.firstPage();
        }
    }
    rotate() {
        this.flip = !this.flip;
    }
    rotateType() {
        this.flip2 = !this.flip2;
    }
    GetObjListCost(filters: any) {
        let labels: Array<string>=[];
        
        let type: number;
        if (filters.Type == "")
            type = 1;
        else
            type = filters.Type;
        let ListObjectSelected: Array<ListTypeSelected> = [];
        filters.ListFourOrCatgOrMdlOrCmpOrTTOrDepOrDri.forEach(value => {            
            let name = this.ListTypeSelected.filter(x => x.ID == value.ID)[0].Name;
            ListObjectSelected.push({ 'ID': value.ID, 'Name': name });
            labels.push(name);
        });
        this.filteredOptions = this.form.get('ListFourOrCatgOrMdlOrCmpOrTTOrDepOrDri').valueChanges.pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : this.lastFilter),
          map(filter => this._filter(filter))
          );

        this._depensesGeneralService.GetObjListCostAndDetails(filters.StartDateGMT._d, filters.EndDateGMT._d, type, ListObjectSelected).subscribe((data: ListCostAndDetails) => {
            this.ObjListCostAndDetails = data;
          //  let ListMvt2: ListDetailsCost[] = data.ListDetailsCost;

            this.ListDetailsCostRepairMaintenanceLog = data.ListDetailsCostRepairMaintenanceLog;
            this.ListDetailsCostCarDocumentLog = data.ListDetailsCostCarDocumentLog;
            
            let datachar: Array<DataChart> = [];
            let sum: number = 0;
            let lined: Array<DataLine> = [];
            let series: Array<DataChart2> = [];
            

            this.ObjListCostAndDetails.ListCost.forEach(item => {
                datachar.push({ 'name': item.Name, 'value': item.TotalCost });
                sum = sum + item.TotalCost;
               
                let ListDetailsCost: Array<ListDetailsCost> = [];
                let detailMaintenance: ListDetailsCostRepairMaintenanceLog[]=[];
                let detailDocumentLog: ListDetailsCostCarDocumentLog[]=[];
                let ListMvt: ListDetailsCost[]=[];
                switch (type.toString()) {
                    case "1": {
                        detailMaintenance = this.ListDetailsCostRepairMaintenanceLog.filter(x => x.Supplier == item.ID.toString());
                        detailDocumentLog = this.ListDetailsCostCarDocumentLog.filter(x => x.Supplier == item.ID.toString());
                        ListMvt =  data.ListDetailsCost.filter(x=>x.Supplier.ID ==item.ID);
                        break;
                    }
                    case "2": {
                        
                        //this.NameObject = "Category";
                        ListMvt =  data.ListDetailsCost.filter(x=>x.CategoryID ==item.ID);
                        break;
                    }
                    case "3": {
                        
                        //this.NameObject = "Model";
                        ListMvt =  data.ListDetailsCost.filter(x=>x.ModelID ==item.ID);
                        break;
                    }
                    case "4": {
                       
                       // this.NameObject = "Compte";
                       ListMvt =  data.ListDetailsCost.filter(x=>x.BenefAcc ==item.ID);
                        break;
                    }
                    case "5": {
                        detailMaintenance = this.ListDetailsCostRepairMaintenanceLog.filter(x => x.Car == item.ID);
                        detailDocumentLog = this.ListDetailsCostCarDocumentLog.filter(x => x.Car == item.ID);
                        break;
                    }
                    case "6": {
                        detailMaintenance = this.ListDetailsCostRepairMaintenanceLog.filter(x => x.Department == item.ID);
                        detailDocumentLog = this.ListDetailsCostCarDocumentLog.filter(x => x.Department == item.ID);
                        ListMvt =  data.ListDetailsCost.filter(x=>x.BenefDep ==item.ID);
                        break;
                    }
                    case "7": {
                        detailMaintenance = this.ListDetailsCostRepairMaintenanceLog.filter(x => x.Driver == item.ID);
                        detailDocumentLog = this.ListDetailsCostCarDocumentLog.filter(x => x.Driver == item.ID);
                        ListMvt =  data.ListDetailsCost.filter(x=>x.BenefDri ==item.ID);
                        break;
                    }
        
                }

                if (detailMaintenance != undefined) {
                    detailMaintenance.forEach(row => {
                        //if (ListDetailsCost.findIndex(x => x.Reference == row.MaintenanceTypeStr && x.car == row.Car) == -1) {
                        let DateString: string = row.DateCompletionGMT.toString();
                        let dateFormat = new Date(parseInt(DateString.substr(6)));
                        series.push({ name: dateFormat, value: row.Cost });

                        ListDetailsCost.push({
                            'Quantity': 1,
                            ActionDate: new Date(parseInt(DateString.substr(6))),
                            'Reference': row.MaintenanceTypeStr,
                            'PUHT': row.Cost,
                            'PUTTC': row.PaidCost,
                            'TotalCost': row.PaidCost,
                            'car': row.Car
                        });

                    });
                }
                if (detailDocumentLog != undefined) {
                    detailDocumentLog.forEach(row => {
                        //if (ListDetailsCost.findIndex(x =>x.car == row.Car) == -1) {
                        let DateString2: string = row.DateAvailableFromGMT.toString();
                        let dateFormat = new Date(parseInt(DateString2.substr(6)));
                        series.push({ name: dateFormat, value: row.Cost });
                        ListDetailsCost.push({
                            'Quantity': 1,
                            'ActionDate': new Date(parseInt(DateString2.substr(6))),
                            'Reference': row.DocumentTypeStr,
                            'PUHT': row.Cost,
                            'PUTTC': row.PaidCost,
                            'TotalCost': row.PaidCost,
                            'car': row.Car
                        });

                    });
                }
                if (ListMvt != undefined) {
                    ListMvt.forEach(row => {
                        //if (ListDetailsCost.findIndex(x =>x.car == row.Car) == -1) {
                        let DateString2: string = row.ActionDate.toString();
                        let dateFormat = new Date(parseInt(DateString2.substr(6)));
                        series.push({ name: dateFormat, value: row.TotalCost });
                        ListDetailsCost.push({
                            'Quantity': 1,
                            'ActionDate': new Date(parseInt(DateString2.substr(6))),
                            'Reference': "Mvt Sorties",
                            'PUHT': row.PUHT,
                            'PUTTC': row.PUTTC,
                            'TotalCost': row.TotalCost,
                            'car': 0
                        });

                    });
                }
              


                
                item.ListDetailsCost=ListDetailsCost;
             //   item.ListDetailsCost = ListDetailsCost;
              //   this.ObjListCostAndDetails.ListCost..find(item).ListDetailsCost= ListDetailsCost;
                this.dataSourceDetails = new MatTableDataSource(item.ListDetailsCost);
                this.dataSourceDetails.paginator = this.paginator;
                this.dataSourceDetails.sort = this.sort;
               
            });
            
            lined.push({ name: "Dépenses", series: series });
            this.single = [...datachar];
            document.getElementById("depenceCar").innerHTML = "Total dépenses :" + Math.floor(sum);
            this.DataLine = [...lined];
            this.dataSource = new MatTableDataSource(this.ObjListCostAndDetails.ListCost);
            
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.ObjListCostAndDetails.ListCost
           

            
            let DataMaint = _.groupBy(this.ObjListCostAndDetails.ListDetailsCostRepairMaintenanceLog, x => x.MaintenanceTypeStr);
            var keys = Object.keys(DataMaint);
           
            let dataDet : Array<DataChart>=[];
            keys.forEach(function (key) {
                let sumDet: number = 0;
                DataMaint[key].forEach(x => sumDet += x.Cost);
                dataDet.push({ 'name': key, 'value': sumDet });
                
            });
            
            let DataDoc = _.groupBy(this.ObjListCostAndDetails.ListDetailsCostCarDocumentLog, x => x.DocumentTypeStr);
            keys = Object.keys(DataDoc);
            keys.forEach(function (key) {
                let sumDet: number = 0;
                DataDoc[key].forEach(x => sumDet += x.Cost);
                dataDet.push({ 'name': key, 'value': sumDet });
                
            });
            let sumDet: number = 0;
            this.ObjListCostAndDetails.ListDetailsCost.forEach(row=> sumDet += row.TotalCost);
           if(sumDet >0)
             dataDet.push({ 'name': "Mvt Sorties", 'value': sumDet });
           

            
          
            this.barChartData2 = [...dataDet];

           
          
        });
        
      
    }
    customColors(){
        return [
            {"name": "a","value": "#ff0000"},
            {"name": "b","value": "#00ff00"}
         ]
    }
    onChangeType(Type) {
      
        switch (Type) {
            case "1": {
                this.ListTypeSelected = [];
                this.NameObject = "PARC.Supplier";
                this.filtreObject="Supplier";
                if(this.generalCost != undefined)
                this.generalCost.ListSupplier.forEach(item => {

                    this.ListTypeSelected.push({ 'ID': item.ID, 'Name': item.Name });
                });
                break;
            }
            case "2": {
                this.ListTypeSelected = [];
                this.NameObject = "PARC.Category";
                if(this.generalCost != undefined)
                this.generalCost.ListCategory.forEach(item => {

                    this.ListTypeSelected.push({ 'ID': item.ID, 'Name': item.NameCategory });
                });
                break;
            }
            case "3": {
                this.ListTypeSelected = [];
                this.NameObject = "PARC.Model";
                if(this.generalCost != undefined)
                this.generalCost.ListModel.forEach(item => {

                    this.ListTypeSelected.push({ 'ID': item.ID, 'Name': item.NameModel });
                });
                break;
            }
            case "4": {
                this.ListTypeSelected = [];
                this.NameObject = "Account";
                this.filtreObject="Compte";
                if(this.generalCost != undefined)
                this.generalCost.ListAccount.forEach(item => {

                    this.ListTypeSelected.push({ 'ID': item.Id, 'Name': item.Login });
                });
                break;
            }
            case "5": {
                this.ListTypeSelected = [];
                this.NameObject = "Vehicle";
                this.filtreObject="Car";
                if(this.generalCost != undefined)
                this.generalCost.ListTracking.forEach(item => {

                    this.ListTypeSelected.push({ 'ID': item.Key, 'Name': item.FullName });
                });
                break;
            }
            case "6": {
                this.ListTypeSelected = [];
                this.NameObject = "PARC.Departement";
                this.filtreObject = "Department";
                if(this.generalCost != undefined)
                json2array( this.generalCost.ListDepartment).forEach(item => {

                    this.ListTypeSelected.push({ 'ID': item.Id, 'Name': item.Name });
                });
                break;
            }
            case "7": {
                this.ListTypeSelected = [];
                this.NameObject = "PARC.Driver";
                if(this.generalCost != undefined)
                this.generalCost.ListDriver.forEach(item => {

                    this.ListTypeSelected.push({ 'ID': item.key, 'Name': item.FullName });
                });
                break;
            }

        }
        this.filteredOptions = this.form.get('ListFourOrCatgOrMdlOrCmpOrTTOrDepOrDri').valueChanges.pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : this.lastFilter),
          map(filter => this._filter(filter))
          );
    }
    displayCar(value) {
        this.ObjetsSelected = [];
        let displayValue='';
             if (Array.isArray(value)) {
               displayValue = '';
               value.forEach((v, index) => {
                if (index === 0) {
                    displayValue = v.Name + ' ';
                  this.ObjetsSelected.push(v.ID);
                } else {
                    displayValue += ', ' + v.Name + ' ';
                  this.ObjetsSelected.push(v.ID);
                }
              });
             
              return displayValue;
             } else {
              return displayValue;
             }
            
      }
      optionClicked(event: Event, obj) {
        event.stopPropagation();
        this.toggleSelection(obj);
      }
      toggleSelection(obj) {
        obj.selected = !obj.selected;
     
        if (obj.selected) {
          this.selectedObj.push(obj);
        } else {
          const i = this.selectedObj.findIndex(value => value.ID === obj.ID );
          this.selectedObj.splice(i, 1);
        }
      
        this.form.get('ListFourOrCatgOrMdlOrCmpOrTTOrDepOrDri').setValue(this.selectedObj);
      }
      selectedOption(event)
      {
        let test = event;

      }

}
function getbackgroundColorChart(nb: number): Array<string> {
    let colors: Array<string> = [];
    for (let i = 0; i < nb; i++) {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        colors.push("rgb(" + r + "," + g + "," + b + ")");
    }
    return colors;
}
