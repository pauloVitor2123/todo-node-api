import { TaskRepository } from "../repositories/task.repository";
import { Task } from "../models/task.model";
import { ITask } from "../interfaces/task.interface";

export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async getPaginatedTasks(page: number, pageSize: number) {
    return this.taskRepository.findPaginated(page, pageSize);
  }

  async getTaskById(id: string): Promise<typeof Task | null> {
    return await this.taskRepository.findById(id);
  }

  async createTask(taskData: ITask): Promise<ITask> {
    const newTask = new Task(taskData);
    return await this.taskRepository.save(newTask);
  }

  async updateTask(taskId: string, taskData: ITask): Promise<ITask | null> {
    return await this.taskRepository.findByIdAndUpdate(taskId, taskData);
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.taskRepository.findByIdAndDelete(taskId);
  }

  async updateTaskStatus(
    taskId: string,
    completed: boolean
  ): Promise<ITask | null> {
    return await this.taskRepository.updateTaskStatus(taskId, completed);
  }

  async updateTasksStatusInBatch(
    taskIds: string[],
    completed: boolean
  ): Promise<ITask[]> {
    return await this.taskRepository.updateTasksStatusInBatch(
      taskIds,
      completed
    );
  }

  async deleteTasksInBatch(taskIds: string[]): Promise<number> {
    return await this.taskRepository.deleteTasksInBatch(taskIds);
  }

  async getTasksCount(): Promise<{
    pendingTasks: number;
    completedTasks: number;
  }> {
    const pendingTasks = await this.taskRepository.countTasks({
      completed: false,
    });
    const completedTasks = await this.taskRepository.countTasks({
      completed: true,
    });
    return { pendingTasks, completedTasks };
  }
}
