import { ITask } from "../interfaces/task.interface";
import { Task } from "../models/task.model";

export class TaskRepository {
  async findPaginated(page: number, pageSize: number) {
    const startIndex = (page - 1) * pageSize;
    const tasks = await Task.find().skip(startIndex).limit(pageSize);
    const totalCount = await Task.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);
    return { tasks, totalPages, totalCount };
  }

  async findById(id: string): Promise<typeof Task | null> {
    return await Task.findById(id);
  }

  async save(task: ITask): Promise<ITask> {
    const newTask = new Task(task);
    return await newTask.save();
  }

  async findByIdAndUpdate(id: string, taskData: ITask): Promise<ITask | null> {
    return await Task.findByIdAndUpdate(id, taskData, { new: true });
  }

  async findByIdAndDelete(id: string): Promise<void> {
    await Task.findByIdAndDelete(id);
  }

  async updateTaskStatus(
    taskId: string,
    completed: boolean
  ): Promise<ITask | null> {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId },
      { completed: completed, completedAt: completed ? new Date() : null },
      { new: true }
    );

    return updatedTask;
  }

  async updateTasksStatusInBatch(
    taskIds: string[],
    completed: boolean
  ): Promise<ITask[]> {
    await Task.updateMany(
      { _id: { $in: taskIds } },
      { completed: completed, completedAt: completed ? new Date() : null }
    );

    const updatedTasks = await Task.find({ _id: { $in: taskIds } });

    return updatedTasks;
  }

  async deleteTasksInBatch(taskIds: string[]): Promise<number> {
    const result = await Task.deleteMany({ _id: { $in: taskIds } });
    return result.deletedCount || 0;
  }

  async countTasks(filter: any): Promise<number> {
    return await Task.countDocuments(filter);
  }
}
