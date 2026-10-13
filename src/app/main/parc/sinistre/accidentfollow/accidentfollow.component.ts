import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import * as _ from 'lodash';
import { AccidentdetailsService } from '../../services/accidentdetails.service';
import { json2array } from 'app/main/helpers/must-match.validator';;
import { AccidentDetailsExtended } from '../../interfaces/accidentdetails';
import { DatacService } from '../../services/datac.service';
import { FollowsinistreComponent } from '../followsinistre/followsinistre.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-accidentfollow',
  templateUrl: './accidentfollow.component.html',
  styleUrls: ['./accidentfollow.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class AccidentfollowComponent implements OnInit {
  trackingObject: number;
  CarMatricule: any;
  accidentReportRef: number;
  data: any[];
  accidentdetails: any[] = [];

  stepExpertise: boolean;
  stepContreExpertise = false;
  stepReglement = false;
  stepClosed = false;
  status: any;
  id: any;
  details: any = [];
  ExpertDecisionEnum = [
    { id: 0, name: "Pas d'indemnisation / Refusée" },
    { id: 1, name: 'Indemnisation / Acceptée' }];
  Expertdecision: any;
  ContreExpertdecision: any;

  constructor(private route: ActivatedRoute,
    private dataService: DatacService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _accidentdetailsService: AccidentdetailsService,
    private errorHandler: ErrorHandlerService,
    private router: Router

  ) { }

  ngOnInit() {

    if (this.route.snapshot.params['trackingObject']) {
      this.trackingObject = +this.route.snapshot.params['trackingObject'];
    }

    if (this.route.snapshot.params['accidentReportRef']) {
      this.accidentReportRef = this.route.snapshot.params['accidentReportRef'];
    }

    if (this.route.snapshot.params['CarMatricule']) {
      this.CarMatricule = this.route.snapshot.params['CarMatricule'];
    }
    this.dataService.sendParams(this.trackingObject, 1);

    this.getSteps();

  }


  nextReglementStep(): void {
    if (this.status === 4) {
      const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
        disableClose: false
      });
      dialogRef.componentInstance.confirmMessage = 'Veuilez confirmer le réglement de ce dossier?';
      //   data:{
      //     message: 'Veuilez confirmer le réglement de ce dossier?',
      //     buttonText: {
      //       ok: 'Confirmer',
      //       cancel: 'Cancel',
      //     }
      //   }
      // });


      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this._accidentdetailsService.updateStatusAchieved(+this.trackingObject, this.id).subscribe((data: any[]) => {

            this.getSteps();
            this._snackBar.open('Accident  report is achieved', 'OK', {
              // here specify the position
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              duration        : 2000
              });

          },
            (error) => {
              if (error.error == "Session was terminated") {
                this._snackBar.open("votre session est expirée!", "s'identifier", {
                  duration: 10000
                }).afterDismissed().subscribe(() => {
                  this.router.navigate(['app-auth']);
                });
              }
              else {
                this._snackBar.open('Server is Not Responding', 'OK', {
                  // here specify the position
                  verticalPosition: 'bottom',
                  horizontalPosition: 'right',
                  duration: 2000
                });
              }
            }

          );
        }
        else {
          return;
        }
      })
    }

    else {
      const dialogRef = this.dialog.open(FollowsinistreComponent, {
        panelClass: 'custom-dialog-container',
        data: {
          action: 'add',
          status: this.status
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          return;
        }
        if (this.status === 1) {
          this._accidentdetailsService.updateStatus(+this.trackingObject, this.id, result).subscribe((data: any[]) => {

            this.getSteps();


            this._snackBar.open('Accident Expertise is added ', 'OK', {
              // here specify the position
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              duration        : 2000
              });

          }, (error) => {
            if (error.error == "Session was terminated") {
              this._snackBar.open("votre session est expirée!", "s'identifier", {
                duration: 10000
              }).afterDismissed().subscribe(() => {
                this.router.navigate(['app-auth']);
              });
            }

            else {
              this._snackBar.open('Server is Not Responding', 'OK', {
                // here specify the position
                verticalPosition: 'bottom',
                horizontalPosition: 'right',
                duration: 2000
              });
            }
          });

        }

        else if (this.status === 2) {
          if (Object.keys(result).length === 4) {
            this._accidentdetailsService.updateStatusContreExpertise(+this.trackingObject, this.id, result).subscribe((data: any[]) => {
              if (data! = null) {
                this.getSteps();


                this._snackBar.open('Accident Contre Expertise is added ', 'OK', {
                  // here specify the position
                  verticalPosition: 'bottom',
                  horizontalPosition: 'right',
                  duration        : 2000
                  });
              }

              else {
                this._snackBar.open('Server is Not Responding', 'OK', {
                  // here specify the position
                  verticalPosition: 'bottom',
                  horizontalPosition: 'right',
                  duration: 2000
                });
              }

            }
              , (error) => {
                if (error.error == "Session was terminated") {
                  this._snackBar.open("votre session est expirée!", "s'identifier", {
                    duration: 10000
                  }).afterDismissed().subscribe(() => {
                    this.router.navigate(['app-auth']);
                  });
                }

                else {
                  this._snackBar.open('Server is Not Responding', 'OK', {
                    // here specify the position
                    verticalPosition: 'bottom',
                    horizontalPosition: 'right',
                    duration: 2000
                  });
                }
              }

            );
          }
          else if (Object.keys(result).length === 2) {
            this._accidentdetailsService.updateStatusReglement(+this.trackingObject, this.id, result).subscribe((data: any[]) => {
              if (data != null) {
                this.getSteps();


                this._snackBar.open('Accident Reglement is added ', 'OK', {
                  // here specify the position
                  verticalPosition: 'bottom',
                  horizontalPosition: 'right',
                  duration        : 2000
                  });
              }

              else {
                this._snackBar.open('Server is Not Responding', 'OK', {
                  // here specify the position
                  verticalPosition: 'bottom',
                  horizontalPosition: 'right',
                  duration: 2000
                });
              }

            }
              , (error) => {
                if (error.error == "Session was terminated") {
                  this._snackBar.open("votre session est expirée!", "s'identifier", {
                    duration: 10000
                  }).afterDismissed().subscribe(() => {
                    this.router.navigate(['app-auth']);
                  });
                }

                else {
                  this._snackBar.open('Server is Not Responding', 'OK', {
                    // here specify the position
                    verticalPosition: 'bottom',
                    horizontalPosition: 'right',
                    duration: 2000
                  });
                }
              }
            );
          }


        }

        else if (this.status === 3) {
          this._accidentdetailsService.updateStatusReglement(+this.trackingObject, this.id, result).subscribe((data: any[]) => {

            this.getSteps();


            this._snackBar.open('Accident Reglement is added ', 'OK', {
              // here specify the position
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              duration        : 2000
              });

          }
            , (error) => {
              if (error.error == "Session was terminated") {
                this._snackBar.open("votre session est expirée!", "s'identifier", {
                  duration: 10000
                }).afterDismissed().subscribe(() => {
                  this.router.navigate(['app-auth']);
                });
              }

              else {
                this._snackBar.open('Server is Not Responding', 'OK', {
                  // here specify the position
                  verticalPosition: 'bottom',
                  horizontalPosition: 'right',
                  duration: 2000
                });
              }
            }
          );
        }
      });
    }
  }
  getSteps() {
    this._accidentdetailsService.getAccidentdetails(+this.trackingObject).subscribe((result) => {
      this.data = json2array(result);
      this.accidentdetails = [];
      this.data.forEach(elt => {
        
        if (elt.AccidentReportRef ===   "" + this.accidentReportRef) {
          this.accidentdetails.push(new AccidentDetailsExtended(elt));
        }
      })

      this.details = this.accidentdetails[0];
      if(this.details != undefined)
      {if (this.details.ContreExpertDecision != null) {
        this.ContreExpertdecision = _.find(this.ExpertDecisionEnum, { id: this.details.ContreExpertDecision });
        this.details = Object.assign({
          ContreExpertDecisionString: this.ContreExpertdecision.name,
        }, this.details);
      }
      if (this.details.ExpertDecision != null) {
        this.Expertdecision = _.find(this.ExpertDecisionEnum, { id: this.details.ExpertDecision });
        this.details = Object.assign({
          ExpertDecisionString: this.Expertdecision.name
        }, this.details);
      }}
      this.accidentdetails.forEach(e => {
        this.status = e.Status
        this.id = e.Id
        switch (e.Status) {
          case 1:
            // this.stepDeclaration = true;
            break;
          case 2:
            this.stepExpertise = true;
            break;
          case 3:
            this.stepContreExpertise = true;
            this.stepExpertise = true;
            break;
          case 4:
            this.stepReglement = true;
            this.stepContreExpertise = true;
            this.stepExpertise = true;
            break;
          case 5:
            this.stepClosed = true;
            this.stepReglement = true;
            this.stepContreExpertise = true;
            this.stepExpertise = true;
            break;
        }
      })

    },
      (error: HttpErrorResponse) => {
        //this.errorHandler.handleError(error);
        console.log(error.name + ' ' + error.message);
      });
  }
  editExpertise() {
    const dialogRef = this.dialog.open(FollowsinistreComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        action: 'edit',
        status: 1,
        data: this.details
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this._accidentdetailsService.updateStatus(+this.trackingObject, this.id, result).subscribe((data: any[]) => {
        if (data! = null) {
          this.getSteps();


          this._snackBar.open('Accident Expertise is updated ', 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration        : 2000
            });
        }

        else {
          this._snackBar.open('Server is Not Responding', 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration: 2000
          });
        }
      },
        (error) => {
          if (error.error == "Session was terminated") {
            this._snackBar.open("votre session est expirée!", "s'identifier", {
              duration: 10000
            }).afterDismissed().subscribe(() => {
              this.router.navigate(['app-auth']);
            });
          }
          else {
            this._snackBar.open('Server is Not Responding', 'OK', {
              // here specify the position
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              duration: 2000
            });
          }
        }

      );
    })
  }
  editReglement() {
    const dialogRef = this.dialog.open(FollowsinistreComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        action: 'edit',
        status: 3,
        data: this.details
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this._accidentdetailsService.updateStatusReglement(+this.trackingObject, this.id, result).subscribe((data: any[]) => {

        if (data != null) {
          this.getSteps();


          this._snackBar.open('Accident Reglement is updated ', 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration        : 2000
            });
        }

        else {
          this._snackBar.open('Server is Not Responding', 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration: 2000
          });
        }

      }
        ,
        (error) => {
          if (error.error == "Session was terminated") {
            this._snackBar.open("votre session est expirée!", "s'identifier", {
              duration: 10000
            }).afterDismissed().subscribe(() => {
              this.router.navigate(['app-auth']);
            });
          }
          else {
            this._snackBar.open('Server is Not Responding', 'OK', {
              // here specify the position
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              duration: 2000
            });
          }
        }

      );
    })
  }



  editContreExpertise() {
    const dialogRef = this.dialog.open(FollowsinistreComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        action: 'edit',
        status: 4,
        data: this.details
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this._accidentdetailsService.updateStatusContreExpertise(+this.trackingObject, this.id, result).subscribe((data: any[]) => {
        if (data != null) {
          this.getSteps();


          this._snackBar.open('Accident Contre Expertise is updated ', 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration        : 2000
            });
        }
        else {
          this._snackBar.open('Server is Not Responding', 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration: 2000
          });
        }

      },
        (error) => {
          if (error.error == "Session was terminated") {
            this._snackBar.open("votre session est expirée!", "s'identifier", {
              duration: 10000
            }).afterDismissed().subscribe(() => {
              this.router.navigate(['app-auth']);
            });
          }
          else {
            this._snackBar.open('Server is Not Responding', 'OK', {
              // here specify the position
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              duration: 2000
            });
          }
        }

      );
    })
  }
}
