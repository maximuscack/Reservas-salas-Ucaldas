# Manual de Usuario
## Sistema de Reserva de Salas Deportivas y Materiales

**Bienestar Universitario**  
**Versión 1.0 - 2025**

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Roles y Permisos](#roles-y-permisos)
3. [Inicio de Sesión](#inicio-de-sesión)
4. [Registro de Cuenta](#registro-de-cuenta)
5. [Dashboard Principal](#dashboard-principal)
6. [Reservar Salas Deportivas](#reservar-salas-deportivas)
7. [Reservar Materiales](#reservar-materiales)
8. [Carrito de Compras](#carrito-de-compras)
9. [Mis Reservas](#mis-reservas)
10. [Panel de Administración](#panel-de-administración)
11. [Preguntas Frecuentes](#preguntas-frecuentes)
12. [Soporte Técnico](#soporte-técnico)

---

## Introducción

El Sistema de Reserva de Salas Deportivas y Materiales es una plataforma web diseñada para facilitar la gestión y reserva de instalaciones deportivas y equipamiento para la comunidad universitaria.

### Características Principales

- Visualización en tiempo real de disponibilidad
- Sistema de carrito para reservas múltiples
- Notificaciones automáticas por correo electrónico
- Panel de control para administradores
- Gestión de horarios y bloqueos
- Reportes y estadísticas
- Interfaz intuitiva y responsive

### Requisitos del Sistema

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet
- Correo electrónico institucional válido

---

## Roles y Permisos

El sistema cuenta con tres niveles de usuario con diferentes permisos:

### 🎓 Estudiante (Usuario Regular)

**Permisos:**
- Ver catálogo de salas y materiales disponibles
- Agregar items al carrito
- Realizar reservas
- Ver y cancelar sus propias reservas
- Recibir notificaciones por correo

**Limitaciones:**
- No puede aprobar/rechazar reservas
- No puede gestionar usuarios
- No puede modificar el inventario

### 👔 Administrador

**Permisos:**
- Todos los permisos de Estudiante
- Aprobar o rechazar reservas pendientes
- Ver todas las reservas del sistema
- Crear nuevos usuarios (solo estudiantes)
- Ver lista de todos los usuarios

**Limitaciones:**
- No puede crear otros administradores
- No puede crear superadministradores
- No puede modificar roles de administradores

### 🔧 Superadministrador

**Permisos:**
- Todos los permisos de Administrador
- Crear usuarios con cualquier rol (estudiante, admin, superadmin)
- Modificar roles de usuarios
- Acceso completo al sistema
- Gestión avanzada de configuración

---

## Inicio de Sesión

### Acceder al Sistema

1. Navega a la página principal del sistema
2. Haz clic en el botón **"Ingresar"** en la esquina superior derecha
3. Serás redirigido a la página de inicio de sesión

### Formulario de Inicio de Sesión

1. **Correo Electrónico**: Ingresa tu correo institucional completo
   - Ejemplo: `estudiante@universidad.edu`
   
2. **Contraseña**: Ingresa tu contraseña
   - Mínimo 6 caracteres
   - Distingue entre mayúsculas y minúsculas

3. Haz clic en el botón **"Ingresar"**

### Problemas Comunes

**Error: "Database error querying schema"**
- Verifica que tu cuenta esté correctamente activada
- Contacta al administrador del sistema

**Error: "Credenciales inválidas"**
- Verifica tu correo y contraseña
- Asegúrate de usar el correo institucional completo

**No recibí el correo de confirmación**
- Revisa la carpeta de spam
- Solicita reenvío al administrador

---

## Registro de Cuenta

### Para Nuevos Usuarios

1. En la página principal, haz clic en **"Registrarse"**
2. Completa el formulario con:
   - **Nombre completo**: Tu nombre y apellidos
   - **Correo electrónico**: Tu correo institucional
   - **Contraseña**: Mínimo 6 caracteres (crea una contraseña segura)
   - **Confirmar contraseña**: Repite la contraseña

3. Lee y acepta los términos y condiciones
4. Haz clic en **"Crear Cuenta"**
5. Revisa tu correo para confirmar tu cuenta

### Recomendaciones de Seguridad

- Usa una contraseña única y segura
- No compartas tu contraseña con nadie
- Cierra sesión al terminar, especialmente en computadoras compartidas
- Cambia tu contraseña periódicamente

---

## Dashboard Principal

Una vez que inicias sesión, accedes al Dashboard, la pantalla principal del sistema.

### Navegación Superior

La barra de navegación incluye:

- **Logo y Nombre**: "Reserva de Salas - Bienestar Universitario"
- **Menú de Navegación**:
  - **Inicio**: Vuelve al dashboard principal
  - **Mis Reservas**: Ver tus reservas activas
  - **Carrito**: Ver items pendientes de reservar
  - **Panel Admin**: (Solo admins) Gestión del sistema
- **Información de Usuario**: Muestra tu email y rol
- **Botón "Salir"**: Cierra tu sesión

### Vista Principal

El dashboard muestra dos pestañas principales:

#### 📍 Salas Deportivas

Muestra todas las salas disponibles con:
- **Nombre** de la sala
- **Descripción** de las instalaciones
- **Capacidad** (número de personas)
- **Ubicación** física
- **Botón de Reservar** (o "No Disponible" si está ocupada)

#### ⚽ Materiales

Muestra todos los materiales disponibles con:
- **Nombre** del material
- **Descripción** y características
- **Categoría** (balones, raquetas, etc.)
- **Cantidad disponible**
- **Campo de cantidad** y botón **"Agregar"** al carrito

---

## Reservar Salas Deportivas

### Proceso de Reserva

1. **Explorar Salas**
   - En el Dashboard, ve a la pestaña **"Salas Deportivas"**
   - Navega entre las salas disponibles
   - Lee la información de cada sala

2. **Seleccionar Sala**
   - Revisa la capacidad y ubicación
   - Verifica que esté disponible (botón verde "Reservar")
   - Haz clic en **"Reservar"**

3. **Confirmar Agregado**
   - Aparecerá un mensaje: "Sala agregada al carrito"
   - La sala se añade automáticamente al carrito
   - Puedes continuar agregando más salas

4. **Ir al Carrito**
   - Haz clic en **"Carrito"** en el menú superior
   - Revisa las salas seleccionadas
   - Continúa al paso de [Carrito de Compras](#carrito-de-compras)

### Información Importante

- Puedes agregar múltiples salas al carrito
- Cada sala debe reservarse para una fecha y horario específico
- Las reservas requieren aprobación del administrador
- Recibirás notificación por correo cuando se apruebe

---

## Reservar Materiales

### Proceso de Reserva

1. **Explorar Materiales**
   - En el Dashboard, ve a la pestaña **"Materiales"**
   - Navega entre los materiales disponibles
   - Lee la descripción y categoría

2. **Seleccionar Cantidad**
   - Verifica la cantidad disponible
   - En el campo numérico, ingresa la cantidad deseada
   - No puedes exceder la cantidad disponible

3. **Agregar al Carrito**
   - Haz clic en el botón **"Agregar"**
   - Aparecerá el mensaje: "Material agregado al carrito"
   - Puedes seguir agregando más materiales

4. **Finalizar**
   - Ve al **"Carrito"** en el menú superior
   - Revisa los materiales y cantidades
   - Continúa al checkout

### Consejos

- Verifica siempre la cantidad disponible
- Puedes agregar el mismo material varias veces
- Las cantidades se suman automáticamente en el carrito
- Reserva solo lo que necesitas para evitar escasez

---

## Carrito de Compras

El carrito permite revisar y confirmar todas tus reservas antes de enviarlas.

### Acceder al Carrito

- Haz clic en **"Carrito"** en el menú de navegación
- O navega directamente a `/cart`

### Secciones del Carrito

#### 🏢 Salas en tu Carrito

Para cada sala verás:
- **Nombre y descripción**
- **Capacidad y ubicación**
- **Botón "Eliminar"** para quitar del carrito

#### 📦 Materiales en tu Carrito

Para cada material verás:
- **Nombre y categoría**
- **Cantidad seleccionada**
- **Campo para modificar cantidad**
- **Botón "Actualizar"** cantidad
- **Botón "Eliminar"** del carrito

### Configurar Reserva

Antes de confirmar, debes completar:

1. **Fecha de Reserva** (obligatorio)
   - Selecciona el día que necesitas los items
   - Usa el selector de fecha

2. **Horario** (solo si tienes salas)
   - **Hora de inicio**: Cuándo comenzará el uso
   - **Hora de fin**: Cuándo terminará el uso
   - Ejemplo: 14:00 a 16:00

### Resumen de Reserva

El panel lateral muestra:
- Total de salas: Cantidad de salas en el carrito
- Total de materiales: Suma de todos los materiales
- Fecha y horario seleccionados

### Confirmar Reserva

1. Verifica que toda la información sea correcta
2. Asegúrate de completar fecha y horario
3. Haz clic en **"Confirmar Reserva"**
4. Espera el mensaje de confirmación
5. Serás redirigido a **"Mis Reservas"**

### Notas Importantes

- No puedes confirmar sin fecha de reserva
- Si tienes salas, el horario es obligatorio
- Una vez confirmada, no puedes modificar la reserva
- Las reservas quedan en estado "Pendiente" hasta aprobación

---

## Mis Reservas

Esta sección muestra todas tus reservas realizadas.

### Acceder

- Haz clic en **"Mis Reservas"** en el menú superior
- O navega a `/reservations`

### Pestañas de Reservas

#### 🏢 Salas

Muestra todas tus reservas de salas con:
- **Nombre de la sala**
- **Fecha y horario** de la reserva
- **Estado**:
  - 🟡 **Pendiente**: Esperando aprobación del administrador
  - ✅ **Confirmada**: Aprobada por el administrador
  - ❌ **Cancelada**: Rechazada o cancelada
- **Fecha de solicitud**
- **Botón "Cancelar"** (solo para pendientes y confirmadas)

#### 📦 Materiales

Muestra todas tus reservas de materiales con:
- **Nombre del material**
- **Cantidad reservada**
- **Fecha de reserva**
- **Horario** (si aplica)
- **Estado** (Pendiente/Confirmada/Cancelada)
- **Botón "Cancelar"**

### Cancelar una Reserva

1. Busca la reserva que deseas cancelar
2. Verifica que no esté ya cancelada
3. Haz clic en el botón **"Cancelar"**
4. Confirma la acción en el diálogo
5. La reserva cambiará a estado "Cancelada"

### Estados de Reservas

- **Pendiente**: Tu solicitud fue recibida y está en revisión
- **Confirmada**: El administrador aprobó tu reserva
- **Cancelada**: La reserva fue rechazada o tú la cancelaste

### Notificaciones

Recibirás correos electrónicos cuando:
- Tu reserva cambie de estado
- Se apruebe una reserva pendiente
- Se rechace una solicitud
- Haya cambios importantes

---

## Panel de Administración

*Esta sección es solo para usuarios con rol Administrador o Superadministrador*

### Acceder al Panel

- Haz clic en **"Panel Admin"** en el menú superior (botón amarillo)
- O navega directamente a `/admin`

### Pestañas del Panel

#### 📋 Gestionar Reservas

**Vista General**

Tres tarjetas resumen muestran:
- **Reservas Pendientes**: Cantidad esperando aprobación
- **Reservas Confirmadas**: Cantidad ya aprobadas
- **Total de Usuarios**: Usuarios registrados en el sistema

**Lista de Reservas Pendientes**

Cada reserva muestra:
- **Tipo**: Sala o Material
- **Email del solicitante**
- **Detalles**: Qué se reservó, fecha y horario
- **Fecha de solicitud**
- **Acciones**:
  - **Botón "Aprobar"** (verde): Confirma la reserva
  - **Botón "Rechazar"** (rojo): Cancela la solicitud

**Aprobar una Reserva**
1. Lee los detalles cuidadosamente
2. Verifica disponibilidad real
3. Haz clic en **"Aprobar"**
4. La reserva pasa a estado "Confirmada"
5. El usuario recibe notificación por correo

**Rechazar una Reserva**
1. Revisa la razón del rechazo
2. Haz clic en **"Rechazar"**
3. La reserva pasa a estado "Cancelada"
4. El usuario recibe notificación

#### 👥 Gestionar Usuarios

**Crear Nuevo Usuario**

Formulario con los siguientes campos:

1. **Nombre Completo**
   - Ingresa nombre y apellidos del usuario
   - Ejemplo: "María González López"

2. **Correo Electrónico**
   - Debe ser correo institucional
   - Ejemplo: "maria.gonzalez@universidad.edu"

3. **Contraseña Temporal**
   - Mínimo 6 caracteres
   - El usuario puede cambiarla después

4. **Rol** (desplegable)
   - **Estudiante**: Rol estándar (todos pueden crear)
   - **Administrador**: Solo superadmin puede crear
   - **Superadministrador**: Solo superadmin puede crear

**Permisos de Creación**

- **Administrador** puede crear: Solo estudiantes
- **Superadministrador** puede crear: Estudiantes, Admins y Superadmins

**Proceso de Creación**
1. Completa todos los campos
2. Selecciona el rol apropiado
3. Haz clic en **"Crear Usuario"**
4. Espera el mensaje de confirmación
5. El nuevo usuario aparecerá en la lista

**Lista de Usuarios Existentes**

Panel con scroll que muestra:
- **Nombre completo** de cada usuario
- **Correo electrónico**
- **Rol** con código de color:
  - 🟠 Superadministrador (naranja)
  - 🔵 Administrador (azul)
  - 🟡 Estudiante (amarillo)

**Mensajes del Sistema**

Aparecen notificaciones cuando:
- ✅ Usuario creado exitosamente (fondo verde)
- ❌ Error en la creación (fondo rojo)
- ⚠️ Permisos insuficientes (fondo amarillo)

---

## Preguntas Frecuentes

### Sobre el Sistema

**¿Puedo reservar varias salas al mismo tiempo?**  
Sí, puedes agregar múltiples salas al carrito y reservarlas todas juntas para la misma fecha y horario.

**¿Cuánto tiempo tardan en aprobar mi reserva?**  
Las reservas son revisadas por los administradores en horario laboral. Generalmente se aprueban en 24-48 horas.

**¿Puedo modificar una reserva después de confirmarla?**  
No directamente. Debes cancelar la reserva existente y crear una nueva.

**¿Qué pasa si cancelo una reserva?**  
La reserva se marca como cancelada y los recursos quedan disponibles para otros usuarios.

### Sobre Salas

**¿Puedo ver qué horarios están ocupados?**  
Actualmente el sistema muestra disponibilidad general. Contacta al administrador para horarios específicos.

**¿Cuál es el tiempo mínimo/máximo de reserva?**  
Esto depende de las políticas de tu institución. Consulta con Bienestar Universitario.

**¿Puedo reservar una sala todos los días?**  
Las políticas de uso repetitivo varían. Contacta al administrador para reservas recurrentes.

### Sobre Materiales

**¿Dónde recojo los materiales reservados?**  
En el área de Bienestar Universitario según el horario indicado en tu reserva confirmada.

**¿Qué pasa si necesito más cantidad de la disponible?**  
Contacta al administrador para verificar si hay más stock o cuando habrá disponibilidad.

**¿Debo devolver los materiales el mismo día?**  
Sí, a menos que hayas coordinado un plazo diferente con el administrador.

### Problemas Técnicos

**No puedo iniciar sesión**  
- Verifica tu correo y contraseña
- Prueba restablecer tu contraseña
- Contacta al administrador si persiste

**Las salas no cargan**  
- Refresca la página (F5)
- Limpia el caché del navegador
- Verifica tu conexión a internet

**El carrito está vacío después de agregar items**  
- Verifica que las cookies estén habilitadas
- No uses modo incógnito
- Prueba con otro navegador

---

## Soporte Técnico

### Canales de Soporte

**Correo Electrónico**  
bienestar@universidad.edu

**Teléfono**  
+XX (XXX) XXX-XXXX  
Horario: Lunes a Viernes, 8:00 AM - 5:00 PM

**Oficina Presencial**  
Edificio de Bienestar Universitario  
Oficina XXX  
Horario: Lunes a Viernes, 9:00 AM - 4:00 PM

### Antes de Contactar Soporte

Prepara la siguiente información:
- Tu correo electrónico institucional
- Descripción detallada del problema
- Capturas de pantalla del error (si aplica)
- Pasos que realizaste antes del error
- Navegador y sistema operativo que usas

### Reportar un Bug

Si encuentras un error en el sistema:
1. Toma una captura de pantalla
2. Anota qué estabas haciendo
3. Envía un correo con toda la información
4. Incluye el mensaje de error completo

### Sugerencias y Mejoras

¿Tienes ideas para mejorar el sistema?
- Envía tus sugerencias a bienestar@universidad.edu
- Especifica qué funcionalidad te gustaría
- Explica cómo mejoraría tu experiencia

---

## Apéndice: Glosario de Términos

**Carrito**: Espacio temporal donde guardas salas y materiales antes de confirmar tu reserva.

**Dashboard**: Pantalla principal del sistema donde ves salas y materiales disponibles.

**Estado de Reserva**: Situación actual de tu solicitud (Pendiente, Confirmada, Cancelada).

**Rol**: Nivel de permisos que tienes en el sistema (Estudiante, Admin, Superadmin).

**RLS (Row Level Security)**: Sistema de seguridad que protege tus datos.

**Reserva**: Solicitud formal para usar una sala o material en fecha específica.

---

## Notas de Versión

**Versión 1.0 - Enero 2025**
- Lanzamiento inicial del sistema
- Sistema de autenticación con Supabase
- Gestión de reservas de salas y materiales
- Panel de administración completo
- Notificaciones por correo electrónico
- Sistema de carrito de compras
- Control de roles y permisos

---

## Información Legal

Este sistema es propiedad de la Universidad y está destinado exclusivamente para uso de la comunidad universitaria.

**Políticas de Uso:**
- Uso responsable de las instalaciones
- No compartir credenciales
- Reportar cualquier mal funcionamiento
- Respetar las reservas de otros usuarios
- Cancelar con anticipación si no usarás una reserva

**Privacidad:**
- Tus datos personales están protegidos
- No compartimos información con terceros
- Usamos tus datos solo para gestión de reservas
- Recibirás correos solo sobre el sistema

---

**Documento creado por:** Sistema de Bienestar Universitario  
**Última actualización:** Enero 2025  
**Versión:** 1.0

Para más información visita: www.universidad.edu/bienestar
