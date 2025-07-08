import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentUploadDocRegistrado } from './component-upload-doc-registrado';

describe('ComponentUploadDocRegistrado', () => {
  let component: ComponentUploadDocRegistrado;
  let fixture: ComponentFixture<ComponentUploadDocRegistrado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentUploadDocRegistrado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentUploadDocRegistrado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
