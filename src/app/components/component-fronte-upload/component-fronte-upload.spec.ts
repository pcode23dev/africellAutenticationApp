import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentFronteUpload } from './component-fronte-upload';

describe('ComponentFronteUpload', () => {
  let component: ComponentFronteUpload;
  let fixture: ComponentFixture<ComponentFronteUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentFronteUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentFronteUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
