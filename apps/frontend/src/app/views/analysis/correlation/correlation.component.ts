import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { PlatformService } from '../../../shared/services/platform.service';
import { ThemeService } from '../../../shared/services/theme.service';

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
                    ticks: {
                        fontColor: '',
                    },
                    gridLines: {
                        color: '',
                    },
                },
                {
                    type: 'linear',
                    id: 'mentions',
                    display: false,
                    position: 'right',
                    ticks: {
                        fontColor: '',
                    },
                    gridLines: {
                        color: '',
                    },
                },
            ],
            xAxes: [
                {
                    ticks: {
                        fontColor: ''
                    },
                    gridLines: {
                        color: '',
                    },
                }
            ]
        },
        legend: {
            display: false,
        },


    };

    isDark!: boolean;

    constructor(
        private platformService: PlatformService,
        private themeService: ThemeService
    ) {
        this.isDark = themeService.isThemeDark();

        this.options.scales.yAxes.forEach(axis => {
            axis.ticks.fontColor = this.isDark ? 'white' : 'black';
            axis.gridLines.color = this.isDark ? '#ebebeb25' : '#0000001f';
        })
        this.options.scales.xAxes.forEach(axis => {
            axis.ticks.fontColor = this.isDark ? 'white' : 'black';
            axis.gridLines.color = this.isDark ? '#ebebeb25' : '#0000001f';
        })
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

            this.correlationData.push(new CorrelationChartData(key, labels, prices, mentions, this.isDark));
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
            borderColor: '',
            borderWidth: '2',
        },
        {
            label: 'Mentions',
            data: [],
            yAxisID: 'mentions',
            fill: true,
            borderColor: '',
            borderWidth: '1',
            backgroundColor: ''
        },
    ];

    constructor(
        ticker: string,
        labels: string[],
        prices: number[],
        mentions: number[],
        isDark: boolean
    ) {
        this.ticker = ticker;
        this.labels = labels;
        this.datasets[0].data = prices;
        this.datasets[0].borderColor = isDark ? 'white' : 'black';
        this.datasets[1].data = mentions;
        this.datasets[1].backgroundColor = isDark ? '#ffffff35' : '#00000015';
    }
}
