import { document } from 'global';
import axe, { AxeResults, RunOptions, Spec } from 'axe-core';
import deprecate from 'util-deprecate';
import { stripIndents } from 'common-tags';

import addons, { makeDecorator } from '@storybook/addons';
import { STORY_RENDERED } from '@storybook/core-events';
import { EVENTS, PARAM_KEY } from './constants';

const channel = addons.getChannel();
let progress = Promise.resolve();
let setup: { config: Spec; options: RunOptions } = { config: {}, options: {} };

const getElement = () => {
  const storyRoot = document.getElementById('story-root');

  if (storyRoot) {
    return storyRoot.children;
  }
  return document.getElementById('root');
};

const report = (input: AxeResults) => {
  channel.emit(EVENTS.RESULT, input);
};

const run = (config: Spec, options: RunOptions) => {
  progress = progress.then(() => {
    axe.reset();
    if (config) {
      axe.configure(config);
    }
    return axe
      .run(
        getElement(),
        options ||
          // tslint:disable-next-line:no-object-literal-type-assertion
          ({
            restoreScroll: true,
          } as RunOptions) // cast to RunOptions is necessary because axe types are not up to date
      )
      .then(report);
  });
};

export const withA11Y = makeDecorator({
  name: 'withA11Y',
  parameterName: PARAM_KEY,
  skipIfNoParametersOrOptions: false,
  allowDeprecatedUsage: false,

  wrapper: (getStory, context, opt) => {
    setup = opt.parameters || opt.options || ({} as any);

    return getStory(context);
  },
});

channel.on(STORY_RENDERED, () => run(setup.config, setup.options));
channel.on(EVENTS.REQUEST, () => run(setup.config, setup.options));

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

// TODO: REMOVE at v6.0.0
export const checkA11y = deprecate((...args: any[]) => withA11Y(...args), 'checkA11y has been replaced with withA11Y');

// TODO: REMOVE at v6.0.0
export const configureA11y = deprecate(
  (config: any) => {
    setup = config;
  },
  stripIndents`
    configureA11y is deprecated, please configure addon-a11y using the addParameter api:
    
    addParameters({
      a11y: {
        // ... axe options
        element: '#root', // optional selector which element to inspect
      },
    });
  `
);
