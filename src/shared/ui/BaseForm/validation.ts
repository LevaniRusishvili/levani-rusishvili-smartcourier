import type { Field } from "./types";

export const validate = (fields: Field[], values: any) => {
  const errors: Record<string, string> = {};

  fields.forEach((field) => {
    if (field.required && !values[field.name]) {
      errors[field.name] = `${field.label} is required`;
    }
  });

  return errors;
};
