import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { PlatformData, Stock } from '@invest-track/models';
import { DatabaseService } from '../../shared/services/database.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-analysis',
    templateUrl: './analysis.component.html',
    styleUrls: ['./analysis.component.scss'],
})
export class AnalysisComponent {

    platformData?: PlatformData;
    currentPlatform = '';
    currentPlatformTitle = '';

    loading = true;

    displayedColumns: string[] = ['ticker', 'openingPrice', 'closingPrice', 'dailyChange', 'numOfMentions'];
    dataSource?: MatTableDataSource<Stock> = new MatTableDataSource();

    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private databaseService: DatabaseService,
        private route: ActivatedRoute,
        private location: Location
    ) {
        this.currentPlatform = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
        this.currentPlatformTitle = this.currentPlatform.replace(/-/, '/')
    }

    ngOnInit() {
        this.getPlatformData();
    }

    async getPlatformData() {
        this.platformData = await this.databaseService.getPlatformData(this.currentPlatform);
        this.dataSource!.data = Object.values(this.platformData['2020-02-10'].topStocks) as unknown as Stock[];
        this.initSort();

        this.loading = false;
    }

    initSort() {
        this.dataSource!.sort = this.sort;
        this.dataSource!.sortingDataAccessor = (data: Stock, sortHeaderId: string) => {
            switch (sortHeaderId) {
                case 'dailyChange':
                    return data.openingPrice - data.closingPrice;
                default:
                    return data[sortHeaderId as keyof Omit<Stock, 'links'>] || 0;
            }
        };
    }

    goBack() {
        this.location.back();
    }
}

