import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Platform, PlatformData } from '@invest-track/models';
import { PlatformService } from '../../shared/services/platform.service';
// import html2canvas from 'html2canvas';

@Component({
    selector: 'invest-track-screenshot-generator',
    templateUrl: './screenshot-generator.component.html',
    styleUrls: ['./screenshot-generator.component.scss'],
})
export class ScreenshotGeneratorComponent implements OnInit {
    availableDates: string[] = [];
    selectedDate = new FormControl('');
    selectedPlatform = new FormControl('r-investing');

    availablePlatformCategories: Platform[] = [];
    allPlatformData: { platform: string; data: PlatformData[] }[] = [];
    platformToHighlight = new FormControl('');
    selectedIndex = -1;

    displayedColumns = ['ticker', 'numOfPosts', 'neutralMentions'];

    allStocks: { ticker: string; neutralMentions: number }[] = [];

    dateFilter = (date: Date | null): boolean => {
        if (date) {
            const dateString = new Intl.DateTimeFormat('sv-SE')
                .format(date)
                .toString();
            return this.availableDates.indexOf(dateString) > -1;
        }
        return false;
    };

    constructor(private platformService: PlatformService) {}

    ngOnInit(): void {
        this.selectedDate.valueChanges.subscribe((value) => {
            this.allPlatformData = [];

            if (value.toISOString) {
                const date = new Intl.DateTimeFormat('sv-SE')
                    .format(value)
                    .toString();
                this.selectedDate.setValue(date, { emitEvent: false });
            }

            this.availablePlatformCategories.forEach((category) => {
                category.platforms.forEach(async (platform) => {
                    let stocks = await this.platformService.getPlatformData(
                        platform.route,
                        this.selectedDate.value
                    );

                    stocks = stocks
                        .sort((a, b) => {
                            if (a.numOfPosts !== b.numOfPosts) {
                                return b.numOfPosts - a.numOfPosts;
                            } else {
                                return b.neutralMention - a.neutralMention;
                            }
                        })
                        .slice(0, 5);

                    stocks.forEach((stock) => {
                        const index = this.allStocks.findIndex(
                            (s) => s.ticker === stock.ticker
                        );
                        if (index === -1) {
                            this.allStocks.push({
                                ticker: stock.ticker,
                                neutralMentions: 1,
                            });
                        } else {
                            this.allStocks[index].neutralMentions++;
                        }
                    });

                    this.allStocks = this.allStocks.filter(
                        (stock) => stock.neutralMentions > 1
                    );

                    this.allPlatformData.push({
                        platform: platform.displayName,
                        data: stocks,
                    });
                });
            });
        });

        this.platformToHighlight.valueChanges.subscribe((value) => {
            this.selectedIndex = this.allPlatformData.findIndex(
                (platform) => platform.platform === value
            );
            if (this.selectedIndex) {
                const selectedPlatform = this.allPlatformData.splice(
                    this.selectedIndex,
                    1
                )[0];
                this.allPlatformData.unshift(selectedPlatform);
            }
        });

        this.getAvailableDates();
        this.availablePlatformCategories = this.platformService.getPlatforms();
    }

    async getAvailableDates() {
        const availableDates = await this.platformService.getAvailableDates(
            this.selectedPlatform.value
        );
        console.log(this.selectedPlatform.value);
        this.availableDates = availableDates;
        this.selectedDate.setValue(this.availableDates[0]);
    }

    generateScreenshot() {
        // html2canvas(document.querySelector('#capture') as HTMLElement).then(canvas => {
        //     const downloadElement = document.createElement("a");
        //     downloadElement.href = canvas.toDataURL();
        //     downloadElement.download = `StockSentiment${this.selectedDate.value}.png`;
        //     downloadElement.click();
        // });
    }
}
