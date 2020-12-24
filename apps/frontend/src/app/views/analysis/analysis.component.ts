import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { PlatformData, Stock } from '@invest-track/models';
import { DatabaseService } from '../../shared/services/database.service';

@Component({
    selector: 'app-analysis',
    templateUrl: './analysis.component.html',
    styleUrls: ['./analysis.component.scss'],
})
export class AnalysisComponent {

    platformData?: PlatformData;
    currentPlatform = '';

    loading = true;

    displayedColumns: string[] = ['ticker', 'openingPrice', 'closingPrice', 'dailyChange', 'numOfMentions'];
    dataSource?: MatTableDataSource<Stock[]>;

    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private databaseService: DatabaseService,
        private route: ActivatedRoute
    ) {
        this.currentPlatform = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
    }

    ngOnInit() {
        this.getPlatformData();
    }

    async getPlatformData() {
        this.platformData = await this.databaseService.getPlatformData(this.currentPlatform);
        this.dataSource = new MatTableDataSource(Object.values(this.platformData['2020-02-10'].topStocks))
        this.dataSource.sort = this.sort;
        this.loading = false;
    }
}

