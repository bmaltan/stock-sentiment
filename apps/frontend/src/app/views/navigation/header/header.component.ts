import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogFavoritesComponent } from '../../../shared/dialog-favorites/dialog-favorites.component';
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
        private userService: UserService
    ) { }

    openLogin() {
        this.dialog.open(DialogLoginComponent, { autoFocus: false });
    }

    openFavorites() {
        this.dialog.open(DialogFavoritesComponent, {});
    }

    openSettings() {
        this.dialog.open(DialogSettingsComponent, {});
    }

    logout() {
        this.userService.logout();

    }
}
