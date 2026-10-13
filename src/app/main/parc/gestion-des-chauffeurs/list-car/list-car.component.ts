import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Driver } from '../model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { GetionChauffeursService } from '../getion-chauffeurs.service';
import { trigger, style, transition, animate, state } from '@angular/animations';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-list-car',
  templateUrl: './list-car.component.html',
  styleUrls: ['./list-car.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),fuseAnimations
  ],
})
export class ListCarComponent implements OnInit {
  driver: Driver;
  FullName:string;
  equipements : any[];
  dataSource: MatTableDataSource<any>;  
  dialogTitle: string;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  @ViewChild(MatPaginator,{static : true}) paginator: MatPaginator;
  listCars :CarsCanDriveTheDriver [] =[];
  listCarsP :CarsCanDriveTheDriver [] =[];
  listCarsUpdate :CarsCanDriveTheDriver [] =[];
  displayedColumns: string[] = ['Equipment','EtatConduite','CurrentTrackingObjectName'];
  constructor(@Inject(MAT_DIALOG_DATA) private _data: any,public matDialogRef: MatDialogRef<ListCarComponent>, private _getionChauffeursService: GetionChauffeursService) 
  {
    this.driver=_data.driver
    this.equipements=_data.equipements;
   }

   ngOnInit() {
    this.FullName= this.driver.FullName;
    this.driver.EquipElemAccessToDriverCode.forEach(element => {
      if(element.IsAssignedNow == true)
      {
        this.listCars.push({'KeyTO' :element.KeyCurrentTrackingObject,'Equipment':element.key,'EtatConduite':true,'CurrentTrackingObjectName':element.CurrentTrackingObjectName,'keyDriver':this.driver.key})
        this.listCarsP.push({'KeyTO' :element.KeyCurrentTrackingObject,'Equipment':element.key,'EtatConduite':true,'CurrentTrackingObjectName':element.CurrentTrackingObjectName,'keyDriver':this.driver.key})
      }
    });
  

    this._getionChauffeursService.getEquipements(this.driver.key).subscribe((data: any) => {
      data.GetElementsFreeByDriverResult.forEach(row=>{
        this.listCars.push({'KeyTO' :row.KeyCurrentTrackingObject,'Equipment':row.key,'EtatConduite':false,'CurrentTrackingObjectName':row.CurrentTrackingObjectName,'keyDriver':this.driver.key})
        this.listCarsP.push({'KeyTO' :row.KeyCurrentTrackingObject,'Equipment':row.key,'EtatConduite':false,'CurrentTrackingObjectName':row.CurrentTrackingObjectName,'keyDriver':this.driver.key})
       })
       //this.listCarsP=this.listCars;
       this.dataSource = new MatTableDataSource( this.listCars);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;

     });

   

  }
  editCar (row)
  {
    
    this.matDialogRef.close(row);

  }
  SaveAllCar()
  {
    this.listCarsUpdate=[];
    this.listCarsP.forEach(row=>{
      if(this.listCars.find(x=>x.KeyTO== row.KeyTO).EtatConduite != row.EtatConduite)
      {
          this.listCarsUpdate.push(this.listCars.find(x=>x.KeyTO== row.KeyTO));
      }
    })
    this.matDialogRef.close(this.listCarsUpdate);
   
  }

}
export interface CarsCanDriveTheDriver {
  KeyTO: number;
  //CustomerBenef: CustomerBenef;
  Equipment: string;
  EtatConduite: boolean;
  CurrentTrackingObjectName: string;
  keyDriver:number;
  
//  AccessRightsOfCurrentAccount: AccessRightsOfCurrentAccount;
 // Account: Account;
}
