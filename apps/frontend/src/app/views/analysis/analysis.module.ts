import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisComponent } from './analysis.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogDiscussionsComponent } from './dialog-discussions/dialog-discussions.component';
import { ChartModule } from 'angular2-chartjs';

const routes: Routes = [
    { path: '', component: AnalysisComponent },
    { path: ':id', component: AnalysisComponent },
];

@NgModule({
    declarations: [
        AnalysisComponent,
        DialogDiscussionsComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        SharedModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        ChartModule
    ]
})

export class AnalysisModule { }
