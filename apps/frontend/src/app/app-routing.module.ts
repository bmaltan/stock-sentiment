import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { GdprRejectedComponent } from './views/gdpr-rejected/gdpr-rejected.component';
import { ScreenshotGeneratorComponent } from './views/screenshot-generator/screenshot-generator.component';

const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'donation-cancel', component: DashboardComponent },
    { path: 'donation-success', component: DashboardComponent },
    {
        path: 'app',
        children: [
            { path: 'analysis', loadChildren: async () => (await import('./views/analysis/analysis.module')).AnalysisModule },
            { path: 'screenshot', component: ScreenshotGeneratorComponent },
            { path: 'rejected', component: GdprRejectedComponent },
        ],
    },
    { path: '**', component: DashboardComponent },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            initialNavigation: 'enabled',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
