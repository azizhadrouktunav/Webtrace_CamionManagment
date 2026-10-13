import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatFormFieldControl } from '@angular/material';
import { TireManagementComponent } from '../../tire-management/tire-management.component';
import { locale as english } from '../../i18n/en';
import { locale as french } from '../../i18n/fr';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
@Component({
  selector: 'app-edit-axle',
  templateUrl: './edit-axle.component.html',
  styleUrls: ['./edit-axle.component.scss']
 
})
export class EditAxleComponent implements OnInit {
  dataForm: FormGroup;
  pattern=[2,4];
  DualWheelAxle1:number;
  DualWheelAxle2:number;
  DualWheelAxle3:number;
  DualWheelAxle4:number;
  DualWheelAxle5:number;
  DualWheelAxle6:number;
  ObjDualWheelAxle1;
  ObjDualWheelAxle2;
  ObjDualWheelAxle3;
  ObjDualWheelAxle4;
  ObjDualWheelAxle5;
  ObjDualWheelAxle6;

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<TireManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private _fuseTranslationLoaderService: FuseTranslationLoaderService) { 
      this._fuseTranslationLoaderService.loadTranslations(english, french);
    }


  ngOnInit() {
    if(this.data.DualWheelAxle1)
        this.DualWheelAxle1=4;
    else
       this.DualWheelAxle1=2;
    if(this.data.DualWheelAxle2)
       this.DualWheelAxle2=4;
   else
      this.DualWheelAxle2=2;
  if(this.data.DualWheelAxle3)
      this.DualWheelAxle3=4;
  else
     this.DualWheelAxle3=2;
     if(this.data.DualWheelAxle4)
      this.DualWheelAxle4=4;
  else
     this.DualWheelAxle4=2;
     
     if(this.data.DualWheelAxle5)
      this.DualWheelAxle5=4;
  else
     this.DualWheelAxle5=2;
     if(this.data.DualWheelAxle6)
      this.DualWheelAxle6=4;
  else
     this.DualWheelAxle6=2;
    
    this.dataForm = this.formBuilder.group({
      Axle1Enabled: [this.data.Axle1Enabled],
      DualWheelAxle1: [this.DualWheelAxle1 ],
      Axle2Enabled: [this.data.Axle2Enabled],
      DualWheelAxle2: [this.DualWheelAxle2],
      Axle3Enabled: [this.data.Axle3Enabled],
      DualWheelAxle3: [this.DualWheelAxle3],
      Axle4Enabled: [this.data.Axle4Enabled],
      DualWheelAxle4: [this.DualWheelAxle4],
      Axle5Enabled: [this.data.Axle5Enabled],
      DualWheelAxle5: [this.DualWheelAxle5],
      Axle6Enabled: [this.data.Axle6Enabled],
      DualWheelAxle6: [this.DualWheelAxle6],
            //new FormControl(Validators.required, Validators.pattern(pett)),
     
  });
  this.ObjDualWheelAxle1 =this.dataForm.get('DualWheelAxle1');
  this.ObjDualWheelAxle2 =this.dataForm.get('DualWheelAxle2');
  this.ObjDualWheelAxle3 =this.dataForm.get('DualWheelAxle3');
  this.ObjDualWheelAxle4 =this.dataForm.get('DualWheelAxle4');
  this.ObjDualWheelAxle5 =this.dataForm.get('DualWheelAxle5');
  this.ObjDualWheelAxle6 =this.dataForm.get('DualWheelAxle6');
  if(this.data.Axle1Enabled){
    this.ObjDualWheelAxle1.enable();
  }else{
    this.ObjDualWheelAxle1.disable();
  }
  if(this.data.Axle2Enabled){
    this.ObjDualWheelAxle2.enable();
  }else{
    this.ObjDualWheelAxle2.disable();
  }
  
  if(this.data.Axle3Enabled){
    this.ObjDualWheelAxle3.enable();
  }else{
    this.ObjDualWheelAxle3.disable();
  }
  if(this.data.Axle4Enabled){
    this.ObjDualWheelAxle4.enable();
  }else{
    this.ObjDualWheelAxle4.disable();
  }
  if(this.data.Axle5Enabled){
    this.ObjDualWheelAxle5.enable();
  }else{
    this.ObjDualWheelAxle5.disable();
  }
  if(this.data.Axle6Enabled){
    this.ObjDualWheelAxle6.enable();
  }else{
    this.ObjDualWheelAxle6.disable();
  }
  

 

  }
  ChangeAxle6Enabled(){
     let form= this.dataForm.value;
     if(form.Axle6Enabled)
     this.ObjDualWheelAxle6.enable();
     else 
     this.ObjDualWheelAxle6.disable();

  }
  ChangeAxle1Enabled(){
    let form= this.dataForm.value;
    if(form.Axle1Enabled)
    this.ObjDualWheelAxle1.enable();
    else 
    this.ObjDualWheelAxle1.disable();

 }
 ChangeAxle2Enabled(){
  let form= this.dataForm.value;
  if(form.Axle2Enabled)
  this.ObjDualWheelAxle2.enable();
  else 
  this.ObjDualWheelAxle2.disable();

}
ChangeAxle3Enabled(){
  let form= this.dataForm.value;
  if(form.Axle3Enabled)
  this.ObjDualWheelAxle3.enable();
  else 
  this.ObjDualWheelAxle3.disable();

}
ChangeAxle4Enabled(){
  let form= this.dataForm.value;
  if(form.Axle4Enabled)
  this.ObjDualWheelAxle4.enable();
  else 
  this.ObjDualWheelAxle4.disable();

}
ChangeAxle5Enabled(){
  let form= this.dataForm.value;
  if(form.Axle5Enabled)
  this.ObjDualWheelAxle5.enable();
  else 
  this.ObjDualWheelAxle5.disable();

}
onSubmit(){
  this.data.Axle1Enabled=this.dataForm.value.Axle1Enabled;
  this.data.Axle2Enabled=this.dataForm.value.Axle2Enabled;
  this.data.Axle3Enabled=this.dataForm.value.Axle3Enabled;
  this.data.Axle4Enabled=this.dataForm.value.Axle4Enabled;
  this.data.Axle5Enabled=this.dataForm.value.Axle5Enabled;
  this.data.Axle6Enabled=this.dataForm.value.Axle6Enabled;
  if(this.dataForm.value.Axle1Enabled){
    if(this.dataForm.value.DualWheelAxle1 ==4 )
    this.data.DualWheelAxle1 =true;
    else
    this.data.DualWheelAxle1 =false;
  }

  if(this.dataForm.value.Axle2Enabled){
    if(this.dataForm.value.DualWheelAxle2 ==4 )
    this.data.DualWheelAxle2 =true;
    else
    this.data.DualWheelAxle2 =false;
  }

  if(this.dataForm.value.Axle3Enabled){
    if(this.dataForm.value.DualWheelAxle3 ==4 )
    this.data.DualWheelAxle3 =true;
    else
    this.data.DualWheelAxle3 =false;
  }

  if(this.dataForm.value.Axle4Enabled){
    if(this.dataForm.value.DualWheelAxle4 ==4 )
    this.data.DualWheelAxle4 =true;
    else
    this.data.DualWheelAxle4 =false;
  }

  if(this.dataForm.value.Axle5Enabled){
    if(this.dataForm.value.DualWheelAxle5 ==4 )
    this.data.DualWheelAxle5 =true;
    else
    this.data.DualWheelAxle5 =false;
  }

  if(this.dataForm.value.Axle6Enabled){
    if(this.dataForm.value.DualWheelAxle6 ==4 )
    this.data.DualWheelAxle6 =true;
    else
    this.data.DualWheelAxle6 =false;
  }
  this.dialogRef.close(this.data);
}



}
