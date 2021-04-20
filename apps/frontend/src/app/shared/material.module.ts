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
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule, MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';

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
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatProgressBarModule,
        MatBottomSheetModule,
        MatTooltipModule,
        MatTabsModule,
        MatButtonToggleModule,
        MatDividerModule
    ],
    exports: [
        MatTableModule,
        MatSortModule,
        MatIconModule,
        MatMenuModule,
        MatDialogModule,
        MatInputModule,
        MatSnackBarModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatProgressBarModule,
        MatBottomSheetModule,
        MatTooltipModule,
        MatTabsModule,
        MatButtonToggleModule,
        MatDividerModule
    ],
    providers: [
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
        { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { color: 'black' } },
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
