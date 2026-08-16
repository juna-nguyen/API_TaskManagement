const Task = require("../models/taskModel");

const getAllTasks = async (query) => {
  const { title, status, priority, page = 1, limit = 10, sort } = query;

  const filterObj = {};
  if (status) filterObj.status = status;
  if (priority) filterObj.priority = priority;
  if (title) {
    filterObj.title = { $regex: title, $options: "i" };
  }

  let sortObj = { createdAt: -1 };
  if (sort) {
    const sortBy = sort.replace("-", "");
    const sortOrder = sort.startsWith("-") ? -1 : 1;
    sortObj = { [sortBy]: sortOrder };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const tasks = await Task.find(filterObj)
    .sort(sortObj)
    .skip(skip)
    .limit(parseInt(limit));

  const totalTasks = await Task.countDocuments(filterObj);

  return {
    total: totalTasks,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(totalTasks / parseInt(limit)),
    data: tasks,
  };
};

const getTaskById = async (id) => {
  return await Task.findById(id);
};

const createTask = async (data) => {
  return await Task.create(data);
};

const updateTask = async (id, data) => {
  if (data.createdAt) {
    delete data.createdAt;
  }

  return await Task.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const updateTaskStatus = async (id, newStatus) => {
  const task = await Task.findById(id);
  if (!task) return null;

  const currentStatus = task.status;

  const validTransitions = {
    TODO: ["IN_PROGRESS"],
    IN_PROGRESS: ["DONE"],
    DONE: [],
  };

  if (!validTransitions[currentStatus].includes(newStatus)) {
    const error = new Error(
      `Chuyển trạng thái không hợp lệ. Không thể chuyển từ ${currentStatus} sang ${newStatus}`,
    );
    error.name = "BusinessLogicError";
    throw error;
  }

  task.status = newStatus;
  await task.save();
  return task;
};

const deleteTask = async (id) => {
  return await Task.findByIdAndDelete(id);
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
