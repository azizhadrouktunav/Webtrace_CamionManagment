import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TireManagement } from '../../interfaces/tire-management';

@Component({
  selector: 'app-edit-add-tire',
  templateUrl: './edit-add-tire.component.html',
  styleUrls: ['./edit-add-tire.component.scss']
})
export class EditAddTireComponent implements OnInit {
    dataForm: FormGroup;
    datTire: TireManagement;
    dialogTitleTire: string;
    ActionType: string;
    constructor(private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<EditAddTireComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        if (this.data.Id == 0) {
            this.dataForm = this.formBuilder.group({
                TireId: ['', Validators.required],
                Brand: ['', Validators.required],
                Size: ['', Validators.required],
                Type: [''],
                Cost: ['', Validators.required],
                MileageWhenPurchased: ['', Validators.required],
                MileageExpiredWarranty: [''],
                HowIsObtained: ['', Validators.required],
                // ItCanUseOnCar: [''],
                CurrentHeightOfTreadWearInMm: [''],
                Dealer: ['', Validators.required],
                ContactNameDealer: [''],
                TelDealer: [''],
                PurchasedDateLocal: ['', Validators.required],
                DateExpiredWarrantyLocal: ['', Validators.required]

            });
            this.dialogTitleTire ="PARC.NewTire";
            this.ActionType = "PARC.Add";
        }
        else {
            this.dataForm = this.formBuilder.group({
                TireId: ['', Validators.required],
                Brand: ['', Validators.required],
                Size: ['', Validators.required],
                Type: [''],
                Cost: ['', Validators.required],
                MileageWhenPurchased: ['', Validators.required],
                MileageExpiredWarranty: [''],
                HowIsObtained: [String(this.data.HowIsObtained), Validators.required],
                // ItCanUseOnCar: [''],
                CurrentHeightOfTreadWearInMm: [''],
                Dealer: ['', Validators.required],
                ContactNameDealer: [''],
                TelDealer: [''],
                PurchasedDateLocal: ['', Validators.required],
                DateExpiredWarrantyLocal: ['', Validators.required]
              
            });
            this.dialogTitleTire = "PARC.EditTire";
            this.ActionType = "PARC.Save";
        }
     // this.dataForm.patchValue({ HowIsObtained: [this.data.HowIsObtained]}) ;
      //  console.log(this.data);


  }
    onClose() {

        this.dialogRef.close();
    }
    onSubmit() {
        //this.FormData = JSON.stringify(this.editForm.value, null, 4);
        this.datTire = this.data;
        this.datTire.TireId = this.dataForm.value.TireId;
        this.datTire.Brand = this.dataForm.value.Brand;
        this.datTire.Size = this.dataForm.value.Size;
        this.datTire.Type = this.dataForm.value.Type;
        this.datTire.Cost = this.dataForm.value.Cost;
        this.datTire.MileageWhenPurchased = this.dataForm.value.MileageWhenPurchased;
        this.datTire.HowIsObtained = this.dataForm.value.HowIsObtained;
        this.datTire.CurrentHeightOfTreadWearInMm = this.dataForm.value.CurrentHeightOfTreadWearInMm;
        this.datTire.Dealer = this.dataForm.value.Dealer;
        this.datTire.ContactNameDealer = this.dataForm.value.ContactNameDealer;
        this.datTire.TelDealer = this.dataForm.value.TelDealer;
        this.datTire.PurchasedDateLocal =  new Date(this.dataForm.value.PurchasedDateLocal);
        this.datTire.MileageExpiredWarranty = this.dataForm.value.MileageExpiredWarranty;
        this.datTire.HowIsObtainedStr = this.GetHowIsObtainedStr(this.dataForm.value.HowIsObtained);
        this.datTire.DateExpiredWarrantyLocal =  new Date(this.dataForm.value.DateExpiredWarrantyLocal);
        this.dialogRef.close(this.datTire);
    }
    GetHowIsObtainedStr(HowIsObtained: string): string {
        switch (HowIsObtained) {
            case "0":
                return "PARC.ComeWithNewCar";
                break;
            case "1":
                return "PARC.ComeWithUsedCar";
                break;
            case "2":
                return "PARC.PurchasedAsUsed";
                break;
            case "3":
                return "PARC.PurchasedAsNew";
                break;
            default:
                return "";
                break;
        }
    }

}
