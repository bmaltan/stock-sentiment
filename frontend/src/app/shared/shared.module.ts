import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule,
        FlexLayoutModule
    ],
    exports: [
        MaterialModule
    ]
})
export class SharedModule { }
