# DIAGRAMAS DE ARQUITECTURA
## Sistema de Reserva de Salas Deportivas y Materiales

---

## 1. DIAGRAMA DE FLUJO DE DATOS

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js 16)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐              │
│  │   Página    │   │  Dashboard  │   │    Auth     │              │
│  │ Principal   │   │   Panel     │   │   Login     │              │
│  │  (Pública)  │   │(Protegido)  │   │  Register   │              │
│  └──────┬──────┘   └──────┬──────┘   └──────┬──────┘              │
│         │                  │                  │                     │
│         │                  │                  │                     │
│  ┌──────┴──────────────────┴──────────────────┴──────┐             │
│  │                                                    │             │
│  │  ┌─────────────┐   ┌─────────────┐               │             │
│  │  │   Salas     │   │ Materiales  │               │             │
│  │  │ Deportivas  │   │ Deportivos  │               │             │
│  │  └──────┬──────┘   └──────┬──────┘               │             │
│  │         │                  │                      │             │
│  │         └─────────┬────────┘                      │             │
│  │                   │                               │             │
│  │         ┌─────────┴──────────┐                    │             │
│  │         │      Carrito       │                    │             │
│  │         └─────────┬──────────┘                    │             │
│  │                   │                               │             │
│  │         ┌─────────┴──────────┐                    │             │
│  │         │   Mis Reservas     │                    │             │
│  │         └─────────┬──────────┘                    │             │
│  │                   │                               │             │
│  │         ┌─────────┴──────────┐                    │             │
│  │         │   Panel Admin      │                    │             │
│  │         │  (Solo Admin/SA)   │                    │             │
│  │         └────────────────────┘                    │             │
│  │                                                    │             │
│  └────────────────────┬───────────────────────────────┘             │
│                       │                                             │
│                       │                                             │
└───────────────────────┼─────────────────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │      Supabase Client          │
        │  (Browser & Server)           │
        └───────────────┬───────────────┘
                        │
                        │ API Calls
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        BACKEND (Supabase)                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────┐          │
│  │            PostgreSQL Database                       │          │
│  │                                                      │          │
│  │  ┌─────────────────┐  ┌──────────────────┐          │          │
│  │  │   auth.users    │  │    profiles      │          │          │
│  │  │  (Auth Table)   │──│  (User Data)     │          │          │
│  │  └─────────────────┘  └──────────────────┘          │          │
│  │                                                      │          │
│  │  ┌─────────────────┐  ┌──────────────────┐          │          │
│  │  │  sports_rooms   │  │ sports_materials │          │          │
│  │  │   (Salas)       │  │   (Materiales)   │          │          │
│  │  └─────────────────┘  └──────────────────┘          │          │
│  │                                                      │          │
│  │  ┌──────────────────┐ ┌──────────────────┐          │          │
│  │  │room_reservations │ │material_reserv.. │          │          │
│  │  │ (Reservas Salas) │ │(Préstamo Mater.) │          │          │
│  │  └──────────────────┘ └──────────────────┘          │          │
│  │                                                      │          │
│  │  ┌──────────────────┐ ┌──────────────────┐          │          │
│  │  │blocked_schedules │ │reservation_remin.│          │          │
│  │  │  (Bloqueos)      │ │  (Recordatorios) │          │          │
│  │  └──────────────────┘ └──────────────────┘          │          │
│  │                                                      │          │
│  └──────────────────────────────────────────────────────┘          │
│                                                                     │
│  ┌──────────────────────────────────────────────────────┐          │
│  │         Row Level Security (RLS)                     │          │
│  │  - Usuarios ven solo sus datos                      │          │
│  │  - Admins ven todo                                   │          │
│  │  - Superadmins control total                         │          │
│  └──────────────────────────────────────────────────────┘          │
│                                                                     │
│  ┌──────────────────────────────────────────────────────┐          │
│  │         Supabase Auth Service                        │          │
│  │  - JWT Token Management                              │          │
│  │  - Session Management                                │          │
│  │  - Email Verification                                │          │
│  └──────────────────────────────────────────────────────┘          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
\`\`\`

---

## 2. ESQUEMA DE BASE DE DATOS

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                      auth.users                                 │
│                  (Supabase Auth)                                │
├─────────────────────────────────────────────────────────────────┤
│ id (UUID)                    PRIMARY KEY                        │
│ email (VARCHAR)              UNIQUE, NOT NULL                   │
│ encrypted_password (TEXT)                                       │
│ email_confirmed_at (TIMESTAMP)                                  │
│ created_at (TIMESTAMP)       DEFAULT NOW()                      │
│ updated_at (TIMESTAMP)                                          │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ FK: user_id
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                        profiles                                 │
│                   (Perfiles de Usuario)                         │
├─────────────────────────────────────────────────────────────────┤
│ id (UUID)                    PRIMARY KEY                        │
│ user_id (UUID)               REFERENCES auth.users(id)          │
│ email (VARCHAR)              NOT NULL                           │
│ full_name (VARCHAR)          NOT NULL                           │
│ role (TEXT)                  DEFAULT 'student'                  │
│                              CHECK IN ('student','admin',       │
│                                        'superadmin')            │
│ created_at (TIMESTAMP)       DEFAULT NOW()                      │
│ updated_at (TIMESTAMP)       DEFAULT NOW()                      │
├─────────────────────────────────────────────────────────────────┤
│ RLS POLICIES:                                                   │
│ - SELECT: auth.uid() = user_id OR role IN ('admin','superadmin')│
│ - UPDATE: auth.uid() = user_id OR role = 'superadmin'          │
│ - INSERT: Automático via trigger                               │
└────────────┬──────────────────────────────┬─────────────────────┘
             │                              │
             │ FK: user_id                  │ FK: user_id
             ▼                              ▼
┌─────────────────────────┐  ┌─────────────────────────────────────┐
│   room_reservations     │  │   material_reservations             │
│  (Reservas de Salas)    │  │  (Préstamos de Materiales)          │
├─────────────────────────┤  ├─────────────────────────────────────┤
│ id (UUID)        PK     │  │ id (UUID)                    PK     │
│ user_id (UUID)   FK     │  │ user_id (UUID)               FK     │
│ room_id (UUID)   FK     │  │ material_id (UUID)           FK     │
│ start_time (TIMESTAMP)  │  │ quantity (INTEGER)           NOT NULL│
│ end_time (TIMESTAMP)    │  │ pickup_date (DATE)           NOT NULL│
│ status (TEXT)           │  │ return_date (DATE)           NOT NULL│
│   DEFAULT 'confirmed'   │  │ actual_return_date (DATE)            │
│ created_at (TIMESTAMP)  │  │ status (TEXT)                        │
│ updated_at (TIMESTAMP)  │  │   DEFAULT 'active'                   │
├─────────────────────────┤  │ created_at (TIMESTAMP)               │
│ RLS POLICIES:           │  │ updated_at (TIMESTAMP)               │
│ - Users: Own data only  │  ├─────────────────────────────────────┤
│ - Admins: All data      │  │ RLS POLICIES:                        │
└──────────┬──────────────┘  │ - Users: Own data only               │
           │                 │ - Admins: All data                   │
           │ FK: room_id     └──────────┬──────────────────────────┘
           ▼                            │ FK: material_id
┌─────────────────────────┐             ▼
│     sports_rooms        │  ┌─────────────────────────────────────┐
│   (Salas Deportivas)    │  │      sports_materials               │
├─────────────────────────┤  │    (Materiales Deportivos)          │
│ id (UUID)        PK     │  ├─────────────────────────────────────┤
│ name (VARCHAR)   UNIQUE │  │ id (UUID)                    PK     │
│ sport_type (VARCHAR)    │  │ name (VARCHAR)               UNIQUE │
│ capacity (INTEGER)      │  │ category (VARCHAR)                  │
│ location (VARCHAR)      │  │ total_quantity (INTEGER)            │
│ description (TEXT)      │  │ available_quantity (INTEGER)        │
│ image_url (TEXT)        │  │ description (TEXT)                  │
│ is_available (BOOLEAN)  │  │ image_url (TEXT)                    │
│   DEFAULT true          │  │ sport_type (VARCHAR)                │
│ created_at (TIMESTAMP)  │  │ created_at (TIMESTAMP)              │
│ updated_at (TIMESTAMP)  │  │ updated_at (TIMESTAMP)              │
├─────────────────────────┤  ├─────────────────────────────────────┤
│ RLS POLICIES:           │  │ RLS POLICIES:                        │
│ - SELECT: PUBLIC        │  │ - SELECT: PUBLIC                     │
│ - INSERT/UPDATE/DELETE: │  │ - INSERT/UPDATE/DELETE:              │
│   Only Admins           │  │   Only Admins                        │
└──────────┬──────────────┘  └─────────────────────────────────────┘
           │
           │ FK: room_id
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   blocked_schedules                             │
│              (Horarios Bloqueados de Salas)                     │
├─────────────────────────────────────────────────────────────────┤
│ id (UUID)                    PRIMARY KEY                        │
│ room_id (UUID)               REFERENCES sports_rooms(id)        │
│ start_time (TIMESTAMP)       NOT NULL                           │
│ end_time (TIMESTAMP)         NOT NULL                           │
│ reason (TEXT)                                                   │
│ created_by (UUID)            REFERENCES profiles(id)            │
│ created_at (TIMESTAMP)       DEFAULT NOW()                      │
├─────────────────────────────────────────────────────────────────┤
│ RLS POLICIES:                                                   │
│ - SELECT: PUBLIC                                                │
│ - INSERT/UPDATE/DELETE: Only Admins                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                 reservation_reminders                           │
│                (Recordatorios de Reservas)                      │
├─────────────────────────────────────────────────────────────────┤
│ id (UUID)                    PRIMARY KEY                        │
│ user_id (UUID)               REFERENCES profiles(user_id)       │
│ reservation_id (UUID)        NOT NULL                           │
│ reservation_type (TEXT)      'room' or 'material'              │
│ reminder_time (TIMESTAMP)    NOT NULL                           │
│ sent (BOOLEAN)               DEFAULT false                      │
│ created_at (TIMESTAMP)       DEFAULT NOW()                      │
├─────────────────────────────────────────────────────────────────┤
│ RLS POLICIES:                                                   │
│ - SELECT: auth.uid() = user_id OR role = 'admin'               │
│ - INSERT: System only (triggers)                               │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

**RELACIONES:**
- `auth.users` 1:1 `profiles` (Automático via trigger)
- `profiles` 1:N `room_reservations`
- `profiles` 1:N `material_reservations`
- `sports_rooms` 1:N `room_reservations`
- `sports_rooms` 1:N `blocked_schedules`
- `sports_materials` 1:N `material_reservations`

---

## 3. ESTRUCTURA DE CARPETAS DEL PROYECTO

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│  📁 RAIZ DEL PROYECTO                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ├─ 📁 app/                    # Rutas y páginas (Next.js App Router)
│  │  │
│  │  ├─ 📁 api/                 # API Routes (Backend)
│  │  │  └─ 📁 auth/             # Endpoints de autenticación
│  │  │     └─ 📁 callback/
│  │  │        └─ route.ts       # Callback de Supabase Auth
│  │  │
│  │  ├─ 📁 auth/                # Autenticación
│  │  │  ├─ 📁 login/
│  │  │  │  └─ page.tsx          # Página de inicio de sesión
│  │  │  ├─ 📁 sign-up/
│  │  │  │  └─ page.tsx          # Página de registro
│  │  │  └─ 📁 sign-up-success/
│  │  │     └─ page.tsx          # Confirmación de registro
│  │  │
│  │  ├─ 📁 dashboard/           # Panel de Control (protegido)
│  │  │  ├─ layout.tsx           # Layout del dashboard
│  │  │  └─ page.tsx             # Página principal del dashboard
│  │  │
│  │  ├─ 📁 admin/               # Panel de Administración
│  │  │  └─ page.tsx             # Gestión de recursos y usuarios
│  │  │                          # (Solo Admin/Superadmin)
│  │  │
│  │  ├─ 📁 cart/                # Carrito de Compras
│  │  │  └─ page.tsx             # Ver y gestionar carrito
│  │  │
│  │  ├─ 📁 reservations/        # Mis Reservas
│  │  │  └─ page.tsx             # Historial de reservas del usuario
│  │  │
│  │  ├─ layout.tsx              # Layout raíz de la aplicación
│  │  ├─ page.tsx                # Página de inicio (Landing page)
│  │  └─ globals.css             # Estilos globales (Tailwind CSS)
│  │
│  ├─ 📁 components/             # Componentes React reutilizables
│  │  │
│  │  └─ 📁 ui/                  # Componentes UI base (shadcn/ui)
│  │     ├─ button.tsx           # Botón personalizable
│  │     ├─ card.tsx             # Tarjetas de contenido
│  │     ├─ dialog.tsx           # Modales
│  │     ├─ form.tsx             # Elementos de formulario
│  │     ├─ input.tsx            # Input de texto
│  │     ├─ label.tsx            # Etiquetas de formulario
│  │     ├─ select.tsx           # Selector dropdown
│  │     ├─ table.tsx            # Tablas de datos
│  │     ├─ tabs.tsx             # Pestañas de navegación
│  │     ├─ toast.tsx            # Notificaciones
│  │     ├─ toaster.tsx          # Contenedor de toasts
│  │     ├─ avatar.tsx           # Imágenes de perfil
│  │     ├─ badge.tsx            # Badges y etiquetas
│  │     ├─ calendar.tsx         # Selector de fechas
│  │     ├─ dropdown-menu.tsx    # Menús desplegables
│  │     ├─ navigation-menu.tsx  # Menú de navegación
│  │     ├─ popover.tsx          # Popovers
│  │     ├─ scroll-area.tsx      # Áreas con scroll
│  │     ├─ separator.tsx        # Separadores visuales
│  │     ├─ skeleton.tsx         # Loading skeletons
│  │     └─ ...                  # +30 componentes más
│  │
│  ├─ 📁 lib/                    # Librerías y utilidades
│  │  │
│  │  ├─ 📁 supabase/            # Configuración de Supabase
│  │  │  ├─ client.ts            # Cliente Supabase (Browser)
│  │  │  ├─ server.ts            # Cliente Supabase (Server)
│  │  │  └─ middleware.ts        # Middleware de autenticación
│  │  │
│  │  └─ utils.ts                # Funciones auxiliares
│  │                             # (cn, clsx, tailwind-merge)
│  │
│  ├─ 📁 hooks/                  # Custom React Hooks
│  │  ├─ use-mobile.tsx          # Hook para detección móvil
│  │  └─ use-toast.ts            # Hook para notificaciones
│  │
│  ├─ 📁 scripts/                # Scripts SQL
│  │  ├─ 001_create_tables.sql
│  │  │     # Crear todas las tablas y triggers
│  │  ├─ 002_seed_data.sql
│  │  │     # Datos de ejemplo (salas y materiales)
│  │  ├─ 003_update_roles_and_superadmin.sql
│  │  │     # Actualizar roles y crear superadmin
│  │  ├─ 004_fix_profiles_rls_policies.sql
│  │  │     # Corregir políticas RLS de profiles
│  │  ├─ 005_reset_all_profiles_policies.sql
│  │  │     # Resetear políticas de profiles
│  │  └─ 006_diagnose_and_fix_auth.sql
│  │        # Diagnóstico y corrección de auth
│  │
│  ├─ 📁 docs/                   # Documentación
│  │  ├─ manual-usuario.md       # Manual completo de usuario
│  │  ├─ arquitectura-sistema.md # Documentación de arquitectura
│  │  └─ diagramas-arquitectura.md # Este archivo
│  │
│  ├─ middleware.ts              # Middleware de Next.js
│  │                             # Protección de rutas y refresh tokens
│  │
│  ├─ package.json               # Dependencias del proyecto
│  ├─ tsconfig.json              # Configuración de TypeScript
│  ├─ next.config.mjs            # Configuración de Next.js
│  ├─ postcss.config.mjs         # Configuración de PostCSS
│  ├─ tailwind.config.ts         # Configuración de Tailwind CSS
│  ├─ components.json            # Configuración de shadcn/ui
│  ├─ .eslintrc.json             # Configuración de ESLint
│  ├─ .gitignore                 # Archivos ignorados por Git
│  └─ README.md                  # Documentación del proyecto
│
└─────────────────────────────────────────────────────────────────┘
\`\`\`

---

## 4. FLUJO DE AUTENTICACIÓN

\`\`\`
┌──────────────┐
│   Usuario    │
└──────┬───────┘
       │
       │ 1. Accede a /auth/login
       ▼
┌─────────────────────────────────────┐
│     app/auth/login/page.tsx         │
│  (Formulario de Login)              │
└──────────────┬──────────────────────┘
               │
               │ 2. Ingresa email/password
               │ 3. Clic en "Ingresar"
               ▼
┌─────────────────────────────────────┐
│   supabase.auth.signInWithPassword  │
│   (lib/supabase/client.ts)          │
└──────────────┬──────────────────────┘
               │
               │ 4. Envía credenciales
               ▼
┌─────────────────────────────────────┐
│      Supabase Auth Service          │
│  - Verifica email/password          │
│  - Genera JWT token                 │
│  - Crea sesión                      │
└──────────────┬──────────────────────┘
               │
               │ 5. Retorna { data, error }
               ▼
┌─────────────────────────────────────┐
│     Si error: Muestra mensaje       │
│     Si success: Redirección         │
└──────────────┬──────────────────────┘
               │
               │ 6. Router.push('/dashboard')
               ▼
┌─────────────────────────────────────┐
│         middleware.ts               │
│  - Intercepta la petición           │
│  - Verifica token JWT               │
│  - Refresca token si necesario      │
└──────────────┬──────────────────────┘
               │
               │ 7. Token válido
               ▼
┌─────────────────────────────────────┐
│    app/dashboard/page.tsx           │
│  - Consulta perfil del usuario      │
│  - Muestra dashboard personalizado  │
└─────────────────────────────────────┘
\`\`\`

---

## 5. FLUJO DE RESERVA DE SALA

\`\`\`
┌──────────────┐
│   Usuario    │
│ (Estudiante) │
└──────┬───────┘
       │
       │ 1. Va a Dashboard
       ▼
┌─────────────────────────────────────┐
│   app/dashboard/page.tsx            │
│  - Muestra tarjetas de recursos     │
│  - "Explorar Salas" button          │
└──────────────┬──────────────────────┘
               │
               │ 2. Clic en "Explorar Salas"
               ▼
┌─────────────────────────────────────┐
│   Sección "Salas Deportivas"        │
│  - Fetch de sports_rooms            │
│  - Filtros disponibles              │
└──────────────┬──────────────────────┘
               │
               │ 3. Usuario selecciona sala
               │    Elige fecha y hora
               ▼
┌─────────────────────────────────────┐
│   Validación de disponibilidad      │
│  - Verifica room_reservations       │
│  - Verifica blocked_schedules       │
└──────────────┬──────────────────────┘
               │
               ├─ Si ocupado: Muestra error
               │
               └─ Si disponible:
                  │
                  │ 4. "Agregar al Carrito"
                  ▼
┌─────────────────────────────────────┐
│   Estado del Carrito (React State)  │
│  - Agrega item temporalmente        │
│  - Actualiza contador               │
└──────────────┬──────────────────────┘
               │
               │ 5. Usuario va a /cart
               ▼
┌─────────────────────────────────────┐
│      app/cart/page.tsx              │
│  - Muestra items del carrito        │
│  - Botón "Confirmar Reservas"       │
└──────────────┬──────────────────────┘
               │
               │ 6. Clic en "Confirmar"
               ▼
┌─────────────────────────────────────┐
│   INSERT INTO room_reservations     │
│  {                                  │
│    user_id: auth.uid(),             │
│    room_id: selected_room,          │
│    start_time: selected_time,       │
│    end_time: calculated_end,        │
│    status: 'confirmed'              │
│  }                                  │
└──────────────┬──────────────────────┘
               │
               │ 7. RLS verifica permisos
               │    (usuario autenticado)
               ▼
┌─────────────────────────────────────┐
│      Base de Datos PostgreSQL       │
│  - Guarda reserva                   │
│  - Trigger crea reminder            │
└──────────────┬──────────────────────┘
               │
               │ 8. Retorna success
               ▼
┌─────────────────────────────────────┐
│   Notificación (Toast)              │
│  "Reserva confirmada con éxito"     │
│   + Email de confirmación           │
└──────────────┬──────────────────────┘
               │
               │ 9. Redirección
               ▼
┌─────────────────────────────────────┐
│   app/reservations/page.tsx         │
│  - Muestra la nueva reserva         │
│  - Estado: "Activa"                 │
└─────────────────────────────────────┘
\`\`\`

---

## 6. FLUJO DE ADMINISTRACIÓN (Panel Admin)

\`\`\`
┌──────────────┐
│Administrador │
│   o          │
│ Superadmin   │
└──────┬───────┘
       │
       │ 1. Inicia sesión
       ▼
┌─────────────────────────────────────┐
│      middleware.ts                  │
│  - Verifica token                   │
│  - Verifica rol en profiles         │
└──────────────┬──────────────────────┘
               │
               ├─ Si role = 'student': Acceso denegado
               │
               └─ Si role IN ('admin','superadmin'):
                  │
                  │ 2. Acceso permitido
                  ▼
┌─────────────────────────────────────┐
│      app/admin/page.tsx             │
│  ┌─────────────────────────────┐   │
│  │  Tab 1: Reservas            │   │
│  │  - Ver todas las reservas   │   │
│  │  - Filtrar por usuario      │   │
│  │  - Aprobar/Rechazar/Cancelar│   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │  Tab 2: Salas               │   │
│  │  - Crear nueva sala         │   │
│  │  - Editar salas existentes  │   │
│  │  - Eliminar salas           │   │
│  │  - Bloquear horarios        │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │  Tab 3: Materiales          │   │
│  │  - Gestionar inventario     │   │
│  │  - Ajustar stock            │   │
│  │  - Registrar devoluciones   │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │  Tab 4: Usuarios            │   │
│  │  (Solo Superadmin)          │   │
│  │  - Crear usuarios           │   │
│  │  - Cambiar roles            │   │
│  │  - Suspender cuentas        │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
\`\`\`

**PERMISOS POR ACCIÓN:**

\`\`\`
┌────────────────────┬──────────┬──────────┬──────────────┐
│      ACCIÓN        │ STUDENT  │  ADMIN   │ SUPERADMIN   │
├────────────────────┼──────────┼──────────┼──────────────┤
│ Ver salas          │    ✅    │    ✅    │      ✅      │
│ Ver materiales     │    ✅    │    ✅    │      ✅      │
│ Reservar           │    ✅    │    ✅    │      ✅      │
│ Ver propias reserv.│    ✅    │    ✅    │      ✅      │
│ Cancelar propias   │    ✅    │    ✅    │      ✅      │
├────────────────────┼──────────┼──────────┼──────────────┤
│ Ver todas reservas │    ❌    │    ✅    │      ✅      │
│ Crear salas        │    ❌    │    ✅    │      ✅      │
│ Editar salas       │    ❌    │    ✅    │      ✅      │
│ Eliminar salas     │    ❌    │    ✅    │      ✅      │
│ Gestionar materials│    ❌    │    ✅    │      ✅      │
│ Bloquear horarios  │    ❌    │    ✅    │      ✅      │
├────────────────────┼──────────┼──────────┼──────────────┤
│ Gestionar usuarios │    ❌    │    ❌    │      ✅      │
│ Cambiar roles      │    ❌    │    ❌    │      ✅      │
│ Ver logs auditoría │    ❌    │    ❌    │      ✅      │
│ Configurar sistema │    ❌    │    ❌    │      ✅      │
└────────────────────┴──────────┴──────────┴──────────────┘
\`\`\`

---

## 7. SEGURIDAD - POLÍTICAS RLS

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                    POLÍTICAS RLS POR TABLA                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TABLA: profiles                                                │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ SELECT:                                                   │ │
│  │   - Los usuarios pueden ver su propio perfil              │ │
│  │   - Los admins/superadmins pueden ver todos               │ │
│  │                                                           │ │
│  │   POLICY: auth.uid() = user_id OR                        │ │
│  │           role IN ('admin', 'superadmin')                │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ UPDATE:                                                   │ │
│  │   - Los usuarios pueden editar su propio perfil           │ │
│  │   - Los superadmins pueden editar cualquier perfil        │ │
│  │                                                           │ │
│  │   POLICY: auth.uid() = user_id OR                        │ │
│  │           role = 'superadmin'                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  TABLA: sports_rooms                                            │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ SELECT: Público (todos pueden ver)                       │ │
│  │   POLICY: true                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ INSERT/UPDATE/DELETE:                                     │ │
│  │   - Solo administradores                                  │ │
│  │                                                           │ │
│  │   POLICY: EXISTS (                                       │ │
│  │     SELECT 1 FROM profiles                               │ │
│  │     WHERE user_id = auth.uid()                           │ │
│  │     AND role IN ('admin', 'superadmin')                  │ │
│  │   )                                                      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  TABLA: sports_materials                                        │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ SELECT: Público (todos pueden ver)                       │ │
│  │   POLICY: true                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ INSERT/UPDATE/DELETE:                                     │ │
│  │   - Solo administradores                                  │ │
│  │                                                           │ │
│  │   POLICY: EXISTS (                                       │ │
│  │     SELECT 1 FROM profiles                               │ │
│  │     WHERE user_id = auth.uid()                           │ │
│  │     AND role IN ('admin', 'superadmin')                  │ │
│  │   )                                                      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  TABLA: room_reservations                                       │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ SELECT:                                                   │ │
│  │   - Usuarios ven solo sus propias reservas                │ │
│  │   - Admins ven todas                                      │ │
│  │                                                           │ │
│  │   POLICY: user_id = auth.uid() OR                        │ │
│  │           EXISTS (                                       │ │
│  │             SELECT 1 FROM profiles                       │ │
│  │             WHERE user_id = auth.uid()                   │ │
│  │             AND role IN ('admin', 'superadmin')          │ │
│  │           )                                              │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ INSERT:                                                   │ │
│  │   - Cualquier usuario autenticado                         │ │
│  │   - user_id debe ser = auth.uid()                         │ │
│  │                                                           │ │
│  │   POLICY: auth.uid() IS NOT NULL                         │ │
│  │           AND user_id = auth.uid()                       │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ UPDATE/DELETE:                                            │ │
│  │   - Usuario puede modificar/borrar sus propias           │ │
│  │   - Admins pueden modificar/borrar cualquiera            │ │
│  │                                                           │ │
│  │   POLICY: user_id = auth.uid() OR                        │ │
│  │           EXISTS (                                       │ │
│  │             SELECT 1 FROM profiles                       │ │
│  │             WHERE user_id = auth.uid()                   │ │
│  │             AND role IN ('admin', 'superadmin')          │ │
│  │           )                                              │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  TABLA: material_reservations                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ (Mismas políticas que room_reservations)                 │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  TABLA: blocked_schedules                                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ SELECT: Público (para mostrar indisponibilidad)          │ │
│  │   POLICY: true                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ INSERT/UPDATE/DELETE:                                     │ │
│  │   - Solo administradores                                  │ │
│  │                                                           │ │
│  │   POLICY: EXISTS (                                       │ │
│  │     SELECT 1 FROM profiles                               │ │
│  │     WHERE user_id = auth.uid()                           │ │
│  │     AND role IN ('admin', 'superadmin')                  │ │
│  │   )                                                      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

---

## 8. INTEGRACIÓN SUPABASE

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                    ARQUITECTURA SUPABASE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CLIENTE NAVEGADOR (Browser)                                    │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  lib/supabase/client.ts                                   │ │
│  │                                                           │ │
│  │  import { createBrowserClient } from '@supabase/ssr'     │ │
│  │                                                           │ │
│  │  export const supabase = createBrowserClient(            │ │
│  │    process.env.NEXT_PUBLIC_SUPABASE_URL,                 │ │
│  │    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY             │ │
│  │  )                                                       │ │
│  │                                                           │ │
│  │  USO: En Client Components                               │ │
│  │  - Autenticación (login, register)                       │ │
│  │  - Queries en cliente                                     │ │
│  │  - Subscripciones en tiempo real                          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  CLIENTE SERVIDOR (Server)                                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  lib/supabase/server.ts                                   │ │
│  │                                                           │ │
│  │  import { createServerClient } from '@supabase/ssr'      │ │
│  │  import { cookies } from 'next/headers'                  │ │
│  │                                                           │ │
│  │  export async function createClient() {                  │ │
│  │    const cookieStore = await cookies()                   │ │
│  │    return createServerClient(...)                        │ │
│  │  }                                                       │ │
│  │                                                           │ │
│  │  USO: En Server Components y API Routes                  │ │
│  │  - Fetch de datos en servidor                            │ │
│  │  - Operaciones protegidas                                 │ │
│  │  - Verificación de sesiones                               │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  MIDDLEWARE                                                     │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  middleware.ts                                            │ │
│  │                                                           │ │
│  │  import { updateSession } from './lib/supabase/middleware'│ │
│  │                                                           │ │
│  │  export async function middleware(request) {             │ │
│  │    return await updateSession(request)                   │ │
│  │  }                                                       │ │
│  │                                                           │ │
│  │  FUNCIONES:                                               │ │
│  │  - Intercepta todas las requests                          │ │
│  │  - Refresca tokens JWT expirados                          │ │
│  │  - Protege rutas privadas                                 │ │
│  │  - Redirige usuarios no autenticados                      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

---

## RESUMEN DE LA ARQUITECTURA

**Frontend:**
- Next.js 16 con App Router
- React 19 Server Components
- TypeScript para tipado estático
- Tailwind CSS + shadcn/ui para UI

**Backend:**
- Next.js API Routes (mínimo, mayoría en Server Components)
- Supabase como BaaS (Backend as a Service)
- PostgreSQL con Row Level Security

**Autenticación:**
- Supabase Auth con JWT
- Middleware para protección de rutas
- Roles: student, admin, superadmin

**Base de Datos:**
- 7 tablas principales
- Políticas RLS por tabla
- Triggers automáticos
- Relaciones bien definidas

**Seguridad:**
- Row Level Security (RLS)
- Autenticación JWT
- Validación cliente y servidor
- Políticas granulares por rol

**Deployment:**
- Vercel (hosting)
- Supabase (base de datos)
- Variables de entorno seguras
- CI/CD automático

---

**Documento creado:** Enero 2025  
**Versión:** 1.0  
**Sistema:** Reserva de Salas Deportivas y Materiales
