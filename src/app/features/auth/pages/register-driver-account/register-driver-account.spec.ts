import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDriverAccount } from './register-driver-account';

describe('RegisterDriverAccount', () => {
  let component: RegisterDriverAccount;
  let fixture: ComponentFixture<RegisterDriverAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterDriverAccount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterDriverAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
