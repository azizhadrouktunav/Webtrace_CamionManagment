import { Component, Inject, ViewEncapsulation, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';

import { RepairMaintenanceLog, TypeMaintenance } from '../../department';
import { RepairsService } from '../repairs.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';
import { isNullOrUndefined, isUndefined } from 'util';
import { Validators_ } from 'app/main/helpers/validators/validators';

@Component({
  selector: 'app-repair-form',
  templateUrl: './repair-form.component.html',
  styleUrls: ['./repair-form.component.scss']
})
export class RepairFormComponent implements OnInit {
  
  action: string;
  repair: RepairMaintenanceLog;
  repairForm: FormGroup;
  dialogTitle: string;
  types: TypeMaintenance[] = [];
  filteredOptions: Observable<string[]>;
  allTypes:string[] = [];
  nameIdMap =  new Map<string, number>();
  showAddButton: boolean = false;
  prompt = 'Press <enter> to add "';
  type:string;
  // disabled type 
  isDisabled: boolean = false;
  show: boolean = true;
  @ViewChild('typeInput' , {read:ElementRef , static:true}) typeInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto'  , {read:String , static:true}) matAutocomplete: MatAutocomplete;
  /**
     * Constructor
     *
     * @param {MatDialogRef<RepairFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
  constructor(
    public matDialogRef: MatDialogRef<RepairFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private repairsService: RepairsService,
  ) {
    this.repair = _data.repair;
    this.action = _data.action;
    if ( this.action === 'edit' )
    {
       this.dialogTitle = 'Update';
    }
    else if(this.action === 'adjust')
    {
      this.isDisabled = true;
      this.dialogTitle = 'Adjust';
    }
    else if(this.action === 'editMaintenance') {
      this.dialogTitle = 'Update Repair';
   
      this.repair = _data.repair;
    }
    else
    {   
      this.dialogTitle = 'Add Repair';
      this.repair = new RepairMaintenanceLog();
    }
    if(!isUndefined(_data.show)) {
      this.show = _data.show
    }
  }
  ngOnInit(){
  
    this.repairForm = this.createRepairForm();

    if(this.action === 'edit') {
      this.repairForm.get('MaintenanceTypeStr').disable();
    }
    this.type = this.repairForm.get('MaintenanceTypeStr').value;

      this.repairsService.getObjectMaintenances().toPromise().then(
        data => {
          this.allTypes = data.map(type => {
            this.nameIdMap.set(type.Object , type.Id);
            return type.Object;
          })    
        }
      ).then(() => {
        this.filteredOptions = this.repairForm.get('MaintenanceTypeStr').valueChanges
        .pipe(
          startWith(''),
          map(value => value ? this._filter(value): this.allTypes.slice())
        );

      })
       
  }
  filterItems(name: string) {
    let results = this.allTypes.filter(item =>
      item.toLowerCase().indexOf(name.toLowerCase()) >= 0);

    this.showAddButton = results.length === 0;
    if (this.showAddButton) {
      results = [this.prompt + name + '"'];
    }

    return results;
  }
  private _filter(value: string): string[]{
    const filterValue = value.toLowerCase();
    let results =  this.allTypes.filter(option => option.toLowerCase().includes(filterValue));
    this.showAddButton = results.length === 0;
    return results
  }
  
  optionSelected(event : Event,option) {
    //event.stopPropagation();
    if (option.value.indexOf(this.prompt) === 0) {
      this.addOption();
    }
    this.repairForm.get('MaintenanceType').setValue(this.nameIdMap.get(option.value));
  }
  addOption() {
    let option = this.repairForm.get('MaintenanceTypeStr').value;
   
    //this.removePromptFromOption(this.repairForm.get('MaintenanceType').value);
    if (!this.allTypes.some(entry => entry === option)) {
      this.repairsService.createTypeMaintenance(option).subscribe(data => {
        this.allTypes.push(data.Object)
        this.nameIdMap.set(data.Object , data.Id);
        const index = this.allTypes.push(option) - 1;
        this.repairForm.get('MaintenanceType').setValue(this.nameIdMap.get(data.Object));
      },
      error => {
        console.info(error);
      })
    }
  }

  removePromptFromOption(option) {
    //if (option.startsWith(this.prompt)) {
      option = option.substring(this.prompt.length, option.length -1);
    //}
    return option;
  }
  changed(e){
    this.repair.MaintenanceType = e.value;
   
  }
  selected(event: MatAutocompleteSelectedEvent): void {
  
    this.repairForm.get('MaintenanceType').setValue(this.nameIdMap.get(event.option.viewValue));
  }
  /**
     * Create the repair form
     *
     * @returns {FormGroup}
     */
    createRepairForm(): FormGroup
    {
        return new FormGroup({
          MaintenanceTypeStr: new FormControl({value: this.repair.MaintenanceTypeStr,disabled: this.isDisabled}), // type d'entreien
          MaintenanceType: new FormControl(this.repair.MaintenanceType), // Id type d'entreien
          DateCompletionGMT: new FormControl(this.repair.DateCompletionGMT), // date d'achévement
          MileageCompletion: new FormControl(this.repair.MileageCompletion, [ Validators_.positiveNumberValidator(), Validators.required]), // kilométrage d'achévement
          EngineHoursCompletion: new FormControl(this.repair.EngineHoursCompletion, [ Validators_.positiveNumberValidator(), Validators.required]), // heures d'achévement
          Cost: new FormControl(this.repair.Cost,  [ Validators_.positiveNumberValidator(), Validators.required]), //Cout
          PaidCost: new FormControl(this.repair.PaidCost, [ Validators_.positiveNumberValidator(), Validators.required]),// Montant payé
          PaidDateLocal: new FormControl(this.repair.PaidDateLocal), // Date de payement 
          Description : new FormControl(this.repair.Description), // Descrition
          InvoiceReference : new FormControl(this.repair.InvoiceReference), // référence facture
          Supplier   : new FormControl(this.repair.Supplier), // fournisseur   
          Id   : new FormControl(this.repair.Id),
          Car   : new FormControl(this.repair.Car),    
        });
    }
    getErrorMessage(control: string) {
      return this.repairForm.controls[control].hasError('required') ? 'You must enter a value' :
          this.repairForm.controls[control].hasError('nonPositive') ? 'The number should be greater than 0' :'';
    }
}
