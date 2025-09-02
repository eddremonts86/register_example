import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table-basic';
import { EditableCell } from './EditableCell-basic';
import type { InteractiveTableProps } from './types';

/**
 * Interactive table component with editable cells and implicit saving
 *
 * This generic component allows displaying tabular data with the ability
 * to edit certain columns directly inline. Changes are automatically saved
 * when the user finishes editing (onBlur event).
 */
export function InteractiveTable<T>({
  data,
  columns,
  rowKey = 'id' as keyof T,
}: InteractiveTableProps<T>) {
  /**
   * Gets the unique ID of a row
   */
  const getRowId = (rowData: T): string | number => {
    const id = rowData[rowKey];
    return typeof id === 'string' || typeof id === 'number' ? id : 0;
  };

  /**
   * Renders the content of a cell
   */
  const renderCell = (column: (typeof columns)[0], rowData: T) => {
    const value = rowData[column.accessorKey];
    const rowId = getRowId(rowData);

    // If the column is editable, use the EditableCell component
    if (column.isEditable) {
      return (
        <EditableCell
          value={value as string | number | boolean}
          rowData={rowData}
          column={column}
          rowId={rowId}
        />
      );
    }

    // If there's a custom render function, use it
    if (column.cell) {
      return (
        <TableCell>
          {column.cell(value as string | number | boolean, rowData)}
        </TableCell>
      );
    }

    // Default rendering
    return (
      <TableCell>
        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value || '')}
      </TableCell>
    );
  };

  return (
    <div style={{ width: '100%' }}>
      <Table>
        {/* Table header */}
        <TableHeader>
          <TableRow style={{ backgroundColor: '#f8f9fa' }}>
            {columns.map((column) => (
              <TableHead key={String(column.accessorKey)} style={{ fontWeight: '600' }}>
                {column.header}
                {column.isEditable && (
                  <span style={{ marginLeft: '4px', fontSize: '0.75rem', color: '#666' }}>✏️</span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Table body */}
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                style={{
                  height: '96px',
                  textAlign: 'center',
                  color: '#666',
                  fontStyle: 'italic'
                }}
              >
                No data to display
              </TableCell>
            </TableRow>
          ) : (
            data.map((rowData, index) => (
              <TableRow key={getRowId(rowData) || index}>
                {columns.map((column) => (
                  <React.Fragment key={String(column.accessorKey)}>
                    {renderCell(column, rowData)}
                  </React.Fragment>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
