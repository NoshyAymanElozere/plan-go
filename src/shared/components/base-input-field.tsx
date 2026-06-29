import * as React from 'react'
import { Eye, EyeOff, Calendar, Clock } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/shared/utils/utils'

export interface BaseInputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  name: string
  type?: 'text' | 'password' | 'date' | 'number' | 'time'
  customError?: string
}

export const BaseInputField = React.forwardRef<HTMLInputElement, BaseInputFieldProps>(
  ({ label, name, type = 'text', placeholder, className, customError, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const localRef = React.useRef<HTMLInputElement>(null)
    
    // Attempt to retrieve react-hook-form context
    const formContext = useFormContext()
    
    // Register if form context exists, otherwise fallback to empty props
    const registerProps = formContext ? formContext.register(name) : {}
    const formErrors = formContext ? formContext.formState.errors : {}
    const error = customError || (formErrors[name]?.message as string | undefined)

    // Combine forwarded ref and local ref
    React.useImperativeHandle(ref, () => localRef.current as HTMLInputElement)

    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    const handleIconClick = () => {
      if (type === 'date' || type === 'time') {
        localRef.current?.showPicker?.()
      }
    }

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            ref={localRef}
            type={inputType}
            placeholder={placeholder}
            className={cn(
              'w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-main focus:border-main transition-all',
              isPassword && 'pr-10',
              (type === 'date' || type === 'time') && 'pr-10',
              error && 'border-rose-500 focus:ring-rose-500 focus:border-rose-500',
              className
            )}
            {...registerProps}
            {...props}
          />

          {/* Action Icons */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}

          {type === 'date' && (
            <button
              type="button"
              onClick={handleIconClick}
              className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Calendar className="h-4 w-4" />
            </button>
          )}

          {type === 'time' && (
            <button
              type="button"
              onClick={handleIconClick}
              className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Clock className="h-4 w-4" />
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-rose-500 font-semibold">{error}</p>
        )}
      </div>
    )
  }
)

BaseInputField.displayName = 'BaseInputField'
export default BaseInputField
