import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    options: Option[] = [
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
            name: 'yahoo',
            icon: 'logo-yahoo',
            platform: 'yahoo',
            route: 'yahoo',
        },
        {
            name: 'twitter',
            icon: 'logo-twitter',
            platform: 'twitter',
            route: 'twitter',
        },
    ]

    constructor() { }

    ngOnInit(): void {
    }

}

interface Option {
    name: string;
    icon: string;
    platform: string;
    route: string;
}

