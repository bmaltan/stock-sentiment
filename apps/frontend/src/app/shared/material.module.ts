import { Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformServer } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatTableModule,
        MatSortModule,
        MatIconModule,
        MatMenuModule,
        MatDialogModule,
        MatInputModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressBarModule,
        MatBottomSheetModule,
        MatTabsModule
    ],
    exports: [
        MatTableModule,
        MatSortModule,
        MatIconModule,
        MatMenuModule,
        MatDialogModule,
        MatInputModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressBarModule,
        MatBottomSheetModule,
        MatTabsModule
    ],
    providers: [
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
    ]
})

export class MaterialModule {

    icons = [
        'account',
        'arrow-left',
        'breakouts',
        'chat',
        'correlation',
        'dislike',
        'date',
        'date-clear',
        'difference',
        'down',
        'enter',
        'exit',
        'export',
        'info',
        'like',
        'liked',
        'logo-ss',
        'logo-reddit',
        'logo-twitter',
        'logo-yahoo',
        'mention',
        'more',
        'post',
        'search',
        'settings',
        'up'
    ]

    constructor(
        private domSanitizer: DomSanitizer,
        private matIconRegistry: MatIconRegistry,
        @Inject(PLATFORM_ID) private platformId: string
    ) {
        this.icons.forEach(icon => {
            if (isPlatformServer(this.platformId)) {
                this.matIconRegistry.addSvgIconLiteral(icon, this.domSanitizer.bypassSecurityTrustHtml('<svg></svg>'));
            } else {
                this.matIconRegistry.addSvgIcon(icon, this.domSanitizer.bypassSecurityTrustResourceUrl(`../../assets/icons/${icon}.svg`));
            }
        })
    }
}
