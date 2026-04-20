// src/types/index.ts
export interface BaseUser {
  id?: number;
  firstName: string;
  lastName?: string;
  pid: string;
  phoneNumber: string;
  email: string;
  password: string;
  profileImage?: string;
  role?: "admin" | "user" | "courier";
}

export interface Address {
  lng: number;
  lat: number;
}

export interface User extends BaseUser {
  role: "user";
  address: Address;
}

export interface WorkingHours {
  startHours: string;
  endHours: string;
}

export interface WorkingDays {
  monday?: WorkingHours;
  tuesday?: WorkingHours;
  wednesday?: WorkingHours;
  thursday?: WorkingHours;
  friday?: WorkingHours;
  saturday?: WorkingHours;
  sunday?: WorkingHours;
}

export interface Courier extends BaseUser {
  role: "courier";
  vehicle: string;
  workingDays: WorkingDays;
}

export interface Admin extends BaseUser {
  role: "admin";
}

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "file" | "time" | "select";
  required?: boolean;
  options?: string[];
  validation?: (value: any) => string | null;
}
