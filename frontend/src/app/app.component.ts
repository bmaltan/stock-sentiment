import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatabaseService } from './shared/services/database.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor() { }
    title = 'invest-track';
}
