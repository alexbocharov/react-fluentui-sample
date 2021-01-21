import * as React from 'react';

export interface IProgressProps {
  completed?: number,
  total?: number,
  percentComplete?: number
};

export type Progress = React.FunctionComponent<IProgressProps>;

export const Progress: Progress = (props: IProgressProps): JSX.Element => {
  return (
    <span>[Render progress here]</span>
  );
}