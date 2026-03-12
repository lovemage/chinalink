'use client'

import { useField } from '@payloadcms/ui'
import type { SelectFieldClientComponent } from 'payload'

import { MaterialSymbol } from '@/components/ui/MaterialSymbol'
import { serviceIconOptions } from '@/lib/services/serviceIcons'
import './material-symbols.css'

export const ServiceIconPreviewField: SelectFieldClientComponent = ({ path }) => {
  const { setValue, value } = useField<string>({
    potentiallyStalePath: path,
  })

  return (
    <div
      style={{
        marginBottom: '0.75rem',
      }}
    >
      <div
        style={{
          display: 'grid',
          gap: '0.5rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(112px, 1fr))',
        }}
      >
        {serviceIconOptions.map((option) => {
          const isActive = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue(option.value)}
              style={{
                alignItems: 'center',
                background: isActive ? 'rgba(11, 101, 255, 0.08)' : '#fff',
                border: isActive ? '1px solid rgba(11, 101, 255, 0.45)' : '1px solid #d9e1ea',
                borderRadius: '16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                justifyContent: 'center',
                minHeight: '92px',
                padding: '0.9rem 0.75rem',
                textAlign: 'center',
                transition: 'border-color 120ms ease, background 120ms ease, transform 120ms ease',
              }}
            >
              <div
                style={{
                  alignItems: 'center',
                  background: isActive ? 'rgba(11, 101, 255, 0.12)' : '#f5f7fa',
                  borderRadius: '14px',
                  display: 'flex',
                  height: '44px',
                  justifyContent: 'center',
                  width: '44px',
                }}
              >
                <MaterialSymbol name={option.value} className="text-[24px]" />
              </div>
              <span
                style={{
                  color: '#1f2937',
                  fontSize: '12px',
                  fontWeight: 600,
                  lineHeight: 1.35,
                }}
              >
                {option.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
