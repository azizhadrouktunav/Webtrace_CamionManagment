import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Mission, StatusMission } from '../model';

@Component({
  selector: 'app-verify-status-dialog',
  templateUrl: './verify-status-dialog.component.html',
  styleUrls: ['./verify-status-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VerifyStatusDialogComponent{

  action: string;
  missionForm: FormGroup;
  dialogTitle: string;
  mission:Mission;
  StatusMission : string;
  EstimatedTotalFuelConsumed: number;
  RealTotalFuelConsumed: number;
  /**
     * Constructor
     *
     * @param {MatDialogRef<VerifyStatusDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
  constructor(
    public matDialogRef: MatDialogRef<VerifyStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder)
    {
      this.dialogTitle = 'Other informations';
      //this.mission = _data.mission;
      this.StatusMission = StatusMission[_data.status];
      this.EstimatedTotalFuelConsumed = _data.mission.EstimatedTotalFuelConsumed;
      this.RealTotalFuelConsumed = _data.realTotalFuelConsumed;

     //this.missionForm = this.createVerifyStatus();
    }
// -----------------------------------------------------------------------------------------------------
// @ Public methods
// -----------------------------------------------------------------------------------------------------

    /**
     * Create the verify status form
     *
     * @returns {FormGroup}
     */
    /*
     EstimatedTotalFuelConsumed: number; // Totale carburant consommé estimé(l)
    RealTotalFuelConsumed: number; // Totale carburant consommé réel(l)
    */
  /*createVerifyStatus(): FormGroup {
        return new FormGroup({
          StatusMission:  new FormControl({value: this.mission.StatusMissionStr , disabled: true }),
          EstimatedTotalFuelConsumed : new FormControl({value: this.mission.EstimatedTotalFuelConsumed, disabled: true}),
          RealTotalFuelConsumed : new FormControl({value: this.mission.RealTotalFuelConsumed, disabled: true})
          
        })
  }*/

}
