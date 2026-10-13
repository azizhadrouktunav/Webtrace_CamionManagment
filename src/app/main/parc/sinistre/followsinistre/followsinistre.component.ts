import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatRadioChange } from '@angular/material';
import { AccidentDetailsExtended } from '../../interfaces/accidentdetails';

@Component({
  selector: 'app-followsinistre',
  templateUrl: './followsinistre.component.html',
  styleUrls: ['./followsinistre.component.scss']
})
export class FollowsinistreComponent implements OnInit {
  dialogTitle: string;
  action: any;
  status: any;
  statusavailable: string[] = ['Reglement', 'Contre Expertise'];
  statusSelected: string;
  followForm: any;
  data: any;
  decalarationfollowForm: FormGroup;
  contreexpertisefollowForm: FormGroup;
  reglementfollowForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private _data: any,
              public dialogRef: MatDialogRef<FollowsinistreComponent>)
   { 
    
    this.action = _data.action;
    this.status = '' + _data.status;
    this.data =  _data.data;

    if ( this.status === '1' )
    {   if ( this.action === 'add' )
    {
        this.dialogTitle = 'Expertise';
       
        this.data = new AccidentDetailsExtended({
          action: _data.action
          
      });}
      else{
        this.dialogTitle = 'Edit Expertise';
      }
        this.decalarationfollowForm = this.createdecalarationfollowForm();

    }

   
    else if ( this.status === '2' )
    {   
        this.dialogTitle = 'Contre Expertise/Règlement';
        this.data = new AccidentDetailsExtended({
          action: _data.action
          
      });

      
    }

    else if(this.status === '3')
    {if ( this.action === 'add' )
    {
        this.dialogTitle = 'Règlement';
       
        this.data = new AccidentDetailsExtended({
          action: _data.action
          
      });}
      else{
        this.dialogTitle = 'Edit Règlement';
      }
  
        this.reglementfollowForm = this.createreglementfollowForm();

    }
    else if(this.status === '4')
    {
        this.dialogTitle = 'Edit Contre Expertise';
      
  
        this.contreexpertisefollowForm = this.createcontreexpertisefollowForm();

    }

   // this.logForm = this.createLogForm();
    }

  ngOnInit() {
  }
  radioChange(event: MatRadioChange) {
   
    this.statusSelected = '' + event.value;
    
    if (this.statusSelected === "Contre Expertise")
    {
      this.contreexpertisefollowForm = this.createcontreexpertisefollowForm();
    }
    else if (this.statusSelected === "Reglement")
    {
      this.reglementfollowForm = this.createreglementfollowForm();
    }
}

createdecalarationfollowForm(): FormGroup
    {  
        return new FormGroup({
          Expertisedate : new FormControl(new Date((this.data.Expertisesdate))),
          ExpertDécision : new FormControl("" + this.data.ExpertDecision),
          Estimatedindemnisation   : new FormControl(this.data.EstimatedDamageCost),
          Dammage: new FormControl(this.data.Damages)
    
        });
    }
    createcontreexpertisefollowForm(): FormGroup
    {  
        return new FormGroup({
          ContreExpertisedate : new FormControl(new Date((this.data.ContreExpertisedate))),
          ContreExpertDécision : new FormControl(""+this.data.ContreExpertDecision),
          Estimatedindemnisation2   : new FormControl(this.data.ContreEstimatedDamageCost),
          Dammage2: new FormControl(this.data.DamagesContreExpert)
    
        });
    }
    createreglementfollowForm(): FormGroup
    {  
        return new FormGroup({
          Reglementdate : new FormControl(new Date((this.data.Reglementdate))),
          Reglementdescription : new FormControl(this.data.Reglementdescription)
          
    
        });
    }

    onSubmit() {
      if ( this.status === '1' )
      {
      this.dialogRef.close(this.decalarationfollowForm.value);
      }
      else if ( this.status === '2' )
    {
        if (this.statusSelected === 'Contre Expertise')
      {
        this.dialogRef.close(this.contreexpertisefollowForm.value);
      }
      else if (this.statusSelected === 'Reglement')
      {
        this.dialogRef.close(this.reglementfollowForm.value);
      }
     
    }
    else if(this.status === '3')
    {
      this.dialogRef.close(this.reglementfollowForm.value);

    }
    else if(this.status === '4')
    {
      this.dialogRef.close(this.contreexpertisefollowForm.value);

    }
}
}
