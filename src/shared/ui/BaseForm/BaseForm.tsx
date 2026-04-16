import { useState } from "react";
import { FieldRenderer } from "./FieldRenderer";
import { uploadImage } from "../../../services/cloudinary";
import type { Field } from "./types";
import { validate } from "./validation";
export const BaseForm = ({
  fields,
  onSubmit,
}: {
  fields: Field[];
  onSubmit: (data: any) => void;
}) => {
  const [values, setValues] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: any) => {
    setValues((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const errs = validate(fields, values);
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    let finalData = { ...values };

    // handle image upload
    if (values.profileImage instanceof File) {
      setLoading(true);
      const res = await uploadImage(values.profileImage);
      finalData.profileImage = res.secure_url;
      setLoading(false);
    }

    onSubmit(finalData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {fields.map((f) => (
        <div key={f.name}>
          <label>{f.label}</label>
          <FieldRenderer
            field={f}
            value={values[f.name]}
            onChange={(v) => handleChange(f.name, v)}
          />
          {errors[f.name] && (
            <div style={{ color: "red" }}>{errors[f.name]}</div>
          )}
        </div>
      ))}

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Uploading..." : "Submit"}
      </button>
    </div>
  );
};
