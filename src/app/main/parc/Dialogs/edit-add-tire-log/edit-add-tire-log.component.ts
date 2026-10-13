import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TireManagementLogComponent } from '../../tire-management-log/tire-management-log.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TireManagementService } from '../../services/tire-management.service';
import { DicoAccount } from '../../interfaces/tire-management';
import { TireLog } from '../../interfaces/tire-management';
import { json2array } from  'app/main/helpers/must-match.validator';

@Component({
  selector: 'app-edit-add-tire-log',
  templateUrl: './edit-add-tire-log.component.html',
  styleUrls: ['./edit-add-tire-log.component.scss']
})
export class EditAddTireLogComponent implements OnInit {
    dataForm: FormGroup;
    ListAccount: Array<DicoAccount>;
    dialogTitleTire: string;
    ActionType: string;
    DataTireLog: TireLog;

    constructor(private formBuilder: FormBuilder,private _TireManagementService: TireManagementService,
        public dialogRef: MatDialogRef<TireManagementLogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {

        this._TireManagementService.getTireParam().subscribe((data: any) => {
            
            this.ListAccount  =json2array(data.DicoAccount);
            
        });
        //this.ListAccount = this.data.ListAccount;
        if (this.data.Id == 0) {
            this.dataForm = this.formBuilder.group({
                WorkOrderNumber: ['', Validators.required],
                Description: [''],
                Comment: [''],
                OperationDateLocal: ['', Validators.required],
                OperationMileage: [0],
                OperationPressure: [0],
                AccountServiceBy: ['', Validators.required],
                AccountWorkedBy: ['', Validators.required],
                OperationCost: ['', Validators.required]
            });
           // this.dialogTitleTire ="PARC.NewTire";
            this.ActionType = "PARC.Add";
        }
        else
        {
            this.dataForm = this.formBuilder.group({
                WorkOrderNumber: [this.data.WorkOrderNumber, Validators.required],
                Description: [this.data.Description],
                Comment: [this.data.Comment],
                OperationDateLocal: [this.data.OperationDateLocal, Validators.required],
                OperationMileage: [this.data.OperationMileage],
                OperationPressure: [this.data.OperationPressure],
                AccountServiceBy: [this.data.AccountServiceBy, Validators.required],
                AccountWorkedBy: [this.data.AccountWorkedBy, Validators.required],
                OperationCost: [this.data.OperationCost, Validators.required]
            });
            //this.dialogTitleTire ="PARC.NewTire";
            this.ActionType = "PARC.Add";
        }
        this.dialogTitleTire = this.GetOperationTypeName(this.data.OperationType);
  }
  onClose() {

    this.dialogRef.close();
}
onSubmit() {
    //this.FormData = JSON.stringify(this.editForm.value, null, 4);
    this.DataTireLog = this.data;
    this.DataTireLog.WorkOrderNumber = this.dataForm.value.WorkOrderNumber;
    this.DataTireLog.Description = this.dataForm.value.Description;
    this.DataTireLog.Comment = this.dataForm.value.Comment;
    this.DataTireLog.OperationDateGmt = this.dataForm.value.OperationDateLocal;
    this.DataTireLog.OperationMileage = this.dataForm.value.OperationMileage;
    this.DataTireLog.OperationPressure = this.dataForm.value.OperationPressure;
    this.DataTireLog.AccountServiceBy = this.dataForm.value.AccountServiceBy;
    this.DataTireLog.AccountWorkedBy = this.dataForm.value.AccountWorkedBy;
    this.DataTireLog.OperationCost = this.dataForm.value.OperationCost;
    
    this.dialogRef.close(this.DataTireLog);
}
GetOperationTypeName(OperationType: number): string {
    switch (OperationType) {
        case 0:
            return "PARC.NewEntry";
            break;
        case 1:
            return "PARC.Mount";
            break;
        case 2:
            return "PARC.Dismount";
            break;
        case 3:
            return "PARC.Rotation";
            break;
        case 4:
            return "PARC.Inspection";
            break;
        default:
            return "";
            break;
    }
}

}