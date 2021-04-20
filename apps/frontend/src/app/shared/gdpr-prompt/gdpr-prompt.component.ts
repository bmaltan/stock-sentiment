import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Component({
    selector: 'invest-track-gdpr-prompt',
    templateUrl: './gdpr-prompt.component.html',
    styleUrls: ['./gdpr-prompt.component.scss']
})
export class GdprPromptComponent {

    constructor(
        private bottomSheetRef: MatBottomSheetRef<GdprPromptComponent>,
        private router: Router
    ) {
        bottomSheetRef.disableClose = true;
    }

    consentToCookies() {
        window.localStorage.setItem('gdprResponse', 'true');
        this.bottomSheetRef.dismiss();
    }

    rejectCookies() {
        window.localStorage.setItem('gdprResponse', 'false');
        this.bottomSheetRef.dismiss();
        this.router.navigate(['rejected']);
    }

}
