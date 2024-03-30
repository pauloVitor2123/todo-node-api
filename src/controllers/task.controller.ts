import { FastifyReply, FastifyRequest } from "fastify";
import { Task } from "../models/task.model";
import { ITask } from "../interfaces/task.interface";

const getAllTasks = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const tasks = await Task.find();
    reply.send(tasks);
  } catch (error) {
    reply.status(500).send(error);
  }
};
const getTaskById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const task = await Task.findById(request.params.id);
    reply.send(task);
  } catch (error) {
    reply.status(500).send(error);
  }
};

const createTask = async (
  request: FastifyRequest<{ Body: ITask }>,
  reply: FastifyReply
) => {
  try {
    const task = new Task(request.body);
    const result = await task.save();
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
    console.log("ID => ", request.params.id);
    console.log("Body => ", request.body);
    const task = await Task.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
    });
    reply.send(task);
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

export default {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
