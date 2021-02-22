import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@invest-track/models';
import { PlatformService } from '../../shared/services/platform.service';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {

    allPlatforms: Platform[] = [];

    constructor(
        private platformService: PlatformService,
        private route: ActivatedRoute,
        private router: Router,
        private snackbar: MatSnackBar,
    ) {
        this.allPlatforms = this.platformService.getPlatforms();
        const url = route.snapshot.url[0]?.path;
        if (url === 'donation-cancel') {
            router.navigate(['']);
        } else if (url === 'donation-success') {
            this.snackbar.open('Thanks for the fuel!', undefined, { duration: 4000 });
            router.navigate(['']);
        }
    }

}

