import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPassenger } from './register-passenger';

describe('RegisterPassenger', () => {
  let component: RegisterPassenger;
  let fixture: ComponentFixture<RegisterPassenger>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPassenger]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPassenger);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
