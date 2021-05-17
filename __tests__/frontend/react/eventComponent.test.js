//need to complete pagination

import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';

import EventComponent from '../../../client/components/events/EventComponent.jsx';
import EventHolder from '../../../client/components/events/EventHolder.jsx';

configure({ adapter: new Adapter() });

describe('React Events unit tests', () => {
  describe('EventComponent', () => {
    let wrapper;
    const props = {
      events: [
        {
          name: 'hey!',
          event: 'scan',
          time: '8:30',
        },
      ],
      totalEvents: 1,
    };

    beforeAll(() => {
      wrapper = shallow(<EventComponent {...props} />);
    });

    it('render a div with the id keyListEvent and pagination component, with events props passed to EventComponent and totalKeys prop passed to PaginationComponent', () => {
      expect(
        wrapper.containsAllMatchingElements([
          <div id='keyEventDiv' />,
          <PaginationComponent totalEvents={props.totalEvents} />,
        ])
      ).toEqual(true);
    });
  });

  describe('keyEventsDiv', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(<div id='keyEventsDiv' />);
    });

    it('renders a ul element with the id keyEventList', () => {
      expect(wrapper.find('keyEventsDiv')).toHaveLength(1);
    });
  });

  describe('keyEventList', () => {
    let wrapper;
    const props = {
      events: [
        {
          name: 'hey!',
          event: 'scan',
          time: '8:30',
        },
      ],
      totalEvents: 1,
    };

    beforeAll(() => {
      wrapper = shallow(<KeyEventList {...props} />);
    });

    it('renders a ul element with the id keyEvenstList', () => {
      expect(wrapper.find('keyEventsList'));
    });
    it('renders a single event for each event in the event prop', () => {
      expect(wrapper.find('keyEventsList').toHaveLength(props.events.length));
    });
  });

  describe('KeyEventComponent', () => {
    let wrapper;
    const props = {
      events: [
        {
          name: 'hey!',
          event: 'scan',
          time: '8:30',
        },
      ],
      totalEvents: 1,
    };

    beforeAll(() => {
      wrapper = shallow(<KeyEventComponent events={props.events} />);
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
