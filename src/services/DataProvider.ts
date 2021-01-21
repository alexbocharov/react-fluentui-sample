import { IPersonaProps, PersonaInitialsColor } from '@fluentui/react';
import { IDataProvider, ITask } from '../types';

const ADD_TASKS_DELAY = 1;

export default class DataProvider implements IDataProvider {
  private _tasks: ITask[];
  private _isLoading: boolean;
  private _listeners: Array<() => void>;

  public get tasks(): Array<ITask> {
    return this._tasks;
  }

  public set tasks(value: Array<ITask>) {
    this._tasks = value;
    this._emitChange();
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }

  public set isLoading(value: boolean) {
    this._isLoading = value;
    this._emitChange();
  }

  constructor() {
    this._tasks = [{
      id: '392e5cb6-e59c-4b78-9a26-fb48eebeacf5',
      title: 'Wash the car',
      completed: true,
      personaProps: {
        text: 'Carol Poland',
        secondaryText: `Created ${this._yesterdaysDate()}`,
        initialsColor: PersonaInitialsColor.darkRed,
        imageUrl:
          'https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-female.png'
      }
    },
    {
      id: 'b510b1eb-cb39-43a3-a005-3713abc65830',
      title: 'Get groceries',
      completed: true,
      personaProps: {
        text: 'Amanda Brady',
        secondaryText: `Created ${this._yesterdaysDate()}`,
        initialsColor: PersonaInitialsColor.orange,
        imageUrl:
          'https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-female.png'
      }
    },
    {
      id: '06582258-6a31-4bbe-8414-a8906d8e6d08',
      title: 'Walk the dog',
      completed: false,
      personaProps: {
        text: 'Miguel Garcia',
        secondaryText: `Created ${this._yesterdaysDate()}`,
        initialsColor: PersonaInitialsColor.blue,
        imageUrl:
          'https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-male.png'
      }
    }];

    this._isLoading = false;

    this._listeners = [];

    this.createTask = this.createTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
  }

  public createTask(title: string): Promise<ITask[]> {
    this._isLoading = true;

    return new Promise<ITask[]>(resolve => {
      const newTask: ITask = {
        id: this._generatedGuid(),
        title: title,
        completed: false,
        personaProps: {
          text: 'Miguel Garcia',
          secondaryText: `Created ${this._yesterdaysDate()}`,
          initialsColor: PersonaInitialsColor.blue,
          imageUrl:
            'https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-male.png'
        }
      };

      setTimeout(() => {
        this.tasks = this.tasks.concat(newTask);
        this.isLoading = false;
        resolve(this.tasks);
      }, ADD_TASKS_DELAY);
    });
  }

  public deleteTask(taskDeleted: ITask): Promise<ITask[]> {
    return new Promise<ITask[]>(resolve => {
      this.tasks = this.tasks.filter((task: ITask) => task.id !== taskDeleted.id);
      resolve(this.tasks);
    })
  }

  public addListener(listener: () => void): void {
    this._listeners.push(listener);
  }

  public removeListener(listener: () => void): void {
    const listenerIdx: number = this._listeners.indexOf(listener);
    if (listenerIdx > - 1) {
      this._listeners.splice(listenerIdx, 1);
    }
  }

  private _emitChange(): void {
    this._listeners.forEach((listener: () => void) => listener());
  }

  private _generatedGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      // eslint-disable-next-line no-bitwise
      const r = (Math.random() * 16) | 0;
      // eslint-disable-next-line no-bitwise
      const v = c === 'x' ? r : (r & 0x3) | 0x8;

      return v.toString(16);
    });
  }

  private _yesterdaysDate(): string {
    const dateOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return yesterday.toLocaleDateString('en-us', dateOptions);
  }
}