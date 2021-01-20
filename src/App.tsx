import React, { useState } from 'react';
import { Checkbox, Fabric, IconButton, Persona, PersonaPresence, PersonaSize, Pivot, PivotItem, Text, TextField } from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react-experiments';
import './App.scss';
import { Progress } from './Progress';
import { Sidenav } from './Sidenav';
import TaskManager from './TaskManager';

interface IAppProps {
  tasks: [];
  inputValue?: string,
  hideDeleteDialog?: true,
  taskToDelete?: null
}

interface ITaskProps {
  personaProps?: any;
  id?: any;
  completed?: any;
  title?: any;
}

const examplePersona = {
  showSecondaryText: true,
  size: PersonaSize.size32,
  presence: PersonaPresence.online
};

export const App: React.FunctionComponent = () => {
  var taskManager = new TaskManager();
  const [state, setState] = useState<IAppProps>({
    tasks: taskManager._tasks,
    inputValue: '',
    hideDeleteDialog: true,
  });

  const addTask = () => {
    taskManager.addTask(state.inputValue);
    setState({ tasks: taskManager.getTasks(), inputValue: '' });
  };

  const onChangeTextField = React.useCallback(
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setState({ tasks: taskManager.getTasks(), inputValue: newValue || '' });
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

  const renderCreateTask = () => {
    return (
      <div className="App-createTask">
        <TextField
          className="App-createTask-field"
          placeholder="Add a new task"
          onChange={onChangeTextField}
          onKeyDown={onKeyDownTextField}
          value={state?.inputValue}
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

  const renderPivot = () => {
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

  const renderTaskList = () => {
    return (
      <div className="App-taskList">
        {state.tasks.map((task: ITaskProps) => {
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
              />
            </div>
          );
        })}
      </div>
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
      </div>
    </Fabric>
  );
};