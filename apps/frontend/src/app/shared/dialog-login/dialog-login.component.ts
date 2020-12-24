import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'invest-track-dialog-login',
    templateUrl: './dialog-login.component.html',
    styleUrls: ['./dialog-login.component.scss']
})
export class DialogLoginComponent implements OnInit {

    registerForm?: FormGroup;
    loginForm?: FormGroup;

    constructor(
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
            passwordAgain: ['', Validators.required],
        })
    }

}
