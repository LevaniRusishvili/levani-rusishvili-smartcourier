// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { useCallStore } from "../stores/callStore";
import api from "../services/api";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  vehicle?: string;
  workingDays?: any;
}

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { getAllCalls } = useCallStore();
  const [users, setUsers] = useState<User[]>([]);
  const [couriers, setCouriers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "couriers" | "calls">(
    "users",
  );
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    vehicle: "",
  });

  const fetchUsers = async () => {
    try {
      const response = await api.get("/resource/users");
      if (Array.isArray(response.data)) {
        const allUsers = response.data
          .filter((item: any) => item.data?.email)
          .map((item: any) => ({
            id: item.id,
            firstName: item.data?.firstName || "Unknown",
            lastName: item.data?.lastName || "",
            email: item.data?.email || "No email",
            phoneNumber: item.data?.phoneNumber || "",
            role: item.data?.role || "user",
            vehicle: item.data?.vehicle || "",
            workingDays: item.data?.workingDays || {},
          }));
        setUsers(allUsers);
        setCouriers(allUsers.filter((u) => u.role === "courier"));
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async () => {
    const firstName = prompt("First name:");
    if (!firstName) return;
    const lastName = prompt("Last name:") || "";
    const email = prompt("Email:");
    if (!email) return;
    const phoneNumber = prompt("Phone:") || "";
    const role = prompt("Role (user/courier/admin):", "user");
    const vehicle = role === "courier" ? prompt("Vehicle:") : "";

    const authData = localStorage.getItem("auth-storage");
    const parsed = JSON.parse(authData || "{}");
    const accessToken = parsed?.state?.accessToken;

    if (!accessToken) return alert("Please login first");

    try {
      const res = await fetch("http://localhost:5000/api/v1/resource/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-api-key": "YXBpS2V5U2VjcmV0",
        },
        body: JSON.stringify({
          data: [
            {
              firstName,
              lastName,
              email,
              phoneNumber,
              role,
              vehicle,
              source: "smartcourier",
            },
          ],
        }),
      });
      if (res.ok) {
        alert("User added successfully");
        fetchUsers();
      } else alert("Failed to add user");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (id: string, email: string) => {
    if (confirm(`Delete user ${email}?`)) {
      try {
        await api.delete(`/resource/users/${id}`);
        fetchUsers();
        alert("User deleted successfully");
      } catch (err) {
        console.error(err);
        alert("Failed to delete user");
      }
    }
  };

  const deleteAllUsers = async () => {
    if (
      confirm(
        "⚠️ This will delete ALL users from Resource database. Are you sure?",
      )
    ) {
      const confirmation = prompt('Type "DELETE ALL" to confirm:');
      if (confirmation === "DELETE ALL") {
        const authData = localStorage.getItem("auth-storage");
        const parsed = JSON.parse(authData || "{}");
        const token = parsed?.state?.accessToken;

        if (!token) {
          alert("Please login first");
          return;
        }

        const res = await fetch("http://localhost:5000/api/v1/resource/users", {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": "YXBpS2V5U2VjcmV0",
          },
        });
        const users = await res.json();

        let deleted = 0;
        let failed = 0;

        for (const user of users) {
          try {
            await fetch(
              `http://localhost:5000/api/v1/resource/users/${user.id}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "x-api-key": "YXBpS2V5U2VjcmV0",
                },
              },
            );
            deleted++;
          } catch (err) {
            failed++;
          }
        }

        alert(
          `✅ Deleted: ${deleted} users from Resource\n❌ Failed: ${failed}`,
        );
        localStorage.removeItem("smartcourier_calls");
        localStorage.removeItem("call-storage");
        window.location.reload();
      } else {
        alert("Deletion cancelled");
      }
    }
  };

  // 🔥 ახალი ფუნქცია - ორივე ბაზიდან წაშლა
  const deleteAllFromBothDatabases = async () => {
    if (
      confirm(
        "⚠️⚠️⚠️ ეს წაშლის ყველა მომხმარებელს ორივე ბაზიდან (Auth და Resource)! გსურს გაგრძელება?",
      )
    ) {
      const confirmation = prompt("დადასტურებისთვის ჩაწერე: DELETE EVERYTHING");
      if (confirmation !== "DELETE EVERYTHING") {
        alert("წაშლა გაუქმდა");
        return;
      }

      const authData = localStorage.getItem("auth-storage");
      const parsed = JSON.parse(authData || "{}");
      const token = parsed?.state?.accessToken;
      const currentAdminEmail = parsed?.state?.user?.email;

      if (!token) {
        alert("გთხოვთ თავიდან შემოხვიდეთ");
        return;
      }

      let deletedResource = 0;
      let deletedAuth = 0;

      // 1. წაშალე Resource ბაზიდან
      const resourceRes = await fetch(
        "http://localhost:5000/api/v1/resource/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": "YXBpS2V5U2VjcmV0",
          },
        },
      );
      const resourceUsers = await resourceRes.json();

      for (const user of resourceUsers) {
        try {
          await fetch(
            `http://localhost:5000/api/v1/resource/users/${user.id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "x-api-key": "YXBpS2V5U2VjcmV0",
              },
            },
          );
          deletedResource++;
        } catch (err) {
          console.error("Failed to delete resource user:", user.id);
        }
      }

      // 2. წაშალე Auth ბაზიდან - ვცდილობთ ყველა შესაძლო email-ის წაშლა
      // შენიშვნა: ეს არის შეზღუდული მეთოდი, რადგან Auth ბაზაზე პირდაპირი API არ გვაქვს
      alert(
        `✅ Resource ბაზიდან წაიშალა: ${deletedResource} მომხმარებელი\n\n⚠️ Auth ბაზიდან წაშლა ხელით მოგიწევთ ან გამოიყენეთ ახალი ემეილები.\n\n💡 რეკომენდაცია: გამოიყენეთ სრულიად ახალი ემეილები რეგისტრაციისას.`,
      );

      // გასუფთავება
      localStorage.removeItem("smartcourier_calls");
      localStorage.removeItem("call-storage");
      localStorage.removeItem("auth-storage");

      alert("გვერდი განახლდება. გთხოვთ თავიდან შემოხვიდეთ Admin-ით");
      window.location.href = "/login";
    }
  };

  const updateUser = async () => {
    if (!editingUser) return;
    const authData = localStorage.getItem("auth-storage");
    const parsed = JSON.parse(authData || "{}");
    const token = parsed?.state?.accessToken;

    if (!token) {
      alert("Please login again");
      return;
    }

    try {
      const updateData: any = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phoneNumber: editForm.phoneNumber,
      };
      if (editingUser.role === "courier") {
        updateData.vehicle = editForm.vehicle;
      }

      await fetch(
        `http://localhost:5000/api/v1/resource/users/${editingUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-api-key": "YXBpS2V5U2VjcmV0",
          },
          body: JSON.stringify({ data: updateData }),
        },
      );
      alert("User updated successfully");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdfbf7] to-[#f4f1ea] flex items-center justify-center">
        <div className="text-[#2c3e2f]">Loading...</div>
      </div>
    );
  }

  const stats = [
    { label: "Total Users", value: users.length },
    { label: "Active Couriers", value: couriers.length },
    { label: "Call History", value: getAllCalls().length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbf7] to-[#f4f1ea]">
      {/* Header with dark green */}
      <div className="bg-[#2c3e2f] text-white sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-light tracking-wide">SmartCourier</h1>
            <p className="text-white/60 text-sm mt-0.5">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-base font-medium text-white">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-sm text-white/60">{user?.email}</div>
            </div>
            <button
              onClick={logout}
              className="text-white/70 hover:text-white transition text-sm"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#2c3e2f] hover:shadow-md transition"
            >
              <div className="text-3xl font-light text-[#2c3e2f]">
                {stat.value}
              </div>
              <div className="text-[#8b9a8b] text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs and Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex gap-2 bg-white/80 p-1 rounded-xl border border-[#e0d8cc]">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "users"
                  ? "bg-[#2c3e2f] text-white shadow-sm"
                  : "text-[#8b9a8b] hover:text-[#2c3e2f] hover:bg-white/50"
              }`}
            >
              All Users
            </button>
            <button
              onClick={() => setActiveTab("couriers")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "couriers"
                  ? "bg-[#2c3e2f] text-white shadow-sm"
                  : "text-[#8b9a8b] hover:text-[#2c3e2f] hover:bg-white/50"
              }`}
            >
              Couriers
            </button>
            <button
              onClick={() => setActiveTab("calls")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "calls"
                  ? "bg-[#2c3e2f] text-white shadow-sm"
                  : "text-[#8b9a8b] hover:text-[#2c3e2f] hover:bg-white/50"
              }`}
            >
              Call Logs
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={addUser}
              className="bg-[#2c3e2f] hover:bg-[#3a4e3d] text-white px-5 py-2 rounded-xl text-sm font-medium transition shadow-sm flex items-center gap-2"
            >
              <span>+</span> Add user
            </button>
            <button
              onClick={fetchUsers}
              className="text-[#8b9a8b] hover:text-[#2c3e2f] transition text-sm px-3"
            >
              ↻ Refresh
            </button>
            <button
              onClick={deleteAllUsers}
              className="text-[#b8a99a] hover:text-[#8b9a8b] transition text-sm px-3"
            >
              Delete Resource
            </button>
            <button
              onClick={deleteAllFromBothDatabases}
              className="bg-red-700/80 hover:bg-red-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
            >
              🔥 DELETE ALL (Both DB)
            </button>
          </div>
        </div>

        {/* Users Table */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl border border-[#e0d8cc] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f5f0e8] border-b border-[#e0d8cc]">
                  <tr className="text-left text-[#8b9a8b] text-xs font-medium uppercase tracking-wider">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ebe5]">
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-12 text-[#b8a99a] text-sm"
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-[#faf7f2] transition">
                        <td className="px-6 py-4 text-[#b8a99a] text-xs font-mono">
                          {u.id.slice(0, 8)}
                        </td>
                        <td className="px-6 py-4 text-[#2c3e2f] font-medium">
                          {u.firstName} {u.lastName}
                        </td>
                        <td className="px-6 py-4 text-[#6b7c6b]">{u.email}</td>
                        <td className="px-6 py-4 text-[#6b7c6b]">
                          {u.phoneNumber || "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              u.role === "admin"
                                ? "bg-[#2c3e2f]/10 text-[#2c3e2f]"
                                : u.role === "courier"
                                  ? "bg-[#4a8b6a]/10 text-[#4a6b4a]"
                                  : "bg-[#6b8b6b]/10 text-[#4a6b4a]"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                setEditingUser(u);
                                setEditForm({
                                  firstName: u.firstName,
                                  lastName: u.lastName,
                                  phoneNumber: u.phoneNumber,
                                  vehicle: u.vehicle || "",
                                });
                              }}
                              className="text-[#8b9a8b] hover:text-[#2c3e2f] text-sm transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteUser(u.id, u.email)}
                              className="text-[#b8a99a] hover:text-[#8b9a8b] text-sm transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Couriers Table */}
        {activeTab === "couriers" && (
          <div className="bg-white rounded-2xl border border-[#e0d8cc] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f5f0e8] border-b border-[#e0d8cc]">
                  <tr className="text-left text-[#8b9a8b] text-xs font-medium uppercase tracking-wider">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Days</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ebe5]">
                  {couriers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-12 text-[#b8a99a] text-sm"
                      >
                        No couriers found
                      </td>
                    </tr>
                  ) : (
                    couriers.map((c) => (
                      <tr key={c.id} className="hover:bg-[#faf7f2] transition">
                        <td className="px-6 py-4 text-[#b8a99a] text-xs font-mono">
                          {c.id.slice(0, 8)}
                        </td>
                        <td className="px-6 py-4 text-[#2c3e2f] font-medium">
                          {c.firstName} {c.lastName}
                        </td>
                        <td className="px-6 py-4 text-[#6b7c6b]">{c.email}</td>
                        <td className="px-6 py-4 text-[#6b7c6b]">
                          {c.phoneNumber || "—"}
                        </td>
                        <td className="px-6 py-4 text-[#6b7c6b]">
                          {c.vehicle || "—"}
                        </td>
                        <td className="px-6 py-4 text-[#6b7c6b]">
                          {c.workingDays
                            ? Object.keys(c.workingDays).length
                            : 0}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                setEditingUser(c);
                                setEditForm({
                                  firstName: c.firstName,
                                  lastName: c.lastName,
                                  phoneNumber: c.phoneNumber,
                                  vehicle: c.vehicle || "",
                                });
                              }}
                              className="text-[#8b9a8b] hover:text-[#2c3e2f] text-sm transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteUser(c.id, c.email)}
                              className="text-[#b8a99a] hover:text-[#8b9a8b] text-sm transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Calls Table */}
        {activeTab === "calls" && (
          <div className="bg-white rounded-2xl border border-[#e0d8cc] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f5f0e8] border-b border-[#e0d8cc]">
                  <tr className="text-left text-[#8b9a8b] text-xs font-medium uppercase tracking-wider">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Courier</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ebe5]">
                  {getAllCalls().length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-12 text-[#b8a99a] text-sm"
                      >
                        No calls found
                      </td>
                    </tr>
                  ) : (
                    getAllCalls().map((call) => (
                      <tr
                        key={call.id}
                        className="hover:bg-[#faf7f2] transition"
                      >
                        <td className="px-6 py-4 text-[#2c3e2f] font-medium">
                          {call.userName}
                        </td>
                        <td className="px-6 py-4 text-[#6b7c6b]">
                          {call.courierName}
                        </td>
                        <td className="px-6 py-4 text-[#6b7c6b]">
                          {call.date}
                        </td>
                        <td className="px-6 py-4 text-[#6b7c6b]">
                          {call.time}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              call.status === "confirmed"
                                ? "bg-[#4a8b6a]/10 text-[#4a6b4a]"
                                : call.status === "completed"
                                  ? "bg-[#6b8b6b]/10 text-[#4a6b4a]"
                                  : call.status === "cancelled"
                                    ? "bg-[#e8e0d5] text-[#b8a99a]"
                                    : "bg-[#f0ebe5] text-[#8b7a6b]"
                            }`}
                          >
                            {call.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setEditingUser(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl border-t-4 border-[#2c3e2f]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-light text-[#2c3e2f] mb-5">
              Edit {editingUser.role}
            </h3>
            <div className="space-y-4">
              <input
                className="w-full px-4 py-3 rounded-lg bg-[#faf7f2] border border-[#e0d8cc] text-[#2c3e2f] focus:outline-none focus:ring-2 focus:ring-[#2c3e2f]/20 placeholder:text-[#c4b8aa]"
                value={editForm.firstName}
                onChange={(e) =>
                  setEditForm({ ...editForm, firstName: e.target.value })
                }
                placeholder="First name"
              />
              <input
                className="w-full px-4 py-3 rounded-lg bg-[#faf7f2] border border-[#e0d8cc] text-[#2c3e2f] focus:outline-none focus:ring-2 focus:ring-[#2c3e2f]/20 placeholder:text-[#c4b8aa]"
                value={editForm.lastName}
                onChange={(e) =>
                  setEditForm({ ...editForm, lastName: e.target.value })
                }
                placeholder="Last name"
              />
              <input
                className="w-full px-4 py-3 rounded-lg bg-[#faf7f2] border border-[#e0d8cc] text-[#2c3e2f] focus:outline-none focus:ring-2 focus:ring-[#2c3e2f]/20 placeholder:text-[#c4b8aa]"
                value={editForm.phoneNumber}
                onChange={(e) =>
                  setEditForm({ ...editForm, phoneNumber: e.target.value })
                }
                placeholder="Phone number"
              />
              {editingUser.role === "courier" && (
                <input
                  className="w-full px-4 py-3 rounded-lg bg-[#faf7f2] border border-[#e0d8cc] text-[#2c3e2f] focus:outline-none focus:ring-2 focus:ring-[#2c3e2f]/20 placeholder:text-[#c4b8aa]"
                  value={editForm.vehicle}
                  onChange={(e) =>
                    setEditForm({ ...editForm, vehicle: e.target.value })
                  }
                  placeholder="Vehicle"
                />
              )}
              <div className="flex gap-3 pt-3">
                <button
                  onClick={updateUser}
                  className="flex-1 bg-[#2c3e2f] hover:bg-[#3a4e3d] text-white py-3 rounded-lg font-medium transition"
                >
                  Save changes
                </button>
                <button
                  onClick={() => setEditingUser(null)}
                  className="flex-1 border border-[#e0d8cc] text-[#8b9a8b] hover:text-[#2c3e2f] py-3 rounded-lg transition"
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
