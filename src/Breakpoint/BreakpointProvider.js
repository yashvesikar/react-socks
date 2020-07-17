import React from 'react';
import PropTypes from 'prop-types';

import BreakpointUtil from './breakpoint-util';
import debounce from 'lodash.debounce';
import { isBrowser } from "browser-or-node";

const BreakpointContext = React.createContext({
  currentWidth: 9999,
  currentBreakpointName: '',
  isServer: !isBrowser
});

export default class BreakpointProvider extends React.Component {
  constructor(props) {
    super(props);
    const currentWidth = BreakpointUtil.currentWidth;

    this.state = {
      currentWidth: currentWidth,
      currentBreakpointName: BreakpointUtil.getBreakpointName(currentWidth),
      isServer: !isBrowser
    };

    this.handleResize = debounce(this.handleResize.bind(this), 100);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.setState({isServer: !isBrowser})
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    this.handleResize.cancel();
  }

  handleResize() {
    const currentWidth = BreakpointUtil.currentWidth;

    this.setState({
      currentWidth: currentWidth,
      currentBreakpointName: BreakpointUtil.getBreakpointName(currentWidth),
      isServer: !isBrowser
    });
  }

  render() {
    const { children } = this.props;
    const { currentWidth, currentBreakpointName, isServer } = this.state;

    return (
      <BreakpointContext.Provider
        value={{
          currentWidth,
          currentBreakpointName,
          isServer
        }}
      >
        { children }
      </BreakpointContext.Provider>
    );
  }
}

export const useCurrentWidth = () => {
  return React.useContext(BreakpointContext).currentWidth
}

export const useCurrentBreakpointName = () => {
  return React.useContext(BreakpointContext).currentBreakpointName
}

BreakpointProvider.propTypes = {
  children: PropTypes.node,
};

export {
  BreakpointContext,
};
