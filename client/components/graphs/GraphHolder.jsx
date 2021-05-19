import React from "react";
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineSeries,
} from "react-vis";

const GraphHolder = (props) => {
  return (
    <XYPlot width={1000} height={200}>
      <VerticalGridLines />
      <HorizontalGridLines />
      <XAxis />
      <YAxis />
      <LineSeries
        data={[
          { x: 1, y: 4 },
          { x: 5, y: 2 },
          { x: 15, y: 6 },
        ]}
      />
    </XYPlot>
  );
};

export default GraphHolder;
