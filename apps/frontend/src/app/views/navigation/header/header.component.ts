import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogFavoritesComponent } from '../../../shared/dialog-favorites/dialog-favorites.component';
import { DialogLoginComponent } from '../../../shared/dialog-login/dialog-login.component';
import { DialogSettingsComponent } from '../../../shared/dialog-settings/dialog-settings.component';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
    constructor(
        private dialog: MatDialog,
        private authService: AuthService
    ) { }

    openLogin() {
        this.dialog.open(DialogLoginComponent, {});
    }

    openFavorites() {
        this.dialog.open(DialogFavoritesComponent, {});
    }

    openSettings() {
        this.dialog.open(DialogSettingsComponent, {});
    }

    logout() {
        this.authService.logout();

    }
}
