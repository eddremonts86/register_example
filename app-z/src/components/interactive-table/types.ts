import type { ReactNode } from 'react';

/**
 * Definition of a column for the interactive table
 */
export interface ColumnDef<T> {
  /** Data object key to access the value */
  accessorKey: keyof T;
  /** Column header text */
  header: string;
  /** Indicates if the column is editable */
  isEditable?: boolean;
  /** Callback function when a cell is updated */
  onCellUpdate?: (rowId: string | number, newValue: string | number) => void;
  /** Custom function to render cell content */
  cell?: (value: string | number | boolean, rowData: T) => ReactNode;
}

/**
 * Props for the InteractiveTable component
 */
export interface InteractiveTableProps<T> {
  /** Array of data to display in the table */
  data: T[];
  /** Column definitions */
  columns: ColumnDef<T>[];
  /** Callback function when a complete row is updated */
  onRowUpdate?: (updatedRow: T) => void;
  /** Unique key to identify each row */
  rowKey?: keyof T;
}

/**
 * Props for an editable cell
 */
export interface EditableCellProps<T> {
  value: string | number | boolean;
  rowData: T;
  column: ColumnDef<T>;
  rowId: string | number;
}
