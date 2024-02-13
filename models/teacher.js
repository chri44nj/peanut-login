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
      trim: true,
    },
    school: {
      type: String,
      trim: true,
    },
    subjects: {
      type: [String],
      trim: true,
    },
  },
  { timestamps: true }
);

const Teacher = models.Teacher || mongoose.model("Teacher", teacherSchema);
export default Teacher;