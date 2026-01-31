# Sistema de Reservas de Salas y Materiales Deportivos
## Guía de Instalación y Configuración

### Prerequisitos
- Node.js 18+ instalado
- npm o pnpm instalado
- Cuenta de Supabase creada
- Git (opcional, para clonar)

---

## PASO 1: Descargar y Preparar el Proyecto

### Opción A: Descargar el archivo ZIP
1. Descarga el proyecto completo desde v0
2. Extrae el archivo ZIP en tu computadora
3. Abre una terminal en la carpeta del proyecto

### Opción B: Usar el comando shadcn CLI
\`\`\`bash
npx shadcn-cli@latest init
# Selecciona: TypeScript, Tailwind CSS, React 19, ESLint
\`\`\`

---

## PASO 2: Instalar Dependencias

\`\`\`bash
npm install
# o si usas pnpm
pnpm install
\`\`\`

---

## PASO 3: Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con lo siguiente:

\`\`\`env
# Supabase - Ya están configuradas en Vercel, pero añádelas localmente
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# Para desarrollo local (opcional)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

**¿Dónde obtener estas claves?**
1. Ve a tu proyecto en Supabase.com
2. Settings → API → URL (copiar en NEXT_PUBLIC_SUPABASE_URL)
3. Settings → API → Project API keys → `anon` (copiar en NEXT_PUBLIC_SUPABASE_ANON_KEY)
4. Settings → API → Project API keys → `service_role` (copiar en SUPABASE_SERVICE_ROLE_KEY)

---

## PASO 4: Configurar la Base de Datos

### 4.1 Ejecutar los scripts SQL en Supabase

1. Ve a tu proyecto en Supabase → SQL Editor
2. Copia y ejecuta el contenido de **scripts/001_create_tables.sql**
   - Esto crea todas las tablas necesarias con políticas de seguridad
3. Luego ejecuta **scripts/002_seed_sample_data.sql**
   - Esto añade salas y materiales de ejemplo

### 4.2 Verificar la creación de tablas
En Supabase → Table Editor, deberías ver:
- `users` (creada automáticamente por auth)
- `rooms` (salas deportivas)
- `sports_materials` (materiales)
- `reservations` (reservas)
- `email_reminders` (recordatorios)

---

## PASO 5: Ejecutar Localmente

\`\`\`bash
npm run dev
# o
pnpm dev
\`\`\`

Abre tu navegador en: **http://localhost:3000**

---

## PASO 6: Pruebas Iniciales

### Usuario de Prueba (Admin)
\`\`\`
Email: admin@test.com
Contraseña: Admin123@
\`\`\`

### Usuario de Prueba (Estudiante)
\`\`\`
Email: estudiante@test.com
Contraseña: Estudiante123@
\`\`\`

**Rutas de la Aplicación:**
- `/` - Página de inicio
- `/auth/sign-up` - Registro de nuevo usuario
- `/auth/login` - Login
- `/dashboard` - Panel de usuario con catálogo
- `/cart` - Carrito de reservas
- `/reservations` - Mis reservas
- `/admin` - Panel administrativo (solo admin)

---

## PASO 7: Desplegar en Vercel

### Opción A: Desde GitHub
1. Sube tu código a un repositorio de GitHub
2. Ve a Vercel.com → New Project
3. Selecciona tu repositorio
4. Las variables de entorno se configuran automáticamente
5. Haz clic en Deploy

### Opción B: Usar Vercel CLI
\`\`\`bash
npm install -g vercel
vercel
# Sigue las instrucciones interactivas
\`\`\`

---

## PASO 8: Configurar Notificaciones por Correo (Opcional)

El sistema incluye rutas API para enviar correos:
- `/api/send-confirmation` - Confirmación de reserva
- `/api/send-reminder` - Recordatorio antes de la reserva

**Para hacerlas funcionales, integra un servicio de email:**
- Resend (recomendado para Vercel)
- SendGrid
- AWS SES
- Mailgun

Actualiza los archivos en `/app/api/send-*` con tu proveedor de email.

---

## Estructura del Proyecto

\`\`\`
/
├── app/
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Home
│   ├── globals.css          # Estilos globales + paleta de colores
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── sign-up/page.tsx
│   │   └── sign-up-success/page.tsx
│   ├── dashboard/page.tsx   # Catálogo de salas y materiales
│   ├── cart/page.tsx        # Carrito de reservas
│   ├── reservations/page.tsx # Mis reservas
│   ├── admin/page.tsx       # Panel administrativo
│   └── api/
│       ├── send-confirmation/route.ts
│       └── send-reminder/route.ts
├── lib/
│   └── supabase/            # Clientes de Supabase
│       ├── client.ts        # Cliente del navegador
│       ├── server.ts        # Cliente del servidor
│       └── middleware.ts    # Autenticación middleware
├── components/
│   ├── ui/                  # Componentes shadcn/ui
│   └── [componentes personalizados]
├── scripts/
│   ├── 001_create_tables.sql
│   └── 002_seed_sample_data.sql
└── middleware.ts            # Protección de rutas

\`\`\`

---

## Paleta de Colores Implementada

- **Primario:** Azul marino (#1A2B5E)
- **Acento 1:** Beige (#C4B896)
- **Acento 2:** Amarillo dorado (#F4C430)
- **Fondos:** Tonos claros (blanco, grises claros)
- **Textos:** Azul marino oscuro

---

## Funcionalidades Implementadas

✅ Autenticación con Supabase (email/password)
✅ Catálogo de salas con capacidad y tarifa
✅ Catálogo de materiales deportivos
✅ Carrito de reservas
✅ Historial de reservas del usuario
✅ Panel administrativo para aprobar/rechazar reservas
✅ Bloqueo de horarios por disponibilidad
✅ Row Level Security (RLS) para protección de datos
✅ API routes para notificaciones por correo
✅ Interfaz responsiva (mobile, tablet, desktop)

---

## Troubleshooting

### Error: "Invalid Supabase URL"
- Verifica que NEXT_PUBLIC_SUPABASE_URL esté correcto en .env.local
- Confirma que las variables están en el archivo correcto

### Error: "Cannot find module"
\`\`\`bash
# Limpia y reinstala
rm -rf node_modules pnpm-lock.yaml
npm install
\`\`\`

### La página de login no funciona
- Verifica que ejecutaste el script 001_create_tables.sql
- Confirma que SUPABASE_SERVICE_ROLE_KEY esté configurado

### Las imágenes no se cargan
- Son placeholders. Para producción, sube imágenes reales a `/public`

---

## Soporte

Para problemas:
1. Revisa la sección de Troubleshooting
2. Consulta la documentación de Supabase: https://supabase.com/docs
3. Consulta la documentación de Next.js: https://nextjs.org/docs

---

**¡Tu aplicación está lista! 🚀**
\`\`\`

He creado una guía completa de instalación con todos los pasos exactos que necesitas seguir. El archivo incluye instrucciones para descargar, configurar Supabase, ejecutar localmente y desplegar en Vercel.
