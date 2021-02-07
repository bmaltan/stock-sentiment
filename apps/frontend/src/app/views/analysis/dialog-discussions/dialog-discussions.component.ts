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
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = (data: DiscussionLink, sortHeaderId: string) => {
            switch (sortHeaderId) {
                case 'score':
                case 'awards':
                    return data[sortHeaderId] || 0;
                case 'title':
                    return data[sortHeaderId].toLocaleLowerCase();
                default:
                    return data[sortHeaderId as keyof DiscussionLink] || 0;
            }
        };
    }

    onSortChange(event: any) {
        if (event.active === 'title') return;
        if (this.dataSource.sort) {
            if (this.dataSource.sort.direction === 'asc') {
                this.dataSource.sort.direction = 'desc'
            } else if (this.dataSource.sort.direction === 'desc') {
                this.dataSource.sort.direction = '';
            } else if (!this.dataSource.sort.direction) {
                this.dataSource.sort.direction = 'asc'
            }
        }
    }

    openLink(element: DiscussionLink) {
        window.open(element.url, "_blank");
    }

}
