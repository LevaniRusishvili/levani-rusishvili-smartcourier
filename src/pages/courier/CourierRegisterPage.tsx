import { BaseForm } from "../../shared/ui/BaseForm/BaseForm";
import type { Field } from "../../shared/ui/BaseForm/types";

const courierFields: Field[] = [
  { name: "firstName", label: "First Name", type: "text", required: true },
  { name: "lastName", label: "Last Name", type: "text", required: false },
  { name: "pid", label: "PID", type: "text", required: true },
  { name: "phoneNumber", label: "Phone Number", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password", label: "Password", type: "password", required: true },
  { name: "vehicle", label: "Vehicle", type: "text", required: true },
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
    options: [{ label: "Courier", value: "courier" }],
  },
];

export default function CourierRegisterPage() {
  const handleSubmit = (data: any) => {
    console.log("COURIER REGISTER DATA:", data);

    // აქ მომავალში გააკეთებ:
    // await api.post("/couriers", data)
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Courier Register</h1>

      <BaseForm fields={courierFields} onSubmit={handleSubmit} />
    </div>
  );
}
