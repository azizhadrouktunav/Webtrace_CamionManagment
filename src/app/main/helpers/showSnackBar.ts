
   export function showSnackBar(msg,_snackBar) {
    _snackBar.open(msg, 'OK' , {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
    
  }