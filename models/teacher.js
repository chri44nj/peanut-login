import mongoose, { Schema, models } from "mongoose";

const teacherSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: Number,
      default: null,
    },
    school: {
      type: String,
    },
    subjects: {
      type: [String],
      trim: true,
    },
    accountType: {
      type: String,
      trim: true,
      required: true,
    },
    classes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Teacher = models.Teacher || mongoose.model("Teacher", teacherSchema);
export default Teacher;
