import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentConfirm } from './component-confirm';

describe('ComponentConfirm', () => {
  let component: ComponentConfirm;
  let fixture: ComponentFixture<ComponentConfirm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentConfirm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentConfirm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
