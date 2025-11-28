import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialConductor } from './historial-conductor';

describe('HistorialConductor', () => {
  let component: HistorialConductor;
  let fixture: ComponentFixture<HistorialConductor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialConductor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialConductor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
