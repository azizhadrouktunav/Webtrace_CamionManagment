import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders }      from '@angular/core';
import { RouterModule } from '@angular/router';
import { LocalizedDatePipe } from '../localized-date-pipe/localized-date-pipe.component';
import { LocalizedDateTimePipe } from '../localized-datetime-pipe/localized-datetime-pipe.component';
import { CustomDatePipe } from './custom-date.pipe';

@NgModule({
  declarations: [LocalizedDatePipe, CustomDatePipe, LocalizedDateTimePipe],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    LocalizedDatePipe,
    CustomDatePipe,
    LocalizedDateTimePipe
  ]
})
export class PipeModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PipeModule,
      providers: [
        LocalizedDatePipe,
        CustomDatePipe,
        LocalizedDateTimePipe
      ]
    }
  }
} 
