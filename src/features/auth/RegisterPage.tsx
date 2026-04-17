import { useState } from "react";
import { BaseForm } from "../../shared/ui/BaseForm/BaseForm";
import {
  adminFields,
  userFields,
  courierFields,
} from "../../features/auth/register/roleTemplates";

import { api } from "../../services/api";

export default function RegisterPage() {
  const [role, setRole] = useState("user");

  const getFields = () => {
    if (role === "admin") return adminFields;
    if (role === "courier") return courierFields;
    return userFields;
  };

  const handleSubmit = async (data: any) => {
    await api.post("/auth/register", {
      ...data,
      role,
    });

    alert("Registered successfully");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Register</h1>

      <select
        className="border p-2 mb-4 w-full"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="admin">Admin</option>
        <option value="user">User</option>
        <option value="courier">Courier</option>
      </select>

      <BaseForm fields={getFields()} onSubmit={handleSubmit} />
    </div>
  );
}
