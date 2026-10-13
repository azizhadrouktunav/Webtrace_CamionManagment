import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { AccidentdetailsService } from '../../services/accidentdetails.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {  AccidentDetailsExtended } from '../../interfaces/accidentdetails';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { json2array } from  'app/main/helpers/must-match.validator';
import { environment } from 'environments/environment';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/internal/operators';
import * as L from 'leaflet';
import { SinisterMapComponent } from '../../sinistre/sinister-map/sinister-map.component';


@Component({
  selector: 'app-add-editsinistre',
  templateUrl: './add-editsinistre.component.html',
  styleUrls: ['./add-editsinistre.component.scss']
})
export class AddEditsinistreComponent implements OnInit,AfterViewInit  {
  AccidentdetailsParam: any;
  DriverList: any = [];
  trackingObjects: any[] = [];
  PlaceList: any[] = [];
  changevalue: string;
  files: any[] = [];
  action: any;
  data: any;
  dialogTitle: string;
  addsinistreForm: any;
  type: any;
  files1: any = [];
  filteredOptions: Observable<string[]>;
  mapIsVisisbale: boolean = false;
  assurances: [];
  private map;
  MapI : SinisterMapComponent = SinisterMapComponent.sinisterMapComponent;
  private initMap(): void {
    this.map = L.map('map', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }
  constructor(private _accidentdetailsService: AccidentdetailsService,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private _data: any,
              public dialogRef: MatDialogRef<AddEditsinistreComponent>,
              private http: HttpClient
    ) { 
      this.action = _data.action;
      this.assurances = _data.assurances;
    
      this.data = _data.data;
      this.type = _data.type;
      {
        this.changevalue = '' + this.type;
      }
      if ( this.action === 'add' )
      {
          this.dialogTitle = 'AddAccidentReport';
          this.data = new AccidentDetailsExtended({
            action: _data.action
            
        });
      }
      else
      {
          this.dialogTitle = 'UpdateAccidentReport';
          
      }
      if(this.data.AccidentLocation == undefined || this.data.AccidentLocation== null)
      {
        this.data.AccidentLocation=-1;
      }
      
      this.addsinistreForm = this.createaddsinistreForm();
      if( this.data.Latitude &&  this.data.Longitude)
      {
        this.mapIsVisisbale=true;
        this.data.AccidentLocation=-1;
        this.MapI.Longitude=this.data.Longitude;
        this.MapI.latitude=this.data.Latitude;
      }
      else
      {
        this.MapI.Longitude=null;
        this.MapI.latitude=null;
      }

    }

    ngAfterViewInit(): void {
    
    }
    createaddsinistreForm(): FormGroup
    {  
        return new FormGroup({
          DossierReference : new FormControl(this.data.AccidentReportRef),
          InsuranceName : new FormControl('' + this.data.InsurerNameA),
          AccidentType   : new FormControl('' + this.data.AccidentType),
          AccidentDateGMT : new FormControl(new Date((this.data.AccidentDateGMT))),
          AccidentLocationFullName: new FormControl('' + this.data.AccidentLocation),
          FirstDriver : new FormControl(this.data.Driver),
          Details  : new FormControl(this.data.Details),
          Dammage: new FormControl(this.data.Dammage),
          Driver2: new FormControl(this.data.DriverB),
          InsuranceName2  : new FormControl( '' +this.data.InsurerNameB),
          Matricule: new FormControl(this.data.CarBType),
          DriverLicenseExpirationDate: new FormControl(this.data.DriverBLicenseNumber),
          Injured : new FormControl(this.data.Injured),
          OtherDamage : new FormControl(this.data.Otherdamage),
          Lat : new FormControl(this.data.Latitude),
          Long : new FormControl(this.data.Longitude),
        });
    }
    onSubmit()
     {
        
      this.dialogRef.close({files1: this.files, data: this.addsinistreForm.value});

      
      if (this.files1.length > 0) { 
        this.files1.forEach((value)=>{ 


  let file: File = value;  
  let formData: FormData = new FormData();  
  formData.append('uploadFile', file, file.name);  
  formData['SessionId'] = localStorage.getItem('SessionId');
  let headers = new Headers()  

  let options = {
   headers: new HttpHeaders({
     'Content-Type': 'application/json'
   })
 }
  let apiUrl1 = environment.apiUrl + "/UIAccidentDetailsManagementWCFService.svc/UploadStream";  
  
  this.http.post(apiUrl1, formData, {responseType: 'text' })  

.subscribe(  
data => console.log(''),  
error => console.log(error)  
)  
    });
} 
    }
// tslint:disable-next-line: typedef
onClose() {

this.dialogRef.close();
}

  showOnMap(latlng ){
    let marker = new L.Marker(latlng,{
      icon: new L.DivIcon()
    })

    marker.addTo(this.map)
  }


    /**
     * on file drop handler
     */
    onFileDropped($event) {
      this.prepareFilesList($event);
    }
  
    /**
     * handle file from browsing
     */
    fileBrowseHandler(files) {
      this.prepareFilesList(files);
      this.files1.push(files[0]);
      let fileList: FileList = files;  
    }
    /**
     * Delete file from files list
     * @param index (File index)
     */
    deleteFile(index: number) {
      this.files.splice(index, 1);
      this.files1.splice(index, 1);

    }
  
    /**
     * Simulate the upload process
     */
    uploadFilesSimulator(index: number) {
      setTimeout(() => {
        if (index === this.files.length) {
          return;
        } else {
          const progressInterval = setInterval(() => {
            if (this.files[index].progress === 100) {
              clearInterval(progressInterval);
              this.uploadFilesSimulator(index + 1);
            } else {
              this.files[index].progress += 5;
            }
          }, 200);
        }
      }, 1000);
    }
  
    /**
     * Convert Files list to normal array list
     * @param files (Files List)
     */
    prepareFilesList(files: Array<any>) {
      for (const item of files) {
        item.progress = 0;
        this.files.push(item);
      }
      this.uploadFilesSimulator(0);
    }
  
    /**
     * format bytes
     * @param bytes (File size in bytes)
     * @param decimals (Decimals point)
     */
    formatBytes(bytes, decimals) {
      if (bytes === 0) {
        return '0 Bytes';
      }
      const k = 1024;
      const dm = decimals <= 0 ? 0 : decimals || 2;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
  ngOnInit() {

    this._accidentdetailsService.getAccidentdetailsParam().subscribe((result) => {
      this.AccidentdetailsParam = json2array(result);
      this.DriverList = json2array(this.AccidentdetailsParam[5]);
      this.PlaceList = json2array(this.AccidentdetailsParam[4]);
      this.PlaceList.unshift({Id: -1, NamePlace: 'Autre', key: "-1"});
      //this.DriverList
      if(this.action !== 'add'){
        console.log(this.DriverList.filter(dr => dr.key ==  this.data.Driver));
        
        this.addsinistreForm.controls['FirstDriver'].setValue(this.data.Driver);//{FullName: this.DriverList.filter(dr => dr.key ==  this.data.Driver)[0].FullName, key:this.data.Driver}
      }
    }); 
    this.filteredOptions = this.addsinistreForm.get('FirstDriver').valueChanges.pipe(
      startWith(''),
      map(text => this._filter(text), this.DriverList)
    );
  }
  private _filter(driver) {    
    return this.DriverList.filter(driverL =>
      driverL.FullName.includes(driver));
  }
  displayDriver = (driver) => {

    if(this.DriverList == undefined)
    this.DriverList = this._data.drivers;
    let DriverFind =this.DriverList.find(x => x.key ==driver ); 
    if(DriverFind)
    return DriverFind.FullName
    else
    return '';
    //? driver.Name : '';
  }
  change(event) {
   
    this.changevalue = '' + event.value;
  }
  getSelectedLongLat(event) {
    // insert the selected long lat to the form
    this.addsinistreForm.controls['Lat'].setValue(event[0]);
    this.addsinistreForm.controls['Long'].setValue(event[1]);
  }
    
  changePlace(event) {
    if(event.value == "-1"){
      this.mapIsVisisbale = true;
    }else{
      this.mapIsVisisbale = false;
    }
  }
  addToQueue() {
   
  }
}
