import { Injectable, ErrorHandler} from '@angular/core'
//import * as Sentry from '@sentry/browser'
import { environment } from 'environments/environment'

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  
  constructor() {
   /*  Sentry.init({
      dsn: 'https://47e05ba4be214986939c8c10ea0353a3@o524881.ingest.sentry.io/5638068'
    })*/
  }
  
  handleError(error) {
    //Sentry.captureException(error.originalError || error)
  } 
}
export function getErrorHandler(): ErrorHandler {
  if (environment.production) {
    return new SentryErrorHandler()
  }
  return new ErrorHandler()
}
