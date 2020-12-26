import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'invest-track-dialog-login',
    templateUrl: './dialog-login.component.html',
    styleUrls: ['./dialog-login.component.scss']
})
export class DialogLoginComponent implements OnInit {

    mode: 'login' | 'register' = 'login';
    promptDismissed = false;

    registerForm?: FormGroup;
    loginForm?: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.required],
        })

        this.registerForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
            passwordAgain: ['', Validators.required],
        })
    }

    toggleLoginRegister() {
        this.mode = this.mode === 'login' ? 'register' : 'login';
    }

    async login() {
        const user = this.loginForm?.value;
        await this.authService.login(user.email, user.password)
    }

    async signup() {
        const user = this.registerForm?.value;
        await this.authService.signup(user.email, user.password);
    }

}
