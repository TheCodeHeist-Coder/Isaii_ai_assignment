import mongoose, { Schema, Document } from 'mongoose';

export interface ILeave extends Document {
  user: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  leaveType: 'sick' | 'casual' | 'vacation' | 'other';
  appliedAt: Date;
}

const LeaveSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  leaveType: { type: String, enum: ['sick', 'casual', 'vacation', 'other'], default: 'casual' },
  appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<ILeave>('Leave', LeaveSchema);
