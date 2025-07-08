import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentFormRegistrado } from './component-form-registrado';

describe('ComponentFormRegistrado', () => {
  let component: ComponentFormRegistrado;
  let fixture: ComponentFixture<ComponentFormRegistrado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentFormRegistrado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentFormRegistrado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
