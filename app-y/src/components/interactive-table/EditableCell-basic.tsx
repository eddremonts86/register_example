import React, { useEffect, useRef, useState } from 'react';

interface EditableCellProps {
  value: string | number | boolean;
  isEditable: boolean;
  onBlur: (newValue: string | number) => void;
  displayFormatter?: (value: string | number | boolean) => string | number;
}

export function EditableCell({ value, isEditable, onBlur, displayFormatter }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(String(value));
  const [originalValue] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setCurrentValue(String(value));
  }, [value]);

  const handleClick = () => {
    if (isEditable) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (currentValue !== originalValue) {
      // Intentar convertir a número si es posible
      const numericValue = Number(currentValue);
      const finalValue = !isNaN(numericValue) && currentValue.trim() !== ''
        ? numericValue
        : currentValue;
      onBlur(finalValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setCurrentValue(originalValue);
      setIsEditing(false);
    }
  };

  const displayValue = displayFormatter ? displayFormatter(value) : String(value);

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          border: '2px solid #3b82f6',
          borderRadius: '4px',
          padding: '8px',
          fontSize: '14px',
          outline: 'none',
          background: '#f8fafc'
        }}
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      style={{
        cursor: isEditable ? 'pointer' : 'default',
        padding: '8px',
        minHeight: '20px',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
        backgroundColor: isEditable ? (value !== originalValue ? '#ecfdf5' : 'transparent') : 'transparent',
        border: isEditable ? '2px solid transparent' : 'none',
        display: 'flex',
        alignItems: 'center'
      }}
      onMouseEnter={(e) => {
        if (isEditable) {
          e.currentTarget.style.backgroundColor = '#f1f5f9';
        }
      }}
      onMouseLeave={(e) => {
        if (isEditable && value === originalValue) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <span style={{ color: '#374151' }}>
        {displayValue}
      </span>
      {isEditable && (
        <span style={{
          marginLeft: '4px',
          color: '#9ca3af',
          fontSize: '12px'
        }}>
          ✏️
        </span>
      )}
    </div>
  );
}
