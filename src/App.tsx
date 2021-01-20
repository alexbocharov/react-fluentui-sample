import { Fabric, Pivot, PivotItem, Text, TextField } from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react-experiments';
import React, { useState } from 'react';
import './App.scss';
import { Progress } from './Progress';
import { Sidenav } from './Sidenav';

interface IAppProps {}

interface ITaskProps {
  personaProps?: any;
  id?: any;
  completed?: any;
  title?: any;
}

export const App: React.FunctionComponent = () => {
  const [state, setState] = useState<ITaskProps>();

  const renderCreateTask = () => {
    return (
      <div className="App-createTask">
        <TextField
          className="App-createTask-field"
          placeholder="Add a new task"
        />
        <PrimaryButton>
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
        <main className="App-main"></main>
        <footer className="App-footer">
          <Progress />
        </footer>
      </div>
    </Fabric>
  );
};