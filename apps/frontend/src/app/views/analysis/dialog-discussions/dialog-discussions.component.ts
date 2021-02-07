import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DiscussionLink, Stock } from '@invest-track/models';

@Component({
    selector: 'invest-track-dialog-discussions',
    templateUrl: './dialog-discussions.component.html',
    styleUrls: ['./dialog-discussions.component.scss']
})
export class DialogDiscussionsComponent implements OnInit {

    displayedColumns: string[] = ['score', 'awards', 'title'];
    dataSource: MatTableDataSource<DiscussionLink> = new MatTableDataSource();

    @ViewChild(MatSort) sort!: MatSort;


    constructor(@Inject(MAT_DIALOG_DATA) public data: { stock: Stock }) { }

    ngOnInit(): void {
        if (this.data.stock.links?.length) {
            this.dataSource.data = this.data.stock.links;
        }

        this.dataSource.sort = this.sort;
    }

    openLink(element: DiscussionLink) {
        window.open(element.url, "_blank");
    }

}
