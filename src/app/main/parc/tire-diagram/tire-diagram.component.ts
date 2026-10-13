import { Component, OnInit } from '@angular/core';
import { TireManagementService } from '../services/tire-management.service';
import { TireManagement, DicoTransportation, TireLog } from '../interfaces/tire-management';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditAddTireLogComponent } from '../Dialogs/edit-add-tire-log/edit-add-tire-log.component';

@Component({
  selector: 'app-tire-diagram',
  templateUrl: './tire-diagram.component.html',
  styleUrls: ['./tire-diagram.component.scss']
})
export class TireDiagramComponent implements OnInit {
  ListTires: Array<TireManagement> = [];
  ListTiresAxle1LIn: Array<TireManagement> = [];
  ListTiresAxle1LOut: Array<TireManagement> = [];
  ListTiresAxle1RIn: Array<TireManagement> = [];
  ListTiresAxle1ROut: Array<TireManagement> = [];
  ListTiresAxle2LIn: Array<TireManagement> = [];
  ListTiresAxle2LOut: Array<TireManagement> = [];
  ListTiresAxle2RIn: Array<TireManagement> = [];
  ListTiresAxle2ROut: Array<TireManagement> = [];
  ListTiresAxle3LIn: Array<TireManagement> = [];
  ListTiresAxle3LOut: Array<TireManagement> = [];
  ListTiresAxle3RIn: Array<TireManagement> = [];
  ListTiresAxle3ROut: Array<TireManagement> = [];
  ListTiresAxle4LIn: Array<TireManagement> = [];
  ListTiresAxle4LOut: Array<TireManagement> = [];
  ListTiresAxle4RIn: Array<TireManagement> = [];
  ListTiresAxle4ROut: Array<TireManagement> = [];
  ListTiresAxle5LIn: Array<TireManagement> = [];
  ListTiresAxle5LOut: Array<TireManagement> = [];
  ListTiresAxle5RIn: Array<TireManagement> = [];
  ListTiresAxle5ROut: Array<TireManagement> = [];
  ListTiresAxle6LIn: Array<TireManagement> = [];
  ListTiresAxle6LOut: Array<TireManagement> = [];
  ListTiresAxle6RIn: Array<TireManagement> = [];
  ListTiresAxle6ROut: Array<TireManagement> = [];

  searchkey;
  DisabledAxle = true;
  axle1 = false;
  axle2 = false;
  axle3 = false;
  axle4 = false;
  axle5 = false;
  axle6 = false;
  KeyCar: number;
  axle1IN = false;
  axle2IN = false;
  axle3IN = false;
  axle4IN = false;
  axle5IN = false;
  axle6IN = false;

  Transportation: DicoTransportation;
  constructor(private _TireManagementService: TireManagementService, private _Activatedroute: ActivatedRoute, public dialog: MatDialog) { }


  dropPrin(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      let tire: TireManagement = <TireManagement>(json2array(event.previousContainer.data)[0]);
      let NewData: TireLog;

      NewData = {
        Id: 0,
        Tire: tire.Id,
        OperationDateGmt: null,
        OperationDateLocal: null,
        OperationType: 2,
        OperationTypeName: null,
        OperationTypeEnum: 0,
        OperationMileage: 0,
        OperationCost: 0,
        OperationHeightOfTreadWearInMm: 0,
        OperationPressure: 0,
        Car: this.KeyCar,
        AxleNumber: 0,
        AxleNumberEnum: 0,
        WheelPosition: 0,
        WheelPositionEnum: 0,
        WorkOrderNumber: null,
        AccountServiceBy: 0,
        AccountWorkedBy: 0,
        Description: null,
        Comment: null,
        CreatedDate: null,
        CreatedDateLocal: null,
        LastEditDate: null,
        LastEditDateLocal: null,
        LastEditAccount: 0,
        Customer: 0
       
        // ListCompt:

      };
      const dialogRef = this.dialog.open(EditAddTireLogComponent, {
        panelClass: 'custom-dialog-container',
        // tslint:disable-next-line: max-line-length
        data: NewData

      });
      dialogRef.afterClosed().subscribe(result => {
        if (!result) {

        }
        //console.log(result);
        result.OperationDateGmt = new Date(result.OperationDateGmt);
        this._TireManagementService.AddTireLog(result).subscribe((row: TireLog) => {


          this._TireManagementService.TireDismount(tire.Id).subscribe((row: TireManagement) => {
            transferArrayItem(event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex);

          })



        });

      });






    }
  }

  ngOnInit() {
    this.KeyCar = Number(this._Activatedroute.snapshot.paramMap.get("Key"));
   
    this._TireManagementService.getTireParam().subscribe((data: any) => {
      let ListTrans: Array<DicoTransportation> = json2array(data.DicoTransportation);
      this.Transportation = ListTrans.find(x => x.Key == this.KeyCar);
      if (this.Transportation.Axle1Enabled) {
        this.axle1 = true;
        if (this.Transportation.DualWheelAxle1) {
          this.axle1IN = true;

        }
        else
          this.axle1IN = false;
      }
      else {
        this.axle1 = false;
      }
      if (this.Transportation.Axle2Enabled) {
        this.axle2 = true;
        if (this.Transportation.DualWheelAxle2) {
          this.axle2IN = true;
        } else {
          this.axle2IN = false;
        }

      }
      else {
        this.axle2 = false;
      }
      if (this.Transportation.Axle3Enabled) {
        this.axle3 = true;
        if (this.Transportation.DualWheelAxle3) {
          this.axle3IN = true;
        } else {
          this.axle3IN = false;
        }
      }
      else {
        this.axle3 = false;
      }
      if (this.Transportation.Axle4Enabled) {
        this.axle4 = true;
        if (this.Transportation.DualWheelAxle4) {
          this.axle4IN = true;
        } else {
          this.axle4IN = false;
        }
      }
      else {
        this.axle4 = false;
      }
      if (this.Transportation.Axle5Enabled) {
        this.axle5 = true;
        if (this.Transportation.DualWheelAxle5) {
          this.axle5IN = true;
        } else {
          this.axle5IN = false;
        }
      }
      else {
        this.axle5 = false;
      }
      if (this.Transportation.Axle6Enabled) {
        this.axle6 = true;
        if (this.Transportation.DualWheelAxle6) {
          this.axle6IN = true;
        } else {
          this.axle6IN = false;
        }
      }
      else {
        this.axle6 = false;
      }
    });
    this._TireManagementService.getTires().subscribe((ListTires: TireManagement[]) => {

      ListTires.forEach(row => {

        if (row.TireCarStatus == 0)
          this.ListTires.push(row);

      });
      let ListTireCar: Array<TireManagement>;
      ListTireCar = ListTires.filter(x => x.CurrentInstalledCar == this.KeyCar);
      ListTireCar.forEach(row => {
        if (row.CurrentInstalledAxleNbr == 1) {
          switch (row.CurrentInstalledWheel) {
            case 0:
              this.ListTiresAxle1LIn.push(row);
              break;
            case 1:
              this.ListTiresAxle1LOut.push(row);
              break;
            case 2:
              this.ListTiresAxle1RIn.push(row);
              break;
            case 3:
              this.ListTiresAxle1ROut.push(row);
              break;
          }
        }
        if (row.CurrentInstalledAxleNbr == 2) {
          switch (row.CurrentInstalledWheel) {
            case 0:
              this.ListTiresAxle2LIn.push(row);
              break;
            case 1:
              this.ListTiresAxle2LOut.push(row);
              break;
            case 2:
              this.ListTiresAxle2RIn.push(row);
              break;
            case 3:
              this.ListTiresAxle2ROut.push(row);
              break;
          }
        }
        if (row.CurrentInstalledAxleNbr == 3) {
          switch (row.CurrentInstalledWheel) {
            case 0:
              this.ListTiresAxle3LIn.push(row);
              break;
            case 1:
              this.ListTiresAxle3LOut.push(row);
              break;
            case 2:
              this.ListTiresAxle3RIn.push(row);
              break;
            case 3:
              this.ListTiresAxle3ROut.push(row);
              break;
          }
        }
        if (row.CurrentInstalledAxleNbr == 4) {
          switch (row.CurrentInstalledWheel) {
            case 0:
              this.ListTiresAxle4LIn.push(row);
              break;
            case 1:
              this.ListTiresAxle4LOut.push(row);
              break;
            case 2:
              this.ListTiresAxle4RIn.push(row);
              break;
            case 3:
              this.ListTiresAxle4ROut.push(row);
              break;
          }
        }
        if (row.CurrentInstalledAxleNbr == 5) {
          switch (row.CurrentInstalledWheel) {
            case 0:
              this.ListTiresAxle5LIn.push(row);
              break;
            case 1:
              this.ListTiresAxle5LOut.push(row);
              break;
            case 2:
              this.ListTiresAxle5RIn.push(row);
              break;
            case 3:
              this.ListTiresAxle5ROut.push(row);
              break;
          }
        }
        if (row.CurrentInstalledAxleNbr == 6) {
          switch (row.CurrentInstalledWheel) {
            case 0:
              this.ListTiresAxle6LIn.push(row);
              break;
            case 1:
              this.ListTiresAxle6LOut.push(row);
              break;
            case 2:
              this.ListTiresAxle6RIn.push(row);
              break;
            case 3:
              this.ListTiresAxle6ROut.push(row);
              break;
          }
        }

      });


    })
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {



      let tire: TireManagement =<TireManagement>(json2array(event.previousContainer.data)[event.previousIndex]);
      // this.ListTires[event.previousIndex];
       let ch :string= event.previousContainer.id.substring(0,4);
       let OperationType : number;
       if(ch == "axle"){
         OperationType=3;
       }
       else{
         OperationType=1;
       }

      if (event.container.data.length < 1) {
        //let rest =  this.openAddTireDialog(tire,event.container.id,1);
        let NewData: TireLog;

        NewData = {
          Id: 0,
          Tire: tire.Id,
          OperationDateGmt: null,
          OperationDateLocal: null,
          OperationType: OperationType,
          OperationTypeName: null,
          OperationTypeEnum: 0,
          OperationMileage: 0,
          OperationCost: 0,
          OperationHeightOfTreadWearInMm: 0,
          OperationPressure: 0,
          Car: this.KeyCar,
          AxleNumber: 0,
          AxleNumberEnum: 0,
          WheelPosition: 0,
          WheelPositionEnum: 0,
          WorkOrderNumber: null,
          AccountServiceBy: 0,
          AccountWorkedBy: 0,
          Description: null,
          Comment: null,
          CreatedDate: null,
          CreatedDateLocal: null,
          LastEditDate: null,
          LastEditDateLocal: null,
          LastEditAccount: 0,
          Customer: 0
          

        };
        const dialogRef = this.dialog.open(EditAddTireLogComponent, {
          panelClass: 'custom-dialog-container',
          // tslint:disable-next-line: max-line-length
          data: NewData

        });
        dialogRef.afterClosed().subscribe(result => {
          if (!result) {
            

          }
          else{
          //console.log(result);
          result.OperationDateGmt = new Date(result.OperationDateGmt);
          this._TireManagementService.AddTireLog(result).subscribe((row: TireLog) => {
            if(OperationType==1)
            {
              this.TireMount(tire, event.container.id);

            }
            else{
              this.TireRotation(tire,event.container.id);
            }

            
            transferArrayItem(event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex);



          });
        }


        });






      }
    }
  }


  applyfilter() { }
  onDragStart(ev) {
  
    ev.dataTransfer.setData("text", ev.target.id);
  }
  onDrop(ev) {
    
    ev.preventDefault();
    ev.stopPropagation();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }
  dropp(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.ListTires, event.previousIndex, event.currentIndex);
  }
  dropb(event: CdkDragDrop<string[]>) {
  
    // console.log(this.ListTires1)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  onDragOver(ev) {
    ev.preventDefault();
    ev.stopPropagation();
  }
  TireMount(tire: TireManagement, IdPos: string) {

    let CurrentInstalledAxleNbr: number = 0;
    let CurrentInstalledWheelEnum: number = 0;
    switch (IdPos) {
      case "axle1LOut":
        CurrentInstalledAxleNbr = 1;
        CurrentInstalledWheelEnum = 1;
        break;
      case "axle1LIn":
        CurrentInstalledAxleNbr = 1;
        CurrentInstalledWheelEnum = 0
        break;
      case "axle1RIn":
        CurrentInstalledAxleNbr = 1;
        CurrentInstalledWheelEnum = 2
        break;
      case "axle1ROut":
        CurrentInstalledAxleNbr = 1;
        CurrentInstalledWheelEnum = 3
        break;
      case "axle2LOut":
        CurrentInstalledAxleNbr = 2;
        CurrentInstalledWheelEnum = 1;
        break;
      case "axle2LIn":
        CurrentInstalledAxleNbr = 2;
        CurrentInstalledWheelEnum = 0
        break;
      case "axle2RIn":
        CurrentInstalledAxleNbr = 2;
        CurrentInstalledWheelEnum = 2
        break;
      case "axle2ROut":
        CurrentInstalledAxleNbr = 2;
        CurrentInstalledWheelEnum = 3
        break;
      case "axle3LOut":
        CurrentInstalledAxleNbr = 3;
        CurrentInstalledWheelEnum = 1;
        break;
      case "axle3LIn":
        CurrentInstalledAxleNbr = 3;
        CurrentInstalledWheelEnum = 0
        break;
      case "axle3RIn":
        CurrentInstalledAxleNbr = 3;
        CurrentInstalledWheelEnum = 2
        break;
      case "axle3ROut":
        CurrentInstalledAxleNbr = 3;
        CurrentInstalledWheelEnum = 3
        break;
      case "axle4LOut":
        CurrentInstalledAxleNbr = 4;
        CurrentInstalledWheelEnum = 1;
        break;
      case "axle4LIn":
        CurrentInstalledAxleNbr = 4;
        CurrentInstalledWheelEnum = 0
        break;
      case "axle4RIn":
        CurrentInstalledAxleNbr = 4;
        CurrentInstalledWheelEnum = 2
        break;
      case "axle4ROut":
        CurrentInstalledAxleNbr = 4;
        CurrentInstalledWheelEnum = 3
        break;
      case "axle5LOut":
        CurrentInstalledAxleNbr = 5;
        CurrentInstalledWheelEnum = 1;
        break;
      case "axle5LIn":
        CurrentInstalledAxleNbr = 5;
        CurrentInstalledWheelEnum = 0
        break;
      case "axle5RIn":
        CurrentInstalledAxleNbr = 5;
        CurrentInstalledWheelEnum = 2
        break;
      case "axle5ROut":
        CurrentInstalledAxleNbr = 5;
        CurrentInstalledWheelEnum = 3
        break;
      case "axle6LOut":
        CurrentInstalledAxleNbr = 6;
        CurrentInstalledWheelEnum = 1;
        break;
      case "axle6LIn":
        CurrentInstalledAxleNbr = 6;
        CurrentInstalledWheelEnum = 0
        break;
      case "axle6RIn":
        CurrentInstalledAxleNbr = 6;
        CurrentInstalledWheelEnum = 2
        break;
      case "axle6ROut":
        CurrentInstalledAxleNbr = 6;
        CurrentInstalledWheelEnum = 3
        break;
    }
    this._TireManagementService.TireMount(tire.Id, this.KeyCar, CurrentInstalledAxleNbr, CurrentInstalledWheelEnum).subscribe((row: TireManagement) => {
      let testMount = row;
    });
  }
  TireRotation(tire: TireManagement, IdPos: string) {

    let CurrentInstalledAxleNbr: number = 0;
    let CurrentInstalledWheelEnum: number = 0;
    switch (IdPos) {
      case "axle1LOut":
        CurrentInstalledAxleNbr = 1;
        CurrentInstalledWheelEnum = 1;
        break;
      case "axle1LIn":
        CurrentInstalledAxleNbr = 1;
        CurrentInstalledWheelEnum = 0
        break;
      case "axle1RIn":
        CurrentInstalledAxleNbr = 1;
        CurrentInstalledWheelEnum = 2
        break;
      case "axle1ROut":
        CurrentInstalledAxleNbr = 1;
        CurrentInstalledWheelEnum = 3
        break;
      case "axle2LOut":
        CurrentInstalledAxleNbr = 2;
        CurrentInstalledWheelEnum = 1;
        break;
      case "axle2LIn":
        CurrentInstalledAxleNbr = 2;
        CurrentInstalledWheelEnum = 0
        break;
      case "axle2RIn":
        CurrentInstalledAxleNbr = 2;
        CurrentInstalledWheelEnum = 2
        break;
      case "axle2ROut":
        CurrentInstalledAxleNbr = 2;
        CurrentInstalledWheelEnum = 3
        break;
      case "axle3LOut":
        CurrentInstalledAxleNbr = 3;
        CurrentInstalledWheelEnum = 1;
        break;
      case "axle3LIn":
        CurrentInstalledAxleNbr = 3;
        CurrentInstalledWheelEnum = 0
        break;
      case "axle3RIn":
        CurrentInstalledAxleNbr = 3;
        CurrentInstalledWheelEnum = 2
        break;
      case "axle3ROut":
        CurrentInstalledAxleNbr = 3;
        CurrentInstalledWheelEnum = 3
        break;
      case "axle4LOut":
        CurrentInstalledAxleNbr = 4;
        CurrentInstalledWheelEnum = 1;
        break;
      case "axle4LIn":
        CurrentInstalledAxleNbr = 4;
        CurrentInstalledWheelEnum = 0
        break;
      case "axle4RIn":
        CurrentInstalledAxleNbr = 4;
        CurrentInstalledWheelEnum = 2
        break;
      case "axle4ROut":
        CurrentInstalledAxleNbr = 4;
        CurrentInstalledWheelEnum = 3
        break;
      case "axle5LOut":
        CurrentInstalledAxleNbr = 5;
        CurrentInstalledWheelEnum = 1;
        break;
      case "axle5LIn":
        CurrentInstalledAxleNbr = 5;
        CurrentInstalledWheelEnum = 0
        break;
      case "axle5RIn":
        CurrentInstalledAxleNbr = 5;
        CurrentInstalledWheelEnum = 2
        break;
      case "axle5ROut":
        CurrentInstalledAxleNbr = 5;
        CurrentInstalledWheelEnum = 3
        break;
      case "axle6LOut":
        CurrentInstalledAxleNbr = 6;
        CurrentInstalledWheelEnum = 1;
        break;
      case "axle6LIn":
        CurrentInstalledAxleNbr = 6;
        CurrentInstalledWheelEnum = 0
        break;
      case "axle6RIn":
        CurrentInstalledAxleNbr = 6;
        CurrentInstalledWheelEnum = 2
        break;
      case "axle6ROut":
        CurrentInstalledAxleNbr = 6;
        CurrentInstalledWheelEnum = 3
        break;
    }
    this._TireManagementService.TireRotation(tire.Id, CurrentInstalledAxleNbr, CurrentInstalledWheelEnum).subscribe((row: TireManagement) => {
      let testMount = row;
    });
  }

  openAddTireDialog(tire: TireManagement, IdPos: string, OperationType: number): boolean {
    // const dialogConfig = new MatDialogConfig();
    let NewData: TireLog;
    let rest = false;
    NewData = {
      Id: 0,
      Tire: tire.Id,
      OperationDateGmt: null,
      OperationDateLocal: null,
      OperationType: OperationType,
      OperationTypeName: null,
      OperationTypeEnum: 0,
      OperationMileage: 0,
      OperationCost: 0,
      OperationHeightOfTreadWearInMm: 0,
      OperationPressure: 0,
      Car: this.KeyCar,
      AxleNumber: 0,
      AxleNumberEnum: 0,
      WheelPosition: 0,
      WheelPositionEnum: 0,
      WorkOrderNumber: null,
      AccountServiceBy: 0,
      AccountWorkedBy: 0,
      Description: null,
      Comment: null,
      CreatedDate: null,
      CreatedDateLocal: null,
      LastEditDate: null,
      LastEditDateLocal: null,
      LastEditAccount: 0,
      Customer: 0
      

    };
    const dialogRef = this.dialog.open(EditAddTireLogComponent, {
      panelClass: 'custom-dialog-container',
      // tslint:disable-next-line: max-line-length
      data: NewData

    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        rest = false;
      }
      //console.log(result);
      result.OperationDateGmt = new Date(result.OperationDateGmt);
      this._TireManagementService.AddTireLog(result).subscribe((row: TireLog) => {
        if (OperationType == 1) {
          this.TireMount(tire, IdPos);
          rest = true;
        }
        else {
          this._TireManagementService.TireDismount(tire.Id).subscribe((row: TireManagement) => {
            rest = true;

          })
        }


      });

    });
    return rest;
  }


}
function json2array(json) {
  var result = [];
  var keys = Object.keys(json);
  keys.forEach(function (key) {
    result.push(json[key]);
  });
  return result;
}


