
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { DateMoreThan } from 'app/main/helpers/compareDate';
import { Vehicle } from 'app/main/parc/gestio-des-vehicules/model';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CarGroup } from '../project.component';

@Component({
  selector: 'app-dashboardparampopup-component',
  templateUrl: './dashboardparampopup-component.component.html',
  styleUrls: ['./dashboardparampopup-component.component.scss']
})


export class DashboardparampopupComponentComponent  {
 
  @ViewChild('picker',{static: true}) picker: any;
  data: any;
  form: FormGroup;
  dateObj = new Date();
  displayValue: string;
  filterValue:string="";

 listcargroup: CarGroup[]=[];

 isExpandCategory: boolean[] = [];
 stateRecord:any = [];
 CarGroupOptions: Observable<CarGroup[]>;
 lastFilter: string = '';
  
  filteredVehicles: any;
  TO: any;
  minDate: any;
  trackingObjects: any;
  constructor(private formBuilder: FormBuilder,
              public matDialogRef: MatDialogRef<DashboardparampopupComponentComponent>,
              @Inject(MAT_DIALOG_DATA) private _data: any,
              private translateService : TranslateService,
              private _formBuilder: FormBuilder,
              )
             { 
             
              
               
     this.form= this._formBuilder.group({
      keyTrackingObject: ['', Validators.required],
    
      dateTo: [new Date(this.dateObj.getUTCFullYear(),this.dateObj.getUTCMonth() ,this.dateObj.getUTCDate(),0,0,0), [Validators.required]],
      dateFrom:   [new Date(this.dateObj.getUTCFullYear(),this.dateObj.getUTCMonth() ,this.dateObj.getUTCDate(),23,59,59), [Validators.required]]
    }, { validator: DateMoreThan('dateTo' , 'dateFrom')
  });
    this.form.get('dateTo').valueChanges.subscribe(date => {
      this.minDate = date;
   });
  
      
   this.TO =  this._data.trackingobjects ;
   if(this.listcargroup.length ==0)
   {
    this.listcargroup =_.chain(this.TO).groupBy("DepartmentName").map((value,key)=>({department:key,car:value})).value();
    this.CarGroupOptions =  this.form.get('keyTrackingObject').valueChanges.pipe(
      startWith(''),
      map(value =>typeof value === 'string' ? value: this.lastFilter),map(filter => this.filterGroup(filter))
    );
   }
  
   
  // this.form.controls['keyTrackingObject'].setValue(this.listcargroup);
 
   /* this.CarGroupOptions= this.form.get('keyTrackingObject').valueChanges.pipe(
    startWith(''),
    map(value => this.filter(value))
   );*/
  
   


   /*this._data.currentIndex.subscribe(index => {
      if(index == 2) {
       this._data.secondServiceResponse.subscribe(key => {
             
        this._trackingObjectService.onTrackingObjectsChanged.subscribe(data => {
          this.trackingObjects  = data;
        })
             var vehicle : Vehicle = this.TO.find(it => it.Key == key)
             this.form.controls['keyTrackingObject'].setValue(vehicle);
             var today = new Date();
             this.form.controls['dateTo'].setValue(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
             this.form.controls['dateFrom'].setValue(new Date());
            // this.onSubmit();
            // this.accordion.openAll();
       });
      }
   });*/
             
           
              
              }
              
 /**
     *
     * @returns {FormGroup}
     */
    createdataForm(): FormGroup
    {  
        return new FormGroup({
          
        });
    }
    
   
    toggleParent(event: any, group: any) {
   
      group.checked = event.checked;
     
      let states = this.form.get('keyTrackingObject').value ;
      states = states ? states : [];
      if(event.checked) {
        group.car.forEach((x: Vehicle) => {
          states.push(x)
        })
        
      } else {
        console.log("else", states);
        group.car.forEach((x: Vehicle) => {
            if(states.indexOf(x) > -1) {
              states.splice(states.indexOf(x), 1)
            }
          });
      }
      this.form.get('keyTrackingObject').setValue(states);
      
     /*   if(!event.checked) {
          this.form.get('keyTrackingObject').setValue( this.form.get('keyTrackingObject').value.filter((x:any) => !x.includes(group.car)))
        
      }*/
      this.stateRecord =  this.form.get('keyTrackingObject').value;
      
    }
    toggleSelection2(event: any, name: any, group: any) {
      //console.log(group);
      //console.log(event.checked);
      
      if(event.checked) {
        
        this.stateRecord.push(name);
        this.form.get('keyTrackingObject').setValue(this.stateRecord);
        this.isExpandCategory[group.department] =true;
     
      }
      else {
          this.stateRecord = this.stateRecord.filter((x:any) => x!== name);
       
          this.form.get('keyTrackingObject').setValue(this.form.get('keyTrackingObject').value.filter((x:any) => x!== name));
         
          //this.states.setValue([]);
      }
    }
    expandDocumentTypes(group: any) {
      console.log("expanding dropdown", group);
      this.isExpandCategory[group.department] = !this.isExpandCategory[group.department];
      // expand only selected parent dropdown category with that childs
    }
  
    
    filterGroup(val: any) {
      this.lastFilter=val;
      if (typeof val == 'string' && val !=''){
       // let test = this.listcargroup.filter(group=>group.car.filter(item=>this._filter(group.car,val).indexOf(item)>-1))
       
     //  let g= this.listcargroup.map(group=>({department:group.department,car:group.car.filter(item=>this._filter(group.car,val).indexOf(item)>-1)})).filter(group=>group.car.length>0);
        //this.listcargroup.filter(group=>group.car.findIndex(obj: this._filter(group.car,val)) );
       // return this.listcargroup.map(group=>({department:group.department,car:group.car.filter(item=>this._filter(group.car,val).indexOf(item)>-1)})).filter(group=>group.car.length>0);
         return this.listcargroup.filter(group=>({department:group.department,car:this._filter(group.car,val)}).car.length>0);
        //.map(group=>({department:group.department,car:this._filter(group.car,val)})).filter(group=>group.car.length>0);
         
      }
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
     filterGroup2(event: any)
     {
       let val =event.srcElement.value;
  
      this.listcargroup.map(group=>({department:group.department,car:this._filter(group.car,val)})).filter(group=>group.car.length>0);
     }
  
     displayVehicle(v: Vehicle) {
       let test = v;
      if (Array.isArray(v)) {
       this.displayValue = '';
        v.forEach((v, index) => {
         if (index === 0) {
           this.displayValue = v.FullName + ' ';
         } else {
           this.displayValue += ', ' + v.FullName + ' ';
         }
       });
       return this.displayValue;
      } else {
       return this.displayValue;
      };
    }
    onSubmit(){}


}

