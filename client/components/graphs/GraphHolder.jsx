import React from "react";
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineSeries,
  MarkSeries,
} from "react-vis";

const GraphHolder = (props) => {
  console.log("GraphHolder props", props);
  console.log("GraphHolder props.events[0]", props.events[props.currDatabase]);
  const eventTimesArray = [];
  // initial time for start to subtract from each keys timestamp
  const initialTime = props.events[props.currDatabase][0].timestamp;
  console.log(initialTime);
  props.events[props.currDatabase].forEach((event) => {
    const date = new Date(event.timestamp).toString("MMM, dd");
    eventTimesArray.push({
      name: event.key,
      time: event.timestamp,
      timeInMsSinceStart: event.timestamp - initialTime,
      time: date.slice(16, 24),
    });
  });
  console.log("eventTimesArray", eventTimesArray);

  const plottableTimesArray = [];
  let temp = [];
  let rangeX = 0;
  let rangeY = 60000;
  for (let i = 0; i < eventTimesArray.length; i++) {
    if (
      eventTimesArray[i].timeInMsSinceStart >= rangeX &&
      eventTimesArray[i].timeInMsSinceStart < rangeY
    ) {
      temp.push(eventTimesArray[i]);
    } else {
      if (temp.length < 2) break;
      else {
        plottableTimesArray.push(temp);
        temp = [eventTimesArray[i]];
        rangeX += 60000;
        rangeY += 60000;
      }
    }
  }
  console.log("plottableTimesArray after pushes", plottableTimesArray);

  const plotData = [];
  plottableTimesArray.forEach((array) => {
    plotData.push({ x: array[0].time, y: array.length });
  });

  console.log("plotData", plotData);
  return (
    <XYPlot xType='ordinal' width={800} height={250}>
      <VerticalGridLines />
      <HorizontalGridLines />
      <XAxis />
      <YAxis />
      <LineSeries data={plotData} />
    </XYPlot>
  );
};

export default GraphHolder;
