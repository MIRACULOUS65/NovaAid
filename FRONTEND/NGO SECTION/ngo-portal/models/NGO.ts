import mongoose, { Schema, model, models } from "mongoose";

export interface INGO extends mongoose.Document {
  userId: string;
  clerkEmail: string;
  ngoName: string;
  registrationNumber: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  website?: string;
  description: string;
  foundedYear: number;
  focusAreas: string;
  createdAt: Date;
  updatedAt: Date;
}

const NGOSchema = new Schema<INGO>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    clerkEmail: {
      type: String,
      required: true,
    },
    ngoName: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    foundedYear: {
      type: Number,
      required: true,
    },
    focusAreas: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const NGO = models.NGO || model<INGO>("NGO", NGOSchema);

export default NGO;
