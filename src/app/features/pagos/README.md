# Módulo de Pagos - UniRide Frontend

## 📋 Descripción

Módulo completo para gestionar pagos en la aplicación UniRide. Integrado con el backend de Spring Boot.

## 🗂️ Estructura de Archivos

```
src/app/
├── core/
│   ├── models/
│   │   └── pago.model.ts          # Interfaces y enums de pagos
│   └── services/
│       └── pago.service.ts        # Servicio HTTP para pagos
└── features/
    └── pagos/
        ├── pages/
        │   ├── registrar-pago/    # Componente para registrar nuevo pago
        │   │   ├── registrar-pago.component.ts
        │   │   ├── registrar-pago.component.html
        │   │   └── registrar-pago.component.css
        │   └── mis-pagos/         # Componente para listar pagos
        │       ├── mis-pagos.component.ts
        │       ├── mis-pagos.component.html
        │       └── mis-pagos.component.css
        └── pagos.routes.ts        # Configuración de rutas
```

## 🚀 Rutas Disponibles

### Para Pasajeros:
- `/pagos/mis-pagos` - Listar todos los pagos realizados
- `/pagos/registrar?solicitudId=X` - Registrar un nuevo pago para una solicitud

## 📡 Endpoints del Backend

### POST /pagos
Registra un nuevo pago.

**Request Body:**
```json
{
  "monto": 15.00,
  "comision": 1.50,
  "medioPago": "YAPE",
  "estadoPago": "COMPLETADO",
  "fecha": "2025-12-02",
  "hora": "14:30:00",
  "solicitudViajeId": 123
}
```

**Response:**
```json
{
  "idPago": 1,
  "monto": 15.00,
  "comision": 1.50,
  "medioPago": "YAPE",
  "estadoPago": "COMPLETADO",
  "fecha": "2025-12-02",
  "hora": "14:30:00",
  "solicitudViajeId": 123
}
```

## 🎨 Características Implementadas

### ✅ Registrar Pago
- Formulario reactivo con validaciones
- Cálculo automático de comisión (10%)
- Pre-llenado de datos desde la solicitud
- Selección de medio de pago (Yape, Plin, Tarjeta, Efectivo, Transferencia)
- Estados de pago (Pendiente, Completado, Fallido, Reembolsado)
- Mensajes de éxito/error
- Redirección automática después de registrar

### ✅ Mis Pagos
- Lista de pagos en formato de tarjetas
- Visualización de todos los detalles del pago
- Badge con color según estado del pago
- Ordenamiento por fecha (más recientes primero)
- Estados vacíos/error/loading

## 🔧 Enums Disponibles

### EstadoPago
- `PENDIENTE` - Pago pendiente de confirmación
- `COMPLETADO` - Pago completado exitosamente
- `FALLIDO` - Pago fallido
- `REEMBOLSADO` - Pago reembolsado

### MedioPago
- `TARJETA` - Tarjeta de Crédito/Débito
- `YAPE` - Yape
- `PLIN` - Plin
- `EFECTIVO` - Efectivo
- `TRANSFERENCIA` - Transferencia Bancaria

## 💡 Cómo Usar

### 1. Desde Solicitudes
Desde la página de solicitudes del pasajero, agregar un botón de "Pagar":

```html
<button 
  class="btn-pagar" 
  [routerLink]="['/pagos/registrar']"
  [queryParams]="{ solicitudId: solicitud.idSolicitudViaje }">
  💳 Pagar
</button>
```

### 2. Ver Mis Pagos
Agregar enlace en el menú del pasajero:

```html
<a routerLink="/pagos/mis-pagos">
  💰 Mis Pagos
</a>
```

### 3. Integración con Backend
El servicio ya está configurado para usar el endpoint `/pagos` del backend. Asegúrate de que:
- El backend está corriendo en `http://localhost:8080`
- El token de autenticación está guardado en `localStorage` como `authToken`
- El usuario tiene rol `PASAJERO`, `CONDUCTOR` o `ADMIN`

## 🎯 Próximas Mejoras (Opcionales)

- [ ] Filtros por estado de pago
- [ ] Búsqueda por fecha
- [ ] Exportar historial de pagos a PDF/Excel
- [ ] Detalles de la solicitud asociada al hacer clic
- [ ] Notificaciones de pago completado
- [ ] Integración con pasarelas de pago reales

## 🐛 Debugging

Si encuentras errores, revisa:
1. Consola del navegador (logs con emojis 📤 ✅ ❌)
2. Network tab para ver las peticiones HTTP
3. Que el backend esté corriendo y accesible
4. Que el token de autenticación sea válido

## 📝 Notas

- La comisión se calcula automáticamente como el 10% del monto
- Los campos de fecha y hora se pre-llenan con la fecha/hora actual
- El estado por defecto es `PENDIENTE` al crear un pago
- Los pagos solo pueden ser creados por usuarios autenticados
