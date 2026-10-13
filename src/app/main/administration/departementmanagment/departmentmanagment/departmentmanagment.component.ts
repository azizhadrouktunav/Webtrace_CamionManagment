import {ArrayDataSource} from '@angular/cdk/collections';
import {Component} from '@angular/core';
import {NestedTreeControl, FlatTreeControl} from '@angular/cdk/tree';
import { decrypt } from 'app/main/parc/Parc';
import { Subscription, Subject } from 'rxjs';
import { DepartmentService } from '../department.service';
import { MatTreeFlattener, MatTreeFlatDataSource, MatSnackBar, MatDialog, MatTableDataSource } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { DepartmentpopupComponent } from '../departmentpopup/departmentpopup.component';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { TranslateService } from '@ngx-translate/core';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { DepartmenttransfertComponent } from '../departmenttransfert/departmenttransfert.component';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Food data with nested structure.
 * Each node has a name and an optiona list of children.
 */
interface Node {
  Name: string;
  children?: Node[];
}

interface FoodNode {
  Name: string;
  Id : number;
  car?: number;
  children?: FoodNode[];
}



interface ExampleFlatNode {
  expandable: boolean;
  Name: string;
  Id : number;
  car: number;
  level: number;
}


/**
 * @title Tree with nested nodes
 */
@Component({
  selector: 'app-departmentmanagment',
  templateUrl: './departmentmanagment.component.html',
  styleUrls: ['./departmentmanagment.component.scss']
})
export class DepartmentmanagmentComponent {
 // treeControl = new NestedTreeControl<Node> (node => node.children);
  

  //hasChild = (_: number, node: Node) => !!node.children && node.children.length > 0;
  listDep: any;
  listParam: string;
  //dataSource: ArrayDataSource<any>;
  subscription: Subscription;
  searchkey:string;
  disabled:any;
  tableColumns: string[] = ['name', 'car', 'actions'];
  destroy: Subject<boolean> = new Subject<boolean>();

  private transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      Name: node.Name,
      Id : node.Id,
      car: node.car,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this.transformer, node => node.level, 
      node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  listCar: any;
  data: any;
  element: any;

  constructor(private _DepartmentService : DepartmentService,
    private translateService: TranslateService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private _errorHandler: ErrorHandlerService) {

      
  }
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit() {
    this.subscription = this._DepartmentService.getDepartmentManagementParam()
      .subscribe((result) => {
    
    this.listParam = decrypt(result["GetUIDepartmentManagementParamCompressedResult"]);

    this.listDep= this.listParam["ListDepartment"];
    this.listCar= this.listParam["DicoTrackingObject"];

   
   // this.dataSource = new ArrayDataSource(unflatten( this.listDep));
   this.dataSource.data = unflatten( this.listDep, Object.values(this.listCar));
  },
  (err: HttpErrorResponse) => {
    //this.errorHandler.handleError(error);.handleError(err);
  });
    
  this.translateService.get(['NAV.DepIsAdded', 'NAV.DepIsEdited', 'NAV.DepIsRemoved', 'NAV.msgDeleteDepartment'])
  .subscribe(data => { this.data = data }
  );
  }
  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }
  
  filterChanged(filterText: string) {
    this.filter(filterText);
    if(filterText)
    {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
  }
  public filter(filterText: string) {
    let filteredTreeData;
    if (filterText) {
      filteredTreeData = this.dataSource.data.filter(d => d.Name.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1);
      
      this.dataSource.data = unflatten( filteredTreeData, Object.values(this.listCar));

    } else {
      this.dataSource.data = unflatten( this.listDep, Object.values(this.listCar));
    }
  
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    // file node as children.
    //const data = this.buildFileTree(filteredTreeData, '0');
    // Notify the change.

  }
  adddepartment(): void {
    const dialogRef = this._dialog.open(DepartmentpopupComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        action: 'add',
        Department: this.listDep,
        data : ''

      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (!result) {
        return;
      }
    
      this._DepartmentService.AddDepartmentByName(result).pipe(takeUntil(this.destroy))
      .subscribe((data: any[]) => {

          if (data !== null) {
         
           this.listDep.push(data["AddDepartmentByNameResult"]);
           this.dataSource.data = unflatten( this.listDep, Object.values(this.listCar));

            this._snackBar.open(this.data['NAV.DepIsAdded'], 'OK', {
              // here specify the position
              verticalPosition: 'bottom',
              horizontalPosition: 'right' ,
              duration  : 2000
               })
          }
          else{
            // Show the failure message
            this._snackBar.open('Server is Not Responding', 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration        : 2000
            });
      }
       
      },
      (err: HttpErrorResponse) => {
        //this.errorHandler.handleError(error);.handleError(err);
      });
    });
  }
  editdepartment(item): void {
    this.element =  this.listDep.find(x => x.Id == item.Id);

    const dialogRef = this._dialog.open(DepartmentpopupComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        action: 'edit',
        Department: this.listDep,
        data : this.element

      }
    });
    
    dialogRef.afterClosed().subscribe(result => {

      if (!result) {
        return;
      }
    
      this._DepartmentService.UpdateDepartment(result[1],item.Id)
      .pipe(takeUntil(this.destroy)).subscribe((data: any[]) => {

          if (data !== null) {
         
          // this.listDep.push(data["AddDepartmentByNameResult"]);
          this.element =  this.listDep.find(x => x.Id == item.Id);
          const Index = this.listDep.indexOf(this.element);   
          this.listDep.splice(Index, 1, data["UpdateDepartmentResult"]);

           this.dataSource.data = unflatten( this.listDep, Object.values(this.listCar));

            this._snackBar.open(this.data['NAV.DepIsEdited'], 'OK', {
              // here specify the position
              verticalPosition: 'bottom',
              horizontalPosition: 'right' ,
              duration  : 2000
               })
          }
          else{
            // Show the failure message
            this._snackBar.open('Server is Not Responding', 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration        : 2000
            });
      }
       
      },
      (err: HttpErrorResponse) => {
        //this.errorHandler.handleError(error);.handleError(err);
      });
    });
  }
  deleteDepartement(item) {
    const dialogRef = this._dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    dialogRef.componentInstance.confirmMessage = this.data['NAV.msgDeleteDepartment'];
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {

         
            const dialogRef = this._dialog.open(DepartmenttransfertComponent, {
              panelClass: 'custom-dialog-container',
              data: {
                Department: this.listDep
              }
            });
        
            dialogRef.afterClosed().subscribe(result => {
        
              if (!result) {
                return;
              }
             
              this._DepartmentService.DeleteDepartment(result.transfert,result.Department,item.Id)
              .pipe(takeUntil(this.destroy)).subscribe((data: any[]) => {
        
                  if (data["DeleteDepartmentResult"] == true) {
                  
                 
                  this.element =  this.listDep.find(x => x.Id == item.Id);

                  const Index = this.listDep.indexOf(this.element);
                     this.listDep.splice(Index, 1);

                 this.dataSource.data = unflatten( this.listDep, Object.values(this.listCar));
        
                    this._snackBar.open(this.data['NAV.DepIsRemoved'], 'OK', {
                      // here specify the position
                      verticalPosition: 'bottom',
                      horizontalPosition: 'right' ,
                      duration  : 2000
                       })
                  }
                  else{
                    // Show the failure message
                    this._snackBar.open('Server is Not Responding', 'OK', {
                    // here specify the position
                    verticalPosition: 'bottom',
                    horizontalPosition: 'right',
                    duration        : 2000
                    });
              }
               
              },
         (err: HttpErrorResponse) => {
               //this.errorHandler.handleError(error);.handleError(err);
            });
        
        });
      }
    })
  }
  applyfilter(){}
}
function unflatten(arr,listCar) {
  
  var tree = [],
      mappedArr = {},
      arrElem,
      mappedElem;

  // First map the nodes of the array to an object -> create a hash table.
  for(var i = 0, len = arr.length; i < len; i++) {
    arrElem = arr[i];
    mappedArr[arrElem.Id] = arrElem;
    mappedArr[arrElem.Id]['children'] = [];
  }


  for (var id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      // If the element is not at the root level, add it to its parent array of children.
      if (mappedElem.ParentDep) {
        let cars =[];
        if( !isNullOrUndefined(mappedElem.ListIdTrackingObj))
        {mappedElem.ListIdTrackingObj.forEach(e=>{
          Object.keys(listCar).map(function(key, index) {
            
            if(e==listCar[index].Key)
            {cars.push(listCar[index].FullName);}

          });
          
        });}
        mappedElem = Object.assign({car : cars
        },mappedElem); 
        mappedArr[mappedElem['ParentDep']]['children'].push(mappedElem);
      
      }
      // If the element is at the root level, add it to first level elements array.
      else {
        let cars =[];
        let c;
        if( !isNullOrUndefined(mappedElem.ListIdTrackingObj))
        {mappedElem.ListIdTrackingObj.forEach(e=>{
          listCar.map(function(key, index) {

            if(e==listCar[index].Key)
            {cars.push(listCar[index].FullName);
             
            }

          });
          
        });}
        mappedElem = Object.assign({car : cars
        },mappedElem);    
         tree.push(mappedElem);
        
      }
    }
  }
  return tree;
}