/**
 * Simple controlled field for auth forms.
 */
export function AuthFormField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  className = "",
  disabled = false,
  autoComplete,
}) {
  return (
    <div className={className}>
      {label ? (
        <label htmlFor={id} className="mb-1 block text-left text-xs font-medium text-slate-600">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-transparent bg-white px-5 py-3 text-center text-sm text-slate-800 placeholder:text-slate-400 shadow-sm outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
      />
      {error ? (
        <p id={`${id}-err`} className="mt-1 text-left text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
