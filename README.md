# Eventos App - Plataforma de Gestión de Eventos

Una aplicación completa para la gestión de eventos construida con Next.js, Prisma y SQLite. Esta plataforma permite organizar, promocionar y administrar eventos, así como la gestión de asistentes y venta de entradas.

## 📋 Características

### Para usuarios

- **Descubrimiento de eventos**: Explora eventos por categoría, fecha, ubicación y más
- **Registro y compra de entradas**: Proceso sencillo para adquirir entradas a eventos
- **Perfil de usuario**: Historial de eventos asistidos y próximos
- **Personalización de perfil**: Edición de datos personales y subida de foto de perfil
- **Mapas interactivos**: Visualiza la ubicación exacta de cada evento
- **Códigos QR**: Entradas digitales con códigos QR para fácil acceso
- **Tema claro/oscuro**: Modo de visualización adaptable a las preferencias del usuario

### Para organizadores

- **Creación y gestión de eventos**: Interfaz completa para administrar todos los aspectos de un evento
- **Control de asistentes**: Seguimiento de registros y check-in en tiempo real
- **Análisis de datos**: Estadísticas sobre ventas de entradas y asistencia
- **Integración con sistemas de pago**: Gestión de transacciones seguras

## 🛠️ Tecnologías

- **Frontend**: Next.js 15 con App Router y React 19
- **Backend**: API Routes de Next.js con Server Components
- **Base de datos**: SQLite (desarrollo) gestionada con Prisma ORM
- **Autenticación**: Sistema seguro basado en NextAuth para proteger cuentas de usuario
- **UI**: Diseño responsive con Tailwind CSS y DaisyUI
- **Temas**: Sistema de temas claro/oscuro con persistencia en localStorage
- **Imágenes**: Subida y gestión de imágenes para perfiles de usuario

## ⚙️ Requisitos previos

- Node.js 20.0 o superior
- npm 10.0 o superior

## 🚀 Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd eventos-app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
DATABASE_URL=file:./prisma/dev.db
# Añadir otras variables de entorno según sea necesario
```

### 4. Configurar la base de datos

```bash
# Aplicar las migraciones de Prisma para crear todas las tablas
npx prisma migrate dev

# Alternativamente, si no quieres crear migraciones:
# npx prisma db push

# Generar el cliente Prisma
npx prisma generate

# Opcional: Explorar la base de datos con Prisma Studio
npx prisma studio
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del proyecto

```
src/
  app/               # Rutas y páginas de Next.js
    api/             # API Routes para el backend
    eventos/         # Páginas relacionadas con eventos
    perfil/          # Páginas de perfil de usuario
  components/        # Componentes reutilizables
  lib/               # Utilidades y configuraciones
prisma/
  schema.prisma      # Esquema de la base de datos
```

## 📝 Desarrollo

### Comandos útiles

```bash
# Ejecutar el servidor de desarrollo
npm run dev

# Construir la aplicación para producción
npm run build

# Iniciar la aplicación en modo producción
npm start

# Ejecutar linter
npm run lint

# Ver la base de datos (interfaz de Prisma)
npx prisma studio
```

## 🔄 Flujo de trabajo del proyecto

1. Los usuarios pueden registrarse y crear una cuenta
2. Los organizadores pueden crear y configurar eventos
3. Los usuarios pueden descubrir eventos y comprar entradas
4. Al asistir a un evento, se puede validar la entrada mediante código QR
5. Posteriormente, los usuarios pueden ver su historial de eventos asistidos

## 📄 Licencia

Este proyecto está licenciado bajo la licencia MIT.
