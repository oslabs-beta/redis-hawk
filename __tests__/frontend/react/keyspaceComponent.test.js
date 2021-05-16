import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';

import KeyspaceComponent from '../../../client/components/KeyspaceComponent.jsx';
import MainComponent from '../../../client/components/MainComponent.jsx';
import PaginationComponent from '../../../client/components/PaginationComponent.jsx'
configure({ adapter: new Adapter() });

describe('React Keyspace unit tests',() => {
  describe('KeyspaceComponent', () => {
    let wrapper;
    const props = {
      keyspace: [{message123: null}],
      events: [{ 
        name: 'hey!', 
        event: 'scan', 
        time: '8:30' }],
      totalKeys: 50
    };

    beforeAll(() => {
      wrapper = shallow(<KeyspaceComponent {...props} />);
    });
  
    it('render the main component and pagination div, with keyspace props passed to MainComponent and totalKeys prop passed to PaginationComponent', () => {
      expect(wrapper.containsAllMatchingElements([
        <MainComponent keyspace={{message123: null}} />,
        <PaginationComponent totalkeys={50}/>
      ])).toEqual(true)
    })
  });
  
  describe('MainComponent', () => {
    let wrapper;
    const props = {
      keyspace: [{message123: null}],
    };

    beforeAll(() => {
        wrapper = shallow(<MainComponent {...props} />)
     });
     
    it('renders two divs, the key name and type div, as well as the key value div', () => {
        expect(wrapper.find('div').toHaveLength(2))
    })

  
  })
  
  describe('PaginationComponent', () => {
    let wrapper;
    const props = {
      totalKeys: 50
    };

    beforeAll(() => {
      wrapper = shallow(<PaginationComponent {...props} />);
    });
  
    it('should render a div with ', () => {
      expect(wrapper.containsAllMatchingElements([
        <MainComponent keyspace={{message123: null}} />,
        <PaginationComponent totalkeys={50}/>
      ])).toEqual(true)
    })
  });

})
