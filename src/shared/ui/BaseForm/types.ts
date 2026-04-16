export type FieldType = "text" | "email" | "password" | "file" | "select";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { label: string; value: string }[];
};
