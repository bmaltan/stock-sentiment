import { Component } from '@angular/core';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
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
  ];
}

interface Option {
  name: string;
  icon: string;
  platform: string;
  route: string;
}
