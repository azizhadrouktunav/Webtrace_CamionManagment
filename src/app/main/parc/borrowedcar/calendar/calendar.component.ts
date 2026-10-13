import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  ViewEncapsulation,
  OnInit,
  setTestabilityGetter,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { fuseAnimations } from '@fuse/animations';
import { PlanningModel } from '../../interfaces/planning';
import { BorrowedRentalService } from '../../services/borrowedrental.service';
import { ActivatedRoute } from '@angular/router';
import { DatacService } from '../../services/datac.service';
import { BorrowedModel } from '../../interfaces/borrowedrentalModel';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector     : 'calendar',
  templateUrl  : './calendar.component.html',
  styleUrls    : ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class CalendarComponent implements OnInit {
  
  
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: string;
  //CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  locale: string = 'fr';

  modalData: {
    action: string;
    event: PlanningModel;
  };
 
  /*actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: PlanningModel }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: PlanningModel }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];*/
  
  refresh: Subject<any> = new Subject();

  
 
  
  activeDayIsOpen: boolean = true;
  result: any =[];
  event: any =[];
  trackingObject: number;
  CarMatricule: any;
  constructor(private _borrowedRentalService: BorrowedRentalService,
              private route: ActivatedRoute,
              private dataService: DatacService) {
                this.view = 'month';

  }

  events: PlanningModel[] = [];


 

  ngOnInit(): void {
      if (this.route.snapshot.params['trackingObject']) {
          this.trackingObject = +this.route.snapshot.params['trackingObject'];
        }
      if (this.route.snapshot.params['CarMatricule']) {
          this.CarMatricule = this.route.snapshot.params['CarMatricule'];
        }

        this.dataService.sendParams(this.trackingObject, 1);

      this.events =   BorrowedModel.calender;
        
     /* 
      this.events  = [
          {
            start: subDays(startOfDay(new Date()), 1),
            end: addDays(new Date(), 1),
            title: 'A 3 day event',
            color: colors.red,
            actions: this.actions,
            allDay: true,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            draggable: true,
          },
          {
            start: startOfDay(new Date()),
            title: 'An event with no end date',
            color: colors.yellow,
            actions: this.actions,
          },
          {
            start: subDays(endOfMonth(new Date()), 3),
            end: addDays(endOfMonth(new Date()), 3),
            title: 'A long event that spans 2 months',
            color: colors.red,
            allDay: true,
          },
          {
            start: addHours(startOfDay(new Date()), 2),
            end: addHours(new Date(), 2),
            title: 'A draggable and resizable event',
            color: colors.yellow,
            actions: this.actions,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            draggable: true,
          },
        ]; */
      
  }

  dayClicked({ date, events }: { date: Date; events: PlanningModel[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  /* eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  } */

  handleEvent(action: string, event: PlanningModel): void {
    this.modalData = { event, action };
  }

 

 
  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
