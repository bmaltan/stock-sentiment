import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogFavoritesComponent } from '../../../shared/dialog-favorites/dialog-favorites.component';
import { DialogSettingsComponent } from '../../../shared/dialog-settings/dialog-settings.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private dialog: MatDialog) {}

  openFavorites() {
    this.dialog.open(DialogFavoritesComponent, {});
  }

  openSettings() {
    this.dialog.open(DialogSettingsComponent, {});
  }
}
