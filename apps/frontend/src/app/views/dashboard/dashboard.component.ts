import { Component } from '@angular/core';
import { Platform } from '@invest-track/models';
import { PlatformService } from '../../shared/services/platform.service';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {

    platforms: Platform[] = [];

    constructor(
        private platformService: PlatformService
    ) {
        this.platforms = this.platformService.getPlatforms();
    }

}

