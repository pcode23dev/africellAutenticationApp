import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentSuccess } from './component-success';

describe('ComponentSuccess', () => {
  let component: ComponentSuccess;
  let fixture: ComponentFixture<ComponentSuccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentSuccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentSuccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
