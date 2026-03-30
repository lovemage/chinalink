interface AdminFormFieldProps {
  label: string
  name: string
  required?: boolean
  error?: string
  children: React.ReactNode
  description?: string
}

export default function AdminFormField({
  label,
  name,
  required,
  error,
  children,
  description,
}: AdminFormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}

      {description && !error && (
        <p className="text-xs text-gray-400">{description}</p>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
