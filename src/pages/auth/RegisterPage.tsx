import { BaseForm } from "../../shared/ui/BaseForm/BaseForm";
import type { Field } from "../../shared/ui/BaseForm/types";

const adminFields: Field[] = [
  { name: "firstName", label: "First Name", type: "text", required: true },
  { name: "lastName", label: "Last Name", type: "text", required: false },
  { name: "pid", label: "PID", type: "text", required: true },
  { name: "phoneNumber", label: "Phone Number", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password", label: "Password", type: "password", required: true },
  {
    name: "profileImage",
    label: "Profile Image",
    type: "file",
    required: false,
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    required: true,
    options: [
      { label: "Admin", value: "admin" },
      { label: "User", value: "user" },
      { label: "Courier", value: "courier" },
    ],
  },
];

export default function RegisterPage() {
  const handleSubmit = (data: any) => {
    console.log("REGISTER DATA:", data);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Register</h1>

      <BaseForm fields={adminFields} onSubmit={handleSubmit} />
    </div>
  );
}
