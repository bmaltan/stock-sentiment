import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { DialogDiscussionsComponent } from '../../views/analysis/dialog-discussions/dialog-discussions.component';
import { DialogLoginComponent } from '../dialog-login/dialog-login.component';
import { DialogSettingsComponent } from '../dialog-settings/dialog-settings.component';

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    dialogRef: MatDialogRef<any> | null = null;

    dialogs: { [key: string]: { component: any, autoOpen: boolean } } = {
        login: { component: DialogLoginComponent, autoOpen: true },
        settings: { component: DialogSettingsComponent, autoOpen: true } ,
        discussions: { component: DialogDiscussionsComponent, autoOpen: false }
    }

    constructor(
        private dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.route.queryParams.subscribe(params => {
            if (params.dialog && this.dialogs[params.dialog] && !this.dialogRef) {
                this.openDialog(params.dialog);
            }
        })
    }

    openDialog(dialog: string, params = {}) {
        const dialogToOpen = this.dialogs[dialog];
        if (!dialogToOpen) return;

        this.dialogRef = this.dialog.open(dialogToOpen.component, params);

        if (dialogToOpen.autoOpen) {
            this.router.navigate([], {
                queryParams: { dialog: dialog }
            });
        }

        this.dialogRef?.afterClosed().pipe(
            first()).subscribe(() => {
            this.router.navigate([], {
                queryParams: { dialog: null }
            });
            this.dialogRef = null;
        });
    }
}
