import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

@Injectable({
    providedIn: 'root'
})
export class DevicePlatformService {

    private isMobile = false;

    constructor(private platform: Platform) {
        this.isMobile = platform.IOS || platform.ANDROID;
    }

    checkIfMobile(): boolean {
        return this.isMobile;
    }
}
