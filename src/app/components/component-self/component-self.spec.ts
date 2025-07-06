import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentSelf } from './component-self';

describe('ComponentSelf', () => {
  let component: ComponentSelf;
  let fixture: ComponentFixture<ComponentSelf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentSelf]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentSelf);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
