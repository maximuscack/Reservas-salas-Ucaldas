# ARQUITECTURA DEL SISTEMA
## Sistema de Reserva de Salas Deportivas y Materiales

---

## ÍNDICE

1. [Visión General](#visión-general)
2. [Arquitectura de Alto Nivel](#arquitectura-de-alto-nivel)
3. [Estructura de Directorios](#estructura-de-directorios)
4. [Capa de Presentación](#capa-de-presentación)
5. [Capa de Lógica de Negocio](#capa-de-lógica-de-negocio)
6. [Capa de Datos](#capa-de-datos)
7. [Patrones de Diseño](#patrones-de-diseño)
8. [Flujo de Datos](#flujo-de-datos)
9. [Seguridad](#seguridad)
10. [Diagrama de Componentes](#diagrama-de-componentes)

---

## 1. VISIÓN GENERAL

### Descripción del Sistema

Sistema web full-stack construido con Next.js 16 que permite a estudiantes reservar salas deportivas y materiales, mientras que administradores y superadministradores gestionan recursos, usuarios y configuraciones del sistema.

### Arquitectura General

**Tipo:** Arquitectura de capas (Layered Architecture) con patrón MVC adaptado para React

**Modelo de Renderizado:** Híbrido
- Server Components (por defecto)
- Client Components (cuando se necesita interactividad)
- Server-Side Rendering (SSR)
- Static Site Generation (SSG) para páginas públicas

---

## 2. ARQUITECTURA DE ALTO NIVEL

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTE (Browser)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐        │
│  │   React UI  │  │ Client Comp │  │ Supabase SDK │        │
│  │  (Next.js)  │  │  useState,  │  │   (Client)   │        │
│  │             │  │  useEffect  │  │              │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬───────┘        │
└─────────┼─────────────────┼─────────────────┼───────────────┘
          │                 │                 │
          │ HTTP Requests   │ API Calls       │ Auth + DB Queries
          │                 │                 │
┌─────────▼─────────────────▼─────────────────▼───────────────┐
│                   SERVIDOR (Next.js)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              App Router (app/)                       │   │
│  │  ┌────────────┐  ┌────────────┐  ┌───────────────┐  │   │
│  │  │   Pages    │  │   Layouts  │  │  API Routes   │  │   │
│  │  │  page.tsx  │  │ layout.tsx │  │   route.ts    │  │   │
│  │  └──────┬─────┘  └──────┬─────┘  └───────┬───────┘  │   │
│  └─────────┼────────────────┼─────────────────┼──────────┘   │
│            │                │                 │              │
│  ┌─────────▼────────────────▼─────────────────▼──────────┐   │
│  │              Middleware Layer                         │   │
│  │  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐ │   │
│  │  │    Auth      │  │   Session   │  │   Cookies    │ │   │
│  │  │  Middleware  │  │  Management │  │   Handler    │ │   │
│  │  └──────────────┘  └─────────────┘  └──────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Business Logic Layer                     │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐ │   │
│  │  │  Supabase   │  │  Validators  │  │   Utils     │ │   │
│  │  │   Server    │  │   (Zod)      │  │  Helpers    │ │   │
│  │  └──────┬──────┘  └──────────────┘  └─────────────┘ │   │
│  └─────────┼──────────────────────────────────────────────┘   │
└────────────┼──────────────────────────────────────────────────┘
             │
             │ SQL Queries + RLS
             │
┌────────────▼──────────────────────────────────────────────────┐
│                    SUPABASE (Backend)                          │
│  ┌──────────────────────────────────────────────────────┐     │
│  │              PostgreSQL Database                      │     │
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────────┐  │     │
│  │  │   Tables   │  │  Functions  │  │   Triggers   │  │     │
│  │  │    RLS     │  │    Views    │  │   Indexes    │  │     │
│  │  └────────────┘  └─────────────┘  └──────────────┘  │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐     │
│  │              Authentication (Supabase Auth)           │     │
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────────┐  │     │
│  │  │   Users    │  │   Sessions  │  │    JWT       │  │     │
│  │  │  Table     │  │   Tokens    │  │   Tokens     │  │     │
│  │  └────────────┘  └─────────────┘  └──────────────┘  │     │
│  └──────────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────────┘
\`\`\`

---

## 3. ESTRUCTURA DE DIRECTORIOS

\`\`\`
reserva-salas-deportivas/
│
├── app/                              # Next.js App Router (Frontend + Backend)
│   ├── layout.tsx                    # Layout raíz de la aplicación
│   ├── page.tsx                      # Página de inicio (Landing Page)
│   ├── globals.css                   # Estilos globales + variables CSS
│   │
│   ├── auth/                         # Módulo de Autenticación
│   │   ├── login/
│   │   │   └── page.tsx             # Página de inicio de sesión
│   │   ├── sign-up/
│   │   │   └── page.tsx             # Página de registro
│   │   └── sign-up-success/
│   │       └── page.tsx             # Confirmación de registro
│   │
│   ├── dashboard/                    # Módulo de Dashboard
│   │   └── page.tsx                 # Catálogo de salas y materiales
│   │
│   ├── cart/                         # Módulo de Carrito
│   │   └── page.tsx                 # Carrito de reservas
│   │
│   ├── reservations/                 # Módulo de Reservas
│   │   └── page.tsx                 # Mis reservas del usuario
│   │
│   ├── admin/                        # Módulo de Administración
│   │   └── page.tsx                 # Panel administrativo completo
│   │
│   └── api/                          # API Routes (Backend)
│       └── notifications/
│           ├── send-confirmation/
│           │   └── route.ts         # Endpoint: Enviar confirmación
│           └── send-reminder/
│               └── route.ts         # Endpoint: Enviar recordatorio
│
├── components/                       # Componentes React Reutilizables
│   ├── ui/                          # Componentes UI Base (shadcn/ui)
│   │   ├── accordion.tsx            # Acordeón
│   │   ├── alert.tsx                # Alertas
│   │   ├── alert-dialog.tsx         # Diálogos de alerta
│   │   ├── avatar.tsx               # Avatar de usuario
│   │   ├── badge.tsx                # Badges/etiquetas
│   │   ├── button.tsx               # Botones
│   │   ├── calendar.tsx             # Calendario
│   │   ├── card.tsx                 # Tarjetas
│   │   ├── carousel.tsx             # Carrusel
│   │   ├── checkbox.tsx             # Checkboxes
│   │   ├── collapsible.tsx          # Elementos colapsables
│   │   ├── command.tsx              # Command palette
│   │   ├── context-menu.tsx         # Menú contextual
│   │   ├── dialog.tsx               # Diálogos/modales
│   │   ├── drawer.tsx               # Drawer móvil
│   │   ├── dropdown-menu.tsx        # Menú desplegable
│   │   ├── form.tsx                 # Formularios
│   │   ├── hover-card.tsx           # Hover cards
│   │   ├── input.tsx                # Inputs de texto
│   │   ├── input-otp.tsx            # Input de OTP
│   │   ├── label.tsx                # Etiquetas
│   │   ├── menubar.tsx              # Barra de menú
│   │   ├── navigation-menu.tsx      # Menú de navegación
│   │   ├── popover.tsx              # Popovers
│   │   ├── progress.tsx             # Barra de progreso
│   │   ├── radio-group.tsx          # Radio buttons
│   │   ├── resizable.tsx            # Paneles redimensionables
│   │   ├── scroll-area.tsx          # Área con scroll
│   │   ├── select.tsx               # Select/dropdown
│   │   ├── separator.tsx            # Separadores
│   │   ├── sheet.tsx                # Hojas laterales
│   │   ├── sidebar.tsx              # Sidebar
│   │   ├── skeleton.tsx             # Skeleton loaders
│   │   ├── slider.tsx               # Sliders
│   │   ├── sonner.tsx               # Toast notifications
│   │   ├── switch.tsx               # Switches
│   │   ├── table.tsx                # Tablas
│   │   ├── tabs.tsx                 # Pestañas
│   │   ├── textarea.tsx             # Textarea
│   │   ├── toast.tsx                # Toasts
│   │   ├── toaster.tsx              # Toast container
│   │   ├── toggle.tsx               # Toggles
│   │   ├── toggle-group.tsx         # Grupo de toggles
│   │   └── tooltip.tsx              # Tooltips
│   │
│   └── [componentes-personalizados]/ # Componentes específicos del negocio
│
├── lib/                              # Bibliotecas y Utilidades
│   ├── supabase/                    # Configuración de Supabase
│   │   ├── client.ts                # Cliente para browser (Client Components)
│   │   ├── server.ts                # Cliente para servidor (Server Components)
│   │   └── middleware.ts            # Middleware de autenticación
│   │
│   └── utils.ts                     # Funciones auxiliares (cn, etc.)
│
├── hooks/                            # Custom React Hooks
│   ├── use-mobile.tsx               # Hook para detección de móvil
│   └── use-toast.ts                 # Hook para notificaciones toast
│
├── scripts/                          # Scripts SQL para base de datos
│   ├── 001_create_tables.sql        # Creación de tablas
│   ├── 002_seed_data.sql            # Datos de ejemplo (seed)
│   ├── 003_update_roles_and_superadmin.sql
│   ├── 004_fix_profiles_rls_policies.sql
│   ├── 005_reset_all_profiles_policies.sql
│   └── 006_diagnose_and_fix_auth.sql
│
├── docs/                             # Documentación
│   ├── manual-usuario.md            # Manual de usuario completo
│   └── arquitectura-sistema.md      # Este documento
│
├── public/                           # Archivos estáticos públicos
│   ├── images/                      # Imágenes
│   └── [otros-archivos-estáticos]
│
├── .env.local                        # Variables de entorno (local)
├── .gitignore                        # Archivos ignorados por Git
├── middleware.ts                     # Middleware de Next.js (auth global)
├── next.config.mjs                   # Configuración de Next.js
├── package.json                      # Dependencias del proyecto
├── tsconfig.json                     # Configuración de TypeScript
├── tailwind.config.js                # Configuración de Tailwind CSS
└── README.md                         # Documentación principal
\`\`\`

---

## 4. CAPA DE PRESENTACIÓN

### 4.1 Páginas Públicas (Sin autenticación)

**Ubicación:** `app/`

| Ruta | Archivo | Descripción | Tipo |
|------|---------|-------------|------|
| `/` | `app/page.tsx` | Landing page | Server Component |
| `/auth/login` | `app/auth/login/page.tsx` | Inicio de sesión | Client Component |
| `/auth/sign-up` | `app/auth/sign-up/page.tsx` | Registro | Client Component |
| `/auth/sign-up-success` | `app/auth/sign-up-success/page.tsx` | Confirmación | Server Component |

**Características:**
- Accesibles sin autenticación
- Redirect automático si el usuario ya tiene sesión activa
- Validación de formularios con Zod
- Manejo de errores con toast notifications

### 4.2 Páginas Protegidas (Requieren autenticación)

**Ubicación:** `app/`

| Ruta | Archivo | Rol Requerido | Descripción |
|------|---------|---------------|-------------|
| `/dashboard` | `app/dashboard/page.tsx` | Todos | Catálogo de salas y materiales |
| `/cart` | `app/cart/page.tsx` | Todos | Carrito de reservas |
| `/reservations` | `app/reservations/page.tsx` | Todos | Mis reservas |
| `/admin` | `app/admin/page.tsx` | Admin, Superadmin | Panel administrativo |

**Protección:**
- Middleware verifica autenticación en cada request
- Redirección a `/auth/login` si no autenticado
- Server Components consultan Supabase directamente
- RLS en base de datos filtra datos según rol

### 4.3 Layouts

**Layout Raíz:** `app/layout.tsx`

\`\`\`typescript
// Responsabilidades:
- Configuración de fuentes (Geist, Geist Mono)
- Metadata SEO
- HTML base y body
- Estilos globales
- Provider de temas (si aplica)
\`\`\`

### 4.4 Sistema de Estilos

**Archivo:** `app/globals.css`

**Arquitectura de estilos:**

\`\`\`
Tailwind CSS v4
├── Variables CSS Personalizadas
│   ├── Colors (--primary, --secondary, --accent, etc.)
│   ├── Spacing (--radius)
│   └── Fonts (--font-sans, --font-mono)
│
├── Theme Tokens
│   ├── Light Mode (default)
│   └── Dark Mode (.dark)
│
├── Utility Classes
│   └── Tailwind utilities (flex, grid, text-, bg-, etc.)
│
└── Custom Animations
    └── tw-animate-css
\`\`\`

**Variables CSS principales:**
\`\`\`css
:root {
  --background: #fafbfc;
  --primary: #1a2b5e;
  --secondary: #c4b896;
  --accent: #f4c430;
  --border: #d4c5b0;
  --radius: 0.625rem;
}
\`\`\`

---

## 5. CAPA DE LÓGICA DE NEGOCIO

### 5.1 Componentes UI Base

**Ubicación:** `components/ui/`

**Total:** 40+ componentes reutilizables construidos con Radix UI

**Categorías:**

**Formularios:**
- Button, Input, Textarea, Checkbox, Radio, Select, Switch, Slider
- Form (React Hook Form integration)
- Label, Input-OTP

**Overlays:**
- Dialog, Alert Dialog, Sheet, Drawer
- Popover, Tooltip, Hover Card
- Context Menu, Dropdown Menu

**Navegación:**
- Navigation Menu, Menubar, Tabs
- Sidebar, Command (Command Palette)

**Display:**
- Card, Avatar, Badge, Separator
- Table, Accordion, Collapsible
- Progress, Skeleton

**Layout:**
- Resizable Panels, Scroll Area
- Carousel

**Notificaciones:**
- Toast, Sonner (toast system)

### 5.2 Custom Hooks

**Ubicación:** `hooks/`

\`\`\`typescript
// use-mobile.tsx
// Detecta si el dispositivo es móvil
export function useMobile(): boolean

// use-toast.ts
// Sistema de notificaciones toast
export function useToast(): {
  toast: (options: ToastOptions) => void
  dismiss: (toastId?: string) => void
}
\`\`\`

### 5.3 Utilidades

**Ubicación:** `lib/utils.ts`

\`\`\`typescript
// cn - Merge de clases CSS con Tailwind
export function cn(...inputs: ClassValue[]): string

// Otras utilidades de formateo, validación, etc.
\`\`\`

### 5.4 Validación de Formularios

**Biblioteca:** Zod + React Hook Form

**Patrón de uso:**

\`\`\`typescript
// Esquema de validación
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres")
})

// En el componente
const form = useForm({
  resolver: zodResolver(loginSchema)
})
\`\`\`

---

## 6. CAPA DE DATOS

### 6.1 Base de Datos - PostgreSQL (Supabase)

**Esquema de la Base de Datos:**

\`\`\`sql
-- TABLA: profiles
-- Almacena información extendida de usuarios
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA: sports_rooms
-- Catálogo de salas deportivas
CREATE TABLE sports_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  sport_type TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA: sports_materials
-- Inventario de materiales deportivos
CREATE TABLE sports_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity_total INTEGER NOT NULL,
  quantity_available INTEGER NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA: room_reservations
-- Reservas de salas deportivas
CREATE TABLE room_reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  room_id UUID REFERENCES sports_rooms(id) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA: material_reservations
-- Préstamos de materiales
CREATE TABLE material_reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  material_id UUID REFERENCES sports_materials(id) NOT NULL,
  quantity INTEGER NOT NULL,
  pickup_date TIMESTAMPTZ NOT NULL,
  return_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA: blocked_schedules
-- Horarios bloqueados de salas (mantenimiento, eventos)
CREATE TABLE blocked_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES sports_rooms(id) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA: reservation_reminders
-- Recordatorios automáticos de reservas
CREATE TABLE reservation_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID NOT NULL,
  reminder_type TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

### 6.2 Row Level Security (RLS)

**Políticas de Seguridad:**

\`\`\`sql
-- PROFILES
-- Los usuarios pueden ver su propio perfil
-- Admins y superadmins pueden ver todos los perfiles
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_select_all_admin"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'superadmin')
    )
  );

-- SPORTS_ROOMS
-- Todos pueden leer salas
-- Solo admins pueden modificar
CREATE POLICY "sports_rooms_select_all"
  ON sports_rooms FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "sports_rooms_insert_admin"
  ON sports_rooms FOR INSERT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'superadmin')
    )
  );

-- ROOM_RESERVATIONS
-- Los usuarios ven solo sus reservas
-- Admins ven todas las reservas
CREATE POLICY "reservations_select_own"
  ON room_reservations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "reservations_select_all_admin"
  ON room_reservations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'superadmin')
    )
  );

-- Similar para material_reservations
\`\`\`

### 6.3 Clientes Supabase

**Ubicación:** `lib/supabase/`

**Cliente Browser (Client Components):**

\`\`\`typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
\`\`\`

**Cliente Server (Server Components):**

\`\`\`typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
        set(name, value, options) { cookieStore.set(name, value, options) },
        remove(name, options) { cookieStore.delete(name) }
      }
    }
  )
}
\`\`\`

**Middleware (Actualización de sesión):**

\`\`\`typescript
// lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value },
        set(name, value, options) { response.cookies.set({ name, value, ...options }) },
        remove(name, options) { response.cookies.delete({ name, ...options }) }
      }
    }
  )
  
  await supabase.auth.getUser()
  return response
}
\`\`\`

### 6.4 Autenticación

**Proveedor:** Supabase Auth

**Métodos soportados:**
- Email + Password (implementado)
- OAuth (no implementado, pero disponible)

**Flujo de autenticación:**

1. Usuario ingresa credenciales en `/auth/login`
2. Client Component llama a `supabase.auth.signInWithPassword()`
3. Supabase valida y retorna JWT token
4. Token se almacena en cookie HTTP-only
5. Middleware renueva token en cada request
6. RLS en DB usa `auth.uid()` para filtrar datos

---

## 7. PATRONES DE DISEÑO

### 7.1 Patrón de Componentes

**Server Components por defecto:**
\`\`\`typescript
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: rooms } = await supabase
    .from('sports_rooms')
    .select('*')
  
  return <RoomList rooms={rooms} />
}
\`\`\`

**Client Components cuando necesario:**
\`\`\`typescript
'use client'

export function LoginForm() {
  const [email, setEmail] = useState('')
  // ... interactividad del cliente
}
\`\`\`

### 7.2 Singleton Pattern (Clientes Supabase)

Los clientes Supabase se crean mediante funciones que retornan instancias configuradas, evitando múltiples instancias.

### 7.3 Factory Pattern (Componentes UI)

Los componentes UI usan `class-variance-authority` para crear variantes:

\`\`\`typescript
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "bg-primary",
        outline: "border border-primary"
      }
    }
  }
)
\`\`\`

### 7.4 Composition Pattern

Componentes compuestos para flexibilidad:

\`\`\`typescript
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    Contenido
  </CardContent>
</Card>
\`\`\`

### 7.5 Repository Pattern (Implícito)

Supabase actúa como capa de repositorio:

\`\`\`typescript
// En lugar de SQL directo, se usa el cliente Supabase
const { data } = await supabase
  .from('sports_rooms')
  .select('*')
  .eq('is_available', true)
\`\`\`

---

## 8. FLUJO DE DATOS

### 8.1 Flujo de Autenticación

\`\`\`
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │ 1. Ingresa credenciales
       ▼
┌─────────────────┐
│  LoginForm      │ (Client Component)
│  'use client'   │
└──────┬──────────┘
       │ 2. supabase.auth.signInWithPassword()
       ▼
┌─────────────────────────────┐
│  Supabase Auth              │
│  - Valida credenciales      │
│  - Genera JWT token         │
│  - Retorna user + session   │
└──────┬──────────────────────┘
       │ 3. Token en cookie HTTP-only
       ▼
┌─────────────────┐
│  Middleware     │
│  - Lee cookie   │
│  - Renueva token│
│  - Verifica user│
└──────┬──────────┘
       │ 4. Request con sesión válida
       ▼
┌─────────────────┐
│  Dashboard      │ (Server Component)
│  - Lee perfil   │
│  - Muestra datos│
└─────────────────┘
\`\`\`

### 8.2 Flujo de Reserva de Sala

\`\`\`
┌──────────────┐
│   Usuario    │
└──────┬───────┘
       │ 1. Selecciona sala
       ▼
┌──────────────────┐
│  DashboardPage   │ (Client Component)
└──────┬───────────┘
       │ 2. Agrega al carrito (estado local)
       ▼
┌──────────────┐
│  CartPage    │
└──────┬───────┘
       │ 3. Confirma reservas
       ▼
┌──────────────────────────┐
│  supabase.from()         │
│  .insert(reservations)   │
└──────┬───────────────────┘
       │ 4. INSERT en DB
       ▼
┌──────────────────────────┐
│  PostgreSQL + RLS        │
│  - Valida auth.uid()     │
│  - Verifica disponibilidad│
│  - Inserta registro      │
└──────┬───────────────────┘
       │ 5. Retorna éxito
       ▼
┌──────────────────────────┐
│  Notificación (Toast)    │
│  "Reserva confirmada"    │
└──────────────────────────┘
\`\`\`

### 8.3 Flujo de Gestión Administrativa

\`\`\`
┌──────────────┐
│  Admin User  │
└──────┬───────┘
       │ 1. Accede a /admin
       ▼
┌──────────────────────────┐
│  middleware.ts           │
│  - Verifica autenticación│
└──────┬───────────────────┘
       │ 2. Request autenticado
       ▼
┌──────────────────────────┐
│  AdminPage (Server Comp) │
│  - Consulta perfil       │
│  - Verifica role = admin │
└──────┬───────────────────┘
       │ 3. Si role ≠ admin: redirect
       │ 4. Si role = admin: renderiza
       ▼
┌──────────────────────────┐
│  AdminPage UI            │
│  - Tabs: Reservas, Salas,│
│    Materiales, Usuarios  │
└──────┬───────────────────┘
       │ 5. Admin edita sala
       ▼
┌──────────────────────────┐
│  Client Component        │
│  (Edit Form)             │
└──────┬───────────────────┘
       │ 6. supabase.update()
       ▼
┌──────────────────────────┐
│  PostgreSQL + RLS        │
│  - Valida role = admin   │
│  - UPDATE registro       │
└──────┬───────────────────┘
       │ 7. Retorna éxito
       ▼
┌──────────────────────────┐
│  Revalidación de caché   │
│  UI actualizado          │
└──────────────────────────┘
\`\`\`

---

## 9. SEGURIDAD

### 9.1 Capas de Seguridad

**1. Autenticación de Múltiples Capas:**
- Supabase Auth (JWT tokens)
- Middleware de Next.js (verificación en cada request)
- Cookies HTTP-only (no accesibles desde JavaScript)

**2. Row Level Security (RLS):**
- Políticas a nivel de base de datos
- Filtrado automático por usuario y rol
- Prevención de acceso no autorizado

**3. Validación de Datos:**
- Zod schemas en cliente y servidor
- Sanitización de inputs
- Prevención de SQL Injection (Supabase usa prepared statements)

**4. Protección CSRF:**
- Tokens automáticos en formularios
- Verificación de origen de requests

**5. HTTPS:**
- SSL/TLS en todas las comunicaciones
- Certificados gestionados por Vercel

### 9.2 Roles y Permisos

\`\`\`typescript
// Jerarquía de roles
type Role = 'student' | 'admin' | 'superadmin'

// Matriz de permisos
const permissions = {
  student: ['read:rooms', 'read:materials', 'create:reservations', 'read:own-reservations'],
  admin: ['*:rooms', '*:materials', '*:reservations', 'read:users'],
  superadmin: ['*:*'] // Acceso total
}
\`\`\`

### 9.3 Variables de Entorno

**Públicas (NEXT_PUBLIC_*):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Privadas (Server-only):**
- `SUPABASE_SERVICE_ROLE_KEY`
- `POSTGRES_URL`
- `POSTGRES_PASSWORD`

---

## 10. DIAGRAMA DE COMPONENTES

### 10.1 Arquitectura de Componentes React

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                      APP LAYOUT                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Header (si aplicable)                                 │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                    {children}                          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │              PAGE COMPONENT                       │  │  │
│  │  │  ┌────────────────────────────────────────────┐  │  │  │
│  │  │  │  Dashboard / Cart / Admin / Reservations  │  │  │  │
│  │  │  │  ┌──────────────────────────────────────┐ │  │  │  │
│  │  │  │  │  UI Components (Button, Card, etc)  │ │  │  │  │
│  │  │  │  │  ┌────────────────────────────────┐ │ │  │  │  │
│  │  │  │  │  │  Custom Hooks              │ │ │ │  │  │  │
│  │  │  │  │  │  - useMobile               │ │ │ │  │  │  │
│  │  │  │  │  │  - useToast                │ │ │ │  │  │  │
│  │  │  │  │  └────────────────────────────────┘ │ │  │  │  │
│  │  │  │  └──────────────────────────────────────┘ │  │  │  │
│  │  │  └────────────────────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Footer (si aplicable)                                 │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

                            ↕ Props / State

┌─────────────────────────────────────────────────────────────┐
│                   SUPABASE CLIENT                            │
│  - createClient() [Browser]                                  │
│  - createClient() [Server]                                   │
└─────────────────────────────────────────────────────────────┘

                            ↕ SQL Queries + RLS

┌─────────────────────────────────────────────────────────────┐
│                   POSTGRESQL DATABASE                        │
│  - Tables                                                    │
│  - RLS Policies                                              │
│  - Functions                                                 │
│  - Triggers                                                  │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### 10.2 Módulos Principales

\`\`\`
Sistema de Reserva
│
├── Módulo de Autenticación
│   ├── Login
│   ├── Register
│   ├── Password Reset
│   └── Session Management
│
├── Módulo de Catálogo
│   ├── Salas Deportivas
│   ├── Materiales Deportivos
│   ├── Filtros y Búsqueda
│   └── Vista de Detalles
│
├── Módulo de Reservas
│   ├── Carrito de Compras
│   ├── Confirmación de Reservas
│   ├── Mis Reservas
│   └── Gestión de Reservas
│
├── Módulo de Administración
│   ├── Gestión de Salas
│   ├── Gestión de Materiales
│   ├── Gestión de Reservas
│   └── Gestión de Usuarios (Superadmin only)
│
└── Módulo de Notificaciones
    ├── Confirmaciones por Email
    ├── Recordatorios
    └── Toast Notifications
\`\`\`

---

## RESUMEN EJECUTIVO

### Stack Tecnológico

**Frontend:**
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui + Radix UI

**Backend:**
- Next.js API Routes
- Supabase (PostgreSQL + Auth)
- Row Level Security (RLS)

**Deployment:**
- Vercel (Frontend + Edge Functions)
- Supabase Cloud (Database + Auth)

### Características Clave de la Arquitectura

1. **Renderizado Híbrido:** Server Components para rendimiento, Client Components para interactividad
2. **Seguridad Multicapa:** RLS + Middleware + Validación
3. **Type-Safe:** TypeScript en todo el stack
4. **Component-Driven:** 40+ componentes UI reutilizables
5. **API-First:** Supabase como backend completo
6. **Responsive:** Mobile-first design
7. **Escalable:** Arquitectura modular por features

### Principios de Diseño

- **Separation of Concerns:** Capas bien definidas (UI, Lógica, Datos)
- **DRY (Don't Repeat Yourself):** Componentes y utilidades reutilizables
- **Security First:** Autenticación y autorización en todas las capas
- **Performance:** Server Components, code splitting, optimización de imágenes
- **Developer Experience:** TypeScript, ESLint, Hot Reload

---

**Documento de Arquitectura - Sistema de Reserva de Salas Deportivas**  
Versión 1.0 | Enero 2025
