import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDriverVehicle } from './register-driver-vehicle';

describe('RegisterDriverVehicle', () => {
  let component: RegisterDriverVehicle;
  let fixture: ComponentFixture<RegisterDriverVehicle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterDriverVehicle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterDriverVehicle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
