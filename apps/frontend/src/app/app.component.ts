import { isPlatformServer, Location } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { GdprPromptComponent } from './shared/gdpr-prompt/gdpr-prompt.component';
import { DevicePlatformService } from './shared/services/device-platform.service';
import { PlatformService } from './shared/services/platform.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'stock-sentiment';

    constructor(
        private platformService: PlatformService,
        private devicePlatformService: DevicePlatformService,
        private bottomSheet: MatBottomSheet,
        private location: Location,
        @Inject(PLATFORM_ID) private platformId: string
    ) {
        if (!isPlatformServer(this.platformId)) platformService.getPlatformMetadata();
    }

    ngOnInit() {
        if (!isPlatformServer(this.platformId)) {
            const cachedGdprResponse = window.localStorage.getItem('gdprResponse');
    
            if (Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase().indexOf('europe') > -1
                && this.location.path() !== '/rejected'
                && cachedGdprResponse !== 'true') {
                this.bottomSheet.open(GdprPromptComponent);
            }
        }
    }
}

