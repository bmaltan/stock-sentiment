import { Component, ViewChild } from '@angular/core';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Stock } from '@invest-track/models';
import { Location } from '@angular/common';
import { UserService } from '../../shared/services/user.service';
import { PlatformService } from '../../shared/services/platform.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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

    platformData?: Stock[];
    platformDataInitial?: Stock[];
    currentPlatform = '';
    currentPlatformTitle = '';

    loading = true;

    isFavorite = false;

    displayedColumns: string[] = ['ticker', 'openingPrice', 'closingPrice', 'dailyChange', 'numOfPosts', 'numOfMentions', 'actions'];
    dataSource: MatTableDataSource<Stock> = new MatTableDataSource();

    @ViewChild(MatSort) sort!: MatSort;

    deviceIsMobile = false;

    dateFilter = (date: Date | null): boolean => {
        if (date) {
            const dateString = new Intl.DateTimeFormat('sv-SE').format(date).toString();
            return this.availableDates.indexOf(dateString) > -1;
        }
        return false;
    };

    filterForm!: FormGroup;
    filterActive = false;

    constructor(
        private platformService: PlatformService,
        private route: ActivatedRoute,
        private userService: UserService,
        private location: Location,
        private dialog: MatDialog,
        private fb: FormBuilder,
        private devicePlatformService: DevicePlatformService,
        private router: Router
    ) {
        this.currentPlatform = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
        this.currentPlatformTitle = this.currentPlatform.replace(/-/, '/');
        this.deviceIsMobile = devicePlatformService.checkIfMobile();
    }

    ngOnInit() {
        this.selectedDate.valueChanges.subscribe(value => {
            this.loading = true;
            this.dataSource.data = [];

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

        this.filterForm = this.fb.group({
            filter: [],
            minimumMentions: [],
            minimumChange: []
        })
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
        this.platformData = Object.values(await (await this.platformService.getPlatformData(this.currentPlatform, date)).topStocks);
        if (!this.platformData) return;

        this.dataSource.data = [...this.platformData];
        this.initSort();
    }

    initSort() {
        this.sort.sort(({ id: 'numOfMentions', start: 'desc' }) as MatSortable);
        this.dataSource.sort = this.sort;

        this.dataSource.sortingDataAccessor = (data: Stock, sortHeaderId: string) => {
            switch (sortHeaderId) {
                case 'dailyChange':
                    // mat-sort doesn't handle negative values. adding 1000 as a quick workaround
                    return (((data.closingPrice - data.openingPrice) / (data.openingPrice) * 100) + 1000) || 0;
                case 'openingPrice':
                case 'closingPrice':
                    return !data.closingPrice ? -1 : data[sortHeaderId];
                default:
                    return data[sortHeaderId as keyof Omit<Stock, 'links'>] || 0;
            }
        };

        this.dataSource.filterPredicate =
            (stock: Stock, filter: string) => {
                const filterParsed = JSON.parse(filter)
                return (!filterParsed.filter || stock.ticker.toLocaleLowerCase().indexOf(filterParsed.filter.toLocaleLowerCase()) > -1)
                    && (!filterParsed.minimumMentions || stock.numOfMentions >= filterParsed.minimumMentions)
                    && (!filterParsed.minimumChange || Math.abs((((stock.closingPrice - stock.openingPrice) / (stock.openingPrice) * 100)) || 0) >= filterParsed.minimumChange)
            };

        this.loading = false;
    }

    seeDiscussions(stock: Stock) {
        this.dialog.open(DialogDiscussionsComponent, {
            data: {
                stock: stock
            },
            width: this.deviceIsMobile ? '' : '60vw'
        });
        const url = this.router.createUrlTree(['discussions']).toString();
        this.location.go(url);
    }

    openStockInYahoo(stock: Stock) {
        if (this.currentPlatform.indexOf('crypto') > -1) {
            window.open(`https://finance.yahoo.com/quote/${stock.ticker}-USD`, '_');
        } else {
            window.open(`https://finance.yahoo.com/quote/${stock.ticker}`, '_');
        }
    }

    onSortChange(event: any) {
        if (event.active === 'ticker') return;
        if (this.dataSource.sort) {
            if (this.dataSource.sort.direction === 'asc') {
                this.dataSource.sort.direction = 'desc'
            } else if (this.dataSource.sort.direction === 'desc') {
                this.dataSource.sort.direction = '';
            } else if (!this.dataSource.sort.direction) {
                this.dataSource.sort.direction = 'asc'
            }
        }
    }

    filter() {
        this.dataSource.filter = JSON.stringify(this.filterForm.value);

        if (this.filterForm.value.filter?.length || this.filterForm.value.minimumMentions?.length) {
            this.filterActive = true;
        } else {
            this.filterActive = false;
        }
    }

    resetFilter() {
        this.filterForm.reset();
        this.dataSource.filter = '';
        this.filterActive = false;
    }

    toggleFavorite() {
        this.userService.toggleFavorite(this.currentPlatform);
    }

    goBack() {
        this.location.back();
    }
}

