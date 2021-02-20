import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GdprRejectedComponent } from './gdpr-rejected.component';

describe('GdprRejectedComponent', () => {
    let component: GdprRejectedComponent;
    let fixture: ComponentFixture<GdprRejectedComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GdprRejectedComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GdprRejectedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
