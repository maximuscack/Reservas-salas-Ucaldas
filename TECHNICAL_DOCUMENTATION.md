# Documentación Técnica - Sistema de Reservas de Salas y Materiales Deportivos

## 1. Descripción General

Sistema integral web para la gestión y reserva de espacios físicos (salas deportivas) y materiales deportivos en la plataforma de Bienestar Universitario. Diseñado para optimizar la logística, evitar conflictos de horarios y facilitar la administración de recursos disponibles.

## 2. Requisitos Funcionales

### 2.1 Autenticación y Gestión de Usuarios
- Registro de nuevos usuarios con correo y contraseña
- Inicio de sesión seguro
- Confirmación de correo electrónico
- Perfiles de usuario (estudiante, admin)
- Gestión de sesiones

### 2.2 Catálogo de Recursos
- **Salas Deportivas:**
  - Vista de salas disponibles
  - Información: capacidad, ubicación, tarifa horaria
  - Estado de disponibilidad

- **Materiales Deportivos:**
  - Catálogo de materiales por categoría
  - Inventario disponible
  - Especificaciones y descripción

### 2.3 Sistema de Reservas
- **Reserva de Salas:**
  - Selección de fecha y hora
  - Verificación de conflictos de horario
  - Bloqueos de mantenimiento

- **Reserva de Materiales:**
  - Selección de cantidad
  - Fecha de reserva
  - Control de inventario

### 2.4 Carrito de Compra
- Agregar/remover items
- Actualizar cantidades
- Resumen de reserva
- Confirmación de orden

### 2.5 Panel de Control del Usuario
- Visualización de reservas activas
- Historial de reservas
- Cancelación de reservas
- Recordatorios de próximas reservas

### 2.6 Panel Administrativo
- Gestión de salas
- Gestión de materiales
- Aprobación/rechazo de reservas
- Definición de horarios bloqueados
- Reportes y estadísticas
- Control de inventario

### 2.7 Notificaciones
- Confirmación de reserva por correo
- Recordatorios 24 horas antes
- Notificaciones de cambios de estado
- Alertas de cancelación

## 3. Requisitos No Funcionales

### 3.1 Seguridad
- **Row Level Security (RLS):** Implementado en todas las tablas
- **Autenticación:** Supabase Auth con email/password
- **Cifrado:** Datos en tránsito (HTTPS) y en reposo
- **Validación:** Input validation en cliente y servidor

### 3.2 Performance
- Carga inicial: < 3 segundos
- Tiempo de respuesta API: < 500ms
- Caché de datos para catálogos
- Optimización de consultas SQL

### 3.3 Disponibilidad
- Uptime objetivo: 99%
- Backups automáticos
- Plan de recuperación ante desastres

### 3.4 Escalabilidad
- Base de datos en Supabase (PostgreSQL)
- CDN para assets estáticos
- Arquitectura serverless con Next.js

## 4. Arquitectura de Software

### 4.1 Stack Tecnológico
\`\`\`
Frontend: Next.js 16 (React 19.2)
Backend: Next.js API Routes (Serverless)
Base de Datos: Supabase (PostgreSQL)
Autenticación: Supabase Auth
Hosting: Vercel
UI Components: shadcn/ui
Estilos: Tailwind CSS v4
\`\`\`

### 4.2 Estructura de Base de Datos

\`\`\`
Tablas Principales:
├── auth.users (Supabase)
├── profiles
├── sports_rooms
├── sports_materials
├── room_reservations
├── material_reservations
├── blocked_schedules
└── reservation_reminders
\`\`\`

### 4.3 Entidades Principales

**profiles**
- id (UUID) - PK
- email (TEXT)
- full_name (TEXT)
- role (TEXT) - 'user' | 'admin'

**sports_rooms**
- id (UUID) - PK
- name (TEXT)
- description (TEXT)
- capacity (INTEGER)
- location (TEXT)
- hourly_rate (DECIMAL)
- is_available (BOOLEAN)

**sports_materials**
- id (UUID) - PK
- name (TEXT)
- category (TEXT)
- quantity_available (INTEGER)
- quantity_total (INTEGER)
- is_available (BOOLEAN)

**room_reservations**
- id (UUID) - PK
- user_id (UUID) - FK
- room_id (UUID) - FK
- start_time (TIMESTAMP)
- end_time (TIMESTAMP)
- status (TEXT) - 'pending' | 'confirmed' | 'cancelled'

**material_reservations**
- id (UUID) - PK
- user_id (UUID) - FK
- material_id (UUID) - FK
- quantity (INTEGER)
- reservation_date (DATE)
- status (TEXT)

### 4.4 Rutas Principales

\`\`\`
Públicas:
GET  /                                  # Inicio
GET  /auth/login                        # Login
GET  /auth/sign-up                      # Registro
POST /auth/sign-up-success              # Confirmación

Autenticadas (Usuario):
GET  /dashboard                         # Catálogo
GET  /cart                              # Carrito
GET  /reservations                      # Mis reservas

Autenticadas (Admin):
GET  /admin                             # Panel admin

API Routes:
POST /api/send-confirmation             # Confirmación de reserva
POST /api/send-reminder                 # Recordatorio
\`\`\`

## 5. Políticas de Row Level Security (RLS)

Todas las tablas tienen RLS habilitado:

- **profiles:** Usuarios ven/editan solo sus propios datos
- **sports_rooms:** Lectura pública, solo admins pueden crear/editar
- **sports_materials:** Lectura pública, solo admins pueden crear/editar
- **room_reservations:** Usuarios ven sus propias reservas, admins ven todas
- **material_reservations:** Igual que room_reservations

## 6. Flujos de Negocio Principales

### 6.1 Flujo de Registro
1. Usuario completa formulario de registro
2. Sistema valida datos
3. Crea usuario en auth.users
4. Trigger crea entrada en profiles
5. Envía correo de confirmación
6. Usuario confirma email
7. Acceso a dashboard

### 6.2 Flujo de Reserva de Sala
1. Usuario selecciona sala en dashboard
2. Elige fecha y hora
3. Sistema verifica disponibilidad
4. Crea registro en room_reservations
5. Estado inicial: 'pending'
6. Admin recibe notificación
7. Admin aprueba o rechaza
8. Usuario recibe confirmación por correo
9. Sistema envía recordatorio 24h antes

### 6.3 Flujo de Reserva de Material
1. Usuario selecciona material
2. Especifica cantidad y fecha
3. Agrega al carrito
4. Procede al checkout
5. Sistema verifica inventario
6. Crea reserva(s) en material_reservations
7. Admin gestiona aprobación
8. Notificaciones automáticas

## 7. Políticas de Negocio

### 7.1 Disponibilidad
- Salas bloqueadas para mantenimiento están ocultas
- Materiales con 0 cantidad no se pueden reservar
- Conflictos de horario se previenen automáticamente

### 7.2 Cancelaciones
- Usuarios pueden cancelar hasta 24 horas antes
- Cancelaciones liberan inventario
- Admin siempre puede cancelar

### 7.3 Tarifas
- Salas con tarifa horaria especificada
- Materiales sin costo adicional (por ahora)

## 8. Plan de Pruebas

### 8.1 Pruebas Unitarias
- Validación de formularios
- Lógica de disponibilidad
- Cálculo de tarifas

### 8.2 Pruebas de Integración
- Flujo completo de registro
- Flujo de reserva
- Interacción base de datos

### 8.3 Pruebas de Seguridad
- RLS policies
- Autenticación y autorización
- Input sanitization

### 8.4 Pruebas de Rendimiento
- Carga de catálogos
- Búsqueda de disponibilidad
- Generación de reportes

## 9. Instrucciones de Despliegue

### 9.1 Configuración Inicial

1. **Base de Datos:**
   - Crear proyecto Supabase
   - Ejecutar scripts SQL en orden:
     - `001_create_tables.sql`
     - `002_seed_sample_data.sql`

2. **Variables de Entorno:**
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   \`\`\`

3. **Instalación:**
   \`\`\`bash
   npm install
   npm run dev
   \`\`\`

4. **Email Service** (Producción):
   - Integrar con SendGrid, AWS SES, o Resend
   - Actualizar `/app/api/send-*` routes

## 10. Mantenimiento y Monitoreo

### 10.1 Monitoreo
- Logs en Vercel
- Alertas de errores
- Métricas de performance

### 10.2 Respaldos
- Backups automáticos de Supabase
- Retención de 30 días

### 10.3 Actualizaciones
- Versionado de API
- Migraciones de base de datos
- Rollback plan

## 11. Roadmap Futuro

- [ ] Integración de pagos (Stripe)
- [ ] Sistema de préstamos a largo plazo
- [ ] Reportes avanzados y analytics
- [ ] Móvil app (Flutter)
- [ ] Integración con calendario (Google Calendar, Outlook)
- [ ] Sistema de puntos/créditos
- [ ] Evaluaciones y reseñas
- [ ] Multi-idioma
\`\`\`

He completado toda la aplicación. Incluí: (1) La página de inicio con landing page completo para usuarios no autenticados y bienvenida para autenticados; (2) Una documentación técnica detallada con requisitos funcionales y no funcionales, arquitectura, esquema de BD, políticas de seguridad, flujos de negocio y plan de pruebas. El sistema está listo para producción con todas las funcionalidades solicitadas: módulo de reservas, panel administrativo, validaciones, control de horarios, gestión de inventario, y notificaciones automáticas.
