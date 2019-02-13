import { setInterval } from 'global';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { styled } from '@storybook/theming';

import { withKnobs, boolean } from '@storybook/addon-knobs';
import { Desktop } from './desktop';
import { Mobile } from './mobile';

import Sidebar from '../sidebar/Sidebar';
import Panel from '../panel/panel';
import { Preview } from '../preview/preview';

import { panels } from '../panel/panel.stories';
import { previewProps } from '../preview/preview.stories';

import { mockDataset } from '../sidebar/treeview/treeview.mockdata';

const realNavProps = {
  title: 'Title',
  url: 'https://example.com',
  notifications: [],
  stories: mockDataset.withRoot,
  menu: [],
};

const PlaceholderBlock = styled.div(({ color }) => ({
  background: color || 'hotpink',
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
}));

class PlaceholderClock extends Component {
  state = {
    count: 1,
  };

  componentDidMount() {
    this.interval = setInterval(() => {
      const { count } = this.state;
      this.setState({ count: count + 1 });
    }, 1000);
  }

  componentWillUnmount() {
    const { interval } = this;
    clearInterval(interval);
  }

  render() {
    const { children, color } = this.props;
    const { count } = this.state;

    return (
      <PlaceholderBlock color={color}>
        <h2
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            color: 'rgba(0,0,0,0.2)',
            fontSize: '150px',
            lineHeight: '150px',
            margin: '-20px',
          }}
        >
          {count}
        </h2>
        {children}
      </PlaceholderBlock>
    );
  }
}
PlaceholderClock.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
};

const MockNav = props => (
  <PlaceholderClock color="hotpink">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </PlaceholderClock>
);
const MockPreview = props => (
  <PlaceholderClock color="deepskyblue">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </PlaceholderClock>
);
const MockPanel = props => (
  <PlaceholderClock color="orangered">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </PlaceholderClock>
);
const MockPage = props => (
  <PlaceholderClock color="cyan">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </PlaceholderClock>
);

const mockProps = {
  Nav: MockNav,
  Preview: MockPreview,
  Panel: MockPanel,
  pages: [],
  options: { isFullscreen: false, showNav: true, showPanel: true, panelPosition: 'right' },
  location: new URL('http://localhost:9011/?path=/components/UI-DesktopLayout-noNav'),
  path: '/story/UI-DesktopLayout-noNav',
  viewMode: 'story',
  storyId: 'UI-DesktopLayout-noNav',
};

const realProps = {
  Nav: () => <Sidebar {...realNavProps} />,
  Preview: () => <Preview {...previewProps} />,
  Panel: () => (
    <Panel
      panels={panels}
      actions={{ onSelect: () => {}, toggleVisibility: () => {}, togglePosition: () => {} }}
      selectedPanel="test2"
    />
  ),
  pages: [],
  options: { isFullscreen: false, showNav: true, showPanel: true, panelPosition: 'right' },
  location: new URL('http://localhost:9011/?path=/components/UI-DesktopLayout-noNav'),
  path: '/story/UI-DesktopLayout-noNav',
  viewMode: 'story',
  storyId: 'UI-DesktopLayout-noNav',
};

const props = () => (boolean('mock', true) ? mockProps : realProps);

storiesOf('UI|Layout/Desktop', module)
  .addDecorator(withKnobs)
  .add('default', () => <Desktop {...props()} />)
  .add('no Nav', () => <Desktop {...props()} options={{ ...props().options, showNav: false }} />)
  .add('no Panel', () => (
    <Desktop {...props()} options={{ ...props().options, showPanel: false }} />
  ))
  .add('bottom Panel', () => (
    <Desktop {...props()} options={{ ...props().options, panelPosition: 'bottom' }} />
  ))
  .add('full', () => <Desktop {...props()} options={{ ...props().options, isFullscreen: true }} />)
  .add('no Panel, no Nav', () => (
    <Desktop {...props()} options={{ ...props().options, showPanel: false, showNav: false }} />
  ))
  .add('page', () => (
    <Desktop
      {...props()}
      pages={[
        {
          key: 'settings',
          // eslint-disable-next-line react/prop-types
          route: ({ children }) => <Fragment>{children}</Fragment>,
          render: () => <MockPage />,
        },
      ]}
      viewMode={undefined}
    />
  ));

storiesOf('UI|Layout/Mobile', module)
  .addDecorator(withKnobs)
  .add('initial 0', () => <Mobile {...props()} options={{ initialActive: 0 }} />)
  .add('initial 1', () => <Mobile {...props()} options={{ initialActive: 1 }} />)
  .add('initial 2', () => <Mobile {...props()} options={{ initialActive: 2 }} />)
  .add('page', () => (
    <Mobile
      {...props()}
      options={{ initialActive: 1 }}
      pages={[
        {
          key: 'settings',
          // eslint-disable-next-line react/prop-types
          route: ({ children }) => <Fragment>{children}</Fragment>,
          render: () => <MockPage />,
        },
      ]}
      viewMode={undefined}
    />
  ));
