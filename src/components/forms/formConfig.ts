import type { FormField } from "../../types";

// Base fields that all forms share
export const baseFields: FormField[] = [
  { name: "firstName", label: "First Name", type: "text", required: true },
  { name: "lastName", label: "Last Name", type: "text", required: false },
  { name: "pid", label: "Personal ID", type: "text", required: true },
  { name: "phoneNumber", label: "Phone Number", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password", label: "Password", type: "password", required: true },
  {
    name: "profileImage",
    label: "Profile Image",
    type: "file",
    required: false,
  },
];

export const adminFields: FormField[] = [
  ...baseFields,
  {
    name: "role",
    label: "Role",
    type: "select",
    required: true,
    options: ["admin"],
  },
];

export const userFields: FormField[] = [
  ...baseFields,
  {
    name: "role",
    label: "Role",
    type: "select",
    required: true,
    options: ["user"],
  },
];

export const courierFields: FormField[] = [
  ...baseFields,
  {
    name: "role",
    label: "Role",
    type: "select",
    required: true,
    options: ["courier"],
  },
  { name: "vehicle", label: "Vehicle", type: "text", required: true },
];
