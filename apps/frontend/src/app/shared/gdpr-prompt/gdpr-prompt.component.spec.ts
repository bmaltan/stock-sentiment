import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GdprPromptComponent } from './gdpr-prompt.component';

describe('GdprPromptComponent', () => {
  let component: GdprPromptComponent;
  let fixture: ComponentFixture<GdprPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GdprPromptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GdprPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
