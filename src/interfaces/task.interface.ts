export interface ITask {
  body: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date | null | undefined;
}
