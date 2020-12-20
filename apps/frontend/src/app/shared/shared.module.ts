import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DialogSettingsComponent } from './dialog-settings/dialog-settings.component';
import { DialogFavoritesComponent } from './dialog-favorites/dialog-favorites.component';

@NgModule({
    declarations: [DialogSettingsComponent, DialogFavoritesComponent],
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule,
        FlexLayoutModule
    ],
    exports: [
        MaterialModule
    ]
})
export class SharedModule { }
