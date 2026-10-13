import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { Error403Component } from './error-403.component';


const routes = [
    {
        path     : '',
        component: Error403Component
    }
];

@NgModule({
    declarations: [
        Error403Component
    ],
    imports     : [
        RouterModule.forChild(routes),

        FuseSharedModule
    ]
})
export class Error403Module
{
}
