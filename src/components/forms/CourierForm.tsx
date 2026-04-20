// src/components/forms/CourierForm.tsx
import React, { useState } from "react";
import { WorkingDaysInput } from "../courier/WorkingDaysInput";
import type { WorkingDays } from "../../types";

export const CourierForm: React.FC = () => {
  const [workingDays, setWorkingDays] = useState<WorkingDays>({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    pid: "",
    phoneNumber: "",
    email: "",
    password: "",
    vehicle: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const workingDaysCount = Object.keys(workingDays).length;
    if (workingDaysCount < 5) {
      alert(
        `Please add at least 5 working days. Currently: ${workingDaysCount}/5`,
      );
      setLoading(false);
      return;
    }

    // Use the SAME email for both auth and resource
    const userEmail = formData.email;

    try {
      // Register via auth with ORIGINAL email
      const authResponse = await fetch(
        "http://localhost:5000/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "YXBpS2V5U2VjcmV0",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: userEmail,
            password: formData.password,
          }),
        },
      );

      if (!authResponse.ok) {
        const error = await authResponse.json();
        throw new Error(error.message || "Auth registration failed");
      }

      const authResult = await authResponse.json();

      const courierData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: userEmail,
        phoneNumber: formData.phoneNumber,
        pid: formData.pid,
        role: "courier",
        vehicle: formData.vehicle,
        workingDays: workingDays,
        source: "smartcourier",
      };

      // Save to resource with SAME email
      if (authResult.credentials?.accessToken) {
        await fetch("http://localhost:5000/api/v1/resource/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authResult.credentials.accessToken}`,
            "x-api-key": "YXBpS2V5U2VjcmV0",
          },
          body: JSON.stringify({ data: [courierData] }),
        });
      }

      alert("Courier registered successfully! You can now login.");
      window.location.href = "/login";
    } catch (error: any) {
      console.error("Registration error:", error);
      alert(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-[#6b7c6b]">
          First Name *
        </label>
        <input
          type="text"
          name="firstName"
          required
          value={formData.firstName}
          onChange={handleChange}
          className="w-full px-5 py-3 rounded-xl bg-[#f8f6f2] border-0 text-[#2c3e2f] placeholder:text-[#c4cdc4] focus:outline-none focus:ring-2 focus:ring-[#2c3e2f]/20 mt-1.5"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#6b7c6b]">
          Last Name
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full px-5 py-3 rounded-xl bg-[#f8f6f2] border-0 text-[#2c3e2f] placeholder:text-[#c4cdc4] focus:outline-none focus:ring-2 focus:ring-[#2c3e2f]/20 mt-1.5"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#6b7c6b]">
          Personal ID *
        </label>
        <input
          type="text"
          name="pid"
          required
          value={formData.pid}
          onChange={handleChange}
          className="w-full px-5 py-3 rounded-xl bg-[#f8f6f2] border-0 text-[#2c3e2f] placeholder:text-[#c4cdc4] focus:outline-none focus:ring-2 focus:ring-[#2c3e2f]/20 mt-1.5"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#6b7c6b]">
          Phone Number *
        </label>
        <input
          type="tel"
          name="phoneNumber"
          required
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full px-5 py-3 rounded-xl bg-[#f8f6f2] border-0 text-[#2c3e2f] placeholder:text-[#c4cdc4] focus:outline-none focus:ring-2 focus:ring-[#2c3e2f]/20 mt-1.5"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#6b7c6b]">
          Email *
        </label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-5 py-3 rounded-xl bg-[#f8f6f2] border-0 text-[#2c3e2f] placeholder:text-[#c4cdc4] focus:outline-none focus:ring-2 focus:ring-[#2c3e2f]/20 mt-1.5"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#6b7c6b]">
          Password *
        </label>
        <input
          type="password"
          name="password"
          required
          value={formData.password}
          onChange={handleChange}
          className="w-full px-5 py-3 rounded-xl bg-[#f8f6f2] border-0 text-[#2c3e2f] placeholder:text-[#c4cdc4] focus:outline-none focus:ring-2 focus:ring-[#2c3e2f]/20 mt-1.5"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#6b7c6b]">
          Vehicle *
        </label>
        <input
          type="text"
          name="vehicle"
          required
          value={formData.vehicle}
          onChange={handleChange}
          placeholder="e.g., Car, Motorcycle, Van"
          className="w-full px-5 py-3 rounded-xl bg-[#f8f6f2] border-0 text-[#2c3e2f] placeholder:text-[#c4cdc4] focus:outline-none focus:ring-2 focus:ring-[#2c3e2f]/20 mt-1.5"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#6b7c6b] mb-2">
          Working Days * (Minimum 5)
        </label>
        <WorkingDaysInput value={workingDays} onChange={setWorkingDays} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#2c3e2f] hover:bg-[#3a4e3d] text-white py-3.5 rounded-xl font-medium transition disabled:opacity-50"
      >
        {loading ? "Registering..." : "Create account"}
      </button>
    </form>
  );
};
