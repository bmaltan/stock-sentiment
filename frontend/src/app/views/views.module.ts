import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../shared/material.module';

@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports: [
        CommonModule,
        FlexLayoutModule,
        MaterialModule
    ]
})
export class ViewsModule { }
