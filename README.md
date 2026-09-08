# Nidus

<p align="center">
  <img src="public/logo.png" alt="Nidus Logo" width="80" height="80" />
</p>

<p align="center">
  <strong>Agenda diaria intencional y motor de rutinas recurrentes. Diseñada para concentrarse en ejecutar, no en gestionar listas infinitas.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-20232A?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/State-Zustand-orange?style=flat-square" alt="Zustand" />
</p>

---

## Por qué Nidus

La mayoría de herramientas de productividad se convierten en vertederos de tareas atrasadas. Se pierde más tiempo configurando etiquetas, prioridades complejas y carpetas anidadas que completando trabajo real.

Nidus replantea este flujo con un enfoque directo:

- **Enfoque en el día a día:** La vista central es la agenda de hoy, segmentada naturalmente en bloques de mañana, tarde y noche para dar contexto temporal sin rigidez.
- **Hábitos y compromisos sin fricción:** Rutinas periódicas (entrenamiento, lectura, revisiones) que aparecen en la agenda de forma automática según los días elegidos, sin ensuciar la bandeja de entrada cuando no tocan.
- **Replanificación ágil:** Si una tarea no se completa, no se pierde ni genera culpa. Un clic abre el selector interactivo para posponerla al día exacto con un solo toque.
- **Velocidad nativa:** Carga instantánea, persistencia local en el dispositivo del usuario y cero esperas entre pantallas.

---

## Vista Previa

<!--
===================================================================
[CAPTURAS SUGERIDAS PARA ESTA SECCIÓN]
Guarda tus imágenes en la carpeta 'docs/screenshots/' con estos nombres:
- today-view.png      -> Captura de la Agenda Diaria en modo oscuro mostrando los bloques y barra de progreso.
- routines-view.png   -> Captura de la pantalla de Rutinas con los presets (Gym L-X-V, Diario) y selectores de días.
- postpone-modal.png  -> Captura del modal de posponer con el mini calendario mensual desplegado.
===================================================================
-->

<p align="center">
  <img src="docs/screenshots/today-view.png" alt="Agenda Diaria Nidus" width="850" />
  <br />
  <em>Agenda diaria estructurada por franjas horarias con progreso en tiempo real.</em>
</p>

<br />

<p align="center">
  <img src="docs/screenshots/routines-view.png" alt="Gestor de Rutinas" width="415" />
  &nbsp;&nbsp;
  <img src="docs/screenshots/postpone-modal.png" alt="Modal de Posponer Tarea" width="415" />
</p>

<p align="center">
  <em>Izquierda: Configuración de rutinas recurrentes por días. Derecha: Replanificación rápida con mini calendario.</em>
</p>

---

## Funcionalidades Clave

### Agenda Diaria por Bloques
- Navegación rápida con accesos directos (*Ayer, Hoy, Mañana*) y selector de calendario.
- Agrupación automática de tareas según horario: **Mañana** (hasta las 14:00), **Tarde** (14:00 a 20:00) y **Noche** (a partir de las 20:00).
- Métricas visuales de cumplimiento con barra de progreso interactiva.

### Bandeja de Pendientes y Posposición Inteligente
- Detección automática de tareas pendientes que quedaron sin marcar en días anteriores.
- Botón **Posponer** por tarea con mini calendario mensual interactivo y atajos inmediatos (*Hoy, Mañana, +2 días, Siguiente semana*).
- Acción rápida para arrastrar todas las pendientes acumuladas a la jornada actual con un solo clic.

### Motor de Rutinas Recurrentes
- Diseñado para hábitos y compromisos cíclicos (rutinas de gimnasio, estudio, revisiones periódicas).
- Presets rápidos de un clic: *Gym (L-X-V), Todos los días, Días laborables (L-V), Fines de semana*.
- Selectores manuales para activar cualquier combinación de días de la semana (`L · M · X · J · V · S · D`).
- Inyección automática en la agenda del día como tareas completables con seguimiento de racha.

### Vistas Semanal y Mensual
- **Planificador Semanal:** Matriz de 7 días para distribuir la carga de trabajo de un vistazo.
- **Calendario Mensual:** Vista global con indicadores de volumen diario y panel lateral de detalle.

### Experiencia Visual
- Interfaz cuidada con tonos oscuros zinc, microinteracciones fluidas y tipografía clara.
- Selector de tema Claro / Oscuro con detección de preferencia del sistema.
- Compatibilidad completa para móviles e instalación PWA con `manifest.json`.

---

## Stack Tecnológico

| Capa | Herramienta | Utilidad |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | Renderizado estático optimizado, hidratación selectiva y enrutamiento rápido |
| **Biblioteca UI** | React 19 | Arquitectura modular de componentes y hooks |
| **Tipado** | TypeScript 5 | Tipos estrictos para tareas, prioridades y frecuencias |
| **Estilos** | Tailwind CSS 3.4 | Sistema de diseño responsivo y tokens visuales |
| **Estado Global** | Zustand 5 + Persist | Estado reactivo con sincronización local continua (`localStorage`) |
| **Fechas** | date-fns 4 | Motor de cálculo de semanas, meses y recurrencias |
| **Iconografía** | Lucide React | Iconos vectoriales limpios y minimalistas |
| **Primitivas UI** | Radix UI | Componentes accesibles (Dialog, Popover, Select, Switch) |

---

## Estructura del Proyecto

```text
nidus/
├── docs/screenshots/        # Capturas de demostración para el README
├── public/                  # Favicons, logo oficial, isotipo y manifest PWA
├── src/
│   ├── app/                 # Rutas de la aplicación (Next.js App Router)
│   │   ├── page.tsx         # Render directo de la jornada de hoy
│   │   ├── today/           # Agenda diaria y bandeja de pendientes
│   │   ├── week/            # Planificador semanal de 7 días
│   │   ├── month/           # Calendario mensual
│   │   ├── recurring/       # Gestor de rutinas y hábitos
│   │   └── settings/        # Configuración general y tema
│   ├── components/
│   │   ├── layout/          # Barra lateral de navegación y contenedores
│   │   ├── tasks/           # Formularios, tarjetas de tarea y modal de posponer
│   │   └── ui/              # Componentes base e isotipo
│   ├── lib/                 # Utilidades de fechas, motor de recurrencia y cn()
│   ├── store/               # Stores de Zustand (tareas, rutinas, ui)
│   └── types/               # Tipos e interfaces globales
├── tailwind.config.ts       # Configuración de estilos
└── tsconfig.json            # Configuración de TypeScript
```

---

## Puesta en Marcha Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/ikercarretero01-gif/NIDUS.git
cd NIDUS

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor local
npm run dev
```

La aplicación se abrirá en [http://localhost:3000](http://localhost:3000).

---

## Licencia

Desarrollado por **Iker Carretero**. Proyecto personal.
