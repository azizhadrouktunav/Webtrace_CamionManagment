import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { decrypt } from 'app/main/parc/Parc';
import { interval } from 'rxjs/internal/observable/interval';
import { AlertConfigurationServiceService } from '../alert-configuration-service.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../../../../navigation/i18n/en';
import { locale as french } from '../../../../navigation/i18n/en';
import { locale as arab } from '../../../../navigation/i18n/en';
import { TranslateService } from '@ngx-translate/core';
import { SharedDataService } from 'app/main/monitoring/shared-data.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { mergeMapTo } from 'rxjs/operators';
import { async } from 'rxjs/internal/scheduler/async';
import { isNull } from 'util';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material';


@Component({
  selector: 'app-alert-configuration-container',
  templateUrl: './alert-configuration-container.component.html',
  styleUrls: ['./alert-configuration-container.component.scss']
})
export class AlertConfigurationContainerComponent implements OnInit {

  selctedCar : any
  searchInput: FormControl;
  vehiculeCluster = []
  ListTrackingObjects = [];
  equippementAlertInfosCluster = [];
  notificationVisivility = false;
  commandDisplayList = [];
  alertCounter = 0;
  alertList = [];
  istimerluanched = false; 
  isCarSelected = false;
  subscription: any;
  selectedValue: number;
  subscription$ : Subscription;
  sub$: Subscription;
  isCommandListVisible  = false;
  constructor(private _service: AlertConfigurationServiceService,
    private _snackBar: MatSnackBar,
    private _translateService: TranslateService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _data: SharedDataService,
    private _errorHandler: ErrorHandlerService) 
    { 
      
      this.searchInput = new FormControl(''); 
      this._fuseTranslationLoaderService.loadTranslations(english, french, arab);
    }

    private _transformer = (node: any, level: number) => {
        return {
          expandable: !!node.children && node.children.length > 0,
          name: node.name,
          level: level,
        };
      };

    carList = [];
    treeControl = new FlatTreeControl<any>(
        node => node.level,
        node => node.expandable,
      );
      treeFlattener = new MatTreeFlattener(
        this._transformer,
        node => node.level,
        node => node.expandable,
        node => node.children,
      );
      
    treeDataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    
  ngOnInit() {

    this._service.get_Alerts().toPromise()
    .then(  (data)=>{
            let Crypteddata = decrypt(data);
            this.ListTrackingObjects = Crypteddata['ListTrackingObjects'];
            // HERE USE MAP FUNCTION
            this.ListTrackingObjects.forEach( e=>{
              if(e['CurrentEquipmentElement'] != null){

                let found = this.carList.findIndex(i => i.id == e.DepartmentId)

                if(found > -1){
                    this.carList[found].children.push({
                        name : {
                          name : e.FullName,
                          id : e.Key
                        }
                    })
                }else{
                    this.carList.push({
                        name : e.DepartmentName,
                        id : e.DepartmentId,
                        children : [{
                          name : {
                            name : e.FullName,
                            id : e.Key
                          }
                      }]
                    })
                }

                this.treeDataSource.data = this.carList


                this.vehiculeCluster.push({Key:e['Key'],name:e['FullName'],isActive:false});
                this.equippementAlertInfosCluster.push({Key:e['Key'],info:e['CurrentEquipmentElement']});  
              }
             
      });
   /*  await this._service.getWayPolygonPlace().subscribe(data =>{
        this._service.paths = data['ListWay'];
        this._service.places = data['ListPlaceElement'];
        this._service.polygon = data['ListPolygon'];
        this._service.country = data['ListCountry'];
      });*/

      console.log(this.vehiculeCluster, this.carList)
    }).catch((error : any) => {
     if(error instanceof HttpErrorResponse) {
      //this.errorHandler.handleError(error);.handleError(error);
     }
        // this._snackBar.open('Connection Error, Reload the page!', '', {
        //   duration: 3000,
        //   verticalPosition: 'top',
        //   horizontalPosition: 'right'
        // });
     
    }).then(() => {
      this._data.currentMatriculeAlert.subscribe(key => {
        if(!isNull(key))
           this.changeSelectedCar(key);
       }).unsubscribe();
    }).then(() => {
       this._data.changeSettingsAlert(null);
    });
    this._service.get_CommandResponceData().subscribe((data)=>{
      if(Object.keys(data).length != 0){
       
        this.commandDisplayList.push({CommandDescription:data['CommandDescription'], DateCommand:data['DateCommandString'], StatusCommand:data['StatusCommandString'], CarName:data['Fleet'], AlertId:data['m_key']})
        this.alertList.push({Alertkey: data['key'],Iscomplete: false});
        if(!this.istimerluanched){
          const source = interval(30000);
          this.subscription = source.subscribe(val => this.testValidation());
          this.istimerluanched = true;
        }
        this.alertCounter = this.commandDisplayList.length;
      }
    });
  }
  hideCommdListTable()
  {
    this.isCommandListVisible=false;
  }
  testValidation(): void {
    
      if(!this.CheckifallAlertComplet()){
        let arrayofAlertskey: any[] = [];
        //Use Filter here 
        this.alertList.forEach(e=>{
          if(e.Iscomplete == false){
            arrayofAlertskey.push(e.Alertkey);
          }
        });
        
        this._service.GetAddedOrChangedCommand(arrayofAlertskey).subscribe(e=>{
          Object.keys(e).forEach(key=>{
            if(e[key]['StatusCommand'] != 0){//test if command status = succes!
              var index  = this.alertList.map(x => {return x.Alertkey}).indexOf(Number(key));
              this.alertList[index]['Iscomplete'] = true;
              let commandeDispalyIndex  = this.commandDisplayList.map(x => {return x.AlertId}).indexOf(Number(key));
              this.commandDisplayList[commandeDispalyIndex]['StatusCommand'] = e[key]['StatusCommandString'];//Modify alert status on alert dropdown menu
              if(e[key]['StatusCommand'] == 1){
                //start sucess snack bar!
                this._snackBar.open(e[key]['CommandDescription'] + ' : ' + e[key]['Fleet'] + ' est ' + e[key]['StatusCommandString'] , '' , {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'right',
                  panelClass: ['mat-toolbar', 'mat-primary']
                });
                
              }else{
                  this._snackBar.open(e[key]['CommandDescription'] + ' : ' + e[key]['Fleet'] + ' est ' + e[key]['StatusCommandString'], '' , {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'right',
                  panelClass: ['mat-toolbar', 'mat-warn']
                });
              }
            }
          });
        },
        (err: HttpErrorResponse) => {
          //this.errorHandler.handleError(error);.handleError(err);
        });
      }else{
        this.subscription.unsubscribe();
        this.istimerluanched = false;
      }
  }
  CheckifallAlertComplet() {//Check if there is any alert not complet
    let alertCompleted = true;
    this.alertList.forEach(e=>{
      if(e.Iscomplete == false){
        alertCompleted = false;
      }
    });
    return alertCompleted;
  }
  ngOnDestroy() {
  //  this.subscription$.unsubscribe();
    if(this.istimerluanched){
    
      this.subscription.complete();
      this.subscription.unsubscribe();
    }
  } 

  activeKey : any = -1;

  changeSelectedCar(key){
    if(key == undefined) return;
console.log("changed car : ", key)
  
    this.selectedValue = key;
    this.isCarSelected = true;
    let info = this.equippementAlertInfosCluster.filter(x => x.Key == this.selectedValue)
    this.selctedCar = info;
    //For updating car list marker position----------------------
    this.vehiculeCluster.map(x => {return x.isActive = false});
    let indexCar  = this.vehiculeCluster.map(x => {return x.Key}).indexOf(Number(key));
    //this.vehiculeCluster[indexCar].isActive = true;
    this.activeKey = key;
    //-----------------------------------------------------------
    this._service.set_EquipementInfoData(info)
  }
  HideShowNotificationList(){
    this.notificationVisivility = !this.notificationVisivility;
  }
  clearNotifications(){
    this.commandDisplayList = [];
    this.alertCounter = 0;
    this.subscription.unsubscribe();
    this.istimerluanched = false;
  }
}
