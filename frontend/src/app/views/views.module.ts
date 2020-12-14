import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports: [
        CommonModule,
        FlexLayoutModule
    ]
})
export class ViewsModule { }
