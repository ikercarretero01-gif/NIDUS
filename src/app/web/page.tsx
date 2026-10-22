'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Repeat,
  FolderKanban,
  ArrowRight,
  ShieldCheck,
  Zap,
  Code2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Clock,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/cn';

export default function WebLandingPage() {
  const [demoTasks, setDemoTasks] = useState([
    { id: 1, title: 'Entrenamiento de fuerza (Push Day)', block: 'Mañana', completed: true, project: 'Salud & Hábitos', color: '#10b981' },
    { id: 2, title: 'Revisar arquitectura y modularidad en Nidus', block: 'Mañana', completed: true, project: 'Desarrollo Web', color: '#3b82f6' },
    { id: 3, title: 'Planificar sprint semanal de proyectos personales', block: 'Tarde', completed: false, project: 'Proyectos Personales', color: '#8b5cf6' },
    { id: 4, title: 'Lectura de 30 minutos sobre sistemas distribuidos', block: 'Noche', completed: false, project: 'Salud & Hábitos', color: '#10b981' },
  ]);

  const toggleDemoTask = (id: number) => {
    setDemoTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = demoTasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / demoTasks.length) * 100);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-zinc-800 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* Luz ambiental sutil en el fondo */}
      <div className="pointer-events-none fixed inset-0 -z-10 flex justify-center">
        <div className="h-[600px] w-[800px] rounded-full bg-amber-500/5 blur-[140px] -translate-y-1/2" />
      </div>

      {/* Barra de Navegación */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/70 bg-[#09090b]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Nidus"
              className="h-8 w-8 rounded-xl object-contain shadow-xs"
            />
            <span className="text-base font-bold tracking-tight text-white">Nidus</span>
            <span className="hidden sm:inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
              v1.0
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-400 font-medium">
            <a href="#filosofia" className="hover:text-zinc-100 transition-colors">Filosofía</a>
            <a href="#diferencias" className="hover:text-zinc-100 transition-colors">Características</a>
            <a href="#comparativa" className="hover:text-zinc-100 transition-colors">Comparativa</a>
            <a href="#stack" className="hover:text-zinc-100 transition-colors">Stack Técnico</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href="https://github.com/ikercarretero01-gif/NIDUS"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>

            <Link
              href="/today"
              className="flex items-center gap-1.5 rounded-xl bg-white text-zinc-950 px-4 py-1.5 text-xs font-semibold hover:bg-zinc-200 transition-colors shadow-xs"
            >
              <span>Abrir App</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 max-w-4xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3.5 py-1 text-xs font-medium text-amber-300 mb-6 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Agenda intencional · Gestión de proyectos · Local-first</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-3xl mx-auto leading-[1.15]">
          El refugio digital para enfocar tu tiempo y ejecutar tus proyectos.
        </h1>

        <p className="mt-6 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Del latín <strong className="text-zinc-200 font-serif italic">nidus</strong> (el nido donde se gesta lo que va a crecer) y <strong className="text-zinc-200 font-serif italic">agenda</strong> («las cosas que se han de hacer»). Sin suscripciones abusivas ni configuraciones infinitas.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/today"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-white text-zinc-950 px-6 py-3 text-sm font-semibold hover:bg-zinc-200 transition-colors shadow-md"
          >
            <span>Probar Nidus en Vivo</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <a
            href="https://github.com/ikercarretero01-gif/NIDUS"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-6 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <Code2 className="h-4 w-4" />
            <span>Ver Repositorio en GitHub</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-60" />
          </a>
        </div>
      </section>

      {/* Mockup Interactivo / Demo en Vivo */}
      <section className="px-4 sm:px-6 max-w-4xl mx-auto pb-24">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 sm:p-6 shadow-2xl backdrop-blur-xl relative">
          
          {/* Barra superior de la demo */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs font-medium text-zinc-400">Vista previa interactiva de la Agenda</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span>{completedCount} de {demoTasks.length} completadas</span>
              <span className="text-amber-400 font-bold">({progressPercent}%)</span>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden mb-6">
            <div
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Lista de tareas de prueba interactivas */}
          <div className="space-y-2.5">
            {demoTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleDemoTask(task.id)}
                className={cn(
                  'flex items-center justify-between rounded-xl border p-3 transition-all duration-150 cursor-pointer text-left',
                  task.completed
                    ? 'border-zinc-800/50 bg-zinc-900/30 opacity-60'
                    : 'border-zinc-800 bg-zinc-900/80 hover:border-zinc-700'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-md border transition-all duration-150',
                      task.completed
                        ? 'border-emerald-500 bg-emerald-500 text-black'
                        : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-500'
                    )}
                  >
                    {task.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>

                  <span
                    className={cn(
                      'text-xs sm:text-sm font-medium',
                      task.completed ? 'line-through text-zinc-500' : 'text-zinc-200'
                    )}
                  >
                    {task.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium border"
                    style={{
                      borderColor: `${task.color}40`,
                      backgroundColor: `${task.color}15`,
                      color: task.color,
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: task.color }}
                    />
                    <span>{task.project}</span>
                  </span>

                  <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline-block">
                    {task.block}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Haz clic en los checkboxes para probar la reactividad instantánea</span>
            <Link
              href="/today"
              className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1"
            >
              <span>Abrir aplicación completa</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Filosofía y Origen */}
      <section id="filosofia" className="py-16 border-t border-zinc-850 bg-zinc-950/40 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <span>El Significado de Nidus</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Un refugio para lo que verdaderamente importa.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-2">
              <h3 className="text-sm font-semibold text-white font-serif italic">Nidus (Latín)</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                El nido: el lugar donde uno se asienta y cuida lo que está por nacer y crecer. Un espacio protegido para incubar metas y proyectos personales sin el ruido digital de las herramientas masivas.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-2">
              <h3 className="text-sm font-semibold text-white font-serif italic">Agenda (Latín)</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Derivado del verbo <em className="text-zinc-300">agere</em> («actuar, poner en movimiento»). Su significado literal es <strong className="text-zinc-200">«las cosas que se han de hacer»</strong>: el compromiso consciente con el futuro inmediato.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Características Diferenciales */}
      <section id="diferencias" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
            Diseñada con Propósito
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Qué hace diferente a Nidus
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Cada elemento está pensado para reducir la sobrecarga mental y maximizar el tiempo dedicado a la ejecución real.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Gestión por Energía, no por Minutos</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Las agendas tradicionales te obligan a encajar tareas en franjas horarias rígidas que rara vez se cumplen. Nidus organiza el día en bloques de mañana, tarde y noche según tu concentración real.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Repeat className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Incubadora de Hábitos y Rutinas</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Configura rutinas periódicas con presets como Gimnasio (L-X-V), estudio o lectura. Nidus las sincroniza en tu agenda únicamente los días elegidos, eliminando la fatiga de decidir qué toca hacer cada mañana.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <FolderKanban className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Módulo de Proyectos Personales</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Agrupa tareas bajo proyectos personales con paleta de colores distintiva, métricas de porcentaje de avance en vivo y panel dedicado para medir tu progreso hito a hito.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CalendarDays className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Replanificación Sin Culpa</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              En lugar de generar listas rojas de tareas atrasadas que causan ansiedad, Nidus te permite posponer tareas en un clic mediante un mini calendario interactivo o moverlas todas a hoy.
            </p>
          </div>

          {/* Card 5 */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Velocidad Nativa y Sin Esperas</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Desarrollada con Next.js 15 y React 19. Cero spinners de carga pesados, navegación instantánea y tiempos de respuesta inferiores a 100 milisegundos.
            </p>
          </div>

          {/* Card 6 */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Local-First con Nube Opcional</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Tus tareas residen en tu dispositivo de forma nativa e instantánea. Si deseas sincronización multidispositivo, conecta tu propio Supabase bajo políticas Row Level Security (RLS) estrictas.
            </p>
          </div>
        </div>
      </section>

      {/* Tabla Comparativa: Nidus vs Otros */}
      <section id="comparativa" className="py-16 px-4 sm:px-6 max-w-4xl mx-auto border-t border-zinc-850">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Nidus frente a las herramientas tradicionales
          </h2>
          <p className="text-xs text-zinc-400">
            Una comparativa honesta de por qué menos complejidad significa más resultados.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 bg-zinc-900 text-zinc-400 font-mono text-[11px]">
                <tr>
                  <th className="p-3.5 sm:p-4">Criterio</th>
                  <th className="p-3.5 sm:p-4 text-zinc-400">Notion / ClickUp</th>
                  <th className="p-3.5 sm:p-4 text-zinc-400">Todoist / Things 3</th>
                  <th className="p-3.5 sm:p-4 text-amber-400 font-semibold">Nidus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                <tr>
                  <td className="p-3.5 sm:p-4 font-medium text-white">Configuración inicial</td>
                  <td className="p-3.5 sm:p-4 text-zinc-400">Horas diseñando tablas</td>
                  <td className="p-3.5 sm:p-4 text-zinc-400">Moderada</td>
                  <td className="p-3.5 sm:p-4 text-amber-300 font-semibold">0 segundos (abrir y usar)</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-medium text-white">Coste económico</td>
                  <td className="p-3.5 sm:p-4 text-zinc-400">Gratis / Planes Pro</td>
                  <td className="p-3.5 sm:p-4 text-zinc-400">5€ a 50€ (pago o suscripción)</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-semibold">100% Open Source (MIT)</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-medium text-white">Rutinas por días (Gym L-X-V)</td>
                  <td className="p-3.5 sm:p-4 text-zinc-400">Requiere automatizaciones complejas</td>
                  <td className="p-3.5 sm:p-4 text-zinc-400">Básico</td>
                  <td className="p-3.5 sm:p-4 text-amber-300 font-semibold">Presets automáticos de 1 clic</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-medium text-white">Privacidad y control</td>
                  <td className="p-3.5 sm:p-4 text-zinc-400">Nube propietaria cerrada</td>
                  <td className="p-3.5 sm:p-4 text-zinc-400">Nube propietaria cerrada</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-semibold">Local-First + Nube privada (RLS)</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-medium text-white">Velocidad de carga</td>
                  <td className="p-3.5 sm:p-4 text-zinc-400">Lenta (1-3 segs)</td>
                  <td className="p-3.5 sm:p-4 text-zinc-400">Rápida</td>
                  <td className="p-3.5 sm:p-4 text-amber-300 font-semibold">Instantánea (&lt;100ms)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Stack Tecnológico */}
      <section id="stack" className="py-16 px-4 sm:px-6 max-w-4xl mx-auto border-t border-zinc-850">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
            Arquitectura Moderna
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Stack Técnico
          </h2>
          <p className="text-xs text-zinc-400">
            Construido con el ecosistema web más avanzado de la actualidad.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { name: 'Next.js 15', role: 'App Router & API Routes' },
            { name: 'React 19', role: 'Concurrencia y Hooks' },
            { name: 'TypeScript 5', role: 'Tipado estricto' },
            { name: 'Tailwind CSS 3.4', role: 'Tokens de diseño' },
            { name: 'Zustand 5', role: 'Estado y persistencia' },
            { name: 'Supabase', role: 'PostgreSQL + RLS Realtime' },
            { name: 'HMAC Security', role: 'Sesiones con cookies HttpOnly' },
            { name: 'date-fns 4', role: 'Cálculo de recurrencias' },
          ].map((item) => (
            <div
              key={item.name}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5 text-left space-y-1"
            >
              <h4 className="text-xs font-bold text-white">{item.name}</h4>
              <p className="text-[11px] text-zinc-400">{item.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-20 px-4 sm:px-6 max-w-3xl mx-auto text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800">
          <img src="/logo.png" alt="Nidus" className="h-10 w-10 object-contain" />
        </div>

        <h2 className="text-3xl font-bold text-white tracking-tight">
          Empieza a ordenar tu tiempo hoy.
        </h2>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          Prueba la aplicación directamente o clona el repositorio para adaptarlo a tus propios proyectos personales.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/today"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-white text-zinc-950 px-6 py-3 text-xs font-semibold hover:bg-zinc-200 transition-colors shadow-md"
          >
            <span>Acceder a la Agenda</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <a
            href="https://github.com/ikercarretero01-gif/NIDUS"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-6 py-3 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <Code2 className="h-4 w-4" />
            <span>Fork en GitHub</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-8 px-4 sm:px-6 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Nidus" className="h-4 w-4 object-contain" />
            <span className="font-semibold text-zinc-400">Nidus</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>

          <p className="flex items-center gap-1 text-[11px]">
            <span>Desarrollado con dedicación por</span>
            <strong className="text-zinc-300 font-semibold">Iker Carretero</strong>
          </p>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="https://github.com/ikercarretero01-gif/NIDUS"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 transition-colors"
            >
              GitHub
            </a>
            <Link href="/today" className="hover:text-zinc-300 transition-colors">
              App
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
