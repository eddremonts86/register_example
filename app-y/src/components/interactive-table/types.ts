import type { ReactNode } from 'react';

/**
 * Definición de una columna para la tabla interactiva
 */
export interface ColumnDef<T> {
  /** Clave del objeto de datos para acceder al valor */
  accessorKey: keyof T;
  /** Texto del encabezado de la columna */
  header: string;
  /** Indica si la columna es editable */
  isEditable?: boolean;
  /** Función de callback cuando se actualiza una celda */
  onCellUpdate?: (rowId: string | number, newValue: string | number) => void;
  /** Función personalizada para renderizar el contenido de la celda */
  cell?: (value: string | number | boolean, rowData: T) => ReactNode;
}

/**
 * Props para el componente InteractiveTable
 */
export interface InteractiveTableProps<T> {
  /** Array de datos a mostrar en la tabla */
  data: T[];
  /** Definición de las columnas */
  columns: ColumnDef<T>[];
  /** Función de callback cuando se actualiza una fila completa */
  onRowUpdate?: (updatedRow: T) => void;
  /** Clave única para identificar cada fila */
  rowKey?: keyof T;
}

/**
 * Props para una celda editable
 */
export interface EditableCellProps<T> {
  value: string | number | boolean;
  rowData: T;
  column: ColumnDef<T>;
  rowId: string | number;
}
