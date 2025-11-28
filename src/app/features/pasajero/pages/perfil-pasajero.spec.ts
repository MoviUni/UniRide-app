import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilPasajero } from './perfil-pasajero';

describe('PerfilPasajero', () => {
  let component: PerfilPasajero;
  let fixture: ComponentFixture<PerfilPasajero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilPasajero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilPasajero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
