import { IPersonaProps } from "@fluentui/react";

export interface ITask {
  id: string;
  title: string;
  completed: boolean;
  personaProps: IPersonaProps;
}