import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { PlatformData } from '@invest-track/models';
import { Location } from '@angular/common';
import { UserService } from '../../shared/services/user.service';
import { PlatformService } from '../../shared/services/platform.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DevicePlatformService } from '../../shared/services/device-platform.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DialogService } from '../../shared/services/dialog.service';

type PlatformDataColumns = keyof PlatformData | 'dailyChange' | 'actions';

@Component({
    selector: 'app-analysis',
    templateUrl: './analysis.component.html',
    styleUrls: ['./analysis.component.scss'],
})
export class AnalysisComponent implements OnInit {
    availableDates: string[] = [];
    selectedDate = new FormControl('');

    platformData?: PlatformData[];
    platformDataInitial?: PlatformData[];
    currentPlatform = '';
    currentPlatformTitle = '';

    loadingDailyData = true;
    loadingCorrelation = false;
    loadingBreakouts = false;
    loadingDeepDive = false;

    isFavorite = false;

    displayedColumns: PlatformDataColumns[] = [
        'ticker',
        'open',
        'close',
        'dailyChange',
        'numOfPosts',
        'neutralMention',
        'actions',
    ];
    dataSource: MatTableDataSource<PlatformData> = new MatTableDataSource();

    @ViewChild(MatSort) sort!: MatSort;

    deviceIsMobile = false;

    dateFilter = (date: Date | null): boolean => {
        if (date) {
            const dateString = new Intl.DateTimeFormat('sv-SE')
                .format(date)
                .toString();
            return this.availableDates.indexOf(dateString) > -1;
        }
        return false;
    };

    filterForm!: FormGroup;
    filterActive = false;

    type = 'line';
    data = {
        labels: ['02', '03', '04', '05', '06', '07'],
        datasets: [
            {
                label: 'Price',
                data: [65, 59, 80, 81, 56, 55, 40],
                yAxisID: 'price',
                fill: false,
                borderColor: 'black',
                borderWidth: '2',
            },
            {
                label: 'Mentions',
                data: [250, 29, 80, 21, 56, 55, 40],
                yAxisID: 'mentions',
                borderWidth: '1',
            },
        ],
    };
    options = {
        responsive: true,
        scales: {
            yAxes: [
                {
                    type: 'linear',
                    id: 'price',
                    display: true,
                    position: 'left',
                },
                {
                    type: 'linear',
                    id: 'mentions',
                    display: false,
                    position: 'right',
                },
            ],
        },
        legend: {
            display: false,
        },
    };

    mainTabIndex = 0;
    analysisTabIndex = 0;

    constructor(
        private platformService: PlatformService,
        private route: ActivatedRoute,
        private userService: UserService,
        private location: Location,
        private formBuilder: FormBuilder,
        private dialogService: DialogService,
        devicePlatformService: DevicePlatformService
    ) {
        this.currentPlatform = this.route.snapshot.url[
            this.route.snapshot.url.length - 1
        ].path;
        this.currentPlatformTitle = this.currentPlatform.replace(/-/, '/');
        this.deviceIsMobile = devicePlatformService.checkIfMobile();
    }

    ngOnInit() {
        this.selectedDate.valueChanges.subscribe((value) => {
            this.loadingDailyData = true;
            this.dataSource.data = [];

            if (value.toISOString) {
                const date = new Intl.DateTimeFormat('sv-SE')
                    .format(value)
                    .toString();
                this.selectedDate.setValue(date, { emitEvent: false });
                this.getPlatformData(date);
            }
        });

        this.getAvailableDates();

        this.userService.getUserFavoritePlatforms().subscribe((favorites) => {
            this.isFavorite = favorites.includes(this.currentPlatform);
        });

        this.filterForm = this.formBuilder.group({
            filter: [],
            minimumMentions: [],
            minimumChange: [],
        });
    }

    async getAvailableDates() {
        const availableDates = await this.platformService.getAvailableDates(
            this.currentPlatform
        );
        this.availableDates = availableDates;
        if (availableDates.length === 0) return;

        this.selectedDate.setValue(availableDates[0]);

        this.getPlatformData(this.selectedDate.value);
    }

    async getPlatformData(date: string) {
        this.platformData = await this.platformService.getPlatformData(
            this.currentPlatform,
            date
        );
        if (!this.platformData) return;

        this.dataSource.data = [...this.platformData];
        this.initSort();
    }

    initSort() {
        this.sort.sort({ id: 'neutralMention', start: 'desc' } as MatSortable);
        this.dataSource.sort = this.sort;
        this.onSortChange({});

        this.dataSource.sortingDataAccessor = (
            data: PlatformData,
            sortHeaderId: string
        ) => {
            switch (sortHeaderId) {
                case 'dailyChange':
                    // mat-sort doesn't handle negative values. adding 1000 as a quick workaround
                    return (
                        ((data.close - data.open) / data.open) * 100 + 1000 || 0
                    );
                case 'open':
                case 'close':
                    return !data.close ? -1 : data[sortHeaderId];
                default:
                    return (
                        data[
                            sortHeaderId as keyof Omit<PlatformData, 'links'>
                        ] || 0
                    );
            }
        };

        this.dataSource.filterPredicate = (
            stock: PlatformData,
            filter: string
        ) => {
            const filterParsed = JSON.parse(filter);
            return (
                (!filterParsed.filter ||
                    stock.ticker
                        .toLocaleLowerCase()
                        .indexOf(filterParsed.filter.toLocaleLowerCase()) >
                        -1) &&
                // TODO: currently there is only neutral mention
                (!filterParsed.minimumMentions ||
                    stock.neutralMention >= filterParsed.minimumMentions) &&
                (!filterParsed.minimumChange ||
                    Math.abs(
                        ((stock.close - stock.open) / stock.open) * 100 || 0
                    ) >= filterParsed.minimumChange)
            );
        };

        this.loadingDailyData = false;
    }

    seeDiscussions(stock: PlatformData) {
        this.dialogService.openDialog('discussions', {
            data: {
                stock: stock,
            },
            width: this.deviceIsMobile ? '' : '60vw',
        });
    }

    openStockInYahoo(stock: PlatformData) {
        if (this.currentPlatform.indexOf('crypto') > -1) {
            window.open(
                `https://finance.yahoo.com/quote/${stock.ticker}-USD`,
                '_'
            );
        } else {
            window.open(`https://finance.yahoo.com/quote/${stock.ticker}`, '_');
        }
    }

    onSortChange(event: any) {
        if (event.active === 'ticker') return;
        if (this.dataSource.sort) {
            if (this.dataSource.sort.direction === 'asc') {
                this.dataSource.sort.direction = 'desc';
            } else if (this.dataSource.sort.direction === 'desc') {
                this.dataSource.sort.direction = '';
            } else if (!this.dataSource.sort.direction) {
                this.dataSource.sort.direction = 'asc';
            }
        }
    }

    filter() {
        this.dataSource.filter = JSON.stringify(this.filterForm.value);

        if (
            this.filterForm.value.filter?.length ||
            this.filterForm.value.minimumMentions?.length
        ) {
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

    onMainTabChange(event: MatTabChangeEvent) {
        if (event.index === 1 && this.analysisTabIndex === 0) {
            setTimeout(() => {
                this.analysisTabIndex = 1;
            }, 1);
            setTimeout(() => {
                this.analysisTabIndex = 0;
            }, 2);
        }
    }

    onAnalysisTabChange(event: MatTabChangeEvent) {
        this.analysisTabIndex = event.index;
    }

    goBack() {
        this.location.back();
    }
}
