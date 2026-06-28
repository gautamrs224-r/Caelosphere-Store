import { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

export default function Input({
  label,
  icon,
  type = 'text',
  error,
  className = '',
  ...props
}) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (show ? 'text' : 'password') : type

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-soft-silver">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cool-gray">
            {icon}
          </span>
        )}
        <input
          type={inputType}
          className={`input-field ${icon ? 'pl-11' : ''} ${isPassword ? 'pr-11' : ''} ${
            error ? 'border-error/60' : ''
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-cool-gray hover:text-slate-gray transition-colors"
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  )
}
