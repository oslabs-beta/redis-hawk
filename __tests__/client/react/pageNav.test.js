import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import toJson from "enzyme-to-json";
import renderer from "react-test-renderer";
import { Link } from 'react-router-dom'

import PageNav from "../../../client/components/navbars/PageNav.jsx";

configure({ adapter: new Adapter() });

describe('React PageNav unit tests', () => {
    describe('PageNav', () => {
        let wrapper;
        const props = {
            currPage: "keyspace"
        }
        
        beforeAll(() => {
            wrapper = shallow(<PageNav props={...props}/>)
        })

        it('renders a div with id of pageNavContainer', () => {
            expect(wrapper.find('pageNavContainer').find('div'))
        })
        it('renders a Link to /', () => {
            expect(wrapper.toContainReact(<Link to='/'>Keyspace</Link>))
        })
        it('renders a Link to /events', () => {
            expect(wrapper.toContainReact(<Link to='/events'>Events</Link>))
        })
        it('renders a Link to /graphs', () => {
            expect(wrapper.toContainReact(<Link to='/graphs'>Graphs</Link>))
        })
    })
})