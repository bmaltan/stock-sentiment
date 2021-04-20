import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenshotGeneratorComponent } from './screenshot-generator.component';

describe('ScreenshotGeneratorComponent', () => {
    let component: ScreenshotGeneratorComponent;
    let fixture: ComponentFixture<ScreenshotGeneratorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ScreenshotGeneratorComponent ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ScreenshotGeneratorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
