//need to complete pagination

import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';

import EventComponent from '../../../client/components/events/EventComponent.jsx';
import KeyEventComponent from '../../../client/components/events/KeyEventComponent.jsx';

configure({ adapter: new Adapter() });

describe('React Events unit tests', () => {
  describe('EventComponent', () => {
    let wrapper;
    const props = {
      events: [[
        {
          name: 'hey!',
          event: 'scan',
          time: '8:30',
        },
      ]],
      totalEvents: 1,
      currDatabase: 0
    };

    beforeAll(() => {
      wrapper = shallow(<EventComponent {...props} />);
    });

    it('render a div with the id keyEventsDiv and pagination component, with events props passed from EventComponent', () => {
      expect(
        wrapper.containsAllMatchingElements([
          <div id='keyEventsDiv' />,
        ])
      ).toEqual(true);
    });
  });

  describe('keyEventDiv', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(<div events={props.events[props.currDatabase]} id='keyEventDiv' />);
    });

    it('renders a ul element with the id keyEventList', () => {
      expect(wrapper.find('keyEventList')).toHaveLength(1);
    });
  });

  describe('keyEventList', () => {
    let wrapper;
    const props = {
      events: [[
        {
          name: 'hey!',
          event: 'scan',
          time: '8:30',
        },
      ]],
      totalEvents: 1,
      currDatabase: 0
    };

    beforeAll(() => {
      wrapper = shallow(<div id='keyEventList' />);
    });

    it('renders a ul element with the id keyEvenstList', () => {
      expect(wrapper.find('keyEventsList'));
    });
    it('renders a single event for each event in the event prop', () => {
      expect(wrapper.find('keyEventsList').toHaveLength(props.events[props.currDatabase].length));
    });
  });

  describe('KeyEventComponent', () => {
    let wrapper;
    const props = {
      events: [[
        {
          name: 'hey!',
          event: 'scan',
          time: '8:30',
        },
      ]],
      totalEvents: 1,
      currDatabase: 0
    };

    beforeAll(() => {
      wrapper = shallow(<KeyEventComponent events={props.events[props.currDatabase]} />);
    });

    it('renders an li element with the id keyEvenstList', () => {
      expect(wrapper.find('keyEventsList'));
    });

    it('renders an li element with text indicating event name, type and time', () => {
      expect(
        wrapper
          .contains(<li>Keyname: Hey! Event: Scan Time: 8:30</li>)
          .toBe(true)
      );
    });
  });
});
