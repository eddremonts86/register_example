import { useState } from 'react';
import { Input } from '../ui/input-basic';
import { TableCell } from '../ui/table-basic';
import type { EditableCellProps } from './types';

/**
 * Component for editable cells in the table
 * Implements implicit saving using the onBlur event
 */
export function EditableCell<T>({
  value: initialValue,
  column,
  rowId,
}: EditableCellProps<T>) {
  // Local state to handle the value during editing
  const [value, setValue] = useState<string>(String(initialValue || ''));
  const [isEditing, setIsEditing] = useState(false);

  /**
   * Handles the onBlur event to automatically save changes
   * This is the heart of "implicit saving"
   */
  const handleBlur = () => {
    setIsEditing(false);

    // Only execute the callback function if the value has changed
    if (value !== String(initialValue) && column.onCellUpdate) {
      // Convert the value to the appropriate type if necessary
      const processedValue = isNaN(Number(value)) ? value : Number(value);
      column.onCellUpdate(rowId, processedValue);
    }
  };

  /**
   * Handles value change during typing
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  /**
   * Handles focus on the input
   */
  const handleFocus = () => {
    setIsEditing(true);
  };

  /**
   * Handles Enter key event to confirm the change
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur(); // This will trigger the onBlur event
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
          boxShadow: 'none',
          backgroundColor: isEditing ? 'white' : 'transparent',
          height: '32px',
          padding: '4px 8px',
          borderRadius: isEditing ? '4px' : '0',
          border: isEditing ? '2px solid #007bff' : '1px solid transparent'
        }}
        placeholder="Type..."
      />
    </TableCell>
  );
}
