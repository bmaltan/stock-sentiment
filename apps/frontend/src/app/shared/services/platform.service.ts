import { Injectable } from '@angular/core';
import { Platform } from '@invest-track/models';

@Injectable({
    providedIn: 'root'
})
export class PlatformService {

    getPlatforms() {
        return platforms;
    }
}

const platforms: Platform[] = [
    {
        name: 'r/investing',
        icon: 'logo-reddit',
        platform: 'reddit',
        route: 'r-investing',
    },
    {
        name: 'r/wsb',
        icon: 'logo-reddit',
        platform: 'reddit',
        route: 'r-wsb',
    },
    {
        name: 'r/stocks',
        icon: 'logo-reddit',
        platform: 'reddit',
        route: 'r-stocks',
    },
    {
        name: 'r/pennystocks',
        icon: 'logo-reddit',
        platform: 'reddit',
        route: 'r-pennystocks',
    },
    {
        name: 'r/stockmarket',
        icon: 'logo-reddit',
        platform: 'reddit',
        route: 'r-stockmarket',
    },
    {
        name: 'r/stock_picks',
        icon: 'logo-reddit',
        platform: 'reddit',
        route: 'r-stock_picks',
    },
    // {
    //     name: 'yahoo',
    //     icon: 'logo-yahoo',
    //     platform: 'yahoo',
    //     route: 'yahoo',
    // },
    // {
    //     name: 'twitter',
    //     icon: 'logo-twitter',
    //     platform: 'twitter',
    //     route: 'twitter',
    // },
];