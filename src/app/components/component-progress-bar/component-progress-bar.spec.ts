import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentProgressBar } from './component-progress-bar';

describe('ComponentProgressBar', () => {
  let component: ComponentProgressBar;
  let fixture: ComponentFixture<ComponentProgressBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentProgressBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentProgressBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
