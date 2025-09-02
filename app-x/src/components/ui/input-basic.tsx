import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', style, ...props }, ref) => {
    return (
      <input
        ref={ref}
        style={{
          display: 'flex',
          height: '40px',
          width: '100%',
          borderRadius: '6px',
          border: '1px solid #ced4da',
          backgroundColor: 'white',
          padding: '8px 12px',
          fontSize: '0.875rem',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          ...style
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#007bff';
          e.target.style.boxShadow = '0 0 0 2px rgba(0, 123, 255, 0.25)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#ced4da';
          e.target.style.boxShadow = 'none';
          // Llamar al onBlur original si existe
          if (props.onBlur) {
            props.onBlur(e);
          }
        }}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
