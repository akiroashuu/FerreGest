# FerreGest

Sistema de gestión para una ferretería: productos, inventario, ventas, fiado y reportes.

**Estado:** fase 0. Funcionan el inicio de sesión, el cierre de sesión y el layout con menú lateral. Los demás módulos aparecen en el menú como "Pronto".

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript estricto
- Tailwind CSS 4
- Supabase (PostgreSQL + Auth), con `@supabase/ssr`
- Zod para validación

## Puesta en marcha en Fedora

### 1. Requisitos

```bash
sudo dnf install -y nodejs git
```

```bash
node --version   # 20.9 o superior
```

### 2. Dependencias

```bash
npm install
```

### 3. Base de datos

Elige **una** de las dos opciones.

**Opción A: proyecto en supabase.com (la más simple para empezar)**

1. Crea un proyecto en <https://supabase.com>.
2. En *SQL Editor*, pega y ejecuta el contenido de `supabase/migrations/20261116000000_perfiles.sql`.
3. En *Authentication → Sign In / Providers*, desactiva **Allow new users to sign up**. Las cuentas las crea el administrador.
4. En *Project Settings → API Keys*, copia la URL del proyecto y la clave **publishable**.

**Opción B: Supabase local con contenedores**

Requiere Docker o Podman con compatibilidad Docker.

```bash
npx supabase init
```

```bash
npx supabase start
```

`supabase start` aplica las migraciones de `supabase/migrations/` y muestra la URL y la clave publicable.

### 4. Variables de entorno

```bash
cp .env.example .env.local
```

Completa `.env.local` con la URL y la clave publicable. Este archivo no se sube a Git.

### 5. Primer usuario administrador

1. En el panel de Supabase, *Authentication → Users → Add user*: correo, contraseña y marca **Auto Confirm User**.
2. El usuario nace con rol `vendedor`. Para hacerlo administrador, ejecuta en *SQL Editor* (cambia el correo y el nombre):

```sql
update public.perfiles
set rol = 'administrador', nombre = 'Tu nombre'
where id = (select id from auth.users where email = 'tu-correo@ejemplo.com');
```

### 6. Ejecutar

```bash
npm run dev
```

Abre <http://localhost:3000>.

## Cómo probar el inicio de sesión

| Paso | Resultado esperado |
| --- | --- |
| Abrir `/` sin sesión | Redirige a `/login` |
| Enviar el formulario vacío | "Escribe tu correo." y "Escribe tu contraseña." |
| Correo sin formato válido | "El correo no tiene un formato válido." |
| Contraseña incorrecta | "Correo o contraseña incorrectos." y el correo se conserva |
| Usuario con `activo = false` en `perfiles` | "Tu cuenta está desactivada…" |
| Credenciales correctas | Entra al panel: "Hola, *nombre*", con el rol en el menú |
| Abrir `/login` con sesión | Redirige al inicio |
| Pulsar "Cerrar sesión" | Vuelve a `/login` y `/` exige iniciar sesión otra vez |

## Estructura

```
src/
├── app/
│   ├── (auth)/login/        # pantalla de inicio de sesión
│   └── (panel)/             # layout con menú lateral; exige sesión
├── components/
│   ├── layout/              # menú lateral
│   └── ui/                  # Boton, Campo, Aviso
├── lib/
│   ├── supabase/server.ts   # cliente de Supabase para el servidor
│   ├── auth.ts              # obtenerPerfil(), exigirRol()
│   └── env.ts               # variables de entorno
├── modules/
│   └── auth/                # actions.ts, schema.ts, roles.ts
└── proxy.ts                 # renueva la sesión y protege las rutas
supabase/
└── migrations/              # esquema, funciones y políticas (SQL)
```

## Decisiones técnicas

- **`src/proxy.ts`** es lo que en versiones anteriores de Next.js se llamaba `middleware.ts`. Renueva la sesión y redirige a `/login` a quien no la tiene.
- **Tres comprobaciones de acceso:** el proxy, `obtenerPerfil()` en cada página del panel, y Row Level Security en la base. Ocultar un enlace no es seguridad.
- **Validación doble:** el mismo esquema Zod se ejecuta en el navegador (respuesta inmediata) y en la Server Action (no se confía en el navegador).
- **Roles en la base:** el rol vive en `perfiles`, no en los metadatos del usuario, y solo un administrador puede cambiarlo. Una cuenta nueva siempre nace como vendedor.
- **Sin borrado de usuarios:** `perfiles` referencia a `auth.users` con `ON DELETE RESTRICT`. Un usuario se desactiva con `activo = false`.
- **`export const instant = false`** en el layout del panel: todo el panel depende de la sesión, así que no se prerenderiza.

## Comandos

```bash
npm run dev      # desarrollo
```

```bash
npm run lint     # ESLint
```

```bash
npm run build    # compilación de producción
```
