import { FastifyReply, FastifyRequest } from "fastify";
import { ITask } from "../interfaces/task.interface";
import { TaskService } from "../services/task.service";
import { io } from "../config/websocket";

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  async getAllTasks(
    request: FastifyRequest<{
      Querystring: { page?: string; pageSize?: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { page = "1", pageSize = "10" } = request.query;

      const { tasks, totalPages, totalCount } =
        await this.taskService.getPaginatedTasks(
          parseInt(page, 10),
          parseInt(pageSize, 10)
        );
      reply.send({
        tasks,
        pageInfo: {
          currentPage: page,
          pageSize: tasks.length,
          totalPages,
          totalCount,
        },
      });
    } catch (error) {
      reply
        .status(500)
        .send({ message: "Failed to get paginated tasks", error: error });
    }
  }

  async getTaskById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const taskId = request.params.id;
      const task = await this.taskService.getTaskById(taskId);

      if (!task)
        return reply
          .status(404)
          .send("The task with the given ID was not found.");

      reply.send(task);
    } catch (error) {
      reply.status(500).send(error);
    }
  }

  async createTask(
    request: FastifyRequest<{ Body: ITask }>,
    reply: FastifyReply
  ) {
    try {
      const taskData = request.body;
      const createdTask = await this.taskService.createTask(taskData);

      io.emit("taskUpdated", createdTask);

      reply.send(createdTask);
    } catch (error) {
      reply.status(500).send(error);
    }
  }

  async updateTask(
    request: FastifyRequest<{ Body: ITask; Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const taskId = request.params.id;
      const updatedTask = await this.taskService.updateTask(
        taskId,
        request.body
      );

      io.emit("taskUpdated", updatedTask);

      reply.send(updatedTask);
    } catch (error) {
      reply.status(500).send(error);
    }
  }

  async deleteTask(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const taskId = request.params.id;
      await this.taskService.deleteTask(taskId);

      io.emit("taskUpdated", taskId);

      reply.status(204).send();
    } catch (error) {
      reply.status(500).send(error);
    }
  }

  async updateTaskStatusById(
    request: FastifyRequest<{
      Params: { id: string };
      Body: { completed: boolean };
    }>,
    reply: FastifyReply
  ) {
    try {
      const taskId = request.params.id;
      const completed = request.body.completed;
      const updatedTask = await this.taskService.updateTaskStatus(
        taskId,
        completed
      );

      if (!updatedTask) {
        return reply
          .status(404)
          .send("The task with the given ID was not found.");
      }

      io.emit("taskUpdated", updatedTask);

      reply.send(updatedTask);
    } catch (error) {
      reply.status(500).send(error);
    }
  }

  async updateTasksStatusInBatch(
    request: FastifyRequest<{
      Body: { taskIds: string[]; completed: boolean };
    }>,
    reply: FastifyReply
  ) {
    try {
      const taskIds = request.body.taskIds;
      const completed = request.body.completed;
      const updatedTasks = await this.taskService.updateTasksStatusInBatch(
        taskIds,
        completed
      );

      io.emit("taskUpdated", updatedTasks);

      reply.send(updatedTasks);
    } catch (error) {
      reply.status(500).send(error);
    }
  }

  async deleteTasksInBatch(
    request: FastifyRequest<{ Body: { taskIds: string[] } }>,
    reply: FastifyReply
  ) {
    try {
      const taskIds = request.body.taskIds;
      const deletedTasksCount = await this.taskService.deleteTasksInBatch(
        taskIds
      );
      if (deletedTasksCount === 0) {
        return reply.status(404).send("No tasks found with the provided IDs.");
      }

      io.emit("taskUpdated", taskIds);

      reply.status(204).send();
    } catch (error) {
      reply.status(500).send(error);
    }
  }

  async getTasksCount(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { pendingTasks, completedTasks } =
        await this.taskService.getTasksCount();
      reply.send({
        pendingTasks,
        completedTasks,
      });
    } catch (error) {
      reply.status(500).send(error);
    }
  }
}
