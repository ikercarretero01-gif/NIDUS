# Nidus

<p align="center">
  <img src="public/logo.png" alt="Nidus Logo" width="90" height="90" />
</p>

<p align="center">
  <strong>Plataforma privada de productividad personal, gestión de agendas y motor de rutinas recurrentes.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3.3-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Zustand-5.0-orange?style=flat-square" alt="Zustand" />
  <img src="https://img.shields.io/badge/Despliegue-Vercel-black?style=flat-square&logo=vercel" alt="Vercel" />
</p>

---

## 📌 Descripción del Proyecto

**Nidus** es un entorno personal de gestión del tiempo y tareas diseñado para simplificar el flujo de trabajo diario sin sobrecarga cognitiva. Desarrollado con una arquitectura orientada al rendimiento, garantiza una navegación instantánea, persistencia en el dispositivo del usuario y un control de acceso privado que permite compartir o exhibir el repositorio públicamente manteniendo los datos y tareas protegidos.

---

## 📸 Vista Previa de la Aplicación

<!-- 
===================================================================
[IMAGEN 1: VISTA PRINCIPAL / AGENDA DIARIA]
Descripción de lo que se verá:
Captura completa de la Agenda Diaria en modo oscuro mostrando los tres
bloques del día (Mañana, Tarde, Noche), la barra de progreso, los chips
de navegación rápida (Ayer, Hoy, Mañana) y tareas creadas con sus etiquetas.
===================================================================
-->
<p align="center">
  <img src="docs/screenshots/today-view.png" alt="Agenda Diaria de Nidus" width="850" />
  <br />
  <em>Vista de la Agenda Diaria con organización por bloques temporales y progreso en tiempo real.</em>
</p>

<br />

<p align="center">
  <!-- 
  ===================================================================
  [IMAGEN 2: CONTROL DE ACCESO GATEKEEPER]
  Descripción de lo que se verá:
  Captura de la pantalla de bloqueo mostrando la insignia de "Espacio privado
  de Iker Carretero", los botones de solicitud de acceso por correo y
  el teclado numérico de 4 dígitos para validación directa con PIN.
  ===================================================================
  -->
  <img src="docs/screenshots/gatekeeper.png" alt="Pantalla de Acceso Privado Gatekeeper" width="410" />
  &nbsp;&nbsp;
  <!-- 
  ===================================================================
  [IMAGEN 3: GESTIÓN DE RUTINAS Y DÍAS]
  Descripción de lo que se verá:
  Captura de la sección 'Rutinas' donde se aprecian los presets rápidos
  (Gym L-X-V, Diario, L-V) y los selectores activos de días de la semana.
  ===================================================================
  -->
  <img src="docs/screenshots/routines-view.png" alt="Motor de Rutinas y Hábitos" width="410" />
</p>

<p align="center">
  <em>Izquierda: Gatekeeper de acceso privado. Derecha: Gestor de rutinas recurrentes y hábitos.</em>
</p>

<br />

<!-- 
===================================================================
[IMAGEN 4: REPLANIFICACIÓN Y MODAL DE POSPONER]
Descripción de lo que se verá:
Captura del modal emergente para posponer tareas con el mini calendario mensual,
los accesos rápidos (+1 día, Mañana, Siguiente semana) y la sección de
tareas pendientes acumuladas de días pasados.
===================================================================
-->
<p align="center">
  <img src="docs/screenshots/postpone-modal.png" alt="Modal de Posponer Tareas con Calendario" width="600" />
  <br />
  <em>Módulo de reprogramación y resolución de tareas pendientes con mini calendario interactivo.</em>
</p>

---

## ✨ Características Principales

### 🔒 Control de Privacidad y Gatekeeper
- **Acceso Propietario con PIN:** Validación instantánea de 4 dígitos al pulsar la última tecla, sin necesidad de botones de confirmación adicionales.
- **Seguridad en Repositorio Público:** La clave PIN se parametriza a través de variables de entorno seguras (`NEXT_PUBLIC_OWNER_PIN`), evitando cualquier fuga en el código fuente de GitHub.
- **Portal de Solicitud para Visitantes:** Pantalla de bienvenida elegante con llamada a la acción para solicitar acceso vía Gmail Web, cliente de correo predeterminado o copia directa de dirección al portapapeles (`ikercarretero01@gmail.com`).

### 📅 Agenda Diaria Inteligente
- Navegación ágil entre días: accesos directos (*Ayer, Hoy, Mañana*), flechas de avance/retroceso y botón flotante de retorno rápido a la fecha actual.
- Clasificación temporal automática según el horario de la tarea: **Mañana** (antes de las 14:00), **Tarde** (14:00 a 20:00) y **Noche** (a partir de las 20:00).
- Métricas de cumplimiento y barra visual de progreso porcentual del día.

### ⏳ Bandeja de Pendientes y Reprogramación
- Detección proactiva de tareas no completadas de jornadas anteriores.
- Botón **Posponer** por tarea individual con mini calendario desplegable del mes y chips de posposición inmediata (*Hoy, Mañana, +2 días, Siguiente semana*).
- Acción masiva **"Mover todas a Hoy"** para reincorporar pendientes acumuladas con un solo clic.

### 🔁 Motor de Rutinas y Hábitos Recurrentes
- Diseñado para hábitos y compromisos periódicos (p. ej., entrenamiento en gimnasio, revisiones semanales, lectura).
- Presets rápidos de repetición: *Gym (L-X-V), Todos los días, Días laborales (L-V), Fines de semana (S-D)*.
- Personalización fina mediante botones independientes para cada día de la semana (`[ L ] [ M ] [ X ] [ J ] [ V ] [ S ] [ D ]`).
- Las rutinas se materializan automáticamente en la agenda del día correspondiente como tareas virtuales interactuables.

### 🗓️ Perspectiva Semanal y Mensual
- **Vista Semanal:** Matriz interactiva de 7 columnas para planificar cargas de trabajo a medio plazo.
- **Vista Mensual:** Cuadrícula completa con marcadores de densidad de tareas y panel lateral de detalle diario.

### 🎨 Experiencia de Usuario y Diseño
- Estética minimalista y moderna con base en paletas de escala de grises zinc y acentos ámbar.
- Modos Claro y Oscuro con detección de preferencias de sistema operativo.
- Transiciones ultraligeras de 0.2s sin bloqueos ni spinners pesados.
- Compatible con dispositivos móviles (PWA ready con `manifest.json` e iconos optimizados).

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) | Enrutamiento moderno, SSR estático e hidratación selectiva |
| **Biblioteca UI** | [React 19](https://react.dev/) | Gestión de componentes y concurrencia |
| **Lenguaje** | [TypeScript 5](https://www.typescriptlang.org/) | Tipado estricto de tareas, prioridades y reglas |
| **Estilos** | [Tailwind CSS 3.4](https://tailwindcss.com/) | Utilidades CSS optimizadas y diseño responsivo |
| **Estado Global** | [Zustand 5](https://zustand-demo.pmnd.rs/) | Gestión de estado reactivo con persistencia en `localStorage` |
| **Fechas** | [date-fns 4](https://date-fns.org/) | Manipulación, formateo e internacionalización en español |
| **Iconografía** | [Lucide React](https://lucide.dev/) | Iconos vectoriales consistentes y ligeros |
| **Primitivas UI** | [Radix UI](https://www.radix-ui.com/) | Componentes accesibles (Dialog, Popover, Select, Switch) |

---

## 📂 Estructura del Proyecto

```text
nidus/
├── public/                  # Favicons, logo oficial, isotipo y manifest PWA
├── src/
│   ├── app/                 # Rutas de Next.js App Router
│   │   ├── page.tsx         # Entrada raíz (render directo de Hoy)
│   │   ├── today/           # Agenda diaria y módulo de pendientes
│   │   ├── week/            # Planificador semanal de 7 días
│   │   ├── month/           # Calendario mensual interactivo
│   │   ├── recurring/       # Motor de hábitos y rutinas con presets
│   │   └── settings/        # Preferencias de tema, datos y perfil
│   ├── components/
│   │   ├── auth/            # Gatekeeper, validación de PIN y solicitud de acceso
│   │   ├── layout/          # Barra lateral, encabezados y transiciones
│   │   ├── tasks/           # Formularios, items de tareas, posponer y quick-add
│   │   └── ui/              # Componentes base reutilizables e isotipo
│   ├── lib/                 # Motor de recurrencia, utilidades de fecha y cn()
│   ├── store/               # Stores de Zustand (tareas, rutinas, auth, ui)
│   └── types/               # Definiciones de TypeScript
├── .env.example             # Plantilla de variables de entorno seguras
├── next.config.ts           # Configuración de Next.js
├── tailwind.config.ts       # Tokens y extensiones de diseño
└── tsconfig.json            # Configuración estricta de compilación
```

---

## 🚀 Puesta en Marcha Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/ikercarretero01-gif/NIDUS.git
cd NIDUS
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo local `.env.local` a partir de la plantilla:
```bash
cp .env.example .env.local
```

Edita `.env.local` para establecer tu PIN de 4 dígitos:
```env
NEXT_PUBLIC_OWNER_PIN=9891
```

> [!NOTE]
> El archivo `.env.local` está incluido en `.gitignore` para garantizar que tu PIN privado nunca se suba al repositorio.

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 🌐 Guía de Despliegue en Vercel

1. **Subir cambios a GitHub:** Asegúrate de que el repositorio en GitHub esté actualizado en la rama `main`.
2. **Importar Proyecto:** Inicia sesión en [Vercel](https://vercel.com/) y selecciona **Add New...** > **Project** > Importar `NIDUS`.
3. **Configurar Variable de Entorno:**
   - En la sección **Environment Variables**, añade:
     - **Key:** `NEXT_PUBLIC_OWNER_PIN`
     - **Value:** Tu PIN personal de 4 dígitos (p. ej. `9891`).
4. **Desplegar:** Haz clic en **Deploy**. El proceso de compilación y optimización estática tomará menos de 1 minuto.

Cualquier usuario que visite la URL generada verá la pantalla de acceso privado y la opción de solicitar credenciales a tu dirección de correo, manteniendo tu información estrictamente segura.

---

## 📄 Licencia

Desarrollado y mantenido por **Iker Carretero**. Proyecto personal protegido bajo licencia privada.

