import { Directive, ElementRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
    selector: '[bsDisplayIfLoggedIn]'
})
export class DisplayIfLoggedInDirective {

    constructor(
        private el: ElementRef,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.authService.getCurrentUser().subscribe(user => {
            if (user?.uid) {
                this.el.nativeElement.style.display = 'inherit'
            } else {
                this.el.nativeElement.style.display = 'none'
            }
        })
    }
}