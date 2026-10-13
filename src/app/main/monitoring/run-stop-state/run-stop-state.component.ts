import { AfterViewInit, Component, ElementRef, OnInit, SecurityContext, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { TrackingObjectService } from '../tracking/tracking-objects.service';
import { GpsData } from '../trajectory/trajectory.model';
import { RunStopStateService } from './run-stop-state.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatAccordion, MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { BehaviorSubject, fromEvent, merge, Observable, Subject, Subscription } from 'rxjs';
import { GlobalMap } from '../map/map';
import { environment } from 'environments/environment';
import { DomSanitizer } from '@angular/platform-browser'
import { LatLng } from 'leaflet';
import { isEmpty, isNull, result, slice } from 'lodash';
import * as moment from 'moment';
import { DateMoreThan } from 'app/main/helpers/compareDate';
import { SharedDataService } from '../shared-data.service';
import * as XLSX from "xlsx";
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { locale as english } from '../../../navigation/i18n/en';
import { locale as french } from '../../../navigation/i18n/fr';
import { locale as arab } from '../../../navigation/i18n/ar';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { SnackbarMessageComponent } from 'app/main/helpers/snackbar-message/snackbar-message.component';
import { Vehicle } from 'app/main/parc/gestio-des-vehicules/model';
import { crypt, decrypt } from 'app/main/parc/Parc';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common'
import { faLessThanEqual } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';
import { group } from 'console';
import { RunstopparampopupComponent } from './runstopparampopup/runstopparampopup.component';
import { RunStop } from './runStop';
import * as L from 'leaflet';

// export class Vehicle {
//     constructor(public id: number, public name: string, public selected?: boolean) {
//       if (selected === undefined) selected = false;
//     }
//   }
@Component({
  selector: 'app-run-stop-state',
  templateUrl: './run-stop-state.component.html',
  styleUrls: ['./run-stop-state.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class RunStopStateComponent implements  OnInit  {
    
    displayedColumns = ['Status','Matricule', 'NearestPlaceString', 'DistanceAtRunStatus', 'PeriodString', 'BeginDateLocalString',
     'AverageSpeed', 'action'];
    dataSource : MatTableDataSource<GpsData>=  new MatTableDataSource([]);TO: any;
  
  t: any;
;
    trackingObjects : Vehicle[];
    gpsData : GpsData[] = [];
    showFooter: boolean = false;
    Map : GlobalMap = GlobalMap.globalMap;
    public minDate: moment.Moment;
     // Private
     private _unsubscribeAll: Subject<any>;
    // keep it other stop and circulation
    archived: boolean = false;
    public form: FormGroup;
 index: number;
 subscription: Subscription;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('accordion',  {static: true}) accordion: MatAccordion;


  displayValue: string;
  filterValue:string="";

  dateObj = new Date();
  isLoading = false;
 listcargroup: CarGroup[]=[];

 isExpandCategory: boolean[] = [];
 stateRecord:any = [];
 CarGroupOptions: Observable<CarGroup[]>;
 lastFilter: string = '';
 DataRunStopCrypt:any[]=[];
 public loading = false;
  progressbarValue=0;
  /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     * @param {RunStopStateService} _runStopStateService
     */
  constructor(private _runStopStateService: RunStopStateService,
              private _trackingObjectService: TrackingObjectService,
              private _formBuilder: FormBuilder,
              public sanitizer: DomSanitizer,
              public _data: SharedDataService,
              private _fuseTranslationLoaderService: FuseTranslationLoaderService,
              private _snackBar: MatSnackBar,private _TranslateService: TranslateService,
              public datepipe: DatePipe,
              public _matDialog : MatDialog) { 

                this._fuseTranslationLoaderService.loadTranslations(english, french, arab);
                 // Set the private defaults
                 this._unsubscribeAll = new Subject();
              }
             
  ngOnInit() : void{
  //  this.dataSource = new GpsDataDataSource(this._runStopStateService, this.paginator, this.sort);
   
  this._data.currentIndex.subscribe(index => {
    if(index == 2) {
     this._data.secondServiceResponse.subscribe(key => {
           
      this._trackingObjectService.onTrackingObjectsChanged.subscribe(data => {
        this.trackingObjects  = data;
      })
           //var vehicle : Vehicle = this.trackingObjects.find(it => it.Key == key)
           ///this.form.controls['keyTrackingObject'].setValue(vehicle);
           var today = new Date();
           var dateTo=(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
           var dateFrom=(new Date());
           let ListkeyTrackingObject :number[]=[];
          
             ListkeyTrackingObject.push(key);
           this.getrunstops(ListkeyTrackingObject, dateTo, dateFrom);

     });
    }
 });

  
  }
  generateRunStops(): void {
    const dialogRef = this._matDialog.open(RunstopparampopupComponent, {
      panelClass: 'custom-dialog-container',  
      
      position: {
        bottom: '270px',
        left: '50px'
      }     
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      
      if ( !result )
      {
          return;
      }

         let ListkeyTrackingObject :number[]=[];
         //if(Object.prototype.toString.call(this.form.get('keyTrackingObject').value) === '[object Array]') {
           result.value.keyTrackingObject.forEach(e=>{
             ListkeyTrackingObject.push(e.Key);
     
           })
           this.gpsData=[];
           this.getrunstops(ListkeyTrackingObject, result.value.dateTo, result.value.dateFrom);
      //   }
        // else{
         //  ListkeyTrackingObject.push(this.form.get('keyTrackingObject').value.Key);
        // }
        });
    
  }
  
  drawer : RunStop;
  drawers : RunStop[] = [];
  

  async getrunstops(ListkeyTrackingObject,dateTo, dateFrom){
    this.isLoading = true;
    let keyCar: any[]=[];
    for(let i=0; i<ListkeyTrackingObject.length;i++)
    {
       keyCar=[];
        keyCar.push(ListkeyTrackingObject[i]);
        let result = await this._runStopStateService.getRunStopStatesManyCar(keyCar, dateTo, dateFrom).toPromise();
         this.progressbarValue = (((i +1) * 100) / ListkeyTrackingObject.length);
          this.isLoading = false;
           let data:any =decrypt(result);
           this.DataRunStopCrypt.push(data[0]);
             this.drawers = data.map(d=>{
          if(d.AllExtendedGpsDataStopRunState.length>0)
          {
            let result = new RunStop(d, this.getColor(d.Matricule));
            result.map = this.Map.map;
            this.runStops[d.Matricule] = result;
            this.colors[d.Matricule] = result.getColor();
            
            this._runStopStateService.onRunStopStatesChanged.next([...this._runStopStateService.onRunStopStatesChanged.value, result]);
            result.map = this.Map.map;
            this.Map.deletableShapes.push(result);
            result.toggleVisiblity(false)
            return result;
          }
        })
         data.forEach( e=>{
          e.AllExtendedGpsDataStopRunState.forEach(element => {
            element.Matricule= e.Matricule;
           this.gpsData.push(element);
           
          });
        })
         this.dataSource = new MatTableDataSource(this.gpsData);

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }
     
/*     this._runStopStateService.getRunStopStatesManyCar(ListkeyTrackingObject, dateTo, 
      dateFrom).subscribe((res: any) => {
       this.isLoading = false;


        let data:any =decrypt(res);
        this.DataRunStopCrypt=res;
        this.drawers = data.map(d=>{
          if(d.AllExtendedGpsDataStopRunState.length>0)
          {
            let result = new RunStop(d, this.getColor(d.Matricule));
            result.map = this.Map.map;
            this.runStops[d.Matricule] = result;
            this.colors[d.Matricule] = result.getColor();
            
            this._runStopStateService.onRunStopStatesChanged.next([...this._runStopStateService.onRunStopStatesChanged.value, result]);
            result.map = this.Map.map;
            this.Map.deletableShapes.push(result);
            result.toggleVisiblity(false)
            return result;
          }
        })

        

        data.forEach( e=>{
          e.AllExtendedGpsDataStopRunState.forEach(element => {
            element.Matricule= e.Matricule;
           this.gpsData.push(element);
           
          });
        })

        // this.Map.deletableShapes.push(this.drawer);
        //console.log(this.gpsData)
        this.dataSource = new MatTableDataSource(this.gpsData);

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
       // this.stateRecord =  this.form.get('keyTrackingObject').value;

}) */
  }
downloadPdf()
  {
   this.loading = true;
   let CompressedData =crypt( this.DataRunStopCrypt);
    this._runStopStateService.ExportReport(CompressedData,"pdf",19)
       .subscribe((data:any) => {
        this.loading = false;
          let fileData64String= decrypt(data.ExportReportNewResult) ;
          var byteString = atob(fileData64String);
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([ia], { type: "application/pdf" });
      var dateString = (new Date()).toLocaleDateString().replace('/', '-').replace('/', '-');
      var titleReport = "";
      titleReport = "GeneralReport"
      titleReport += " " + "(" + dateString + ")";
 
 
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
       window.navigator.msSaveOrOpenBlob(blob); // For IE browser
     }
     const linkElement = document.createElement('a');
     const url = URL.createObjectURL(blob);
     linkElement.setAttribute('href', url);
     linkElement.setAttribute('download', titleReport+'.pdf');
     const clickEvent = new MouseEvent('click', {
       'view': window,
       'bubbles': true,
      'cancelable': false
     });
     linkElement.dispatchEvent(clickEvent);
     
    },
    (err: any) => {
      this.loading = false;
      //this.errorHandler.handleError(error);.handleError(err);
    });
  }
   downloadExcel()
    {
      this.loading = true;
       let CompressedData =crypt( this.DataRunStopCrypt);
      this._runStopStateService.ExportReport(CompressedData,"excel",19)
        .subscribe((data:any) => {
          this.loading = false;
            let fileData64String= decrypt(data.ExportReportNewResult) ;
            var byteString = atob(fileData64String);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
            }
        var blob = new Blob([ia], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        var dateString = (new Date()).toLocaleDateString().replace('/', '-').replace('/', '-');
        var titleReport = "";
        titleReport = "GeneralReport"
        titleReport += " " + "(" + dateString + ")";
   
   
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
         window.navigator.msSaveOrOpenBlob(blob); // For IE browser
       }
       const linkElement = document.createElement('a');
       const url = URL.createObjectURL(blob);
       linkElement.setAttribute('href', url);
       linkElement.setAttribute('download', titleReport+'.XLS');
       const clickEvent = new MouseEvent('click', {
         'view': window,
         'bubbles': true,
        'cancelable': false
       });
       linkElement.dispatchEvent(clickEvent);
       
      },
      (err: any) => {
           //this.errorHandler.handleError(error);.handleError(err);
      });
    }
  runStops = {}
  colors = {}
  defaultColor = ["#7D0000", "#0D4F00", "#001EA4", "#9D0070", "#00C493", "#935C32", "#FF8000", "#FF006F", "#535353", "#027BCE"]

  getColor(matricule) : string{
    if(!this.colors[matricule]){
      this.colors[matricule] = this.getRandomColor();
    }
    return this.colors[matricule].length? this.colors[matricule] :this.colors[matricule]();
  }

  getRandomColor() {
    if(this.defaultColor.length) return this.defaultColor.pop()
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var j = 0; j < 6; j++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;

  }

  getDrawerPoint(index : number) : GpsData{
    //console.log('index : ', index);
    let drawerIndex = 0;
    
    for(let i = 0; i < this.drawers.length; i++){
        if(index < this.drawers[i].points.length){
            drawerIndex = i;
           // console.log('drawer : ', i);
            this.drawer = this.drawers[i];
            break;
        }
        index -= this.drawers[i].points.length;
    }
    //console.log('drawer point index : ', index);
    
    return this.drawers[drawerIndex].points[index];
  }

  zoomOn(matricule ,index){
    this.runStops[matricule].highlightPart(index.Id);
    // if(this.drawer){
    //     if(this.drawer.highlitedPart){
    //         this.drawer.highlitedPart.removeFrom(this.Map.map)
    //     }
    // }
    
    // let p : GpsData = this.getDrawerPoint(index)
    // let nextP : GpsData = this.getDrawerPoint(index+1)
    // this.Map.map.flyTo(new LatLng(p.Latitude, p.Longitude))

    // if(p.StopRunStatusEnumString == 'Stop'){
    //     // call this.map.Map.focusOnStop(p)
    //     let stop = new L.CircleMarker(new LatLng(p.Latitude, p.Longitude), {
    //         color : '#ff0000',
    //         weight : 4,
    //         className : 'stop'
    //     })
    //     this.Map.focusOn([stop.getLatLng()],0)
    // }else{
    //     // else call this.map.Map.focusOnPartOfTraject(points)
    //     // point = traject.getPartSelectedByTime(start, end)
    //     if(nextP){
    //         let points = this.drawer.getPartSelectedByTime(p.AcquisitionTime, nextP.AcquisitionTime)
    //         if(points){
    //             let part = new L.Polyline(points, {
    //                 color : '#00ff00',
    //                 weight : 4,
    //                 className : 'partOfTraject'})
    //             this.drawer.togglePart(part)
    //             this.Map.focusOn(points, 0)
    //         }
    //     }
    // }
  }
    

  expandDocumentTypes(group: any) {
    //console.log("expanding dropdown", group);
    this.isExpandCategory[group.department] = !this.isExpandCategory[group.department];
    // expand only selected parent dropdown category with that childs
  }

  

   /** Gets the total of all gps data. */
   getTotalDistance(){
    return this.dataSource.filteredData.map(t => t.DistanceAtRunStatus).reduce((acc, value) => acc + value, 0);
   }
   getTotalFuel(){
    return this.dataSource.filteredData.map(t => t.FuelConsumptionInLAtRunStatus).reduce((acc, value) => acc + value, 0);
   }
  // remove entire table
  removeTable() {
   this._runStopStateService.onRunStopStatesChanged.next([]);
   this.dataSource.data = [];

   //this.Map.drawer.removeMarkerStop();
  }

onfilterClear(){
  this.filterValue = "";
}

applyFilter() {
  this.dataSource.filter = this.filterValue.trim().toLowerCase();

 
}
// show on the map
show(element: GpsData) : void {
   
    var latlng = new LatLng(element.TruthLatitude, element.TruthLongitude);
    var start = element.BeginDateLocalString;
  if(element.StopRunStatusEnum == 1) {
    // stop
      var duration = element.PeriodString;
      var nearPlace = element.NearestPlaceString;
     //var html_ : string = this.sanitizer.sanitize(SecurityContext.HTML, "<div>Start: {{start }}</div><div>Duration: ${ duration}</div><div>Close address: ${ address }</div>");
     var icon = environment.iconUrl+'images/Others/icone-stop-16x16.png';
     this.Map.drawer.showStop(start, duration, nearPlace, latlng,icon, element.Id);
  }
  else if(element.StopRunStatusEnum == 0)  {
    // circulation
     var latlngs : L.LatLng[] = [];
     var icon = environment.iconUrl+'images/Others/Map-Marker-Flag-2-Right-Chartreuse-256.png';
     
     this.Map.drawer.showTraffic({key: ' Start ', value:element.BeginDateLocalString}, icon, latlng, element.Id);
    // var arr: GpsData[] = this.dataSource.filteredData.slice(20,50);
     var arr: GpsData[] = slice(this.gpsData, 0,this.gpsData.indexOf(element));
    // var stop : GpsData  = arr.find(item => item.IsTruhPositionOfStop && (item.StopRunStatusEnum == 1));

    // arr =  slice(arr, 0 , arr.indexOf(stop)+1);
     for(let item of arr) {
        latlngs.push(new LatLng(item.TruthLatitude, item.TruthLongitude));
    
     }
    var icon = environment.iconUrl+'images/Others/Flag-left-red-256.png';
    this.Map.drawer.showTraffic({key: ' End ', value: arr[0].BeginDateLocalString}, icon, new LatLng(arr[0].TruthLatitude, arr[arr.length - 1].TruthLongitude), element.Id);
    //this.Map.drawer.showPolylineTraffic(latlngs, this.archived);
    this.Map.drawTrajectory(arr,arr[0].Id.toString() , arr[0].Id.toPrecision(), true, true,true,false);

  }

}
showRunOrStopOnMap(data : GpsData)
{
     var allLatLong = data.URL.replace('!', '\\');
     var encodedLtLg = this.getQueryVariable('ltlg', allLatLong);
     var arrayLatLng :string= "";
     if (encodedLtLg != undefined) {
      encodedLtLg = encodedLtLg.replace(/%60/g, '`');
      encodedLtLg = encodedLtLg.replace(/%7D/g, '}');
      encodedLtLg = encodedLtLg.replace(/%7B/g, '{');
      encodedLtLg = encodedLtLg.replace(/%7E/g, '~');
      encodedLtLg = encodedLtLg.replace(/%5C/g, '\\');
      encodedLtLg = encodedLtLg.replace(/%5E/g, '^');

    //  arrayLatLng = this.decodeLine(encodedLtLg).split("$") ;
  }

}
getQueryVariable (variable, allLatLong)
{
  var query = allLatLong.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
}
decodeLine (encoded) {
  var len = encoded.length;
  var index = 0;
  var latlongString:string = "";
  var lat = 0;
  var lng = 0;
  try {
      while (index < len) {
          var b;
          var shift = 0;
          var result = 0;
          do {
              b = encoded.charCodeAt(index++) - 63;
              result |= (b & 0x1f) << shift;
              shift += 5;
          } while (b >= 0x20);
          var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
          lat += dlat;

          shift = 0;
          result = 0;
          do {
              b = encoded.charCodeAt(index++) - 63;
              result |= (b & 0x1f) << shift;
              shift += 5;
          } while (b >= 0x20);
          var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
          lng += dlng;
          //array.push(new google.maps.LatLng((lat * 1e-5), (lng * 1e-5)));
          if (lat != 0 && lng != 0)
              latlongString += (lat * 1e-5).toString() + '$' + (lng * 1e-5).toString() + '$';
      }
  } catch (ex) {
      //error in encoding.
  }
  return latlongString.substring(0, latlongString.length - 1);
}
// toggle archived boolean
Toggle(e) {
    this.archived = ! this.archived;
}

exportPdf(dataSource) : void {
    var doc = new jsPDF( {orientation: "landscape",});
    

    //var col =  ['Status', 'Nearest Place', 'Distance At Run Status', 'Period', 'Begin Date','Average Speed'];
    var rows = []; 
    this.gpsData.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.StopRunStatusEnumString);
      tempObj.push(e.Matricule);
      tempObj.push(e.NearestPlaceString);
      tempObj.push(e.DistanceAtRunStatus);
      tempObj.push(e.PeriodString);
      tempObj.push(e.BeginDateLocalString);
      tempObj.push(e.SpeedAverageAtRunStatus);
      rows.push(tempObj);
    });
    /*rows =  this.gpsData.map((traffic: GpsData) => { return [
        traffic.StopRunStatusEnumString,  traffic.NearestPlaceString,
        traffic.DistanceAtRunStatus , traffic.PeriodString, traffic.BeginDateLocalString, traffic.SpeedAverageAtRunStatus
    ] });*/
    //let datedebut = this.datepipe.transform(this.form.get('dateTo').value, 'dd/MM/yyyy hh:mm:ss');
    //let dateFin=this.datepipe.transform(this.form.get('dateFrom').value, 'dd/MM/yyyy hh:mm:ss');
    this._TranslateService.get(['RunStop.Status', 'NAV.Matricule', 'RunStop.PlaceKm', 'RunStop.DistanceKm', 'PARC.DateExpiredWarrantyLocal', 'NAV.Period',
    'NAV.StartDate', 'RunStop.AverageSpeed','Common.RunStopState','DateFrom','DateTo']).subscribe(translations  => {
      doc.text(translations['Common.RunStopState'], 40, 16);
      // translations['Common.RunStopState']+' '+this.form.get('dateTo').value.toLocaleString()+' '+this.form.get('dateFrom').value.toLocaleString()
    doc.autoTable({
        head: [[ translations['RunStop.Status'], translations['NAV.Matricule'], translations['RunStop.PlaceKm'], translations['RunStop.DistanceKm'],
            translations['NAV.Period'], translations[ 'NAV.StartDate'],
            translations['RunStop.AverageSpeed']]], 
        body: rows,
        startY: 35,
      //  orientation: "landscape",
       
    });
    
});

 
  doc.save('Liste_Stops_Circulations('+ (new Date()).toLocaleString() +').pdf');   
  }
exportExcel(){
    var prepare_to_excel=[];
    //let tem = ['Status', 'Nearest Place', 'Distance At Run Status', 'Period', 'Begin Date','Average Speed'];
    this._TranslateService.get(['RunStop.Status', 'NAV.Matricule', 'RunStop.PlaceKm', 'RunStop.DistanceKm', 'PARC.DateExpiredWarrantyLocal', 'NAV.Period',
    'NAV.StartDate', 'RunStop.AverageSpeed','Common.RunStopState','DateFrom','DateTo']).subscribe(translations  => {
      let tem=[ translations['RunStop.Status'], translations['NAV.Matricule'], translations['RunStop.PlaceKm'], translations['RunStop.DistanceKm'],
      translations['NAV.Period'], translations[ 'NAV.StartDate'],
      translations['RunStop.AverageSpeed']];
      prepare_to_excel.push(tem);


    })
   
    this.gpsData.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.StopRunStatusEnumString);
      tempObj.push(e.Matricule);
      tempObj.push(e.NearestPlaceString);
      tempObj.push(e.DistanceAtRunStatus);
      tempObj.push(e.PeriodString);
      tempObj.push(e.BeginDateLocalString);
      tempObj.push(e.SpeedAverageAtRunStatus);
      prepare_to_excel.push(tempObj);
    });
   
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    var name = 'Liste_Stops_Circulations('+ (new Date()).toLocaleString() +').xls'
    XLSX.writeFile(workbook, name, { bookType: 'xls', type: 'buffer' });
 }
}


export class GpsDataDataSource extends DataSource<any> 
{
  
   // Private
   private _filterChange = new BehaviorSubject('');
   private _filteredDataChange = new BehaviorSubject('');
   /**
     * Constructor
     *
     * @param {RunStopStateService} _runStopStateService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
  constructor(private _runStopStateService: RunStopStateService,
              private _matPaginator: MatPaginator,
              private _matSort: MatSort) {

        super();
    
        this.filteredData = this._runStopStateService.runStopStates;

  }
  // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // Filtered data
    get filteredData(): any
    {
        return this._filteredDataChange.value;
    }

    set filteredData(value: any)
    {
        this._filteredDataChange.next(value);
    }
    // Filter
    get filter(): string
    {
        return this._filterChange.value;
    }

    set filter(filter: string)
    {
        this._filterChange.next(filter);
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        const displayDataChanges = [
            this._runStopStateService.onRunStopStatesChanged,
            this._matPaginator.page,
            this._filterChange,
            this._matSort.sortChange
        ];

        return merge(...displayDataChanges).pipe(map(() => {

                let data = this._runStopStateService.onRunStopStatesChanged.value.slice();

                data = this.filterData(data);

                this.filteredData = [...data];

                data = this.sortData(data);

                // Grab the page's slice of data.
                const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
                return data.splice(startIndex, this._matPaginator.pageSize);
            })
        );

    }
 /**
     * Filter data
     *
     * @param data
     * @returns {any}
     */
    filterData(data): any
    {
        if ( !this.filter )
        {
            return data;
        }
        return FuseUtils.filterArrayByString(data, this.filter);
    }
    /**
     * Sort data
     *
     * @param data
     * @returns {any[]}
     */
    sortData(data): any[]
    {
        if ( !this._matSort.active || this._matSort.direction === '' )
        {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch ( this._matSort.active )
            {
                case 'StopRunStatusEnumString':
                    [propertyA, propertyB] = [a.StopRunStatusEnumString, b.StopRunStatusEnumString];
                    break;
                case 'NearestPlaceString':
                    [propertyA, propertyB] = [a.NearestPlaceString, b.NearestPlaceString];
                    break;
                case 'DistanceAtRunStatus':
                    [propertyA, propertyB] = [a.DistanceAtRunStatus, b.DistanceAtRunStatus];
                    break;
                case 'PeriodString':
                    [propertyA, propertyB] = [a.PeriodString, b.PeriodString];
                    break;
                case 'BeginDateLocalString':
                    [propertyA, propertyB] = [a.BeginDateLocalString, b.BeginDateLocalString];
                    break;
                case 'FuelConsumptionAvgInL100Km':
                    [propertyA, propertyB] = [a.FuelConsumptionAvgInL100Km, b.FuelConsumptionAvgInL100Km];
                    break;
                case 'FuelConsumptionInLAtRunStatus':
                    [propertyA, propertyB] = [a.FuelConsumptionInLAtRunStatus, b.FuelConsumptionInLAtRunStatus];
                    break;
                case 'Speed':
                    [propertyA, propertyB] = [a.Speed, b.Speed];
                    break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._matSort.direction === 'asc' ? 1 : -1);
        });
    }
     /**
     * Disconnect
     */
    disconnect(): void
    {
    }
  }
  
  export interface CarGroup {
    department: string;
    car: Vehicle[];
  }
  