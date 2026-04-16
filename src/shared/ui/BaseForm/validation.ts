import type { Field } from "./types";


export const validate = (fields: Field[], values: any) => {
  const errors: Record<string, string> = {};

  fields.forEach((f) => {
    if (f.required && !values[f.name]) {
      errors[f.name] = `${f.label} is required`;
    }
  });

  return errors;
};
