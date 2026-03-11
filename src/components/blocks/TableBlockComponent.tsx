interface Header {
  label: string
  id?: string | null
}

interface Cell {
  value: string
  id?: string | null
}

interface Row {
  cells?: Cell[] | null
  id?: string | null
}

interface TableBlockComponentProps {
  headers?: Header[] | null
  rows?: Row[] | null
}

export function TableBlockComponent({ headers, rows }: TableBlockComponentProps) {
  if (!headers || headers.length === 0) return null

  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-brand-primary/10">
          <tr>
            {headers.map((header) => (
              <th key={header.id || header.label} className="px-4 py-3 font-semibold text-brand-text">
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows?.map((row) => (
            <tr key={row.id} className="hover:bg-brand-primary/5">
              {row.cells?.map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-brand-text">
                  {cell.value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
