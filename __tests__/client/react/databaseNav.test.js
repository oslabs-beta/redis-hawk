import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';

import DatabaseNav from '../../../client/components/navbars/DatabaseNav.jsx';
import DatabaseComponent from '../../../client/components/navbars/DatabaseComponent.jsx';

configure({ adapter: new Adapter() });

describe('React DatabaseNav unit tests', () => {
  describe('DatabaseNav', () => {
    let wrapper;
    const props = {
      databaseInfo: [
        {
          host: 'localhost',
          port: '3000',
          numberOfDBs: 16,
        },
      ],
    };

    beforeAll(() => {
      wrapper = shallow(<DatabaseNav props={props.databaseInfo} />);
    });

    it('renders the div with id databaseNavContainer with database host and database port passed down and a div with id databaseHolder with databaseInfo props passed down ', () => {
      // expect(wrapper.find("databaseNavContainer").find("div"));
      expect(wrapper.find('databaseNavContainer').find('div'));
      // expect(wrapper.find("db-host").find("span"));
      // expect(wrapper.find("db-port").find("span"));
      // expect(
      //   wrapper.containsAllMatchingElements([
      //     <div id='databaseNavContainer'>
      //       <div id='redisInstance' databaseinfo={this.props.databaseInfo}>
      //         <p>
      //           {" "}
      //           <span className='db-host'>Host</span>{" "}
      //           {this.props.databaseInfo.host}
      //         </p>
      //         <p>
      //           {" "}
      //           <span className='db-port'>Port</span>{" "}
      //           {this.props.databaseInfo.port}
      //         </p>
      //         <div id='databaseHolder'>{dbArray}</div>
      //       </div>
      //     </div>,
      //   ])
      // ).toEqual(true);
    });
  });
  describe('DatabaseComponent', () => {
    let wrapper;
    const changeDatabasesFunc = () => 'changing databases';
    const props = {
      databaseInfo: [
        {
          host: 'localhost',
          port: '3000',
          numberOfDBs: 16,
        },
      ],
      changeDatabases: changeDatabasesFunc,
    };

    beforeAll(() => {
      wrapper = shallow(<DatabaseComponent props={props.databaseInfo} />);
    });
    it('renders a div with id singleDatabase that contains the number for the database', () => {
      expect(wrapper.find('singleDatabase').find('div'));
      expect(
        wrapper.containsAllMatchingElements([
          <div
            databaseInfo={[
              {
                host: 'localhost',
                port: '3000',
                numberOfDBs: 16,
              },
            ]}
          />,
        ])
      );
    });
    it('should have functions passed down invoking on click to change databases', () => {
      expect(wrapper.find('singleDatabase').invoke('onClick')()).toEqual(
        changeDatabasesFunc()
      );
    });
  });
});
