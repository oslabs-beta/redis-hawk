import React from "react";

import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineSeries,
} from "react-vis";

const GraphHolder = (props) => {

  const graphDataConverter = (array, initTime) => {
    const eventTimesArray = [];
    let temp = [];
    let xRange = 0;
    let yRange = 5000;
    console.log("array in graphDataConverter", array);
    for (let i = 0; i < array.length; i++) {
      if (
        array[i].timestamp - initTime >= xRange &&
        array[i].timestamp - initTime < yRange
      ) {
        let date = new Date(array[i].timestamp).toString("MMM, dd");
        temp.push({
          name: array[i].key,
          time: array[i].timestamp,
          timeInMsSinceStart: array[i].timestamp - initTime,
          formattedTime: date.slice(16, 24),
        });
      } else {
        if (temp.length < 2) break;
        else {
          eventTimesArray.push(temp);
          let date = new Date(array[i].timestamp).toString("MMM, dd");
          temp = [
            {
              name: array[i].key,
              time: array[i].timestamp,
              timeInMsSinceStart: array[i].timestamp - initTime,
              formattedTime: date.slice(16, 24),
            },
          ];
          xRange += 5000;
          yRange += 5000;
        }
      }
    }

    const result = [];
    console.log("eventtimesarray", eventTimesArray);
    // if (props.currDatabase === 0) {
    eventTimesArray.forEach((array) => {
      // console.log("time", time);
      result.push({ x: array[0].formattedTime, y: array.length });
    });
    // }
    return result;
  };

  const initialTime = props.events[props.currDatabase][0].timestamp;
  const eventsArray = props.events[props.currDatabase];
  console.log("intialTime", initialTime, "eventsArray", eventsArray);
  const plotData = graphDataConverter(eventsArray, initialTime);
  console.log("plotData", plotData);

  return (
    <XYPlot
      xType='ordinal'
      width={1200}
      height={250}
      style={{ backgroundColor: "transparent" }}>
      <HorizontalGridLines />
      <XAxis />
      <YAxis />
      <LineSeries data={plotData} />
    </XYPlot>
  );
};

export default GraphHolder;
