import { FastifyReply, FastifyRequest } from "fastify";
import { Task } from "../models/task.model";
import { ITask } from "../interfaces/task.interface";

const getAllTasks = async (
  request: FastifyRequest<{
    Querystring: { page?: string; pageSize: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { page = "1", pageSize = "10" } = request.query;
    const pageNumber = parseInt(page, 10);
    const limit = parseInt(pageSize, 10);

    const startIndex = (pageNumber - 1) * limit;

    const tasks = await Task.find().skip(startIndex).limit(limit);

    const totalCount = await Task.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    reply.send({
      tasks,
      pageInfo: {
        currentPage: pageNumber,
        pageSize: tasks.length,
        totalPages,
        totalCount,
      },
    });
  } catch (error) {
    reply.status(500).send(error);
  }
};
const getTaskById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const _task = await Task.findById(request.params.id);
    if (!_task)
      return reply
        .status(404)
        .send("The task with the given ID was not found.");

    reply.send(_task);
  } catch (error) {
    reply.status(500).send(error);
  }
};

const createTask = async (
  request: FastifyRequest<{ Body: ITask }>,
  reply: FastifyReply
) => {
  try {
    const _task = new Task(request.body);
    const result = await _task.save();
    reply.send(result);
  } catch (error) {
    reply.status(500).send(error);
  }
};

const updateTask = async (
  request: FastifyRequest<{ Body: ITask; Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const _task = await Task.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
      }
    );
    reply.send(_task);
  } catch (error) {
    reply.status(500).send(error);
  }
};

const deleteTask = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    await Task.findByIdAndDelete(request.params.id);
    reply.status(204).send();
  } catch (error) {
    reply.status(500).send(error);
  }
};

const updateTaskStatusById = async (
  request: FastifyRequest<{
    Params: { id: string };
    Body: { completed: boolean };
  }>,
  reply: FastifyReply
) => {
  try {
    const _task = await Task.findOneAndUpdate(
      { _id: request.params.id },
      {
        completed: request.body.completed,
        completedAt: new Date(),
      },
      { new: true }
    );

    if (!_task)
      return reply
        .status(404)
        .send("The task with the given ID was not found.");

    reply.send(_task);
  } catch (error) {
    reply.status(500).send(error);
  }
};

const updateTasksStatusInBatch = async (
  request: FastifyRequest<{ Body: { taskIds: string[]; completed: boolean } }>,
  reply: FastifyReply
) => {
  try {
    const { taskIds, completed } = request.body;

    const updatedTasks = await Task.updateMany(
      { _id: { $in: taskIds } },
      { completed: completed, completedAt: completed ? new Date() : null },
      { new: true }
    );

    reply.send(updatedTasks);
  } catch (error) {
    reply.status(500).send(error);
  }
};

const deleteTasksInBatch = async (
  request: FastifyRequest<{ Body: { taskIds: string[] } }>,
  reply: FastifyReply
) => {
  try {
    const { taskIds } = request.body;

    const deletedTasks = await Task.deleteMany({ _id: { $in: taskIds } });

    if (deletedTasks.deletedCount === 0) {
      return reply.status(404).send("No tasks found with the provided IDs.");
    }

    reply.status(204).send();
  } catch (error) {
    reply.status(500).send(error);
  }
};

const getTasksCount = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const pendingTasks = await Task.countDocuments({ completed: false });
    const completedTasks = await Task.countDocuments({ completed: true });

    reply.send({
      pendingTasks,
      completedTasks,
    });
  } catch (error) {
    reply.status(500).send(error);
  }
};

export default {
  getAllTasks,
  getTaskById,
  getTasksCount,
  createTask,
  updateTask,
  updateTaskStatusById,
  updateTasksStatusInBatch,
  deleteTask,
  deleteTasksInBatch,
};
