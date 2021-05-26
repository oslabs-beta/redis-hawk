//incomplete because we don't have the specific graph details we are using so we don't know what to expect

import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import toJson from "enzyme-to-json";
import renderer from "react-test-renderer";
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineSeries,
} from "react-vis";

import GraphComponent from "../../../client/components/graphs/GraphComponent.jsx";
import GraphHolder from "../../../client/components/graphs/GraphComponent.jsx";

configure({ adapter: new Adapter() });

describe("React GraphComponent unit tests", () => {
  describe("GraphComponent", () => {
    let wrapper;
    const props = {
      // keyGraph: [
      //   {
      //     name: "keyName",
      //     memory: "456GB",
      //     time: "11:52",
      //   },
      // ],
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

    beforeAll(() => {
      wrapper = shallow(<GraphComponent {...props} />);
    });

    it("renders the graphHolder with all keyGraph info and events passed down", () => {
      expect(wrapper.find("graphHolder"));
      expect(
        wrapper.containsAllMatchingElements([
          <GraphHolder
            props={{
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
            }}
          />,
        ])
      ).toEqual(true);
    });
  });

  describe("GraphHolder", () => {
    let wrapper;
    const props = {
      // keyGraph: [
      //   {
      //     name: "keyName",
      //     memory: "456GB",
      //     time: "11:52",
      //   },
      // ],
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

    beforeAll(() => {
      wrapper = shallow(<GraphHolder {...props} />);
    });

    it("renders an XYPlot component wrapping HorizontalGridLines, XAxis, YAxis  and LineSeries components with plotData array passed in as prop ", () => {
      const plotData = [
        { x: "07:37", y: 120 },
        { x: "07:37", y: 140 },
      ];
      expect(wrapper.find("graphHolder"));
      expect(
        wrapper.containsAllMatchingElements([
          <XYPlot
            xType='ordinal'
            width={1200}
            height={250}
            style={{ backgroundColor: "transparent" }}>
            <HorizontalGridLines />
            <XAxis />
            <YAxis />
            <LineSeries data={plotData} />
          </XYPlot>,
        ])
      ).toEqual(true);
    });
  });
});
