
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { LogEntry } from './log.service';

export abstract class LogPublisher {
    location: string;
    abstract log(record: LogEntry):
    Observable<boolean>
    abstract clear(): Observable<boolean>;
}
export class LogPublisherConfig {
  loggerName: string;
  loggerLocation: string;
  isActive: boolean;
}