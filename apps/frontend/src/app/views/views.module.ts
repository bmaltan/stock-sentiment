import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ScreenshotGeneratorComponent } from './screenshot-generator/screenshot-generator.component';
import { GdprRejectedComponent } from './gdpr-rejected/gdpr-rejected.component';

@NgModule({
    declarations: [
        DashboardComponent,
        ScreenshotGeneratorComponent,
        GdprRejectedComponent,

],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule,
    ],
})
export class ViewsModule {}
