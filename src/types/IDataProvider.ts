import { IPersonaProps } from "@fluentui/react";
import { ITask } from "./ITask";

export interface IDataProvider {
  isLoading: boolean;

  tasks: ITask[];

  createTask(title: string, personaProps: IPersonaProps): Promise<ITask[]>;

  deleteTask(taskDeleted: ITask): Promise<ITask[]>;

  addListener(listener: () => void): void;

  removeListener(listener: () => void): void;
}