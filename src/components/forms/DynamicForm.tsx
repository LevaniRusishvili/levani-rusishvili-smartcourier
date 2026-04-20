// src/components/forms/DynamicForm.tsx
import React, { useState } from "react";
import type { FormField } from "../../types";

interface DynamicFormProps {
  fields: FormField[];
  initialValues: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  submitLabel: string;
  renderExtraFields?: () => React.ReactNode;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  initialValues,
  onSubmit,
  submitLabel,
  renderExtraFields,
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && !value) {
      return `${field.label} is required`;
    }
    if (field.validation) {
      return field.validation(value);
    }
    if (field.type === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
      return "Invalid email format";
    }
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach((field) => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label className="text-sm font-medium text-[#6b7c6b]">
            {field.label}
            {field.required && <span className="text-rose-400 ml-1">*</span>}
          </label>

          {field.type === "select" ? (
            <select
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-[#f8f6f2] border-0 text-[#2c3e2f] focus:outline-none focus:ring-2 focus:ring-[#2c3e2f]/20 mt-1.5"
            >
              <option value="" className="bg-[#f8f6f2]">
                Select...
              </option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt} className="bg-[#f8f6f2]">
                  {opt}
                </option>
              ))}
            </select>
          ) : field.type === "file" ? (
            <input
              type="file"
              onChange={(e) => handleChange(field.name, e.target.files?.[0])}
              className="w-full px-5 py-3 rounded-xl bg-[#f8f6f2] border-0 text-[#2c3e2f] mt-1.5 file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-[#2c3e2f] file:text-white hover:file:bg-[#3a4e3d]"
              accept="image/*"
            />
          ) : (
            <input
              type={field.type}
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-[#f8f6f2] border-0 text-[#2c3e2f] placeholder:text-[#c4cdc4] focus:outline-none focus:ring-2 focus:ring-[#2c3e2f]/20 mt-1.5"
            />
          )}

          {errors[field.name] && (
            <p className="text-rose-500 text-xs mt-1.5">{errors[field.name]}</p>
          )}
        </div>
      ))}

      {renderExtraFields && renderExtraFields()}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#2c3e2f] hover:bg-[#3a4e3d] text-white py-3.5 rounded-xl font-medium transition disabled:opacity-50"
      >
        {loading ? "Submitting..." : submitLabel}
      </button>
    </form>
  );
};
