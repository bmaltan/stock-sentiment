import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';

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
        private userService: UserService,
        private dialogRef: MatDialogRef<DialogLoginComponent>
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
        const userCredential = await this.userService.login(user.email, user.password);
        if (userCredential?.user?.uid) {
            this.dialogRef.close();
        }
    }

    async signup() {
        const user = this.registerForm?.value;
        const userCredential = await this.userService.signup(user.email, user.password);
        if (userCredential?.user?.uid) {
            this.dialogRef.close();
        }
    }

}
