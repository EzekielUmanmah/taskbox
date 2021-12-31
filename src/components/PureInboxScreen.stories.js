import React from 'react';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { userEvent, within } from '@storybook/testing-library';

import { PureInboxScreen } from './InboxScreen';
import * as TaskListStories from './TaskList.stories';

// A super-simple mock of a redux store
const Mockstore = configureStore({
  reducer: {
    tasks: createSlice({
      name: 'tasks',
      initialState: TaskListStories.Default.args.tasks,
      reducers: {
        updateTaskState: (state, action) => {
          const { id, newTaskState } = action.payload;
          const task = state.findIndex((task) => task.id === id);
          if (task >= 0) {
            state[task].state = newTaskState;
          }
        },
      },
    }).reducer,
  },
});

export default {
  component: PureInboxScreen,
  title: 'PureInboxScreen',
  decorators: [story => <Provider store={Mockstore}>{story()}</Provider>]
};

const Template = args => <PureInboxScreen {...args} />;

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: 'Something',
};

export const WithInteractions = Template.bind({});
WithInteractions.play = ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // Simulates pinning the first task
  userEvent.click(canvas.getByLabelText("pinTask-1"));
  // Simulates pinning the third task
  userEvent.click(canvas.getByLabelText("pinTask-3"));
};
