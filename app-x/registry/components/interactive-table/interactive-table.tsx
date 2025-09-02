import React, { useState } from 'react';

// Basic types for the component
interface ColumnDef<T> {
  accessorKey: keyof T;
  header: string;
  isEditable?: boolean;
  onCellUpdate?: (rowId: string | number, newValue: string | number) => void;
  cell?: (value: any, rowData: T) => React.ReactNode;
}

interface InteractiveTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  rowKey?: keyof T;
}

// Basic Table Components (inline for simplicity)
const Table = ({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
  <div style={{ width: '100%', overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }} {...props}>
      {children}
    </table>
  </div>
);

const TableHeader = ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead {...props}>{children}</thead>
);

const TableBody = ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props}>{children}</tbody>
);

const TableRow = ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr style={{ borderBottom: '1px solid #e9ecef' }} {...props}>{children}</tr>
);

const TableHead = ({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th style={{
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: '600',
    backgroundColor: '#f9fafb',
    borderBottom: '2px solid #e5e7eb'
  }} {...props}>
    {children}
  </th>
);

const TableCell = ({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td style={{ padding: '12px 16px', textAlign: 'left' }} {...props}>{children}</td>
);

// Editable Cell Component
function EditableCell<T>({
  value: initialValue,
  column,
  rowId
}: {
  value: any;
  column: ColumnDef<T>;
  rowId: string | number;
}) {
  const [value, setValue] = useState<string>(String(initialValue || ''));
  const [isEditing, setIsEditing] = useState(false);

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== String(initialValue) && column.onCellUpdate) {
      const processedValue = isNaN(Number(value)) ? value : Number(value);
      column.onCellUpdate(rowId, processedValue);
    }
  };

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      onFocus={() => setIsEditing(true)}
      onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
      style={{
        border: 'none',
        background: 'transparent',
        padding: '4px',
        width: '100%',
        outline: 'none',
        borderRadius: '4px',
        ...(isEditing ? {
          background: 'white',
          border: '1px solid #007bff',
          boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.25)'
        } : {})
      }}
    />
  );
}

/**
 * Interactive table component with editable cells and implicit saving
 */
export function InteractiveTable<T>({
  data,
  columns,
  rowKey = 'id' as keyof T,
}: InteractiveTableProps<T>) {
  const getRowId = (rowData: T): string | number => {
    const id = rowData[rowKey];
    return typeof id === 'string' || typeof id === 'number' ? id : 0;
  };

  const renderCell = (column: ColumnDef<T>, rowData: T) => {
    const value = rowData[column.accessorKey];
    const rowId = getRowId(rowData);

    if (column.isEditable) {
      return (
        <EditableCell
          value={value}
          rowData={rowData}
          column={column}
          rowId={rowId}
        />
      );
    }

    if (column.cell) {
      return column.cell(value, rowData);
    }

    return <span>{String(value ?? '')}</span>;
  };

  return (
    <div style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.accessorKey)}>
                {column.header}
                {column.isEditable && (
                  <span style={{ marginLeft: '4px', color: '#f59e0b' }} title="Editable column">
                    ✏️
                  </span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} style={{ textAlign: 'center', height: '96px' }}>
                No data available.
              </TableCell>
            </TableRow>
          ) : (
            data.map((rowData) => {
              const rowId = getRowId(rowData);
              return (
                <TableRow key={rowId}>
                  {columns.map((column) => (
                    <TableCell key={String(column.accessorKey)}>
                      {renderCell(column, rowData)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
