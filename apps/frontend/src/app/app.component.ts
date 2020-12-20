import { Component } from '@angular/core';
import { DatabaseService } from './shared/services/database.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(databaseService: DatabaseService) {
        databaseService.getAllPlatformData();
    }

    title = 'invest-track';
}
