import { Input } from '@/components/ui/input-basic';
import { useState } from 'react';
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

    // Only execute callback function if the value has changed
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
      e.currentTarget.blur(); // This will trigger onBlur and save the change
    }
  };

  return (
    <Input
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      className={`
        border-none bg-transparent p-1 focus:bg-white focus:border-blue-300 focus:ring-1 focus:ring-blue-300
        ${isEditing ? 'ring-1 ring-blue-300 bg-white' : 'hover:bg-gray-50'}
      `}
      style={{
        minWidth: '60px',
        width: '100%',
      }}
      aria-label={`Edit ${column.header}`}
    />
  );
}
