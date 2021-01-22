import React, { useState } from 'react';
import { Checkbox, Dialog, DialogFooter, DialogType, Fabric, IconButton, Persona, PersonaPresence, PersonaSize, Pivot, PivotItem, Text, TextField } from '@fluentui/react';
import { DefaultButton, PrimaryButton } from '@fluentui/react-experiments';
import './App.scss';
import { Sidenav } from '../Sidenav/Sidenav';
import { Progress } from '../Progress/Progress';
import { ITask } from '../../types';
import DataProvider from '../../services/DataProvider';
import { useBoolean } from '@fluentui/react-hooks';

const examplePersona = {
  showSecondaryText: true,
  size: PersonaSize.size32,
  presence: PersonaPresence.online
};

const dataProvider = new DataProvider();

export const App: React.FunctionComponent = () => {
  const [hideDeleteDialog, { toggle: toggleHideDeleteDialog }] = useBoolean(true);
  const [taskTitle, setTaskTitle] = React.useState<string>('');
  const [taskToDelete, setTaskToDelete] = React.useState<ITask | null>(null);
  const [tasks, setTasks] = React.useState<ITask[]>(dataProvider.tasks);
  const [task, setTask] = React.useState<ITask>();

  const onChangeTextField = React.useCallback(
    (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setTaskTitle(newValue || '');
    },
    []
  );

  const onKeyDownTextField = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      if (event.key === 'Enter') {
        addTask();
      }
    },
    []
  );

  const addTask = (): void => {
    dataProvider.createTask(taskTitle)
      .then(() => {
        setTasks(dataProvider.tasks);
      });
  }

  const onChangeCompleted = (task: ITask): void => {
    task.completed = !task.completed;
    setTask(task)
  }

  const onConfirmDeleteClick = (): void => {
    if (taskToDelete !== null) {
      dataProvider.deleteTask(taskToDelete as ITask)
        .then(() => {
          setTaskToDelete(null);
          setTasks(dataProvider.tasks);
        });
    }

    toggleHideDeleteDialog();
  }

  const renderCreateTask = (): JSX.Element => {
    return (
      <div className="App-createTask">
        <TextField
          className="App-createTask-field"
          placeholder="Add a new task"
          value={taskTitle}
          onChange={onChangeTextField}
        />
        <PrimaryButton
          className="App-createTask-button"
          onClick={addTask}
        >
          Add task
        </PrimaryButton>
      </div>
    );
  };

  const renderPivot = (): JSX.Element => {
    return (
      <div className="App-pivot">
        <Pivot>
          <PivotItem
            headerText="All Tasks"
            headerButtonProps={{
              "data-order": 1,
              "data-title": "My Files Title"
            }}
          />
          <PivotItem headerText="Completed" />
        </Pivot>
      </div>
    );
  };

  const renderTaskList = (): JSX.Element => {
    return (
      <div className="App-taskList">
        {tasks.map((task: ITask) => {
          let { personaProps } = task;
          let personaArgs = { ...personaProps, ...examplePersona };

          return (
            <div
              className="App-task"
              key={task.id}
            >
              <Checkbox
                checked={task.completed}
                label={task.title}
                name={task.id}
                onChange={(event, checked) => { onChangeCompleted(task) }}
              />
              <div className="App-persona">
                <div className="ms-PersonaExample">
                  <Persona {...personaArgs} />
                </div>
              </div>
              <IconButton
                className="App-taskActions"
                iconProps={{ iconName: "Delete" }}
                title="Delete task"
                ariaLabel="Delete task"
                onClick={event => {
                  event.stopPropagation();
                  toggleHideDeleteDialog();
                  setTaskToDelete(task);
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const renderDeleteDialog = () => {
    return (
      <Dialog
        hidden={hideDeleteDialog}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Delete task',
          subText: 'Are you sure you want to delete this task? This cannot be undone.'
        }}
        modalProps={{
          isBlocking: false
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={onConfirmDeleteClick}>
            Ok
          </PrimaryButton>
          <DefaultButton onClick={toggleHideDeleteDialog}>
            Cancel
          </DefaultButton>
        </DialogFooter>
      </Dialog>
    );
  };

  return (
    <Fabric className="App">
      <nav className="App-sideNav">
        <Sidenav />
      </nav>
      <div className="App-container">
        <header className="App-header">
          <div className="App-titleBlock">
            <Text variant="xxLarge" className="App-title">
              Team Tasks
            </Text>
            <div className="App-description">
              <TextField borderless placeholder="Describe your list" />
            </div>
            {renderCreateTask()}
            {renderPivot()}
          </div>
        </header>
        <main className="App-main">{renderTaskList()}</main>
        <footer className="App-footer">
          <Progress />
        </footer>
        {renderDeleteDialog()}
      </div>
    </Fabric>
  );
};
