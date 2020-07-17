import React from 'react';
import { shallow  } from 'enzyme';
import { BreakpointProvider } from 'index';
import { BreakpointUtil } from './breakpoint-util';
import debounce from 'lodash.debounce'; // eslint-disable-line
import sinon from 'sinon';

jest.mock('lodash.debounce', () => jest.fn(fn => fn));

describe('Breakpoint Context Provider', () => {
  it('render without crashing', () => {
    const wrapper = shallow(<BreakpointProvider>Hello World</BreakpointProvider>);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.text()).toEqual('Hello World');
  });
});

describe('Breakpoint - large', () => {
  let currWidthStub;
  let currBPointNameStub;

  beforeEach(() => {
    currWidthStub = sinon.stub(BreakpointUtil.prototype, 'currentWidth').get(function getterFn() {
      return 1024;
    });

    currBPointNameStub = sinon.stub(BreakpointUtil.prototype, 'getBreakpointName').returns('large');
  });

  it('should pass the correct value', () => {
    const wrapper = shallow(<BreakpointProvider>Hello World</BreakpointProvider>);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.prop('value')).toEqual({
      currentWidth: 1024,
      currentBreakpointName: 'large',
      isServer: false
    });
  });

  it('should set correct state', () => {
    let wrapper = shallow(
      <BreakpointProvider>
      </BreakpointProvider>
    );
    expect(wrapper.state()).toEqual({
      currentWidth: 1024,
      currentBreakpointName: 'large',
      isServer: false
    });

    currBPointNameStub.restore();
    currBPointNameStub = sinon.stub(BreakpointUtil.prototype, 'getBreakpointName').returns('small');

    global.dispatchEvent(new Event('resize'));

    expect(wrapper.state()).toEqual({
      currentWidth: 1024,
      currentBreakpointName: 'small',
      isServer: false
    });
  });

  afterEach(() => {
    currWidthStub.restore();
    currBPointNameStub.restore();
  });
});
