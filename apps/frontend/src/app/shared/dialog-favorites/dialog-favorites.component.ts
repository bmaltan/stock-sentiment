import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-dialog-favorites',
    templateUrl: './dialog-favorites.component.html',
    styleUrls: ['./dialog-favorites.component.scss'],
})

export class DialogFavoritesComponent {

    favorites: string[] = []

    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    displayedColumns = ['name', 'actions']

    constructor(
        private userService: UserService
    ) { }

    ngOnInit() {
        this.userService.getUserFavorites().subscribe(favorites => {
            this.dataSource.data = favorites;
        });
    }
}
