import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalysisComponent } from './views/analysis/analysis.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { GdprRejectedComponent } from './views/gdpr-rejected/gdpr-rejected.component';
import { ScreenshotGeneratorComponent } from './views/screenshot-generator/screenshot-generator.component';

const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'donation-cancel', component: DashboardComponent },
    { path: 'donation-success', component: DashboardComponent },
    { path: 'analysis/:id', component: AnalysisComponent },
    { path: 'screenshot', component: ScreenshotGeneratorComponent },
    { path: 'rejected', component: GdprRejectedComponent },
    { path: '**', component: DashboardComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
