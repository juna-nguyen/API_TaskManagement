const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router
  .route("/")
  .get(taskController.getAllTasks)
  .post(taskController.createTask);

router
  .route("/:id")
  .get(taskController.getTaskById)
  .put(taskController.updateTask)
  .delete(taskController.deleteTask);

router.route("/:id/status").post(taskController.updateTaskStatus);

module.exports = router;
