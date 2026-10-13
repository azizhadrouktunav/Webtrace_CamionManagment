import { Observable } from "rxjs";
import { LogPublisher } from "./log-publisher";
import { LogEntry } from "./log.service";

export class LogConsole extends LogPublisher {

    log(entry: LogEntry): Observable<boolean> {
        // Log to console
        console.log(entry.buildLogString());
        return Observable.of(true);
    }
    clear(): Observable<boolean> {
        console.clear();
        return Observable.of(true);
    }
}
