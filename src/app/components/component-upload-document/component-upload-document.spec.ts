import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentUploadDocument } from './component-upload-document';

describe('ComponentUploadDocument', () => {
  let component: ComponentUploadDocument;
  let fixture: ComponentFixture<ComponentUploadDocument>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentUploadDocument]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentUploadDocument);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
