import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DialogSettingsComponent } from './dialog-settings/dialog-settings.component';
import { DialogFavoritesComponent } from './dialog-favorites/dialog-favorites.component';
import { DialogLoginComponent } from './dialog-login/dialog-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DisplayIfLoggedInDirective } from './directives/display-if-logged-in.directive';
import { DisplayIfNotLoggedInDirective } from './directives/display-if-not-logged-in.directive'
@NgModule({
    declarations: [
        DialogSettingsComponent,
        DialogFavoritesComponent,
        DialogLoginComponent,
        DisplayIfLoggedInDirective,
        DisplayIfNotLoggedInDirective
    ],
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule,
        FlexLayoutModule,
        ReactiveFormsModule
    ],
    exports: [
        MaterialModule,
        DisplayIfLoggedInDirective,
        DisplayIfNotLoggedInDirective,
    ]
})
export class SharedModule { }
