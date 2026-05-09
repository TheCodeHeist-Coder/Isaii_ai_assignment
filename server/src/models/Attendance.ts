import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  user: mongoose.Types.ObjectId;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'half-day';
  checkIn?: Date;
  checkOut?: Date;
  note?: string;
}

const AttendanceSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent', 'late', 'half-day'], default: 'present' },
  checkIn: { type: Date },
  checkOut: { type: Date },
  note: { type: String }
}, { timestamps: true });

// Ensure unique attendance per user per day
AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
