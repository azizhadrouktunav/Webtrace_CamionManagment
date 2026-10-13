import { PipeTransform, Pipe } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe, registerLocaleData } from '@angular/common';
import ar from '@angular/common/locales/ar';
import fr from '@angular/common/locales/fr';
import us from '@angular/common/locales/es-US'
registerLocaleData(fr);
registerLocaleData(us);
registerLocaleData(ar);

@Pipe({
  name: 'localizedDate',
  pure: false
  })
  export class LocalizedDatePipe implements PipeTransform {
  constructor(private translateService: TranslateService, private datePipe: DatePipe) {}
  
  transform(value: any, pattern: string = 'mediumDate'): any {
  return this.datePipe.transform(value, pattern, undefined, this.translateService.currentLang);
  }
  }