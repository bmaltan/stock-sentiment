import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from '../../../shared/services/dialog.service';
import { ThemeService } from '../../../shared/services/theme.service';
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
        private themeService: ThemeService,
        location: Location
    ) {
        this.router.events.subscribe(() => {
            this.url = location.path();
        });
    }

    openLogin() {
        this.dialogService.openDialog('login');
    }

    toggleTheme() {
        this.themeService.toggleTheme();
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
