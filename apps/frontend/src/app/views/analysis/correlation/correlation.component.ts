import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { PlatformService } from '../../../shared/services/platform.service';

@Component({
    selector: 'invest-track-correlation',
    templateUrl: './correlation.component.html',
    styleUrls: ['./correlation.component.scss']
})
export class CorrelationComponent implements OnInit {

    @Input() currentPlatform = '';
    @Input() tabActivated!: Subject<boolean>;

    loading = true;

    type = 'line';

    correlationData: CorrelationChartData[] = []

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

    constructor(
        private platformService: PlatformService
    ) {
    }

    ngOnInit(): void {
        this.tabActivated.subscribe(val => {
            if (val) {
                this.getCorrelationData();
            }
        })
    }

    async getCorrelationData() {
        if (this.correlationData.length) return;

        const correlationData = await this.platformService.getCorrelationData(this.currentPlatform);

        for (const key in correlationData) {
            const labels = correlationData[key].map(data => data.day);
            const prices = correlationData[key].map(data => data.close);
            const mentions = correlationData[key].map(data => data.total_mention);

            this.correlationData.push(new CorrelationChartData(key, labels, prices, mentions));
        }

        this.correlationData.sort((a,b) => {
            if (a.ticker.toLowerCase() < b.ticker.toLowerCase()) {
                return -1;
            } else if (a.ticker.toLowerCase() > b.ticker.toLowerCase()) {
                return 1;
            }
            return 0;
        });
        
        this.loading = false;
    }
}

class CorrelationChartData {
    ticker = '';
    labels: string[] = [];
    datasets = [
        {
            label: 'Price',
            data: [] as number[],
            yAxisID: 'price',
            fill: false,
            borderColor: 'black',
            borderWidth: '2',
        },
        {
            label: 'Mentions',
            data: [],
            yAxisID: 'mentions',
            borderWidth: '1',
        },
    ];

    constructor(
        ticker: string,
        labels: string[],
        prices: number[],
        mentions: number[],
    ) {
        this.ticker = ticker;
        this.labels = labels;
        this.datasets[0].data = prices;
        this.datasets[1].data = mentions;
    }
}
