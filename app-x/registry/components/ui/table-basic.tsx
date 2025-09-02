import React from 'react';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  className?: string;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className = '', children, ...props }, ref) => (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table
        ref={ref}
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.875rem'
        }}
        {...props}
      >
        {children}
      </table>
    </div>
  )
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ children, ...props }, ref) => (
    <thead ref={ref} {...props}>
      {children}
    </thead>
  )
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ children, ...props }, ref) => (
    <tbody ref={ref} {...props}>
      {children}
    </tbody>
  )
);
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ children, style, ...props }, ref) => (
    <tr
      ref={ref}
      style={{
        borderBottom: '1px solid #e9ecef',
        transition: 'background-color 0.15s ease-in-out',
        ...style
      }}
      {...props}
    >
      {children}
    </tr>
  )
);
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ children, style, ...props }, ref) => (
    <th
      ref={ref}
      style={{
        padding: '12px 16px',
        textAlign: 'left',
        fontWeight: '600',
        color: '#374151',
        backgroundColor: '#f9fafb',
        borderBottom: '2px solid #e5e7eb',
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
        ...style
      }}
      {...props}
    >
      {children}
    </th>
  )
);
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ children, style, ...props }, ref) => (
    <td
      ref={ref}
      style={{
        padding: '12px 16px',
        textAlign: 'left',
        verticalAlign: 'middle',
        color: '#374151',
        ...style
      }}
      {...props}
    >
      {children}
    </td>
  )
);
TableCell.displayName = "TableCell";
