import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AnalysisComponent } from './analysis/analysis.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ScreenshotGeneratorComponent } from './screenshot-generator/screenshot-generator.component';
import { GdprRejectedComponent } from './gdpr-rejected/gdpr-rejected.component';

@NgModule({
    declarations: [
        DashboardComponent,
        AnalysisComponent,
        ScreenshotGeneratorComponent,
        GdprRejectedComponent,
    ],
    imports: [
        CommonModule,
        FlexLayoutModule,
        SharedModule,
        RouterModule,
        ReactiveFormsModule
    ]
})
export class ViewsModule { }
