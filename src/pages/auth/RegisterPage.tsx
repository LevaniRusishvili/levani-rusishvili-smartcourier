import { useState } from "react";
import { BaseForm } from "../../shared/ui/BaseForm/BaseForm";
import {
  adminFields,
  userFields,
  courierFields,
} from "../../features/auth/register/roleTemplates";
import { registerApi } from "../../features/auth/api";
import type { Field } from "../../shared/ui/BaseForm/types";

export default function RegisterPage() {
  const [role, setRole] = useState<"admin" | "user" | "courier">("user");

  const getFields = (): Field[] => {
    switch (role) {
      case "admin":
        return adminFields ?? [];
      case "user":
        return userFields ?? [];
      case "courier":
        return courierFields ?? [];
      default:
        return [];
    }
  };

  const handleSubmit = async (data: any) => {
    await registerApi({ ...data, role });
    alert("Registered!");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Register</h1>

      <select
        className="border p-2 mb-4"
        value={role}
        onChange={(e) => setRole(e.target.value as any)}
      >
        <option value="admin">Admin</option>
        <option value="user">User</option>
        <option value="courier">Courier</option>
      </select>

      <BaseForm fields={getFields()} onSubmit={handleSubmit} />
    </div>
  );
}
