import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogFavoritesComponent } from '../../../shared/dialog-favorites/dialog-favorites.component';
import { DialogSettingsComponent } from '../../../shared/dialog-settings/dialog-settings.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  openFavorites() {
    this.dialog.open(DialogFavoritesComponent, {});
  }

  openSettings() {
    this.dialog.open(DialogSettingsComponent, {});
  }
}
