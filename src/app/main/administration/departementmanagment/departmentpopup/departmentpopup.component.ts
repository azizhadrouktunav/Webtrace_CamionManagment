import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Validators_ } from 'app/main/helpers/validators/validators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-departmentpopup',
  templateUrl: './departmentpopup.component.html',
  styleUrls: ['./departmentpopup.component.scss']
})
export class DepartmentpopupComponent {
  addeditForm: FormGroup;
  action: any;
  dialogTitle: string;
 
  typesEnum: any[];
  data: any;
  showDep: boolean;
  department: any;
  departmentgroup = [];
  type2: string;
  dataTrans: any;

  constructor(private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private _data: any,
              private translateService: TranslateService,
              public matDialogRef: MatDialogRef<DepartmentpopupComponent>)
             { 
              this.translateService.get(['NAV.updateDepartment', 'NAV.addDepartment'])
             .subscribe(data => { this.dataTrans = data }
             );
              this.department = _data.Department;
              this.department.forEach(element => {
                if(element.ParentDep != 0 && element.Type == 1 )
                {
                  this.departmentgroup.push(element);
                }
                
              });
              this.action = _data.action;
              if ( this.action === 'edit' )
              {
                  this.dialogTitle = this.dataTrans["NAV.updateDepartment"];
                  this.data = _data.data;
              }
              else
              {
                this.dialogTitle =this.dataTrans["NAV.addDepartment"];
                this.data = _data.data;
              }
             
              this.addeditForm = this.createdataForm();
             
              }
 /**
     * Create the document form
     *
     * @returns {FormGroup}
     */
    createdataForm(): FormGroup
    {   
          this.type2 = this.data.ParentDep === 0 ?  "0" :  "1";
          this.showDep = this.type2 === "1" ? true : false;
        return new FormGroup({
          Name: new FormControl(this.data.Name, Validators.required),
          type : new FormControl( ""+this.data.Type, Validators.required ),
          type2 : new FormControl( this.type2, Validators.required),
          Parentdep   : new FormControl(this.data.ParentDep)
         
        });
    }
    onSubmit() {

       this.matDialogRef.close(this.addeditForm.value);
            
        }
  
  
    onClose() {
  
      this.matDialogRef.close();
    }

radioChange(e) {

  this.showDep = e.value === "1" ? true : false;

}
}