import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentViewRegistrado } from './component-view-registrado';

describe('ComponentViewRegistrado', () => {
  let component: ComponentViewRegistrado;
  let fixture: ComponentFixture<ComponentViewRegistrado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentViewRegistrado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentViewRegistrado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
