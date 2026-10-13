import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe extends 
DatePipe implements PipeTransform {

constructor(private translateService: TranslateService) {
  super(translateService.currentLang);
}
transform(value: any, args?: any): any {
return super.transform(value, "EEEE d MMMM y h:mm ");
}
}
