import { useState } from "react";
import { useAuthStore } from "../../app/stores/auth.store";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState(user?.email || "");

  const handleUpdate = () => {
    // აქ რეალურად backend-ში გააგზავნი update-ს
    login({
      ...user!,
      email,
    });

    alert("Profile updated");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Profile</h1>

      <div className="bg-white shadow p-4 rounded flex flex-col gap-3">
        <input
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Update
        </button>
      </div>
    </div>
  );
}
