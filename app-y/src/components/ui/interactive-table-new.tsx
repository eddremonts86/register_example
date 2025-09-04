import { cn } from '@/lib/utils';
import React, { useCallback, useMemo, useState } from 'react';

export interface TableData {
  id: string | number;
  [key: string]: unknown;
}

export interface ColumnDef {
  id: string;
  header: string;
  accessorKey?: string;
  accessor?: (row: TableData) => unknown;
  cell?: (props: { getValue: () => unknown; row: { original: TableData } }) => React.ReactNode;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  meta?: {
    type?: 'text' | 'number' | 'date' | 'boolean' | 'select';
    options?: Array<{ label: string; value: string }>;
  };
}

export interface InteractiveTableProps {
  data: TableData[];
  columns: ColumnDef[];
  onUpdate?: (id: string | number, field: string, value: unknown) => void;
  className?: string;
}

export function InteractiveTable({
  data,
  columns,
  onUpdate,
  className
}: InteractiveTableProps) {
  const [editingCell, setEditingCell] = useState<{
    rowId: string | number;
    columnId: string;
  } | null>(null);

  const [editValue, setEditValue] = useState<string>('');

  const handleCellClick = useCallback(
    (rowId: string | number, columnId: string, currentValue: unknown) => {
      setEditingCell({ rowId, columnId });
      setEditValue(String(currentValue || ''));
    },
    []
  );

  const handleSave = useCallback(() => {
    if (editingCell && onUpdate) {
      onUpdate(editingCell.rowId, editingCell.columnId, editValue);
    }
    setEditingCell(null);
    setEditValue('');
  }, [editingCell, editValue, onUpdate]);

  const handleCancel = useCallback(() => {
    setEditingCell(null);
    setEditValue('');
  }, []);

  const getCellValue = useCallback(
    (row: TableData, column: ColumnDef) => {
      if (column.accessor) {
        return column.accessor(row);
      }
      if (column.accessorKey) {
        return row[column.accessorKey];
      }
      return row[column.id];
    },
    []
  );

  const renderedRows = useMemo(() => {
    return data.map((row) => (
      <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
        {columns.map((column) => {
          const cellValue = getCellValue(row, column);
          const isEditing = editingCell?.rowId === row.id && editingCell?.columnId === column.id;

          return (
            <td
              key={column.id}
              className="px-4 py-2 text-sm text-gray-900 cursor-pointer"
              onClick={() => !isEditing && handleCellClick(row.id, column.id, cellValue)}
            >
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave();
                      if (e.key === 'Escape') handleCancel();
                    }}
                  />
                  <button
                    onClick={handleSave}
                    className="px-2 py-1 text-xs text-white bg-green-500 rounded hover:bg-green-600"
                  >
                    ✓
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="hover:bg-blue-50 px-2 py-1 rounded">
                  {column.cell
                    ? column.cell({ getValue: () => cellValue, row: { original: row } })
                    : String(cellValue || '')}
                </div>
              )}
            </td>
          );
        })}
      </tr>
    ));
  }, [data, columns, editingCell, editValue, getCellValue, handleCellClick, handleSave, handleCancel]);

  return (
    <div className={cn('w-full overflow-auto', className)}>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderedRows}</tbody>
      </table>
    </div>
  );
}

export default InteractiveTable;
