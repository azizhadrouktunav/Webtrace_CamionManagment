export class ItemFlatNode {
  constructor(
    public expandable: boolean,
    public id: number,
    public name: string,
    public level: number) { }
}
export class ItemNode {
  id: number;
  name: string;
  children: ItemNode[];

  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}
import { Component, Injectable, Inject } from '@angular/core';
import { of as ofObservable, Observable, BehaviorSubject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar, MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { TreeBuilder } from '../tree/tree-builder';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { of as observableOf } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { AdministrationService } from '../administration.service';
import { DataService } from '../data.service';

import { TranslateService } from '@ngx-translate/core';
import { json2array } from 'app/main/helpers/must-match.validator';
import { passwordMatchValidator } from 'app/main/helpers/password-validator';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-accountpopup',
  templateUrl: './accountpopup.component.html',
  styleUrls: ['./accountpopup.component.scss'],
  providers: [TreeBuilder]

})
export class AccountpopupComponent {
  myForm: FormGroup
  step = 0;
  action: any;
  dialogTitle: string;
  formdata: any;
  confirmDialogRef: any;
  Id: number;
  disabled = false;
  passwordsDoNotMatch: boolean;
  treeControl: FlatTreeControl<ItemFlatNode>;
  treeFlattener: MatTreeFlattener<ItemNode, ItemFlatNode>;
  dataSource: MatTreeFlatDataSource<ItemNode, ItemFlatNode>;
  IdChoice:number;
  /** The selection for checklist */
  checklistSelection = new SelectionModel<ItemFlatNode>(true /* multiple */);
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<ItemFlatNode, ItemNode>();

  show: boolean;
  DepartmentList: any;
  SpecialityList: any;
  dataacount: any;
  selected: ItemFlatNode[];
  data: any;
  ViewAllTrackingObkjects: string="";
  test = [];
  isDisabled: boolean;
  defaultpassword: string;
  accessAdmin: boolean;
  accessSuivi: boolean;
  accessParc: boolean;
  access: any[];
  AccessRights = [];
  errorMatcher: any;
  filteredOptions: Observable<string[]>;
  filteredSpeciality: Observable<string[]>;
  selectedDeps: any[] = [];
  selectedSpes: any[] = [];
  Dep = [];
  trackingObjects = [];
  SpecialityDataSource=[];
  displayValue: string = "";
  displaySpecValue: string = "";
  lastFilter: string = '';
  lastFilterSpeciality: string = '';
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  constructor(
    public dialogRef: MatDialogRef<AccountpopupComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _administrationService: AdministrationService,
    private _snackBar: MatSnackBar,
    private _database: TreeBuilder,
    private _dataService: DataService,
    private translateService: TranslateService,
    private _errorHandler: ErrorHandlerService
  ) {

    this.translateService.get(['NAV.Loginexist', 'NAV.maxAccountIsAcheived', 'NAV.lbModifyAccount', 'NAV.lbAddAccount'])
      .subscribe(data => { this.data = data }
      );
    this.action = _data.action;
    this.formdata = _data.item;
    this.DepartmentList = _data.Department;
    this.SpecialityList = _data.ListSpeciality;
    // add selected option to the department list

    this.SpecialityList.forEach(element => {

      if (this.formdata != undefined && this.formdata.AccessSpeciality != undefined && this.formdata.AccessSpeciality.length > 0) {
        this.SpecialityDataSource.push({ 'key': element.Id, 'value': element.Name,  'selected': this.formdata.AccessSpeciality.map((dp) => dp.Id).indexOf(element.Id) > -1 });
      }
      else {
        this.SpecialityDataSource.push({ 'key': element.Id, 'value': element.Name,  'selected': false });
      }
    });

     this.DepartmentList.forEach(element => {

      if (this.formdata != undefined && this.formdata.AccessDepartment != undefined && this.formdata.AccessDepartment.length > 0) {
        this.trackingObjects.push({ 'key': element.Id, 'value': element.FullName, 'selectBy': 'car', 'selected': this.formdata.AccessDepartment.map((dp) => dp.Id).indexOf(element.Id) > -1 });
      }
      else {
        this.trackingObjects.push({ 'key': element.Id, 'value': element.FullName, 'selectBy': 'car', 'selected': false });
      }
    });
    if (this.action === 'add') {
      this.dialogTitle = this.data["NAV.lbAddAccount"];
      this.formdata =
        _data.action
      this.isDisabled = false;
      this.defaultpassword = ""
      this.ViewAllTrackingObkjects = "1";
    }


    else {
      this.dialogTitle = this.data["NAV.lbModifyAccount"];
      this.disabled = true;
      this.isDisabled = true;
      this.defaultpassword = "org2018"
      this.access = json2array(this.formdata.hashPageAccesible);
      this.access.forEach(element => {
        if (element.AccessRight == true) {
          this.AccessRights.push(element.Page);
        }
      });
    }
    this.test = [];

    //this.test = this.formdata.AccessDepartment;

    this.myForm = this.createForm();
    this.myForm.setValidators(this.createDepValidator())
    this.dataacount = _data.Accountlist;

    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<ItemFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    _database.dataChange.subscribe(data => this.dataSource.data = data);

    this.AccessRights.forEach(element => {
      for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
        if (this.treeControl.dataNodes[i].id == element) {
          this.todoItemSelectionToggle(this.treeControl.dataNodes[i]);
          this.treeControl.expand(this.treeControl.dataNodes[i])
        }

      }
    });
    this.filteredOptions = this.myForm.get('Department').get('AccessDepartment').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : this.lastFilter),
      map(filter => this._filter(filter))
      // map(text => this._filter(text), this.DepartmentList)
    );
     this.filteredSpeciality = this.myForm.get('Department').get('AccessSpeciality').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : this.lastFilterSpeciality),
      map(filter => this._filterSpeciality(filter))
      // map(text => this._filter(text), this.DepartmentList)
    ); 
  }
  private _filterSpeciality(spec) {
         this.lastFilterSpeciality=spec;
         let specName='';
         
         if(spec=='')
         {
          specName =spec.value || spec;
          return this.SpecialityDataSource.filter(sp=>sp.value.toLowerCase().indexOf(specName.toLowerCase())>=0);
         }
         else
         {
            if(spec.includes(','))
            {
               let splitedArrays = spec.split(','); 
               specName =splitedArrays[splitedArrays.length - 1];
            }
            else
            {
               specName = spec[0].value || spec;
            }
             return this.SpecialityDataSource.filter(sp =>
                sp.value.toLowerCase().indexOf(specName.toLowerCase()) >= 0);
         }
  }
  private _filter(txt) {
    this.lastFilter = txt;



    let depName;

    if (txt == '') {
      depName = txt.value || txt;
      return this.trackingObjects.filter(car =>
        car.value.toLowerCase().indexOf(depName.toLowerCase()) >= 0);
    } else {
      if (txt.includes(',')) {
        let splitedArrays = txt.split(',');
        depName = splitedArrays[splitedArrays.length - 1];
      }
      else {
        depName = txt[0].value || txt;
      }
      return this.trackingObjects.filter(car =>
        car.value.toLowerCase().indexOf(depName.toLowerCase()) >= 0);
    }
    // console.log(txt);
    //     return this.DepartmentList.filter(dep => dep.FullName.includes(txt));
    //return this.DepartmentList.filter(driverL =>
    //driverL.FullName.includes(driver));
  }
  optionClicked(event: Event, dep) {
    event.stopPropagation();
    this.toggleSelection(dep);
  }
  optionClickedSpec(event: Event, spec) {
    event.stopPropagation();
    this.toggleSelectionSpec(spec);
  }
  displayDep(value) {
    this.Dep = [];
    if (Array.isArray(value)) {
      this.displayValue = '';
      value.forEach((v, index) => {
        if (index === 0) {
          this.displayValue = v.value == undefined ? v.Name + ',' : v.value + ',';
          //this.Cars.push(v.Key);
        } else {
          this.displayValue += v.value == undefined ? v.Name + ',' : v.value + ',';
          //this.Cars.push(v.Key);
        }
      });
      return this.displayValue;
    } else {
      return this.displayValue;
    }
  }

   displaySpec(value) {
    this.Dep = [];
    if (Array.isArray(value)) {
      this.displaySpecValue = '';
      value.forEach((v, index) => {
        if (index === 0) {
          this.displaySpecValue = v.value == undefined ? v.Name + ',' : v.value + ',';
          //this.Cars.push(v.Key);
        } else {
          this.displaySpecValue += v.value == undefined ? v.Name + ',' : v.value + ',';
          //this.Cars.push(v.Key);
        }
      });
      return this.displaySpecValue;
    } else {
      return this.displaySpecValue;
    }
  }
  toggleSelection(car) {

    car.selected = !car.selected;
    if (car.selected) {
      this.selectedDeps.push(car);
    }
    else {


      const i = this.selectedDeps.findIndex(value => value.key === car.key);
      this.selectedDeps.splice(i, 1);


    }
    this.myForm.get('Department').get('AccessDepartment').setValue(this.selectedDeps);

  }
   toggleSelectionSpec(spec) {

    spec.selected = !spec.selected;
    if (spec.selected) {
      this.selectedSpes.push(spec);
    }
    else {


      const i = this.selectedSpes.findIndex(value => value.key === spec.key);
      this.selectedSpes.splice(i, 1);


    }
    this.myForm.get('Department').get('AccessSpeciality').setValue(this.selectedSpes);

  }
  transformer = (node: ItemNode, level: number) => {
    return new ItemFlatNode(!!node.children, node.id, node.name, level);
  }
  private _getLevel = (node: ItemFlatNode) => node.level;

  private _isExpandable = (node: ItemFlatNode) => node.expandable;

  private _getChildren = (node: ItemNode): Observable<ItemNode[]> => observableOf(node.children);

  hasChild = (_: number, _nodeData: ItemFlatNode) => _nodeData.expandable;

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: ItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: ItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: ItemFlatNode): void {

    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);

    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  hide = true;

  compareWithFunc(a, b) {
    return a && b.Id ? a === b.Id : a === b;

  }
  createForm(): FormGroup {

    let AccessDepartment = [];
    let AccessSpeciality=[];
    //AccessDepartment = this.formdata.AccessDepartment;
    if (this.formdata.AccessDepartment != undefined && this.formdata.AccessDepartment.length > 0) {
      // 
      this.formdata.AccessDepartment.forEach(element => {
        AccessDepartment.push({ 'key': element.Id, 'value': element.FullName, 'selectBy': 'car', 'selected': true });
        this.selectedDeps.push({ 'key': element.Id, 'value': element.FullName, 'selectBy': 'car', 'selected': true });
      });
    }

      if (this.formdata.AccessSpecialities != undefined && this.formdata.AccessSpecialities.length > 0) {
      // 
      this.formdata.AccessSpecialities.forEach(element => {
        AccessSpeciality.push({ 'key': element.Id, 'value': element.Name,  'selected': true });
        this.selectedSpes.push({ 'key': element.Id, 'value': element.Name, 'selected': true });
      });
    }
    if (this.action === 'add') {
      this.ViewAllTrackingObkjects = "1";
      this.show = false;
    }
    else 
      {
        if (!this.formdata.ViewAllTrackingObjects) {
        if(!this.formdata.ViewDepartmentOrSpecialty)
        {
            this.ViewAllTrackingObkjects = "2";
            this.IdChoice=2;
        }
          else
          {
             this.ViewAllTrackingObkjects = "3";
             this.IdChoice=3
          }
        this.show = true;
      }
      else { this.ViewAllTrackingObkjects = "1"; }
     /*  if (!this.formdata.ViewAllTrackingObjects) {
        this.ViewAllTrackingObkjects = "2";
        this.show = true;
      }
      else { this.ViewAllTrackingObkjects = "1"; } */
    }


    return new FormGroup({
      User: new FormGroup({
        Login: new FormControl(this.formdata.Login, [Validators.required]),
        FirstName: new FormControl(this.formdata.FirstName),
        LastName: new FormControl(this.formdata.LastName)

      }),
      Password: new FormGroup({
        password: new FormControl(this.defaultpassword, [Validators.required, Validators.minLength(6)]),
        verifyPassword: new FormControl(this.defaultpassword, [Validators.required, Validators.minLength(6),
        passwordMatchValidator('password')
        ])


      }
      ),
      Department: new FormGroup({
        AccessDepartment: new FormControl(AccessDepartment),
        AccessSpeciality: new FormControl(AccessSpeciality),
        ViewAllTrackingObkjects: new FormControl(this.ViewAllTrackingObkjects, [Validators.required])
      }),
      Access: new FormGroup({

      })
    });

  }
  ValidationDep2(control: AbstractControl)
  {
    let {  value } = control;
 
    if(value.length>0)
      {
        
        return null;
      }
    
    else
    {
      return{ "ViewAllTrackingObkjects": true   }
     
    }
  }
   createDepValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      let DepartmentForm:FormGroup;
      DepartmentForm= group.controls["Department"] as FormGroup;
      const ViewAllTrackingObkjectsC=DepartmentForm.controls["ViewAllTrackingObkjects"];
      const AccessDepartmentC=DepartmentForm.controls["AccessDepartment"];
      if(DepartmentForm.controls["ViewAllTrackingObkjects"].value=="1")
        {
          ViewAllTrackingObkjectsC.setErrors(null);
          AccessDepartmentC.setErrors(null);
        }
        else
        {
         
          if(AccessDepartmentC.value.length>0)
            {
              AccessDepartmentC.setErrors(null);
            }
            else
            {
              AccessDepartmentC.setErrors({AccessDepartment: true});
            }
        }
     
      return;
};
}

  onSubmit() {
    
      if (this.action === 'add') {

       this._administrationService.IsLoginExiste(this.myForm.value.User.Login)
         .subscribe((data: any[]) => {
           if (!data) {
             this._administrationService.IsMaxAllowedAccountAchieved().subscribe((data: any[]) => {

               if (!data) {

                 let result = [];
                 this.selected = this.checklistSelection.selected;
                 this.selected.forEach(element => {
                   if (!isNullOrUndefined(element.id)) {
                     result.push(element.id);
                   }
                 });
                 this._dataService.sendParams(result);
                 this.dialogRef.close(this.myForm.value);
               }
               else {
                 this._snackBar.open(this.data["NAV.maxAccountIsAcheived"], '', {
                   duration: 5000,
                   // here specify the position
                   verticalPosition: 'top',
                   horizontalPosition: 'right'
                 });
               }
             },
               (err: HttpErrorResponse) => {
                 //this.errorHandler.handleError(error);.handleError(err);
               });
           }
           else {
             this._snackBar.open(this.data["NAV.Loginexist"], '', {
               duration: 5000,
    //           // here specify the position
               verticalPosition: 'top',
               horizontalPosition: 'right'
             });
           }
         },
           (err: HttpErrorResponse) => {
             //this.errorHandler.handleError(error);.handleError(err);
           });
     }

     else {
       let result = [];
       this.selected = this.checklistSelection.selected;
       this.selected.forEach(element => {
         if (!isNullOrUndefined(element.id)) {
           result.push(element.id);
         }
       });
       this._dataService.sendParams(result);
       this.dialogRef.close(this.myForm.value);
     } 
  }

  onClose() {

    this.dialogRef.close();
  }


  radioChange(e) {
    if (e.value == 1) { this.show = false; }
    else { this.show = true; }
   /*  let t= this.ViewAllTrackingObkjects;
    let s= this.myForm; */
    this.IdChoice= e.value;

    /* if (e.value == 1) { this.show = false; }
    else { this.show = true; }
    let t= this.ViewAllTrackingObkjects;
    let s= this.myForm; */
  }
}


