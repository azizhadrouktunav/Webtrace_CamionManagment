import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Mission, StatusMission } from '../model';
import { MatSnackBar } from '@angular/material';
import { OrderService, serializeMission } from '../service.order';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { isEqual } from 'date-fns';
import { fuseAnimations } from '@fuse/animations';
import { Location } from '@angular/common';
import { isNullOrUndefined } from 'util';
import { Validators_ } from 'app/main/helpers/validators/validators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { compareDate } from 'app/main/helpers/compareDate';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class MissionComponent implements OnInit {
  
  pageType: string;
  mission: Mission;
  missionForm: FormGroup;
  drivers:any[];
  cars:any[];
  places:any[];
  statusMission:any[];
  currentAccount:number;
  exist: boolean = false;
  startDate: Date;
  endDate: Date;
  filteredOptions: Observable<string[]>;
  filteredOptionsVehicule: Observable<string[]>;
  data:any;
  // Private
  private _unsubscribeAll: Subject<any>;
  constructor(
    private _formBuilder: FormBuilder,
    private _matSnackBar: MatSnackBar,
    private _orderManagement: OrderService,
    private _location: Location,
    private _translate: TranslateService,
    private router : Router,
    private _route: ActivatedRoute,
   
  ) {
     // Set the default
     this.mission = new Mission();

     // Set the private defaults
     this._unsubscribeAll = new Subject();

   
     this.startDate = new Date(this._route.snapshot.queryParamMap.get('start'));
     this.endDate = new Date(this._route.snapshot.queryParamMap.get('end'));
     this._translate.get(['NAV.Mission_add_msg', 'NAV.Mission_update_msg' , 'NAV.Mission_delete_msg'])
    .subscribe(data => { this.data = data }
    );
    }
// -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
// -----------------------------------------------------------------------------------------------------

/**
 * On init
 */
  ngOnInit():void {
  //this._orderManagement.getUIPlannedMissionParam();
    this.statusMission=  Object.keys(StatusMission).filter(key => !isNaN(Number(StatusMission[key]))).map(key => {
        return {
            id: StatusMission[key],
            name: key,
        };
    });
    
    this.cars = this._orderManagement.vehicles;
    
    this.drivers = this._orderManagement.drivers;
    this.places = this._orderManagement.places;
    this.currentAccount = this._orderManagement.currentAccount;
    // Subscribe to update mission on changes
    this._orderManagement.onMissionChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(response => {
      if(response){
        this.mission = response;
        this.pageType = 'edit';
      }
      else{
        this.pageType = 'new';
        this.mission  = new Mission();
        
      }
    })
    
    this.missionForm = this.createProductForm();
    this.onChanges();
    this.filteredOptions = this.missionForm.get('Driver').valueChanges.pipe(
      startWith(''),
      map(text => this._filter(text))
    );
    this.filteredOptionsVehicule = this.missionForm.get('TrackingTarget').valueChanges.pipe(
      startWith(''),
      map(text => this._filtercar(text))
    );
  }
  private _filter(driver) {  
      return this.drivers.filter(driverL =>
      driverL.name.includes(driver));
    
  }
  private _filtercar(text) {  
    return this.cars.filter(car =>
    car.name.includes(text));
  }
  displayDriver = (driver) => {
    if(this.drivers == undefined)
    this.drivers = this._orderManagement.drivers;
    let DriverFind =this.drivers.find(x => x.id ==driver ); 
    if(DriverFind)
    return DriverFind.name
    else
    return '';
    //? driver.Name : '';
  }
  displayCar = (car) => {
    console.log(car);
    
    if(this.cars == undefined)
    this.cars = this._orderManagement.vehicles;
    let CarFind =this.cars.find(x => x.id ==car );
    if(CarFind)
    return CarFind.name
    else
    return '';
  }
/**
 * On destroy
 */
ngOnDestroy(): void
{
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
}
goBack() : void {
 
   this.router.navigate(['/parc/app-order-management'] ,
   { queryParams: { 'start': this.startDate , 'end': this.endDate} })

}
   /**
     * Create mission form
     *
     * @returns {FormGroup}
     */
    createProductForm(): FormGroup
    {
        return this._formBuilder.group({
          Id  : new FormControl(this.mission.Id), // id routeParams
          Number: new FormControl(this.mission.Number),
          Driver : new FormControl(this.mission.Driver), // responsable
          EstimatedDateLocalOfMission : new FormControl(this.mission.EstimatedDateLocalOfMission), // date planifié de visite/mission
          RealDateLocalOfMission : new FormControl(this.mission.RealDateLocalOfMission), // date réelle  de visite/mission
          MaxDateLocalOfMission : new FormControl(this.mission.MaxDateLocalOfMission), // Date max de visite/mission
          Account: new FormControl(this.mission.Account), 
          StartPlaceOfMission : new FormControl(this.mission.StartPlaceOfMission), // Client/Emplacement de départ
          DestinationPlaceOfMission : new FormControl(this.mission.DestinationPlaceOfMission, Validators.required), // Client/Emplacement à visiter
          StatusMission    : new FormControl(this.mission.StatusMission), // Etat
          TrackingTarget          : new FormControl(this.mission.TrackingTarget), // vehicule
          EstimatedDateLocalOfStarting: new FormControl(this.mission.EstimatedDateLocalOfStarting), // date planifiée de départ
          RealDateLocalOfStarting : new FormControl(this.mission.RealDateLocalOfStarting), // date réelle de départ
          Purpose : new FormControl(this.mission.Purpose), // objet
          OdometerOut   : new FormControl(this.mission.OdometerOut), // Kilométrage au départ
          OdometerIn   : new FormControl(this.mission.OdometerIn), // Kilométrage à l'arrivée
          WeightLoaded : new FormControl(this.mission.WeightLoaded), // Poids chargé(kg)
          PriceOfWeightLoaded : new FormControl(this.mission.PriceOfWeightLoaded), // Valeur du poids chargé
          EstimatedTotalFuelConsumed : new FormControl(this.mission.EstimatedTotalFuelConsumed), // Totale carburant consommé estimé(l)
          RealTotalFuelConsumed: new FormControl(this.mission.RealTotalFuelConsumed), // Totale curburant consommé réel(l)
          Cost : new FormControl(this.mission.Cost) // cout
        });
    }
    existPlannedMissionNumberStr(data):void{
      var msg : string = '';
          this._orderManagement.ExistPlannedMissionNumberStr(data)
          .subscribe((respone : boolean) => {
              this.exist = respone;
              if(this.exist) {
                this.missionForm.get('Number').setErrors({
                  exist : this.exist
                });
               const sub =  this._translate.get('PlannedMission.ThisNumberExist').subscribe(data => {
                     msg = data
                });
                sub.unsubscribe();
                // failure the success message
                this._matSnackBar.open(msg, 'Ok', {
                  verticalPosition: 'top',
                  //horizontalPosition: 'right',
                  duration        : 3000
              });
              }
          })
    }
     /* detect touched or untouched NumberStr*/
     onChanges():void {
      this.missionForm.get('Number').valueChanges.subscribe(data => {
              this.existPlannedMissionNumberStr(data);
      });
       // EstimatedDateLocalOfStarting < EstimatedDateLocalOfMission
       this.missionForm.get('EstimatedDateLocalOfMission').valueChanges.subscribe(data => {
        //var val = this.missionForm.get('EstimatedDateLocalOfStarting').value;
        var comp : number = compareDate(this.missionForm.get('EstimatedDateLocalOfMission').value,this.missionForm.get('EstimatedDateLocalOfStarting').value);
         if(comp === -1){
           var msg : string = '';
           const sub =  this._translate.get('PlannedMission.EstimatedDateMissionLessThanEstimatedDateStarting').subscribe(data => {
             msg = data
        });
        sub.unsubscribe();
        // failure the success message
        this._matSnackBar.open(msg, 'OK', {
          verticalPosition: 'top',
          //horizontalPosition: 'right',
          duration        : 3000
      });
      this.missionForm.controls['EstimatedDateLocalOfMission'].setErrors({'incorrect': true});
         }
        else{
           this.missionForm.controls['EstimatedDateLocalOfMission'].setErrors(null);
         }
       });
       // MaxDateLocalOfMission > EstimatedDateLocalOfMission
       this.missionForm.get('MaxDateLocalOfMission').valueChanges.subscribe(data => {
         var comp : number = compareDate(this.missionForm.get('MaxDateLocalOfMission').value, this.missionForm.get('EstimatedDateLocalOfMission').value);
          if(comp === -1){
            var msg : string = '';
            const sub =  this._translate.get('PlannedMission.EstimatedDateLessThanMaxDateOfMission').subscribe(data => {
              msg = data
         });
            sub.unsubscribe();
            // failure the success message
            this._matSnackBar.open(msg, 'OK', {
              verticalPosition: 'top',
              //horizontalPosition: 'right',
              duration        : 3000
          });
          this.missionForm.controls['MaxDateLocalOfMission'].setErrors({'incorrect': true});
          }
          else if(comp === 1 || comp === 0) {
            this.missionForm.controls['MaxDateLocalOfMission'].setErrors(null);
          }
        });
    }
    // add Mission
    add(){
      this.missionForm.get('Account').setValue(this.currentAccount)
      const data = this.missionForm.getRawValue();
      this._orderManagement.add(data).subscribe(response => {
        if(!isEqual(response.toString() , 'null')){
       
                 let missonsAdded = response;
                 missonsAdded = missonsAdded.map(item => 
                  new Mission(item)
                );
                this._orderManagement.missions.unshift(...missonsAdded)
                this._orderManagement.onMissionsChanged.next(this._orderManagement.missions);
            // Show the success message
            this._matSnackBar.open(this.data['NAV.Mission_add_msg'], 'OK', {
              verticalPosition: 'top',
            //  horizontalPosition: 'right',
              duration        : 2000
          });

          // Change the location with new one
          this._location.go('/missions/' + this.mission.Id);
        }
        else {
           // Show the failure server message
           this._matSnackBar.open('Server Not Responding', 'OK', {
            verticalPosition: 'top',
           // horizontalPosition: 'right',
            duration        : 2000
        });
        }
      },
      error => {
       if(error.status==400)
        this.router.navigate(['/app-auth']);
      }
      )
    }

    /**
     * Update Mission
     */
    update(): void{
     
      const data = this.missionForm.getRawValue();
      this._orderManagement.update(data);
    }
    verifyStatus(): void {
      let  places: number[] = [];
      if(!isNullOrUndefined(this.mission.StartPlaceOfMission))
           places.push(this.mission.StartPlaceOfMission)
      if(!isNullOrUndefined(this.mission.DestinationPlaceOfMission))
           places.push(this.mission.DestinationPlaceOfMission)
      this._orderManagement.isPlannedMissionAccomplished(this.mission.TrackingTarget, this.mission.EstimatedDateLocalOfStarting, this.mission.MaxDateLocalOfMission, places)
          .subscribe((data : boolean) => {
             if(!data){
               this.missionForm.get('StatusMission').setValue(2);
             }
             else if(data){
               this.missionForm.get('StatusMission').setValue(1);
             }
          },
          error => {
            console.log(error)
          })
    }
    //EstimatedTotalFuelConsumed
    calculRealTotalFuelConsumed(): void {
      var sDate, eDate;
      this._orderManagement.sharedSDate.subscribe((data : Date) => {
          sDate = data;
      });
      this._orderManagement.sharedEDate.subscribe((data: Date) => {
         eDate = data;
      });
      this._orderManagement.calculateRealTotalFuelConsumed(sDate, eDate, this.mission.TrackingTarget)
      .subscribe(data => {
        this.missionForm.get('RealTotalFuelConsumed').setValue(data);
      });
    }
}
