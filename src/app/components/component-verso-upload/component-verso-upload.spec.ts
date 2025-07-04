import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentVersoUpload } from './component-verso-upload';

describe('ComponentVersoUpload', () => {
  let component: ComponentVersoUpload;
  let fixture: ComponentFixture<ComponentVersoUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentVersoUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentVersoUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
