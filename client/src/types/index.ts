export type UserRole = 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeId?: string;
  department?: string;
  designation?: string;
  joiningDate?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Employee {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeId: string;
  department: string;
  designation: string;
  joiningDate: string;
}

export interface Attendance {
  _id: string;
  user: string | Partial<User>;
  date: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  checkIn?: string;
  checkOut?: string;
  note?: string;
}

export interface Leave {
  _id: string;
  user: string | Partial<User>;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  leaveType: 'sick' | 'casual' | 'vacation' | 'other';
  appliedAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  employeeCount: number;
  todayAttendance: number;
  pendingLeaves: number;
}
