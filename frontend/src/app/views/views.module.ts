import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AnalysisComponent } from './analysis/analysis.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        DashboardComponent,
        AnalysisComponent
    ],
    imports: [
        CommonModule,
        FlexLayoutModule,
        SharedModule,
        RouterModule
    ]
})
export class ViewsModule { }
