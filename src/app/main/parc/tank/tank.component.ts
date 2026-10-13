import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CardCouponService } from '../card-coupon/card-coupon.service';
import { NewTankComponent } from './new-tank/new-tank.component';
import { FormGroup, FormControl } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import * as shape from 'd3-shape';
import { ChartDataModel, Tank, SeriersChildModel } from './model';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FillTankComponent } from './fill-tank/fill-tank.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../i18n/en';
import { locale as french } from '../i18n/fr';
import { locale as arabic } from '../i18n/ar';
import {  Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { takeUntil } from 'rxjs/operators';
//import { MatSnackBar } from '@angular/material/snack-bar/typings/snack-bar';
@Component({
  selector: 'tanks',
  templateUrl: './tank.component.html',
  styleUrls: ['./tank.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class TankComponent implements OnInit,  AfterViewInit {

  dialogRef: any;
  tanks: any[];
  ngxData: ChartDataModel = {
    data: []
  };
  childs: SeriersChildModel[];
       // options
       xAxis         = true;
       yAxis         = true;
       gradient      = false;
       legend        = true;
       legendPosition= "below";
       showXAxisLabel= false;
       xAxisLabel    ='Tanks';
       showYAxisLabel = false;
       yAxisLabel    = 'Fuel';
     
       colorScheme = {
         domain: ['#42BFF7', '#C6ECFD', '#C7B42C', '#AAAAAA']
       };
       confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
       displayedColumns: string[] = ['FuelType', 'Name',  'FuelContainerCapacityInL', 
       'TotalFuelConsumptionInL', 'FuelLevelInL', 'FuelLevelInPercent', 'Remaining', 'actions'
       ];
       dataSource: MatTableDataSource<any>;
       // Private
    private _unsubscribeAll: Subject<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    private _matDialog: MatDialog,
    private _tankService: CardCouponService,
    private _matSnackBar: MatSnackBar,
    private translationLoader: FuseTranslationLoaderService)
  { 
       // Set the private defaults
       this._unsubscribeAll = new Subject();
     // Load the translations
     this.translationLoader.loadTranslations(english, french, arabic);
  }

  ngOnInit() {
    this._tankService.onTanksChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(tanks => {
                this.tanks = tanks;
            });
    this.dataSource = new MatTableDataSource(this.tanks);
    let currData: Tank;
    this.tanks.map((p) => {
      currData = new Tank(p);
      this.ngxData.data.push({
        name: currData.Name , series: [
          {
            name: 'FuelContainerCapacityInL',
            value: currData.FuelContainerCapacityInL
          },
          {
            name: 'FuelLevelInL',
            value: currData.FuelLevelInL
          },
          {
            name: 'TotalFuelConsumptionInL',
            value: currData.TotalFuelConsumptionInL
          }
        ]
      })

      });
    this.ngxData.data = [...this.ngxData.data];
  }
  ngAfterViewInit() : void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
  addTank(): void{
    var  updatedData: ChartDataModel = {
      data: []
    };
      this.dialogRef = this._matDialog.open(NewTankComponent, {
          panelClass: ['event-form-dialog','custom-dialog-container'],
          data : {
              action: 'new'
          }
      });
      this.dialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
          if(!response) {
              return;
          }
          
          var newTank: Tank = new Tank(response.getRawValue());
          this.dataSource.data.unshift(newTank);
          //this.dataSource.data = this.dataSource.data;
          this._tankService.addTank(newTank);
          let currData: Tank;
                            this.dataSource.data.map((p) => {
                              currData = new Tank(p);
                              updatedData.data.push({
                                name: currData.Name , series: [
                                  {
                                    name: 'FuelContainerCapacityInL',
                                    value: currData.FuelContainerCapacityInL
                                  },
                                  {
                                    name: 'FuelLevelInL',
                                    value: currData.FuelLevelInL
                                  },
                                  {
                                    name: 'TotalFuelConsumptionInL',
                                    value: currData.TotalFuelConsumptionInL
                                  }
                                ]
                              })
                        
                              });
                            this.ngxData.data = [...updatedData.data];
      })
  }
  updateTank(action: string, tank: Tank) : void
  {
    var  updatedData: ChartDataModel = {
      data: []
    };
  const Index = this.dataSource.data.indexOf(tank);
  this.dialogRef = this._matDialog.open(NewTankComponent,{
    panelClass: ['new-tank','custom-dialog-container'],
    data :{
        tank : tank,
        action : action
    }
  });
  this.dialogRef.afterClosed()
  .subscribe(response => {
       if( !response)
       {
         return;
       }
       const actionType: string = response[0];
       const formData: FormGroup = response[1];
       switch (actionType){
             /**
                     * Save
                     */
                    case 'save':
                        this._tankService.updateTank(formData.getRawValue())
                        .subscribe(data => {
                            if(data as Tank){
                              
                            this.dataSource.data[Index] = Object.assign(this.dataSource.data[Index], data);
                            let currData: Tank;
                            this.dataSource.data.map((p) => {
                              currData = new Tank(p);
                              updatedData.data.push({
                                name: currData.Name , series: [
                                  {
                                    name: 'FuelContainerCapacityInL',
                                    value: currData.FuelContainerCapacityInL
                                  },
                                  {
                                    name: 'FuelLevelInL',
                                    value: currData.FuelLevelInL
                                  },
                                  {
                                    name: 'TotalFuelConsumptionInL',
                                    value: currData.TotalFuelConsumptionInL
                                  }
                                ]
                              })
                        
                              });
                            this.ngxData.data = [...updatedData.data];
                            }
                            this._matSnackBar.open('Successfully edited', '', {
                              // here specify the position
                              verticalPosition: 'bottom',
                              horizontalPosition: 'right' ,
                              duration  : 3000
                               }
                            )
                          },
                          (err: HttpErrorResponse) => {
                            // Show the failure message 
                           this._matSnackBar.open('Error occurred. Details: ' + err.name + ' ' + err.message, '' ,{
                            // here specify the position
                            verticalPosition: 'bottom',
                            horizontalPosition: 'right' ,
                            duration  : 8000
                             })
                          });
                        break;
                    /**
                     * Delete
                     */
                    case 'delete':
                        this.deleteTank(tank)
                        break;
       }
  });
  }
  fillTank(tank: Tank): void{
    var  updatedData: ChartDataModel = {
      data: []
    };
    const Index = this.dataSource.data.indexOf(tank);
    this.dialogRef = this._matDialog.open(FillTankComponent, {
        width: '250px',
        data      : {
              nameTank : tank.Name
          }
    });
    this.dialogRef.afterClosed()
            .subscribe((response: FormControl) => {
                if ( !response )
                {
                    return;
                }
                const filling = response.value;
                this._tankService.fillTank(tank.Id, filling)
                .subscribe(data => {
                    if(data as Tank){
                    this.dataSource.data[Index] = Object.assign(this.dataSource.data[Index], data);
                    let currData: Tank;
                    this.dataSource.data.map((p) => {
                      currData = new Tank(p);
                      updatedData.data.push({
                        name: currData.Name , series: [
                          {
                            name: 'FuelContainerCapacityInL',
                            value: currData.FuelContainerCapacityInL
                          },
                          {
                            name: 'FuelLevelInL',
                            value: currData.FuelLevelInL
                          },
                          {
                            name: 'TotalFuelConsumptionInL',
                            value: currData.TotalFuelConsumptionInL
                          }
                        ]
                      })
                
                      });
                    this.ngxData.data = [...updatedData.data];
                    }
                    this._matSnackBar.open('Successfully filled', '', {
                      // here specify the position
                      verticalPosition: 'bottom',
                      horizontalPosition: 'right',
                      duration  : 3000
                       }
                    )
                  },
                  (err: HttpErrorResponse) => {
                    // Show the failure message 
                   this._matSnackBar.open('Error occurred. Details: ' + err.name + ' ' + err.message, '' ,{
                    // here specify the position
                    verticalPosition: 'bottom',
                    horizontalPosition: 'right' ,
                    duration  : 8000
                     })
                  });
            
            });
  }
  deleteTank(tank: Tank){
   var  updatedData: ChartDataModel = {
      data: []
    };
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: false
      });
  this.confirmDialogRef.componentInstance.confirmMessage = 'deleteMsg';
  this.confirmDialogRef.afterClosed().subscribe(result => {
    if(result){
      this._tankService.delete(tank.Id);
      let currData: Tank;
      this._tankService.onTanksChanged.value.map((p) => {
        currData = new Tank(p);
        updatedData.data.push({
          name: currData.Name , series: [
            {
              name: 'FuelContainerCapacityInL',
              value: currData.FuelContainerCapacityInL
            },
            {
              name: 'FuelLevelInL',
              value: currData.FuelLevelInL
            },
            {
              name: 'TotalFuelConsumptionInL',
              value: currData.TotalFuelConsumptionInL
            }
          ]
        })
  
        });
      this.ngxData.data = [...updatedData.data];
    }
  })
  }

}