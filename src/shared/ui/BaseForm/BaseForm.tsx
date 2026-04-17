import { useState } from "react";
import type { Field } from "./types";
import { FieldRenderer } from "./FieldRenderer";
import { validate } from "./validation";

type Props = {
  fields: Field[];
  onSubmit: (data: any) => void;
};

export const BaseForm = ({ fields, onSubmit }: Props) => {
  const [values, setValues] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: any) => {
    setValues((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const errs = validate(fields, values);
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    setLoading(true);

    try {
      onSubmit(values);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1">
          <label className="text-sm font-medium">{field.label}</label>

          <FieldRenderer
            field={field}
            value={values[field.name]}
            onChange={(v) => handleChange(field.name, v)}
          />

          {errors[field.name] && (
            <span className="text-red-500 text-sm">{errors[field.name]}</span>
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded mt-3"
      >
        {loading ? "Loading..." : "Submit"}
      </button>
    </div>
  );
};
