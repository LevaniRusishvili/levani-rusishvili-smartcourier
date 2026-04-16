import type { Field } from "./types";



export const FieldRenderer = ({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: any;
  onChange: (v: any) => void;
}) => {
  switch (field.type) {
    case "select":
      return (
        <select onChange={(e) => onChange(e.target.value)}>
          <option value="">Select</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );

    case "file":
      return (
        <input type="file" onChange={(e) => onChange(e.target.files?.[0])} />
      );

    default:
      return (
        <input
          type={field.type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
};
