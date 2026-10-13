import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  public errorMessage: string = '';
 
  constructor(private router: Router,
    private _matSnackBar: MatSnackBar) { }
 
  public handleError = (error: HttpErrorResponse) => {
    
    if(error.status === 500){
      this.handle500Error(error);
    }
    else if(error.status === 404){
      this.handle404Error(error)
    }
    else if(error.error == "Session was terminated" || error.message == "Session was terminated"){
      this.handleTerminatedSession(error);
    }
    else{
      this.handleOtherError(error);
    }
  }
 
  private handle500Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this.router.navigate(['/500']);
  }
 
  private handle404Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this.router.navigate(['/404']);
  }
 
  private handleOtherError = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    //TODO: this will be fixed later;
    alert(this.errorMessage);
  }
 private handleTerminatedSession = (error: HttpErrorResponse) => {
  this.createErrorMessage(error);
  // Show the failure message 
    this._matSnackBar.open("votre session est expirée!", "s'identifier", {
      duration: 10000
    }).afterDismissed().subscribe(()=>{
      this.router.navigate(['app-auth']);
    });
 }
  private createErrorMessage = (error: HttpErrorResponse) => {
    this.errorMessage = error.error ? error.error : error.statusText;
  }
}