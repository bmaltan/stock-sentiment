import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatTableModule,
        MatIconModule,
        MatMenuModule,
        MatDialogModule,
    ],
    exports: [
        MatTableModule,
        MatIconModule,
        MatMenuModule,
        MatDialogModule,
    ]
})

export class MaterialModule {

    icons = [
        'account',
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
