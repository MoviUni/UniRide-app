import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPassengerAccount } from './register-passenger-account';

describe('RegisterPassengerAccount', () => {
  let component: RegisterPassengerAccount;
  let fixture: ComponentFixture<RegisterPassengerAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPassengerAccount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPassengerAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
