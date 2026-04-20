// src/components/forms/UserForm.tsx
import React, { useState } from "react";
import type { Address } from "../../types";

export const UserForm: React.FC = () => {
  const [address, setAddress] = useState<Address>({ lng: 0, lat: 0 });
  const [showLocationPicker, setShowLocationPicker] = useState(false);
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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setAddress({
          lng: position.coords.longitude,
          lat: position.coords.latitude,
        });
        setShowLocationPicker(false);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Use the SAME email for both auth and resource
    const userEmail = formData.email;

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: userEmail,
      phoneNumber: formData.phoneNumber,
      pid: formData.pid,
      password: formData.password,
      role: "user",
      address: address,
      source: "smartcourier",
    };

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

      // Save to resource with SAME email
      if (authResult.credentials?.accessToken) {
        await fetch("http://localhost:5000/api/v1/resource/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authResult.credentials.accessToken}`,
            "x-api-key": "YXBpS2V5U2VjcmV0",
          },
          body: JSON.stringify({ data: [userData] }),
        });
      }

      alert("User registered successfully! You can now login.");
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
          Address *
        </label>
        <button
          type="button"
          onClick={() => setShowLocationPicker(true)}
          className="w-full mt-1.5 px-5 py-3 rounded-xl bg-[#f8f6f2] border-0 text-left text-[#2c3e2f] hover:bg-[#efede8] transition"
        >
          {address.lng && address.lat
            ? `📍 ${address.lat}, ${address.lng}`
            : "📍 Set your location"}
        </button>

        {showLocationPicker && (
          <div className="mt-3 p-4 rounded-xl bg-[#f8f6f2]">
            <button
              type="button"
              onClick={getCurrentLocation}
              className="w-full bg-white border border-[#e8e0d5] text-[#2c3e2f] py-3 rounded-xl hover:bg-[#f8f6f2] transition"
            >
              Use my current location
            </button>
          </div>
        )}
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
