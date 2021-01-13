import { Directive, ElementRef } from '@angular/core';
import { UserService } from '../services/user.service';

@Directive({
    selector: '[bsDisplayIfLoggedIn]'
})
export class DisplayIfLoggedInDirective {

    constructor(
        private el: ElementRef,
        private authService: UserService
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