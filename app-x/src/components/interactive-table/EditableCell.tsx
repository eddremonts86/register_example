import { Input } from '@/components/ui/input';
import { TableCell } from '@/components/ui/table';
import { useState } from 'react';
import type { EditableCellProps } from './types';

/**
 * Componente para celdas editables en la tabla
 * Implementa el guardado implícito usando el evento onBlur
 */
export function EditableCell<T>({
  value: initialValue,
  rowData,
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
    <TableCell className="p-1">
      <Input
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        className={`border-0 shadow-none bg-transparent h-8 px-2 ${
          isEditing
            ? 'ring-2 ring-ring ring-offset-2 bg-background'
            : 'hover:bg-muted/50'
        }`}
        placeholder="Escribir..."
      />
    </TableCell>
  );
}
