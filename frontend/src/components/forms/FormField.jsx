// frontend/src/components/FormField.jsx - Form field component

const FormField = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  options = [],
  disabled = false,
}) => {
  const baseClasses =
    "w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100";
  const errorClasses = error ? "border-red-500" : "border-gray-300";

  const renderField = () => {
    switch (type) {
      case "select":
        return (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={`${baseClasses} ${errorClasses}`}
            required={required}
            disabled={disabled}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "textarea":
        return (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${baseClasses} ${errorClasses} min-h-[100px]`}
            required={required}
            disabled={disabled}
          />
        );
      default:
        return (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${baseClasses} ${errorClasses}`}
            required={required}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {renderField()}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FormField;
