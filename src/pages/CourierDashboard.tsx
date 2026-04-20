// src/pages/CourierDashboard.tsx
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { useCallStore } from "../stores/callStore";
import api from "../services/api";

export const CourierDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { getCallsByCourier, loadCalls, updateCallStatus } = useCallStore();
  const [myCalls, setMyCalls] = useState<any[]>([]);
  const [callCount, setCallCount] = useState(0);
  const [otherCouriers, setOtherCouriers] = useState<any[]>([]);
  const [courierData, setCourierData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    vehicle: "",
    courierId: "",
  });
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    vehicle: "",
  });

  const loadData = async () => {
    const res = await api.get("/resource/users");
    if (Array.isArray(res.data)) {
      const current = res.data.find((i: any) => i.data?.email === user?.email);
      if (current) {
        setCourierData({
          courierId: current.id,
          firstName: current.data?.firstName || user?.firstName || "",
          lastName: current.data?.lastName || user?.lastName || "",
          phoneNumber: current.data?.phoneNumber || "",
          vehicle: current.data?.vehicle || "",
        });
        loadCalls();
        const calls = getCallsByCourier(current.id);
        setMyCalls(calls);
        setCallCount(calls.length);
      }
      const others = res.data
        .filter(
          (i: any) =>
            i.data?.role === "courier" && i.data?.email !== user?.email,
        )
        .map((i: any) => ({
          firstName: i.data?.firstName,
          lastName: i.data?.lastName,
          vehicle: i.data?.vehicle,
        }));
      setOtherCouriers(others);
    }
  };

  const handleEdit = async () => {
    const authData = localStorage.getItem("auth-storage");
    const token = JSON.parse(authData || "{}")?.state?.accessToken;
    if (!courierData.courierId || !token) return alert("Unable to update");
    try {
      await fetch(
        `http://localhost:5000/api/v1/resource/users/${courierData.courierId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-api-key": "YXBpS2V5U2VjcmV0",
          },
          body: JSON.stringify({
            data: {
              firstName: editForm.firstName,
              lastName: editForm.lastName,
              phoneNumber: editForm.phoneNumber,
              vehicle: editForm.vehicle,
            },
          }),
        },
      );
      alert("Profile updated");
      setEditing(false);
      window.location.reload();
    } catch (err) {
      alert("Failed to update");
    }
  };

  useEffect(() => {
    loadData();
    if (user)
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: "",
        vehicle: "",
      });
  }, [user]);

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Header */}
      <div className="border-b border-[#e8e0d5] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif text-[#3a2c24] tracking-wide">
              SmartCourier
            </h1>
            <p className="text-[#b8a99a] text-sm mt-0.5">Courier Dashboard</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-base font-medium text-[#3a2c24]">
                {courierData.firstName} {courierData.lastName}
              </div>
              <div className="text-sm text-[#b8a99a]">{user?.email}</div>
            </div>
            <button
              onClick={logout}
              className="text-[#b8a99a] hover:text-[#3a2c24] transition text-sm cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-[#e8e0d5] p-6 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-serif text-[#3a2c24]">Profile</h2>
                <button
                  onClick={() => setEditing(!editing)}
                  className="text-[#8b7a6b] hover:text-[#3a2c24] text-sm cursor-pointer transition"
                >
                  Edit
                </button>
              </div>
              {editing ? (
                <div className="space-y-4">
                  <input
                    className="w-full px-4 py-3 rounded-lg bg-[#faf7f2] border border-[#e8e0d5] text-[#3a2c24] text-base focus:outline-none focus:ring-2 focus:ring-[#3a2c24]/20 placeholder:text-[#c4b8aa]"
                    value={editForm.firstName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, firstName: e.target.value })
                    }
                    placeholder="First name"
                  />
                  <input
                    className="w-full px-4 py-3 rounded-lg bg-[#faf7f2] border border-[#e8e0d5] text-[#3a2c24] text-base focus:outline-none focus:ring-2 focus:ring-[#3a2c24]/20 placeholder:text-[#c4b8aa]"
                    value={editForm.lastName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, lastName: e.target.value })
                    }
                    placeholder="Last name"
                  />
                  <input
                    className="w-full px-4 py-3 rounded-lg bg-[#faf7f2] border border-[#e8e0d5] text-[#3a2c24] text-base focus:outline-none focus:ring-2 focus:ring-[#3a2c24]/20 placeholder:text-[#c4b8aa]"
                    value={editForm.phoneNumber}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phoneNumber: e.target.value })
                    }
                    placeholder="Phone number"
                  />
                  <input
                    className="w-full px-4 py-3 rounded-lg bg-[#faf7f2] border border-[#e8e0d5] text-[#3a2c24] text-base focus:outline-none focus:ring-2 focus:ring-[#3a2c24]/20 placeholder:text-[#c4b8aa]"
                    value={editForm.vehicle}
                    onChange={(e) =>
                      setEditForm({ ...editForm, vehicle: e.target.value })
                    }
                    placeholder="Vehicle"
                  />
                  <button
                    onClick={handleEdit}
                    className="w-full bg-[#3a2c24] hover:bg-[#5a4438] text-white py-3 rounded-lg font-medium transition cursor-pointer"
                  >
                    Save changes
                  </button>
                </div>
              ) : (
                <div className="space-y-3 text-base">
                  <div>
                    <span className="text-[#b8a99a]">Name</span>
                    <div className="text-[#3a2c24] font-medium mt-1">
                      {courierData.firstName} {courierData.lastName}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#b8a99a]">Email</span>
                    <div className="text-[#3a2c24] mt-1">{user?.email}</div>
                  </div>
                  <div>
                    <span className="text-[#b8a99a]">Phone</span>
                    <div className="text-[#3a2c24] mt-1">
                      {courierData.phoneNumber || "Not provided"}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#b8a99a]">Vehicle</span>
                    <div className="text-[#3a2c24] mt-1">
                      {courierData.vehicle || "Not specified"}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white rounded-2xl border border-[#e8e0d5] p-6 text-center shadow-sm">
              <div className="text-4xl font-serif text-[#3a2c24]">
                {callCount}
              </div>
              <div className="text-[#b8a99a] text-base mt-1">
                Total calls received
              </div>
            </div>
          </div>

          {/* Calls and Other Couriers */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-[#e8e0d5] p-6 shadow-sm">
              <h2 className="text-xl font-serif text-[#3a2c24] mb-4">
                Requests Received
              </h2>
              {myCalls.length === 0 ? (
                <p className="text-[#b8a99a] text-center py-8">
                  No requests yet
                </p>
              ) : (
                <div className="space-y-3">
                  {myCalls.map((call) => (
                    <div
                      key={call.id}
                      className="flex justify-between items-center p-4 rounded-xl bg-[#faf7f2] border border-[#e8e0d5] hover:bg-white transition cursor-pointer"
                    >
                      <div>
                        <span className="font-medium text-[#3a2c24]">
                          {call.userName}
                        </span>
                        <span className="text-[#b8a99a] text-sm ml-3">
                          {call.date} at {call.time}
                        </span>
                      </div>
                      <select
                        value={call.status}
                        onChange={(e) => {
                          updateCallStatus(call.id, e.target.value as any);
                          loadData();
                        }}
                        className="bg-[#faf7f2] border border-[#e8e0d5] rounded-lg px-3 py-2 text-sm text-[#3a2c24] focus:outline-none focus:ring-2 focus:ring-[#3a2c24]/20 cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirm</option>
                        <option value="completed">Complete</option>
                        <option value="cancelled">Cancel</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-[#e8e0d5] p-6 shadow-sm">
              <h2 className="text-xl font-serif text-[#3a2c24] mb-4">
                Other Couriers
              </h2>
              {otherCouriers.length === 0 ? (
                <p className="text-[#b8a99a] text-center py-8">
                  No other couriers found
                </p>
              ) : (
                <div className="space-y-3">
                  {otherCouriers.map((c, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-4 rounded-xl bg-[#faf7f2] border border-[#e8e0d5] hover:bg-white transition cursor-pointer"
                    >
                      <span className="font-medium text-[#3a2c24]">
                        {c.firstName} {c.lastName}
                      </span>
                      <span className="text-[#b8a99a] text-sm">
                        {c.vehicle}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
