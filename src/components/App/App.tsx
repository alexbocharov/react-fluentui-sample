import React, { useState } from 'react';
import { Checkbox, Dialog, DialogFooter, DialogType, Fabric, IconButton, Persona, PersonaPresence, PersonaSize, Pivot, PivotItem, Text, TextField } from '@fluentui/react';
import { DefaultButton, PrimaryButton } from '@fluentui/react-experiments';
import './App.scss';
import TaskManager from '../../services/TaskManager';
import { Sidenav } from '../Sidenav/Sidenav';
import { Progress } from '../Progress/Progress';

interface IAppProps {
  tasks: [];
  inputValue?: string,
  hideDeleteDialog?: boolean,
  taskToDelete?: any
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

  const toogleTaskCompleted = (taskId: any) => {
    taskManager.toggleTaskCompleted(taskId);
    setState({ tasks: taskManager.getTasks() });
  };

  const confirmDeleteTask = (taskId: any) => {
    showDeleteDialog();
    setState({ ...state, tasks: taskManager.getTasks(), taskToDelete: taskId });
  };

  const showDeleteDialog = () => {
    setState({ ...state, tasks: state.tasks, hideDeleteDialog: false });
  };

  const closeDeleteDialog = () => {
    setState({ tasks: state.tasks, hideDeleteDialog: true });
  };

  const handleConfirmDeleteClick = (taskId: any) => {
    taskManager.deleteTask(taskId);
    setState({ tasks: taskManager.getTasks(), taskToDelete: null });
    closeDeleteDialog();
  };

  const handleCancelDeleteClick = () => {
    closeDeleteDialog();
  };

  const onChangeTextField = React.useCallback(
    (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
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
              onClick={() => { toogleTaskCompleted(task.id) }}
            >
              <Checkbox
                checked={task.completed}
                label={task.title}
                name={task.id}
                onChange={(_event, _checked) => {
                  toogleTaskCompleted(task.id);
                }}
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
                  confirmDeleteTask(task.id);
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
        hidden={state.hideDeleteDialog}
        onDismiss={closeDeleteDialog}
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
          <PrimaryButton onClick={() => { handleConfirmDeleteClick(state.taskToDelete) }}>
            Ok
          </PrimaryButton>
          <DefaultButton onClick={() => handleCancelDeleteClick()}>
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
          <Progress
            completed={taskManager.getCompletedTaskCount()}
            total={taskManager.getTaskCount()}
            percentComplete={taskManager.getTasksPercentComplete()}
          />
        </footer>
        {renderDeleteDialog()}
      </div>
    </Fabric>
  );
};