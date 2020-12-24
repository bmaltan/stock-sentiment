import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatTableModule,
        MatSortModule,
        MatIconModule,
        MatMenuModule,
        MatDialogModule,
        MatInputModule
    ],
    exports: [
        MatTableModule,
        MatSortModule,
        MatIconModule,
        MatMenuModule,
        MatDialogModule,
        MatInputModule
    ],
    providers: [
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
    ]
})

export class MaterialModule {

    icons = [
        'account',
        'arrow-left',
        'dislike',
        'down',
        'exit',
        'info',
        'like',
        'logo-reddit',
        'logo-twitter',
        'logo-yahoo',
        'settings',
        'up'
    ]

    constructor(
        private domSanitizer: DomSanitizer,
        private matIconRegistry: MatIconRegistry,
    ) {
        this.icons.forEach(icon => {
            this.matIconRegistry.addSvgIcon(icon, this.domSanitizer.bypassSecurityTrustResourceUrl(`../../assets/icons/${icon}.svg`));
        })
    }
}
