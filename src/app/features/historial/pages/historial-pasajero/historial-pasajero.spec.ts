import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialPasajero } from './historial-pasajero';

describe('HistorialPasajero', () => {
  let component: HistorialPasajero;
  let fixture: ComponentFixture<HistorialPasajero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialPasajero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialPasajero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
