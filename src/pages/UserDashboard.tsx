// src/pages/UserDashboard.tsx
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { useCallStore } from "../stores/callStore";
import api from "../services/api";

export const UserDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { addCall, getCallsByUser, loadCalls } = useCallStore();
  const [couriers, setCouriers] = useState<any[]>([]);
  const [myCalls, setMyCalls] = useState<any[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<any>(null);
  const [callDate, setCallDate] = useState("");
  const [callTime, setCallTime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const fetchCouriers = async () => {
    const res = await api.get("/resource/users");
    if (Array.isArray(res.data)) {
      const list = res.data
        .filter((i: any) => i.data?.role === "courier")
        .map((i: any) => ({
          id: i.id,
          firstName: i.data?.firstName,
          lastName: i.data?.lastName,
          email: i.data?.email,
          phoneNumber: i.data?.phoneNumber,
          vehicle: i.data?.vehicle,
          workingDays: i.data?.workingDays,
        }));
      setCouriers(list);
    }
  };

  const loadMyCalls = () => {
    loadCalls();
    const calls = getCallsByUser(user?.id?.toString() || "");
    setMyCalls(calls);
  };

  const handleCall = () => {
    if (!selectedCourier || !callDate || !callTime)
      return alert("Please fill all fields");
    const success = addCall({
      userId: user?.id?.toString() || "",
      userName: `${user?.firstName} ${user?.lastName}`,
      courierId: selectedCourier.id,
      courierName: `${selectedCourier.firstName} ${selectedCourier.lastName}`,
      date: callDate,
      time: callTime,
      status: "pending",
    });
    if (success) {
      alert("Call scheduled successfully");
      setShowModal(false);
      loadMyCalls();
    } else alert("This time slot is already booked");
  };

  const handleEdit = async () => {
    const authData = localStorage.getItem("auth-storage");
    const token = JSON.parse(authData || "{}")?.state?.accessToken;
    const res = await api.get("/resource/users");
    const found = res.data.find((i: any) => i.data?.email === user?.email);
    if (found && token) {
      await fetch(`http://localhost:5000/api/v1/resource/users/${found.id}`, {
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
          },
        }),
      });
      alert("Profile updated");
      setEditing(false);
      window.location.reload();
    }
  };

  useEffect(() => {
    fetchCouriers();
    loadMyCalls();
    if (user)
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: (user as any).phoneNumber || "",
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
            <p className="text-[#b8a99a] text-sm mt-0.5">User Dashboard</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-base font-medium text-[#3a2c24]">
                {user?.firstName} {user?.lastName}
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
          {/* Profile Card */}
          <div className="lg:col-span-1">
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
                      {user?.firstName} {user?.lastName}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#b8a99a]">Email</span>
                    <div className="text-[#3a2c24] mt-1">{user?.email}</div>
                  </div>
                  <div>
                    <span className="text-[#b8a99a]">Phone</span>
                    <div className="text-[#3a2c24] mt-1">
                      {user?.phoneNumber || "Not provided"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Calls and Couriers */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Calls */}
            <div className="bg-white rounded-2xl border border-[#e8e0d5] p-6 shadow-sm">
              <h2 className="text-xl font-serif text-[#3a2c24] mb-4">
                My Requests
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
                          {call.courierName}
                        </span>
                        <span className="text-[#b8a99a] text-sm ml-3">
                          {call.date} at {call.time}
                        </span>
                      </div>
                      <span
                        className={`text-sm px-3 py-1 rounded-full ${call.status === "confirmed" ? "bg-[#c5d4c5] text-[#2c4a2c]" : call.status === "completed" ? "bg-[#c5c5d4] text-[#2c2c4a]" : call.status === "cancelled" ? "bg-[#d4c5c5] text-[#4a2c2c]" : "bg-[#d4d0c5] text-[#4a462c]"}`}
                      >
                        {call.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Couriers */}
            <div className="bg-white rounded-2xl border border-[#e8e0d5] p-6 shadow-sm">
              <h2 className="text-xl font-serif text-[#3a2c24] mb-4">
                Available Couriers
              </h2>
              {couriers.length === 0 ? (
                <p className="text-[#b8a99a] text-center py-8">
                  No couriers available
                </p>
              ) : (
                <div className="space-y-3">
                  {couriers.map((c) => (
                    <div
                      key={c.id}
                      className="flex justify-between items-center p-4 rounded-xl bg-[#faf7f2] border border-[#e8e0d5] hover:bg-white transition cursor-pointer"
                    >
                      <div>
                        <span className="font-medium text-[#3a2c24]">
                          {c.firstName} {c.lastName}
                        </span>
                        <span className="text-[#b8a99a] text-sm ml-3">
                          {c.vehicle}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCourier(c);
                          setShowModal(true);
                        }}
                        className="bg-[#3a2c24] hover:bg-[#5a4438] text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
                      >
                        Request
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Call Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-serif text-[#3a2c24] mb-4">
              Request Courier
            </h3>
            <div className="space-y-4">
              <input
                type="date"
                className="w-full px-4 py-3 rounded-lg bg-[#faf7f2] border border-[#e8e0d5] text-[#3a2c24] text-base focus:outline-none focus:ring-2 focus:ring-[#3a2c24]/20"
                value={callDate}
                onChange={(e) => setCallDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
              <select
                className="w-full px-4 py-3 rounded-lg bg-[#faf7f2] border border-[#e8e0d5] text-[#3a2c24] text-base focus:outline-none focus:ring-2 focus:ring-[#3a2c24]/20"
                value={callTime}
                onChange={(e) => setCallTime(e.target.value)}
              >
                <option value="">Select time</option>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={`${i}:00`}>
                    {i}:00
                  </option>
                ))}
              </select>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCall}
                  className="flex-1 bg-[#3a2c24] hover:bg-[#5a4438] text-white py-3 rounded-lg font-medium transition cursor-pointer"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-[#e8e0d5] text-[#b8a99a] hover:text-[#3a2c24] py-3 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
