import { FastifyInstance } from "fastify";
import taskController from "../controllers/task.controller";

const routes = async (fastify: FastifyInstance, options: any) => {
  fastify.get("/", taskController.getAllTasks);
  fastify.get("/:id", taskController.getTaskById);
  fastify.post("/", taskController.createTask);
  fastify.put("/:id", taskController.updateTask);
  fastify.delete("/:id", taskController.deleteTask);
  fastify.patch("/status/:id", taskController.updateTaskStatusById);
  fastify.patch("/status", taskController.updateTasksStatusInBatch);
  fastify.delete("/", taskController.deleteTasksInBatch);
  fastify.get("/count", taskController.getTasksCount);
};

export default routes;
