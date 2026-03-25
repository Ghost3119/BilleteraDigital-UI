# Billetera Digital — Frontend

**Frontend web para la aplicación Billetera Digital**, una plataforma de gestión financiera personal desarrollada con tecnologías modernas de React.

---

## 📋 Tabla de contenidos

- [Requisitos previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración del entorno](#️-configuración-del-entorno)
- [Ejecutar la aplicación](#-ejecutar-la-aplicación)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Stack tecnológico](#-stack-tecnológico)
- [Scripts disponibles](#-scripts-disponibles)
- [Convenciones de código](#-convenciones-de-código)

---

## 🔧 Requisitos previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- **Node.js** (v18 o superior) — [Descargar aquí](https://nodejs.org/)
- **npm** (viene incluido con Node.js)
- **Backend API de Billetera Digital** corriendo localmente en `http://localhost:5112`

> **Nota:** Este frontend depende completamente de la API backend. Asegúrate de que el servidor .NET esté corriendo antes de iniciar el frontend.

---

## 📦 Instalación

Clona el repositorio (si aún no lo has hecho) y navega al directorio del frontend:

```bash
cd BilleteraDigital-UI
```

Instala las dependencias del proyecto:

```bash
npm install
```

---

## ⚙️ Configuración del entorno

El proyecto utiliza variables de entorno para configurar la URL de la API backend.

### Paso 1: Copiar el archivo de ejemplo

En la raíz del proyecto, copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

En Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

### Paso 2: Ajustar la URL de la API (si es necesario)

Abre el archivo `.env` y verifica que la URL de la API sea correcta:

```env
VITE_API_BASE_URL=http://localhost:5112/api/v1
```

Si tu backend corre en un puerto o host diferente, actualiza este valor.

> **Importante:** Las variables de entorno en Vite deben comenzar con el prefijo `VITE_` para ser accesibles en el código del cliente.

---

## 🚀 Ejecutar la aplicación

Una vez completada la instalación y configuración, inicia el servidor de desarrollo de Vite:

```bash
npm run dev
```

El servidor de desarrollo se iniciará en:

```
http://localhost:5173
```

Abre esta URL en tu navegador para ver la aplicación. Vite recargará automáticamente la página cuando realices cambios en el código.

---

## 📁 Estructura del proyecto

El proyecto sigue una arquitectura **Feature-Sliced Design** para mantener el código modular y escalable:

```
src/
├── components/       # Componentes UI reutilizables (Button, Card, InputField, etc.)
│   └── ui/
├── config/           # Configuración global (Axios, React Query)
│   ├── axiosClient.ts
│   └── queryClient.ts
├── features/         # Módulos de funcionalidad (arquitectura Feature-Sliced)
│   ├── auth/         # Autenticación (login, registro)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── cuentas/      # Gestión de cuentas (dashboard, saldo)
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── transacciones/  # Transferencias e historial
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── perfil/       # Perfil del usuario
│       └── pages/
├── layouts/          # Layouts de página (AppLayout con BottomNav)
├── types/            # Tipos TypeScript compartidos
├── utils/            # Utilidades (parseApiError, formatters)
├── router.tsx        # Configuración de React Router
├── App.tsx           # Componente raíz
└── main.tsx          # Punto de entrada
```

### Directrices para agregar nuevas funcionalidades

- **Componentes reutilizables** → `src/components/ui/`
- **Funcionalidades específicas** → `src/features/<nombre-feature>/`
- Dentro de cada feature:
  - `pages/` → Páginas completas (ej: `DashboardPage.tsx`)
  - `components/` → Componentes específicos del feature
  - `hooks/` → Custom hooks de React Query (ej: `useMisCuentas.ts`)
  - `services/` → Llamadas a la API (ej: `cuentasService.ts`)
  - `types/` → Tipos TypeScript del dominio

---

## 🛠️ Stack tecnológico

| Tecnología | Propósito |
|------------|-----------|
| **React 18** | Biblioteca UI |
| **TypeScript** | Tipado estático |
| **Vite** | Build tool y dev server |
| **Tailwind CSS** | Framework de estilos utility-first |
| **TanStack Query** (React Query) | Gestión de estado del servidor, caché, refetch automático |
| **React Router** | Enrutamiento client-side |
| **Axios** | Cliente HTTP con interceptores para auth y paginación |

### Convenciones clave

- **React Query** maneja todo el estado del servidor (cuentas, transacciones, usuarios).
- **Axios interceptors** automáticamente:
  - Adjuntan el token JWT a cada request
  - Parsean el header `X-Pagination` de respuestas paginadas
  - Redirigen a `/login` en caso de 401 (sesión expirada)
- **Tailwind CSS** se usa exclusivamente para estilos (sin CSS modules ni styled-components).
- **Feature-Sliced Design** mantiene el código organizado por dominio de negocio.

---

## 📜 Scripts disponibles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview

# Linter (ESLint)
npm run lint
```

---

## 📝 Convenciones de código

### Nombres de archivos

- **Componentes React** → `PascalCase.tsx` (ej: `DashboardPage.tsx`)
- **Hooks** → `camelCase.ts` con prefijo `use` (ej: `useMisCuentas.ts`)
- **Services** → `camelCase.ts` con sufijo `Service` (ej: `cuentasService.ts`)
- **Tipos** → `camelCase.types.ts` (ej: `cuentas.types.ts`)

### Idioma

- **Todo el código, comentarios y documentación** → Inglés o español consistente por archivo
- **Interfaz de usuario (copy)** → Español mexicano (es-MX)
- **Moneda** → MXN (peso mexicano)

### Estilos

- Usa **Tailwind utility classes** directamente en JSX
- Para colores del brand: `bg-[#1A7A4A]` (verde principal)
- Evita estilos inline con `style={{ ... }}` excepto para casos dinámicos extremos

### Git

- **Commits** en español, siguiendo convención del equipo
- No commitear archivos `.env` (ya está en `.gitignore`)

---

## 🔐 Autenticación

El sistema de autenticación funciona con **JWT (JSON Web Tokens)**:

1. El usuario inicia sesión → recibe `accessToken` y `refreshToken`
2. Ambos tokens se almacenan en `localStorage`
3. El interceptor de Axios adjunta automáticamente `Authorization: Bearer <token>` en cada request
4. Si el backend responde con 401, el interceptor:
   - Limpia los tokens
   - Redirige a `/login`

---

## 🌐 Endpoints principales

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/Auth/token` | POST | Iniciar sesión |
| `/api/v1/Usuarios/registrar` | POST | Registrar nuevo usuario |
| `/api/v1/Cuentas/mias` | GET | Obtener cuentas del usuario |
| `/api/v1/Cuentas/{id}/transacciones` | GET | Historial de transacciones |
| `/api/v1/Transferencias/realizar` | POST | Realizar transferencia |

Todos los endpoints (excepto login y registro) requieren autenticación.

---

## 🐛 Solución de problemas comunes

### El frontend no puede conectarse al backend

- Verifica que el backend esté corriendo en `http://localhost:5112`
- Revisa la consola del navegador para errores de CORS o red
- Asegúrate de que `.env` tiene la URL correcta

### Cambié `.env` pero no se reflejan los cambios

- Vite requiere reiniciar el dev server para cargar nuevas variables de entorno
- Ejecuta `Ctrl+C` para detener el servidor y luego `npm run dev` de nuevo

### Error 401 constantemente

- Tu token JWT ha expirado o es inválido
- Cierra sesión (`/perfil` → Cerrar sesión) y vuelve a iniciar sesión

---

## 📞 Soporte

Si tienes problemas o preguntas, contacta al equipo de desarrollo.

---

**¡Listo para empezar a construir! 🚀**
