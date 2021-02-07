import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDiscussionsComponent } from './dialog-discussions.component';

describe('DialogDiscussionsComponent', () => {
    let component: DialogDiscussionsComponent;
    let fixture: ComponentFixture<DialogDiscussionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DialogDiscussionsComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DialogDiscussionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
