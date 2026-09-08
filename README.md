# Nidus

<p align="center">
  <img src="public/logo.png" alt="Nidus Logo" width="80" height="80" />
</p>

<p align="center">
  <strong>Agenda diaria minimalista para optimizar tu tiempo y avanzar en tus proyectos personales. Simpleza radical, cero fricción de gestión.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-20232A?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/State-Zustand-orange?style=flat-square" alt="Zustand" />
  <img src="https://img.shields.io/badge/Licencia-Open%20Source-green?style=flat-square" alt="Licencia" />
</p>

---

## El Significado de Nidus

Del latín ***nidus*** («nido», el lugar donde uno se asienta y cuida lo que está por crecer) y enraizado con el concepto clásico de ***agenda*** (del verbo latino *agere*, «las cosas que se han de hacer»).

Nidus está concebido como un refugio de trabajo: un espacio seguro y minimalista donde incubar tus proyectos personales, ordenar tus hábitos diarios y avanzar con foco, lejos de la dispersión y el ruido de las herramientas convencionales.

---

## Por qué Nidus

La mayoría de herramientas de productividad caen en dos extremos:

1. **Herramientas sobrecargadas (Notion, ClickUp):** Ofrecen infinitas opciones, pero acabas perdiendo más tiempo diseñando plantillas, tablas y configurando propiedades que completando trabajo real.
2. **Aplicaciones de pago por suscripción (Things 3, Todoist, Sunsama):** Bloquean funciones esenciales tras muros de pago o suscripciones mensuales recurrentes.

**Nidus nace como alternativa intencional:** una agenda diaria limpia, rápida y gratuita pensada para organizar tu jornada, tus hábitos y tus proyectos personales sin distracciones ni configuraciones innecesarias.

- **Diseñada para ejecutar:** Entras y ves lo que tienes que hacer hoy, distribuido de forma natural en bloques (mañana, tarde y noche).
- **Control total de tus hábitos:** Rutinas periódicas (gimnasio, lectura, repaso de proyectos) que se sincronizan solas en los días que tú decidas.
- **Tu propio espacio, 100% personalizable:** Diseñada para clonar el repositorio, desplegarla en tu propia infraestructura o en Vercel gratis, y adaptarla a tus proyectos y rutinas cotidianas.

---

## Qué Hace Diferente a Nidus

### Gestión por Energía, no por Minutos
Las agendas tradicionales te obligan a encajar tareas en franjas rígidas que rara vez se cumplen. Nidus organiza tu jornada en bloques orgánicos de mañana, tarde y noche, ayudándote a distribuir el trabajo profundo y los proyectos personales según tu nivel de concentración real.

### Incubadora de Rutinas: Hábitos que se Mantienen Solos
El progreso en proyectos personales depende de la consistencia. Configura hábitos y compromisos periódicos (como sesiones de entrenamiento L-X-V, bloques de desarrollo o lectura) y Nidus los sincroniza en tu agenda únicamente los días elegidos, eliminando la fatiga de decidir qué toca hacer cada mañana.

### Replanificación Sin Culpa: Cero Ansiedad de Tareas Atrasadas
La productividad real asume que los imprevistos suceden. En lugar de generar una lista interminable de tareas atrasadas que generan culpa, Nidus rescata lo inconcluso de días pasados y te permite reprogramarlo en un clic hacia el día oportuno con su mini calendario interactivo o incorporarlo a tu jornada con un solo toque.

### Visión Panorámica sin Perder el Foco
Alterna con un clic entre la ejecución del día a día, la perspectiva semanal de 7 días para equilibrar cargas de trabajo y la visión mensual para proyectar plazos sin saturarte.

### Local-First: Privacidad Absoluta y Cero Dependencias
Tus notas, ideas y proyectos son tuyos. Nidus almacena tus datos directamente en tu propio dispositivo, ofreciendo una experiencia instantánea, sin tiempos de carga, sin rastreo y sin costes de suscripción.

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
├── public/                  # Favicons, logo oficial, isotipo y manifest PWA
├── src/
│   ├── app/                 # Rutas de la aplicación (Next.js App Router)
│   │   ├── page.tsx         # Render directo de la agenda de hoy
│   │   ├── today/           # Agenda diaria por bloques y tareas pendientes
│   │   ├── week/            # Planificador semanal de 7 días
│   │   ├── month/           # Calendario mensual interactivo
│   │   ├── recurring/       # Gestor de rutinas y hábitos
│   │   ├── projects/        # Gestión de proyectos personales y métricas
│   │   └── settings/        # Configuración general y tema
│   ├── components/
│   │   ├── layout/          # Barra lateral, cabeceras y tema
│   │   ├── tasks/           # Formularios, tarjetas de tarea y modal de posponer
│   │   └── ui/              # Componentes base e isotipo
│   ├── lib/                 # Motor de recurrencia, fechas y utilidades
│   ├── store/               # Stores de Zustand (tareas, rutinas, proyectos, ui)
│   └── types/               # Tipos e interfaces globales de TypeScript
├── next.config.ts           # Configuración de Next.js
├── tailwind.config.ts       # Tokens y temas de diseño
└── tsconfig.json            # Configuración estricta de TypeScript
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

## Adaptación a Proyectos Personales

Nidus está construida con una arquitectura modular para que cualquier desarrollador pueda utilizarla como su propia agenda o adaptarla al flujo de trabajo de sus proyectos personales:

- **Etiquetas y categorías:** Modifica las áreas de enfoque en `src/lib/constants.ts`.
- **Franjas horarias:** Ajusta los bloques de mañana, tarde y noche según tus hábitos en `src/lib/recurrence-engine.ts`.
- **Persistencia local:** Los datos no dependen de servicios de terceros ni bases de datos de pago; se guardan en el almacenamiento de tu navegador de manera segura e instantánea.
- **Despliegue gratuito:** Listo para publicar en un clic en [Vercel](https://vercel.com/) con cero costes de mantenimiento.

---

## Licencia

Desarrollado por **Iker Carretero**. Proyecto de código abierto para productividad personal.
