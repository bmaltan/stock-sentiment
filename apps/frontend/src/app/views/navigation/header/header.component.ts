import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogLoginComponent } from '../../../shared/dialog-login/dialog-login.component';
import { DialogSettingsComponent } from '../../../shared/dialog-settings/dialog-settings.component';
import { UserService } from '../../../shared/services/user.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})

export class HeaderComponent {

    constructor(
        private dialog: MatDialog,
        private userService: UserService,
        private router: Router,
        private location: Location
    ) { }

    openLogin() {
        this.dialog.open(DialogLoginComponent, { autoFocus: false });

        const url = this.router.createUrlTree(['login']).toString();
        this.location.go(url);
    }

    // openFavorites() {
    //     this.dialog.open(DialogFavoritesComponent, {});
    // }

    openSettings() {
        this.dialog.open(DialogSettingsComponent, {});
    }

    logout() {
        this.userService.logout();

    }
}
