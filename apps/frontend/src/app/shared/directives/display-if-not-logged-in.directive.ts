import { Directive, ElementRef, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Directive({
    selector: '[bsDisplayIfNotLoggedIn]',
})
export class DisplayIfNotLoggedInDirective implements OnInit {
    constructor(private el: ElementRef, private userService: UserService) {}

    ngOnInit() {
        this.userService.getCurrentUser().subscribe((user) => {
            if (!user?.uid) {
                this.el.nativeElement.style.display = 'inherit';
            } else {
                this.el.nativeElement.style.display = 'none';
            }
        });
    }
}
