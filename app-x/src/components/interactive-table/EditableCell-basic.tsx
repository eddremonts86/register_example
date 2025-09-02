import { useState } from 'react';
import { Input } from '../ui/input-basic';
import { TableCell } from '../ui/table-basic';
import type { EditableCellProps } from './types';

/**
 * Componente para celdas editables en la tabla
 * Implementa el guardado implícito usando el evento onBlur
 */
export function EditableCell<T>({
  value: initialValue,
  column,
  rowId,
}: EditableCellProps<T>) {
  // Estado local para manejar el valor durante la edición
  const [value, setValue] = useState<string>(String(initialValue || ''));
  const [isEditing, setIsEditing] = useState(false);

  /**
   * Maneja el evento onBlur para guardar automáticamente los cambios
   * Este es el corazón del "guardado implícito"
   */
  const handleBlur = () => {
    setIsEditing(false);

    // Solo ejecutar la función de callback si el valor ha cambiado
    if (value !== String(initialValue) && column.onCellUpdate) {
      // Convertir el valor al tipo apropiado si es necesario
      const processedValue = isNaN(Number(value)) ? value : Number(value);
      column.onCellUpdate(rowId, processedValue);
    }
  };

  /**
   * Maneja el cambio de valor durante la escritura
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  /**
   * Maneja el focus en el input
   */
  const handleFocus = () => {
    setIsEditing(true);
  };

  /**
   * Maneja el evento Enter para confirmar el cambio
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur(); // Esto disparará el evento onBlur
    }
  };

  return (
    <TableCell style={{ padding: '4px' }}>
      <Input
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        style={{
          border: '0',
          boxShadow: 'none',
          backgroundColor: isEditing ? 'white' : 'transparent',
          height: '32px',
          padding: '4px 8px',
          borderRadius: isEditing ? '4px' : '0',
          border: isEditing ? '2px solid #007bff' : '1px solid transparent'
        }}
        placeholder="Escribir..."
      />
    </TableCell>
  );
}
