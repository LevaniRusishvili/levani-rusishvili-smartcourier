// src/components/forms/AdminForm.tsx
import React, { useState } from "react";

export const AdminForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    pid: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    alert("Admin registration is disabled. Please contact system administrator.");
    setLoading(false);
  };

  return (
    <div className="text-center py-8">
      <div className="text-6xl mb-4">🛡️</div>
      <h3 className="text-xl font-serif text-[#3a2c24] mb-2">Admin Registration</h3>
      <p className="text-[#b8a99a]">Admin accounts are created by system administrators only.</p>
      <p className="text-[#b8a99a] text-sm mt-2">Please contact support for admin access.</p>
    </div>
  );
};