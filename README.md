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
  <a href="./LICENSE"><img src="https://img.shields.io/badge/Licencia-MIT-green?style=flat-square" alt="Licencia MIT" /></a>
</p>

<p align="center">
  <a href="https://nidus-two.vercel.app/web"><strong>🌐 Ver Web Oficial</strong></a> &nbsp;•&nbsp; 
  <a href="https://nidus-two.vercel.app"><strong>🚀 Abrir WebApp Nidus</strong></a>
</p>

---

## El Significado de Nidus

Del latín ***nidus*** («nido», el lugar donde uno se asienta y cuida lo que está por crecer).

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

### Separación Inteligente: Agenda Diaria vs Roadmap de Proyectos
A menudo las herramientas mezclan las tareas operativas de hoy con los hitos estratégicos a largo plazo, saturando la vista diaria. En Nidus, los proyectos cuentan con su propio **Tablero de Roadmap Visual** organizado en metas por fases (*Por Empezar*, *En Curso*, *Conseguidas*). Las metas del proyecto no ensucian tu agenda diaria: tú decides cuándo enviar una meta a tu día a día con el botón **«Hacer hoy»** o vincular tareas de tu jornada como subtareas de ejecución.

---

## Arquitectura de Almacenamiento y Privacidad

Nidus está diseñada bajo un modelo híbrido flexible según las necesidades de cada usuario:

1. **Modo Local-First (Por defecto):**
   - Tus datos se almacenan exclusivamente en el almacenamiento de tu propio navegador (`localStorage` reactivo mediante Zustand).
   - Cero dependencias en la nube, funcionamiento offline instantáneo y privacidad absoluta en tu dispositivo.

2. **Modo Sincronización en la Nube (Opcional con Supabase):**
   - Si deseas sincronizar tu agenda en tiempo real entre múltiples dispositivos (por ejemplo, el móvil y el ordenador portátil), puedes configurar tu propia instancia de [Supabase](https://supabase.com).
   - **Aislamiento por usuario:** Cada registro (`tasks`, `projects`, `project_goals`, `recurrence_rules`, `recurrence_completions`) cuenta con una clave `user_id`.
   - **Seguridad en base de datos:** Se aplica **Row Level Security (RLS)** estricto en Supabase (`schema.sql`), impidiendo cualquier acceso no autorizado o lectura accidental entre diferentes usuarios.

---

## Seguridad y Control de Acceso

- **Validación del PIN en Servidor:** El acceso como propietario se valida en el backend mediante Next.js API Routes (`/api/auth/unlock`), verificando el hash del PIN con algoritmos resistentes a ataques de temporización (`crypto.timingSafeEqual`).
- **Sesiones Seguras:** Tras una autenticación exitosa, se emite una cookie segura con atributos `HttpOnly`, `SameSite=Lax` y firma criptográfica HMAC-SHA256. El PIN nunca se envía al cliente JavaScript ni se guarda en texto plano en el navegador.
- **Protección contra Fuerza Bruta:** Limitación automática de intentos fallidos con retardo artificial e intervalos de enfriamiento para mitigar ataques automatizados.
- **Variables Privadas:** El PIN (`APP_PIN`) y la clave de firma (`AUTH_SECRET`) permanecen estrictamente en variables de entorno del servidor, no visibles en el bundle público.

---

## Stack Tecnológico

| Capa | Herramienta | Utilidad |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | Renderizado estático optimizado, hidratación selectiva y enrutamiento rápido |
| **Biblioteca UI** | React 19 | Arquitectura modular de componentes y hooks |
| **Tipado** | TypeScript 5 | Tipos estrictos para tareas, prioridades y frecuencias |
| **Estilos** | Tailwind CSS 3.4 | Sistema de diseño responsivo y tokens visuales |
| **Estado Global** | Zustand 5 + Persist | Estado reactivo con sincronización local continua (`localStorage`) |
| **Base de Datos** | Supabase (PostgreSQL + RLS) | Sincronización en tiempo real y persistencia segura en la nube (opcional) |
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
│   │   ├── api/auth/        # Endpoints de autenticación segura (unlock, session, logout)
│   │   ├── page.tsx         # Render directo de la agenda de hoy
│   │   ├── today/           # Agenda diaria por bloques y tareas pendientes
│   │   ├── week/            # Planificador semanal de 7 días
│   │   ├── month/           # Calendario mensual interactivo
│   │   ├── recurring/       # Gestor de rutinas y hábitos
│   │   ├── projects/        # Gestión de proyectos personales y roadmap
│   │   ├── settings/        # Configuración general, tema y estado de sesión
│   │   └── web/             # Landing page de presentación pública
│   ├── components/
│   │   ├── auth/            # Gatekeeper con teclado PIN nativo móvil y sesión segura
│   │   ├── layout/          # Barra lateral, cabeceras y tema
│   │   ├── tasks/           # Formularios, tarjetas de tarea y modal de posponer
│   │   └── ui/              # Componentes base e isotipo
│   ├── lib/                 # Auth de servidor, sincronización Supabase, motor de recurrencia
│   ├── store/               # Stores de Zustand (tareas, rutinas, proyectos, ui, auth)
│   └── types/               # Tipos e interfaces globales de TypeScript
├── supabase/
│   └── schema.sql           # Esquema PostgreSQL con políticas RLS y suscripciones Realtime
├── test/                    # Pruebas automatizadas de lógica crítica y seguridad
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

# 3. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local y define tu APP_PIN de 4 dígitos

# 4. Ejecutar pruebas automatizadas
npm test

# 5. Iniciar el servidor local
npm run dev
```

La aplicación se abrirá en [http://localhost:3000](http://localhost:3000).

---

## Despliegue en Producción (Vercel)

1. Sube tu copia del repositorio a GitHub.
2. Importa el proyecto en [Vercel](https://vercel.com).
3. Añade tus variables de entorno en **Project Settings -> Environment Variables**:
   - `APP_PIN`: tu PIN de acceso de 4 dígitos.
   - `AUTH_SECRET`: clave aleatoria para la firma de sesiones.
   - *(Opcional)* `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` si utilizas sincronización en nube.
4. Despliega con un clic.

---

## Documentación Técnica

Para un desglose en profundidad sobre las decisiones de ingeniería, el motor de proyección de tareas virtuales y el modelo criptográfico de seguridad, consulta [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Licencia

Distribuido bajo la Licencia MIT. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

Desarrollado con foco y dedicación por **Iker Carretero**.
