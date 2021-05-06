import { isPlatformServer, Location } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { GdprPromptComponent } from './shared/gdpr-prompt/gdpr-prompt.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'stock-sentiment';

    splashClasses = 'splashscreen';
    splashTitleClasses = 'splash-title'

    constructor(
        private bottomSheet: MatBottomSheet,
        private location: Location,
        @Inject(PLATFORM_ID) private platformId: string
    ) {}

    ngOnInit() {
        setTimeout(() => {
            this.splashTitleClasses += ' fade-in';
        }, 100);
        setTimeout(() => {
            this.splashClasses += ' fading faded';
        }, 1000);


        if (!isPlatformServer(this.platformId)) {
            const cachedGdprResponse = window.localStorage.getItem(
                'gdprResponse'
            );

            if (
                Intl.DateTimeFormat()
                    .resolvedOptions()
                    .timeZone.toLowerCase()
                    .indexOf('europe') > -1 &&
                this.location.path() !== '/rejected' &&
                cachedGdprResponse !== 'true'
            ) {
                this.bottomSheet.open(GdprPromptComponent);
            }
        }
    }
}
