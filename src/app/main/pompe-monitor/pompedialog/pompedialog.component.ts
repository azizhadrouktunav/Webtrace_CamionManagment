import { ViewEncapsulation } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { uniqueValidator } from 'app/main/helpers/validators/uniqueName';
import { Fuel } from 'app/main/parc/tank/model';
import { isNullOrUndefined } from 'util';


@Component({
  selector: 'app-pompedialog',
  templateUrl: './pompedialog.component.html',
  styleUrls: ['./pompedialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PompedialogComponent implements OnInit {

    action: string;
    pompe: any;
    pompeForm: FormGroup;
    dialogTitle: string;
    fuelOptions = Fuel;
  pompistes: any;
    /**
     * Constructor
     *
     * @param {MatDialogRef<MobilepompeformdialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<PompedialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _TranslateService: TranslateService
    )
    {
        this.pompistes = _data.pompistes;
        // Set the defaults
        this.action = _data.action;
       
        if ( this.action === 'edit' )
        {

            this._TranslateService.get('NAV.Editpompe').subscribe(result => {
            
                this.dialogTitle = result;
              });
         
            
            this.pompe = _data.Pompe;
        }
        else
        {

            this._TranslateService.get('NAV.Addpompe').subscribe(result => {
            
                this.dialogTitle = result;
              });
           
            this.pompe = {};
        }

        this.pompeForm = this.createpompeForm();
      
    }
    ngOnInit() :void {

         
         
       }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create pompe form
     *
     * @returns {FormGroup}
     */
    createpompeForm(): FormGroup
    {
        return this._formBuilder.group({
            id      : [this.pompe.Id],
            name    : [this.pompe.Name ,[Validators.required]],
            pompiste  : [!isNullOrUndefined(this.pompe.GasStationAttendant) ? this.pompistes.find(i => i.LastName === this.pompe.GasStationAttendant.LastName).Id : 0],
            equipment: [this.pompe.Equipment]
        });
    }

}
