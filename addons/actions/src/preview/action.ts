import uuid from 'uuid/v1';
import { addons } from '@storybook/addons';
import { EVENT_ID } from '../constants';
import { ActionDisplay, ActionOptions, HandlerFunction } from '../models';

export function action(name: string, options: ActionOptions = {}): HandlerFunction {
  const actionOptions = {
    ...options,
  };

  // tslint:disable-next-line:no-shadowed-variable
  const handler = function action(...args: any[]) {
    const channel = addons.getChannel();
    const id = uuid();
    const actionDisplayToEmit: ActionDisplay = {
      id,
      count: 0,
      data: { name, args },
      options: actionOptions,
    };
    channel.emit(EVENT_ID, actionDisplayToEmit);
  };

  return handler;
}
