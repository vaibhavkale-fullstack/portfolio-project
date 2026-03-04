import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Projectform } from './projectform';

describe('Projectform', () => {
  let component: Projectform;
  let fixture: ComponentFixture<Projectform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Projectform]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Projectform);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
