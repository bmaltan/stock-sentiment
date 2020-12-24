import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DialogSettingsComponent } from './dialog-settings/dialog-settings.component';
import { DialogFavoritesComponent } from './dialog-favorites/dialog-favorites.component';
import { DialogLoginComponent } from './dialog-login/dialog-login.component';
import { ReactiveFormsModule } from '@angular/forms'
@NgModule({
    declarations: [
        DialogSettingsComponent,
        DialogFavoritesComponent,
        DialogLoginComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule,
        FlexLayoutModule,
        ReactiveFormsModule
    ],
    exports: [
        MaterialModule
    ]
})
export class SharedModule { }
