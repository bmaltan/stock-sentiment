import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatTableModule,
        MatIconModule
    ],
    exports: [
        MatTableModule,
        MatIconModule
    ]
})

export class MaterialModule {

    icons = [
        'account',
        'dislike',
        'down',
        'info',
        'like',
        'logo-reddit',
        'logo-twitter',
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
