const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Vui lòng nhập tiêu đề (title)"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["TODO", "IN_PROGRESS", "DONE"],
        message: "{VALUE} không hợp lệ.",
      },
      default: "TODO",
    },
    priority: {
      type: String,
      enum: {
        values: ["LOW", "MEDIUM", "HIGH"],
        message: "{VALUE} không hợp lệ.",
      },
      default: "MEDIUM",
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Task", taskSchema);
