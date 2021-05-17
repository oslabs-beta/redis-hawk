//need to complete pagination

import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';

import KeyspaceComponent from '../../../client/components/keyspace/KeyspaceComponent.jsx';
import MainComponent from '../../../client/components/keyspace/MainComponent.jsx';
import PaginationComponent from '../../../client/components/navbars/PaginationComponent.jsx';
import KeyListComponent from '../../../client/components/keyspace/KeyListComponent.jsx';

configure({ adapter: new Adapter() });

describe('React Keyspace unit tests', () => {
  describe('KeyspaceComponent', () => {
    let wrapper;
    const props = {
      keyspace: [
        {
          name: 'keyName',
          value: 'hello',
          time: '11:52',
        },
      ],
      events: [
        {
          name: 'hey!',
          event: 'scan',
          time: '8:30',
        },
      ],
      totalKeys: [{ totalKeys: 50 }],
    };

    beforeAll(() => {
      wrapper = shallow(<KeyspaceComponent {...props} />);
    });

    it('render the main component and pagination div, with keyspace props passed to MainComponent', () => {
      expect(
        wrapper.containsAllMatchingElements([
          <MainComponent
            keyspace={[
              {
                name: 'keyName',
                value: 'hello',
                time: '11:52',
              },
            ]}
          />,
        ])
      ).toEqual(true);
    });
  });

  describe('MainComponent', () => {
    let wrapper;
    const props = {
      keyspace: [
        {
          name: 'keyName',
          value: 'hello',
          time: '11:52',
        },
      ],
    };

    beforeAll(() => {
      wrapper = shallow(<MainComponent {...props} />);
    });

    it('renders two divs, one with the id keyListHolder, the other with the id valueDisplay', () => {
      expect(wrapper.find('div').toHaveLength(2));
      expect(wrapper.find('keyListHolder'));
      expect(wrapper.find('valueDisplay'));
    });
  });
  describe('valueDisplay', () => {
    let wrapper;
    const props = {
      keyspace: [
        {
          name: 'keyName',
          value: 'hello',
          time: '11:52',
        },
      ],
    };
    beforeAll(() => {
      wrapper = shallow(<div id='valueDisplay' props={props.keyspace} />);
    });
    it('should render an h3 element with the props keyspace', () => {
      expect(
        wrapper.containsAllMatchingElements([
          <h3
            keyspace={[
              {
                name: 'keyName',
                value: 'hello',
                time: '11:52',
              },
            ]}
          />,
        ])
      ).toEqual(true);
    });
  });

  describe('keyListHolder', () => {
    let wrapper;
    const props = {
      keyspace: [
        {
          name: 'keyName',
          value: 'hello',
          time: '11:52',
        },
      ],
    };
    beforeAll(() => {
      wrapper = shallow(<div id='keyListHolder' props={props.keyspace} />);
    });

    it('should render a ul element with the id keyList', () => {
      expect(wrapper.find('keyList')).toHaveLength(1);
    });
  });

  describe('KeyListComponent', () => {
    let wrapper;
    const props = {
      keyspace: [
        {
          name: 'keyName',
          value: 'hello',
          time: '11:52',
        },
      ],
    };
    beforeAll(() => {
      wrapper = shallow(<KeyListComponent props={props.keyspace} />);
    });
    it('should render a list item with the id keynameandtype', () => {
      expect(wrapper.find('keynameandtype'));
      expect(
        wrapper.containsAllMatchingElements([
          <li
            keyspace={[
              {
                name: 'keyName',
                value: 'hello',
                time: '11:52',
              },
            ]}
          />,
        ])
      ).toEqual(true);
    });
  });
});
