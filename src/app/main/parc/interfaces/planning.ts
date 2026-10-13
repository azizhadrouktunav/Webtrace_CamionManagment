import { formatDate } from '@angular/common';
import { CalendarEventAction } from 'angular-calendar';
import { startOfDay, endOfDay } from 'date-fns';

export class PlanningModel
{
    start: Date;
    end?: Date;
    title: string;
    color: {
        primary: string;
        secondary: string;
    };
    actions?: CalendarEventAction[];
    allDay?: boolean;
    cssClass?: string;
    resizable?: {
        beforeStart?: boolean;
        afterEnd?: boolean;
    };
    draggable?: boolean;
    meta?: {
        location: string,
        notes: string
    };

    /**
     * Constructor
     *
     * @param data
     */
    constructor(data?)
    {
        data = data || {};
        this.start = new Date(parseInt(data.ContractStartDateGMT.substr(6)))|| startOfDay(new Date());
        this.end =new Date(parseInt(data.ContractEndDateGMT.substr(6)))  || endOfDay(new Date());
        this.title = data.ContractTypeString + " jusqu'à " + formatDate(this.end,'dd/MM/yyyy', 'fr')|| '';
        this.color = {
            primary  : data.color && data.color.primary || '#ad2121',
            secondary: data.color && data.color.secondary || '#FAE3E3'
        };
        this.draggable = data.draggable;
        this.resizable = {
            beforeStart: data.resizable && data.resizable.beforeStart || true,
            afterEnd   : data.resizable && data.resizable.afterEnd || true
        };
        this.actions = data.actions || [];
        this.allDay = data.allDay || false;
        this.cssClass = data.cssClass || '';
        this.meta = {
            location: data.meta && data.meta.location || '',
            notes   : data.meta && data.meta.notes || ''
        };
    }
}
