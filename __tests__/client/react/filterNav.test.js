import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import toJson from "enzyme-to-json";
import renderer from "react-test-renderer";

import FilterNav from "../../../client/components/navbars/FilterNav.jsx";
import SearchFilter from "../../../client/components/navbars/SearchFilter.jsx";

configure({ adapter: new Adapter() });

describe("React FilterNav tests", () => {
  describe("FilterNav", () => {
    let wrapper;
    const props = {
      whichPage: "keyspace",
      keyspace: [
        [
          {
            name: "keyName",
            value: "hello",
            time: "11:52",
          },
        ],
      ],
      events: [
        [
          {
            name: "hey!",
            event: "scan",
            time: "8:30",
          },
        ],
      ],
      currDatabase: 0,
    };

    it("renders a SearchFilter component, a button with the id refreshButton and a div with the id totals.  The button should have onclick functionality passed in as props", () => {
      wrapper = shallow(<FilterNav {...props} />);
      expect(
        wrapper.containsAllMatchingElements([
          <SearchFilter />,
          <button id='refreshButton' onClick={this.handleClick} />,
          <div id='totals' />,
        ])
      ).toEqual(true);
    });

    it("the div with the id totals should render the number of total keys if on the keyspace page", () => {
      wrapper = shallow(<FilterNav whichPage={props.keyspace} />);
      expect(wrapper.find("totals")).toHaveLength(1);
      expect(wrapper.containsAllMatchingElements([<div id='totals'>1</div>]));
    });

    it("the div with the id totals should render the number of total events if on the events page", () => {
      wrapper = shallow(<FilterNav whichPage={props.events} />);
      expect(wrapper.find("totals")).toHaveLength(1);
      expect(wrapper.containsAllMatchingElements([<div id='totals'>1</div>]));
    });
  });

  describe("SearchFilter", () => {
    let wrapper;
    const props = {
      whichPage: "keyspace",
      keyspace: [
        [
          {
            name: "keyName",
            value: "hello",
            time: "11:52",
          },
        ],
      ],
      events: [
        [
          {
            name: "hey!",
            event: "scan",
            time: "8:30",
          },
        ],
      ],
      currDatabase: 0,
    };

    it("renders an input with an id searchInput", () => {
      wrapper = shallow(<SearchFilter {...props} />);
      expect(wrapper.find("searchInput").to.have.lengthOf(1));
    });

    it("should render two divs with classname filterType when whichPage is equal to keyspace", () => {
      wrapper = shallow(<SearchFilter whichPage={"keyspace"} />);
      expect(wrapper.find(".filterType")).toHaveLength(2);
    });

    it("should render three divs with classname filterType when whichPage is equal to events", () => {
      wrapper = shallow(<SearchFilter whichPage={"events"} />);
      expect(wrapper.find(".filterType")).toHaveLength(3);
    });

    it("should render four divs with classname filterType when whichPage is equal to graphs", () => {
      wrapper = shallow(<SearchFilter whichPage={"graphs"} />);
      expect(wrapper.find(".filterType")).toHaveLength(4);
    });
  });
});
