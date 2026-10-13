import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GetionChauffeursService } from '../getion-chauffeurs.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'app-commands-driver-component',
  templateUrl: './commands-driver-component.component.html',
  styleUrls: ['./commands-driver-component.component.scss']
})
export class CommandsDriverComponentComponent implements OnInit {
  currentDate = Date();
  private _unsubscribeAll: Subject<any>;
  constructor(private _service: GetionChauffeursService) {  this._unsubscribeAll = new Subject(); }
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
