import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'invest-track-gdpr-rejected',
    templateUrl: './gdpr-rejected.component.html',
    styleUrls: ['./gdpr-rejected.component.scss']
})
export class GdprRejectedComponent {

    constructor(
        private router: Router
    ) { }

    consentToCookies() {
        window.localStorage.setItem('gdprResponse', 'true');
        this.router.navigate([''])
    }
}
