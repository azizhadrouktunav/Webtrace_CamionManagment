import { Component, Input, OnInit } from '@angular/core';
import { GpsData } from '../trajectory.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  @Input() element :GpsData= new GpsData();
  constructor() { }

  ngOnInit() {
  }

}
