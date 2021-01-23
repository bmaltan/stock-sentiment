import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Stock } from '@invest-track/models';

@Component({
    selector: 'invest-track-dialog-discussions',
    templateUrl: './dialog-discussions.component.html',
    styleUrls: ['./dialog-discussions.component.scss']
})
export class DialogDiscussionsComponent implements OnInit {

    stock!: Stock;

    constructor(@Inject(MAT_DIALOG_DATA) public data: { stock: Stock }) {
        this.stock = data.stock;
    }

    ngOnInit(): void {
    }

}
