import { MatDialog } from '@angular/material';
import { ErrorDialogComponent } from '../parc/Dialogs/error-dialog/error-dialog.component';

// show error message
export function showError(error : string, _matDialog:MatDialog, width: string = '250px') : void {
    _matDialog.open(ErrorDialogComponent, {
      data: {errorMsg: error} ,width : width 
    });
  }