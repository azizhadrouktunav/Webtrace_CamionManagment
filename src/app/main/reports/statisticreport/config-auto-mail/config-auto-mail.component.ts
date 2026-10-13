import { Component, OnInit } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTabChangeEvent, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-config-auto-mail',
  templateUrl: './config-auto-mail.component.html',
  styleUrls: ['./config-auto-mail.component.scss']
})
export class ConfigAutoMailComponent implements OnInit {

  constructor() { }
  dataSource = new MatTableDataSource<string>();
  searchkey="";
  ngOnInit() {
    
  }
  applyfilter(){}
  addmail(){}

}
