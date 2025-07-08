import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageUserRegistrado } from './page-user-registrado';

describe('PageUserRegistrado', () => {
  let component: PageUserRegistrado;
  let fixture: ComponentFixture<PageUserRegistrado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageUserRegistrado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageUserRegistrado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
