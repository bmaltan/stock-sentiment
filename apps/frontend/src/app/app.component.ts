import { Component } from '@angular/core';
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
        private devicePlatformService: DevicePlatformService
    ) {
        platformService.getPlatformMetadata();
    }
}

