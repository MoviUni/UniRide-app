import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RutaService } from '../../../../core/services/ruta.service';
import { RutaFrecuenteResponseDTO } from '../../../../core/models/ruta.model';
import { ChangeDetectorRef } from '@angular/core'; // fuerza a Angular a detectar y renderizar los cambios inmediatamente

//Para las gráficas
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartType, ChartDataset, ChartData, Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController} from 'chart.js';


// 🔹 Registrar los componentes de Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController);

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

  //====== TOTAL DE VIAJES ======
  totalViajes: number = 0; // Valor inicial 0

  constructor(private rutaService: RutaService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('ngOnInit ejecutado');
    const conductorId = 2; // ID hardcodeado para ejemplo
    this.obtenerTotalViajes(conductorId);
    this.cargarFrecuencia(conductorId);
  }

  obtenerTotalViajes(conductorId: number): void {
    this.rutaService.getTotalViajes(conductorId).subscribe({
      next: (data) => {
        console.log('Respuesta recibida:', data);
        console.log('Respuesta del backend (total viajes):', data); // log para verificar
        this.totalViajes = data ?? 0; // Si es null o undefined, muestra 0
        this.cdr.detectChanges(); // Forzar detección de cambios
      },
      error: (err) => {
        console.error('Error al obtener el total de viajes', err);
        this.totalViajes = 0; // Si hay error, queda 0
      }
    });
  }

  //====== FRECUENCIA DE VIAJES ======
  frecuenciaViajes: { [dia: string]: number } = {}; 
  diasSemana: string[] = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];


  // Getter para mostrar mensaje si no hay viajes
  get noTieneViajes(): boolean {
    return (
      !this.frecuenciaViajes ||
      Object.values(this.frecuenciaViajes).every(v => v === 0)
    );
  }

  // Configuración del gráfico
public barChartType: 'bar' = 'bar';

public barChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  scales: {
    x: {
      grid: {
        color: '#E0E0E0',     // Color de las líneas horizontales del fondo
        lineWidth: 3,          // Grosor de las líneas de la cuadrícula
      },
      ticks: {
        font: { size: 22.6 },
        color: '#000000ff'
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: '#E0E0E0',     // Color de las líneas horizontales del fondo
        lineWidth: 3,          // Grosor de las líneas de la cuadrícula
      },
      ticks: {
        stepSize: 1,
        font: { size: 22.6 },
        color: '#000000ff'
      }
    }
  },
  plugins: {
    legend: {
      labels: {
        font: { size: 22.6 },
        color: '#000000ff'
      }
    }
  }
};



// Aquí el tipo correcto es ChartData<ChartType>
public barChartData: ChartData<'bar'> = {
  labels: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
  datasets: [
    {
      data: [],
      label: 'Cantidad de viajes'
    }
  ]
};

cargarFrecuencia(conductorId: number) {
  this.rutaService.getFrecuenciaViajes(conductorId).subscribe({
    next: (data) => {
      console.log('Frecuencia:', data);
      this.frecuenciaViajes = data;

      // Actualizamos los valores en el dataset
      this.barChartData = {
        labels: this.diasSemana,
        datasets: [
          {
            data: this.diasSemana.map(d => data[d] ?? 0),
            label: 'Cantidad de viajes',
            backgroundColor: '#880D1E',
            borderWidth: 4,
          }
        ]
      };

      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error al obtener frecuencia de viajes', err);
      this.frecuenciaViajes = {};
      this.barChartData = {
        labels: this.diasSemana,
        datasets: [
          {
            data: [0, 0, 0, 0, 0, 0, 0],
            label: 'Cantidad de viajes'
          }
        ]
      };
    }
  });
}


  //=========== RUTAS FRECUENTES ===========
  rutasFrecuentes: RutaFrecuenteResponseDTO[] = [];

  obtenerRutasFrecuentes(conductorId: number): void {
    this.rutaService.getRutasMasFrecuentes(conductorId).subscribe({
      next: (data) => (this.rutasFrecuentes = data),
      error: (err) => {
        console.error('Error al obtener rutas frecuentes', err);
        this.rutasFrecuentes = [];
      },
    });
  

    //=========== DESCARGAR HISTORIAL EN PDF ===========


  }
}
