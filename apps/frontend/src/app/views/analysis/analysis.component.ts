import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { PlatformData, Stock } from '@invest-track/models';
import { Location } from '@angular/common';
import { UserService } from '../../shared/services/user.service';
import { PlatformService } from '../../shared/services/platform.service';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogDiscussionsComponent } from './dialog-discussions/dialog-discussions.component';
import { DevicePlatformService } from '../../shared/services/device-platform.service';

@Component({
    selector: 'app-analysis',
    templateUrl: './analysis.component.html',
    styleUrls: ['./analysis.component.scss'],
})
export class AnalysisComponent {

    availableDates: string[] = []
    selectedDate = new FormControl('');

    platformData?: PlatformData;
    currentPlatform = '';
    currentPlatformTitle = '';

    loading = true;

    isFavorite = false;

    displayedColumns: string[] = ['ticker', 'openingPrice', 'closingPrice', 'dailyChange', 'numOfPosts', 'numOfMentions', 'actions'];
    dataSource: MatTableDataSource<Stock> = new MatTableDataSource();

    @ViewChild(MatSort) sort!: MatSort;

    dateFilter = (date: Date | null) => {
        const dateString = new Intl.DateTimeFormat('sv-SE').format(date!).toString();
        return this.availableDates.indexOf(dateString) > -1;
    };

    deviceIsMobile = false;

    constructor(
        private platformService: PlatformService,
        private route: ActivatedRoute,
        private userService: UserService,
        private location: Location,
        private dialog: MatDialog,
        private devicePlatformService: DevicePlatformService
    ) {
        this.currentPlatform = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
        this.currentPlatformTitle = this.currentPlatform.replace(/-/, '/');
        this.deviceIsMobile = devicePlatformService.checkIfMobile();
    }

    ngOnInit() {
        this.selectedDate.valueChanges.subscribe(value => {
            if (value.toISOString) {
                const date = new Intl.DateTimeFormat('sv-SE').format(value).toString();
                this.selectedDate.setValue(date, { emitEvent: false });
                this.getPlatformData(date);
            }
        })

        this.getAvailableDates();

        this.userService.getUserFavoritePlatforms().subscribe(favorites => {
            this.isFavorite = favorites.includes(this.currentPlatform);
        });
    }

    getAvailableDates() {
        const platformMetadata = this.platformService.getAllPlatformMetadata();

        platformMetadata.subscribe(data => {
            if (data?.length) {
                this.availableDates = data.find(platform => platform.name === this.currentPlatform)?.availableDates as string[];
                this.selectedDate.setValue(this.availableDates[0]);
                this.getPlatformData(this.selectedDate.value);
            }
        })
    }

    async getPlatformData(date: string) {
        this.platformData = await this.platformService.getPlatformData(this.currentPlatform, date);
        if (!this.platformData) return;

        this.dataSource.data = Object.values(this.platformData.topStocks) as unknown as Stock[];
        this.initSort();

        this.loading = false;
    }

    initSort() {
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = (data: Stock, sortHeaderId: string) => {
            switch (sortHeaderId) {
                case 'dailyChange':
                    // mat-sort doesn't handle negative values. adding 1000 as a quick workaround
                    return ((data.closingPrice - data.openingPrice) / (data.openingPrice) * 100) + 1000;
                default:
                    return data[sortHeaderId as keyof Omit<Stock, 'links'>] || 0;
            }
        };
    }

    seeDiscussions(stock: Stock) {
        this.dialog.open(DialogDiscussionsComponent, {
            data: {
                stock: stock
            }
        });
    }

    toggleFavorite() {
        this.userService.toggleFavorite(this.currentPlatform);
    }

    goBack() {
        this.location.back();
    }
}

