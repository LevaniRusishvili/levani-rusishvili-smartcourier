export type WorkingDay = {
  day: string;
  start: string;
  end: string;
};

export type Courier = {
  id: string;
  firstName: string;
  lastName: string;
  pid?: string;
  phoneNumber?: string;
  email: string;
  password: string;
  profileImage?: string;
  vehicle: string;

  workingDays: WorkingDay[];
  role: "courier";
};
