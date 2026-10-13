import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Tank } from 'app/main/tank-monitor/tank-monitor.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PompeMonitorService } from '../pompe-monitor.service';
export interface type{
  id:number;
  name:string;
  price: number,
  volume: number,
  Amount : number,
  State : Boolean,
  Agent : string
}


@Component({
  selector: 'app-pompetracking',
  templateUrl: './pompetracking.component.html',
  styleUrls: ['./pompetracking.component.scss']
})
export class PompetrackingComponent implements OnInit {
  /*public myPompes:type[] = [
    {id: 1, name: 'Pompe 1', price : 1.250, volume : 16.05 ,Amount : 20.063, State : false, Agent : "Mohamed Abid" },
    {id: 2, name: 'Pompe 2',price : 1.250, volume : 88 ,Amount : 110.001, State : true, Agent : "Hamrouni Ramzi" },
    {id: 3, name: 'Pompe 3',price : 1.670, volume : 9.59 ,Amount : 16.015, State : true, Agent : "Hamrouni Ramzi" },
    {id: 4, name: 'Pompe 4',price : 1.500, volume :0 ,Amount : 0, State : false, Agent : "Mohamed Abid" },
  ];*/
  private _unsubscribeAll: Subject<any>;
  pumps: any[];
  data: any[];
  pompistes: any;
  myPompes = [];
  width: number;
  CurrentCustomer: number;

  constructor(    private changeDetectorRef: ChangeDetectorRef,
    private _signalRService: PompeMonitorService,
    private _pompeService: PompeMonitorService

    ) {    this._unsubscribeAll = new Subject();
    }
  loading: any;
 

    // Set the private defaults
  ngOnInit() {

    this._signalRService.startConnection()

    this.loading = true;

 
    this._signalRService.signalReceived
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(data => {
        this.loading = false;
        this.CurrentCustomer = +localStorage.getItem("Customer");

        if(data[0].Customer == this.CurrentCustomer)
        {this.myPompes = [];
        this.myPompes = data;
       
        this._pompeService.getPompistes()
        .subscribe(data => {
            this.pompistes = data;
    

            this.myPompes.forEach(e=>{
              if(this.pompistes.find(i => i.CardId === e.PompeiButton) !=undefined)
             {Object.assign(e, { FirstName: this.pompistes.find(i => i.CardId === e.PompeiButton).FirstName });
             Object.assign(e, { LastName: this.pompistes.find(i => i.CardId === e.PompeiButton).LastName });}
             else{
              Object.assign(e, { FirstName: ""});
             Object.assign(e, { LastName: "" });
             }
             if(this.pompistes.find(i => i.CardId === e.PompeiButton2) !=undefined)
               {
              Object.assign(e, { FirstName2: this.pompistes.find(i => i.CardId === e.PompeiButton2).FirstName });
              Object.assign(e, { LastName2: this.pompistes.find(i => i.CardId === e.PompeiButton2).LastName });}
              else
              {
                Object.assign(e, { FirstName2: "" });
                Object.assign(e, { LastName2: ""});}
              
    
            });
           
        });

       
       

        }
       
      }, err => {
        this.loading = false;
      });

   
     

  }
  trigger() {
    this.changeDetectorRef.detectChanges();
  }
  changeState(): void { 
    (this.width === 0) ? this.width = 70 : this.width = 0;
  }

}
