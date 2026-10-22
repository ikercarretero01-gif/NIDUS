export const APP_NAME = 'Nidus';
export const APP_DESCRIPTION = 'Tu espacio de productividad personal';

export const DEFAULT_USER_ID = process.env.NEXT_PUBLIC_USER_ID?.trim() || 'local-user';

export const DAYS_OF_WEEK = [
  { value: 0, label: 'Dom', labelFull: 'Domingo' },
  { value: 1, label: 'Lun', labelFull: 'Lunes' },
  { value: 2, label: 'Mar', labelFull: 'Martes' },
  { value: 3, label: 'Mié', labelFull: 'Miércoles' },
  { value: 4, label: 'Jue', labelFull: 'Jueves' },
  { value: 5, label: 'Vie', labelFull: 'Viernes' },
  { value: 6, label: 'Sáb', labelFull: 'Sábado' },
];

export const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export const DEFAULT_TAGS = [
  'Personal',
  'Universidad',
  'Trabajo',
  'Proyecto',
  'Salud',
  'Hogar',
];
