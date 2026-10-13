import { Component, OnInit, ViewChild } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Command, CommandService } from './commandService ';

import { locale as english } from '../../../navigation/i18n/en';
import { locale as french } from '../../../navigation/i18n/fr';
import { locale as arab } from '../../../navigation/i18n/ar';
import { MatPaginator, MatTableDataSource } from '@angular/material';
@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.scss']
})
export class CommandsComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  displayedColumns: string[] = ['sendDate', 'vehicle', 'commandType', 'status'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);//Command[] = [];
  constructor(private _commandService: CommandService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService) { 
      // Set the private defaults
      this._unsubscribeAll = new Subject();
      this._fuseTranslationLoaderService.loadTranslations(english, french, arab);
  }
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this._commandService.onCommandsChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(value => {
        
         this.dataSource.data = [...value];
         this.dataSource.paginator = this.paginator;
         
    });
  }
  ngOnDestroy() {
        
    /*  this.trackingObjects.forEach(car => {
         car.remove();
     }) */
     this._commandService.onDestroy();
    
 }

}
