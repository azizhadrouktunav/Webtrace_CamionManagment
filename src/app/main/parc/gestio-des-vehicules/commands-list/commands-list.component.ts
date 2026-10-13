import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { GestionDesVehiculesService } from '../gestion-des-vehicules.service';

@Component({
  selector: 'app-commands-list',
  templateUrl: './commands-list.component.html',
  styleUrls: ['./commands-list.component.scss']
})
export class CommandsListComponent implements OnInit {
  currentDate = Date();
  private _unsubscribeAll: Subject<any>;
  constructor(private _service: GestionDesVehiculesService) { this._unsubscribeAll = new Subject(); }
  displayedColumns: string[] = ['date', 'vehicule', 'type', 'status'];
  dataSource = [];
  ngOnInit() {
    this._service.onCommandListChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data: any) => {
      if(data[0] != null){
        
        this.dataSource = data;
      }
    });
  }

}
