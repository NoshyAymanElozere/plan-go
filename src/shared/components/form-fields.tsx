import React from 'react'
import { useForm, Controller, type FieldValues, type Path, type Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ZodSchema } from 'zod'
import { cn } from '@/shared/utils/utils'
import { Label } from './label'
import { Input } from './input'
import { Textarea } from './textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Checkbox } from './controls'

// ─── Form Field Wrapper ───────────────────────────────────────────────────────

interface FormFieldProps {
  label?: string
  error?: string
  required?: boolean
  hint?: string
  className?: string
  children: React.ReactNode
  htmlFor?: string
}

export function FormField({ label, error, required, hint, className, children, htmlFor }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

// ─── Controlled Form Field ────────────────────────────────────────────────────

interface ControlledInputProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label?: string
  required?: boolean
  placeholder?: string
  type?: React.HTMLInputTypeAttribute
  hint?: string
  disabled?: boolean
  className?: string
}

export function ControlledInput<T extends FieldValues>({
  name,
  control,
  label,
  required,
  placeholder,
  type = 'text',
  hint,
  disabled,
  className,
}: ControlledInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField label={label} error={fieldState.error?.message} required={required} hint={hint} htmlFor={name} className={className}>
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            error={fieldState.error?.message}
            {...field}
          />
        </FormField>
      )}
    />
  )
}

interface ControlledTextareaProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label?: string
  required?: boolean
  placeholder?: string
  rows?: number
  hint?: string
  disabled?: boolean
  className?: string
}

export function ControlledTextarea<T extends FieldValues>({
  name,
  control,
  label,
  required,
  placeholder,
  rows = 3,
  hint,
  disabled,
  className,
}: ControlledTextareaProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField label={label} error={fieldState.error?.message} required={required} hint={hint} htmlFor={name} className={className}>
          <Textarea
            id={name}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            error={fieldState.error?.message}
            {...field}
          />
        </FormField>
      )}
    />
  )
}

interface ControlledSelectProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label?: string
  required?: boolean
  placeholder?: string
  options: Array<{ value: string; label: string }>
  hint?: string
  disabled?: boolean
  className?: string
}

export function ControlledSelect<T extends FieldValues>({
  name,
  control,
  label,
  required,
  placeholder = 'Select…',
  options,
  hint,
  disabled,
  className,
}: ControlledSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField label={label} error={fieldState.error?.message} required={required} hint={hint} htmlFor={name} className={className}>
          <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
            <SelectTrigger id={name} error={!!fieldState.error}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      )}
    />
  )
}

interface ControlledCheckboxProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label: string
  hint?: string
  disabled?: boolean
  className?: string
}

export function ControlledCheckbox<T extends FieldValues>({
  name,
  control,
  label,
  hint,
  disabled,
  className,
}: ControlledCheckboxProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField error={fieldState.error?.message} hint={hint} className={className}>
          <div className="flex items-center gap-2">
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
            <Label htmlFor={name} className="cursor-pointer font-normal">
              {label}
            </Label>
          </div>
        </FormField>
      )}
    />
  )
}

// ─── useZodForm ───────────────────────────────────────────────────────────────

export function useZodForm<T extends FieldValues>(schema: ZodSchema<T>, defaultValues?: Partial<T>) {
  return useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as T,
  })
}
