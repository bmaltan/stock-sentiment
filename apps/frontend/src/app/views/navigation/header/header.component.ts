import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from '../../../shared/services/dialog.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
    url = '';

    constructor(
        private dialogService: DialogService,
        private userService: UserService,
        private router: Router,
        location: Location
    ) {
        this.router.events.subscribe(() => {
            this.url = location.path();
        });
    }

    openLogin() {
        this.dialogService.openDialog('login');
    }

    // openFavorites() {
    //     this.dialog.open(DialogFavoritesComponent, {});
    // }

    openSettings() {
        this.dialogService.openDialog('settings');
    }

    logout() {
        this.userService.logout();
    }
}
