import { FastifyInstance } from "fastify";
import { TaskController } from "../controllers/task.controller";
import { TaskService } from "../services/task.service";
import { TaskRepository } from "../repositories/task.repository";

const routes = async (fastify: FastifyInstance, options: any) => {
  const _taskRepository = new TaskRepository();
  const _taskService = new TaskService(_taskRepository);
  const _taskController = new TaskController(_taskService);

  fastify.get("/", _taskController.getAllTasks.bind(_taskController));
  fastify.get("/:id", _taskController.getTaskById.bind(_taskController));
  fastify.post("/", _taskController.createTask.bind(_taskController));
  fastify.put("/:id", _taskController.updateTask.bind(_taskController));
  fastify.delete("/:id", _taskController.deleteTask.bind(_taskController));
  fastify.patch(
    "/status/:id",
    _taskController.updateTaskStatusById.bind(_taskController)
  );
  fastify.patch(
    "/status",
    _taskController.updateTasksStatusInBatch.bind(_taskController)
  );
  fastify.delete("/", _taskController.deleteTasksInBatch.bind(_taskController));
  fastify.get("/count", _taskController.getTasksCount.bind(_taskController));
};

export default routes;
