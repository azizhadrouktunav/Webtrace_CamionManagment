import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../../../app/main/parc/i18n/en';
import { locale as french } from'../../../app/main/parc/i18n/fr';
import { locale as arab } from '../../../app/main/parc/i18n/ar';
@Component({
    selector   : 'fuse-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls  : ['./confirm-dialog.component.scss']
})
export class FuseConfirmDialogComponent
{
    public confirmMessage: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<FuseConfirmDialogComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<FuseConfirmDialogComponent> ,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService

    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, french, arab);
    }

}
