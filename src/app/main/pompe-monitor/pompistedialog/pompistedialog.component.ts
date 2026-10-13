import { ViewEncapsulation } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { uniqueValidator } from 'app/main/helpers/validators/uniqueName';
import { Fuel } from 'app/main/parc/tank/model';


@Component({
  selector: 'app-pompistedialog',
  templateUrl: './pompistedialog.component.html',
  styleUrls: ['./pompistedialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PompistedialogComponent implements OnInit {

    action: string;
    pompiste: any;
    pompisteForm: FormGroup;
    dialogTitle: string;
    fuelOptions = Fuel;
    departments: any;
    names: string[];
    /**
     * Constructor
     *
     * @param {MatDialogRef<MobilepompisteformdialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<PompistedialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _TranslateService: TranslateService
    )
    {
        this.names = _data.names;
        // Set the defaults
        this.action = _data.action;
       
        if ( this.action === 'edit' )
        {

            this._TranslateService.get('NAV.Editpompiste').subscribe(result => {
            
                this.dialogTitle = result;
              });
         
            
            this.pompiste = _data.pompiste;
        }
        else
        {

            this._TranslateService.get('NAV.Addpompiste').subscribe(result => {
            
                this.dialogTitle = result;
              });
           
            this.pompiste = {};
            //this.pompiste.DepartmentObj = new Departm()
        }

        this.pompisteForm = this.createpompisteForm();
        this.departments = _data.departments;
      
    }
    ngOnInit() :void {

         
         
       }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create pompiste form
     *
     * @returns {FormGroup}
     */
    createpompisteForm(): FormGroup
    {
        return this._formBuilder.group({
            id      : [this.pompiste.Id],
            firstname    : [this.pompiste.FirstName ,[Validators.required, uniqueValidator(this.names)]],
            lastname  : [this.pompiste.LastName],
            CardId: [this.pompiste.CardId]
        });
    }

}
