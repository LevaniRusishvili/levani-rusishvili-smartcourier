import type { Field } from "../../../shared/ui/BaseForm/types";

export const adminFields: Field[] = [
  { name: "firstName", label: "First Name", type: "text", required: true },
  { name: "lastName", label: "Last Name", type: "text", required: false },
  { name: "pid", label: "PID", type: "text", required: true },
  { name: "phoneNumber", label: "Phone", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password", label: "Password", type: "password", required: true },
  {
    name: "profileImage",
    label: "Profile Image",
    type: "file",
    required: false,
  },
];

export const userFields: Field[] = [
  ...adminFields,
  { name: "addressLng", label: "Longitude", type: "text", required: true },
  { name: "addressLat", label: "Latitude", type: "text", required: true },
];

export const courierFields: Field[] = [
  { name: "firstName", label: "First Name", type: "text", required: true },
  { name: "lastName", label: "Last Name", type: "text", required: false },
  { name: "pid", label: "PID", type: "text", required: true },
  { name: "phoneNumber", label: "Phone", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password", label: "Password", type: "password", required: true },
  { name: "vehicle", label: "Vehicle", type: "text", required: true },
  {
    name: "profileImage",
    label: "Profile Image",
    type: "file",
    required: false,
  },
];
