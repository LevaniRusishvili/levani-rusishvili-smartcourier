// src/stores/callStore.ts
import { create } from "zustand";

export interface Call {
  id: string;
  userId: string;
  userName: string;
  courierId: string;
  courierName: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

interface CallState {
  calls: Call[];
  addCall: (call: Omit<Call, "id" | "createdAt">) => boolean;
  getCallsByUser: (userId: string) => Call[];
  getCallsByCourier: (courierId: string) => Call[];
  getAllCalls: () => Call[];
  updateCallStatus: (callId: string, status: Call["status"]) => void;
  loadCalls: () => void;
}

const STORAGE_KEY = "smartcourier_calls";

// Helper functions
const saveToLocalStorage = (calls: Call[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(calls));
    console.log("💾 Saved to localStorage:", calls.length, "calls");
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
};

const loadFromLocalStorage = (): Call[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const calls = JSON.parse(stored);
      console.log("📂 Loaded from localStorage:", calls.length, "calls");
      return calls;
    }
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
  }
  return [];
};

export const useCallStore = create<CallState>((set, get) => ({
  calls: loadFromLocalStorage(),

  addCall: (callData) => {
    console.log("📞 addCall called with:", callData);

    const existingCalls = get().calls;

    // Check for time conflict
    const hasConflict = existingCalls.some(
      (call) =>
        call.courierId === callData.courierId &&
        call.date === callData.date &&
        call.time === callData.time &&
        call.status !== "cancelled",
    );

    if (hasConflict) {
      console.log("❌ Time conflict detected!");
      alert("This time slot is already booked for this courier.");
      return false;
    }

    const newCall: Call = {
      id: Date.now().toString(),
      userId: callData.userId,
      userName: callData.userName,
      courierId: callData.courierId,
      courierName: callData.courierName,
      date: callData.date,
      time: callData.time,
      status: callData.status,
      createdAt: new Date().toISOString(),
    };

    const updatedCalls = [...existingCalls, newCall];
    set({ calls: updatedCalls });
    saveToLocalStorage(updatedCalls);
    console.log("✅ Call added! Total calls:", updatedCalls.length);
    return true;
  },

  getCallsByUser: (userId) => {
    const allCalls = get().calls;
    const result = allCalls.filter((call) => call.userId === userId);
    console.log(`🔍 User ${userId}: found ${result.length} calls`);
    return result;
  },

  getCallsByCourier: (courierId) => {
    const allCalls = get().calls;
    const result = allCalls.filter((call) => call.courierId === courierId);
    console.log(`🔍 Courier ${courierId}: found ${result.length} calls`);
    return result;
  },

  getAllCalls: () => {
    const allCalls = get().calls;
    console.log("📞 Total calls in store:", allCalls.length);
    return allCalls;
  },

  updateCallStatus: (callId, status) => {
    const updatedCalls = get().calls.map((call) =>
      call.id === callId ? { ...call, status } : call,
    );
    set({ calls: updatedCalls });
    saveToLocalStorage(updatedCalls);
    console.log(`Updated call ${callId} to ${status}`);
  },

  loadCalls: () => {
    const calls = loadFromLocalStorage();
    set({ calls });
    console.log("🔄 Loaded", calls.length, "calls from storage");
  },
}));
