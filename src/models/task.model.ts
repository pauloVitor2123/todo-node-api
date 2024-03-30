import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  body: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Task = mongoose.model("Task", TaskSchema);
