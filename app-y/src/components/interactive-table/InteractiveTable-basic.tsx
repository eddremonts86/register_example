import { EditableCell } from './EditableCell-basic';
import type { ColumnDef } from './types';

interface InteractiveTableProps<T = unknown> {
  data: T[];
  columns: ColumnDef<T>[];
  rowKey: keyof T;
}

export function InteractiveTable<T extends Record<string, unknown>>({
  data,
  columns,
  rowKey
}: InteractiveTableProps<T>) {

  const handleCellUpdate = (
    rowId: string | number,
    columnKey: keyof T,
    onCellUpdate?: (rowId: string | number, newValue: string | number) => void
  ) => {
    return (newValue: string | number) => {
      if (onCellUpdate) {
        onCellUpdate(rowId, newValue);
      }
    };
  };

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: 'white'
    }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
        backgroundColor: '#f9fafb',
        borderBottom: '1px solid #e5e7eb'
      }}>
        {columns.map((column) => (
          <div
            key={String(column.accessorKey)}
            style={{
              padding: '12px 16px',
              fontWeight: '600',
              fontSize: '14px',
              color: '#374151',
              borderRight: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {column.header}
            {column.isEditable && (
              <span style={{
                marginLeft: '4px',
                color: '#9ca3af',
                fontSize: '12px'
              }}>
                ✏️
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Body */}
      <div>
        {data.map((row, rowIndex) => {
          const rowId = row[rowKey] as string | number;

          return (
            <div
              key={rowId}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
                borderBottom: rowIndex < data.length - 1 ? '1px solid #f3f4f6' : 'none',
                backgroundColor: rowIndex % 2 === 0 ? 'white' : '#fafafa'
              }}
            >
              {columns.map((column) => {
                const cellValue = row[column.accessorKey];

                return (
                  <div
                    key={`${rowId}-${String(column.accessorKey)}`}
                    style={{
                      borderRight: '1px solid #f3f4f6',
                      minHeight: '48px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <EditableCell
                      value={cellValue as string | number | boolean}
                      isEditable={Boolean(column.isEditable)}
                      onBlur={handleCellUpdate(rowId, column.accessorKey, column.onCellUpdate)}
                      displayFormatter={column.cell}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {data.length === 0 && (
        <div style={{
          padding: '48px 24px',
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '14px'
        }}>
          No hay datos para mostrar
        </div>
      )}
    </div>
  );
}
