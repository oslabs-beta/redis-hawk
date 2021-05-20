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
  console.log("GraphHolder props", props);
  console.log("GraphHolder props.events[0]", props.events[props.currDatabase]);
  // initial time for start to subtract from each keys timestamp
  // const initialTime = props.events[props.currDatabase][0].timestamp;
  // console.log(initialTime);

  // const eventsArray = props.events[props.currDatabase];

  const graphDataConverter = (array, initTime) => {
    const eventTimesArray = [];
    let temp = [];
    let xRange = 0;
    let yRange = 60000;

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
          xRange += 60000;
          yRange += 60000;
        }
      }
    }
    console.log("eventTimesArray after pushes", eventTimesArray);

    const result = [];
    eventTimesArray.forEach((array) => {
      const time = new Date(array[0].time).toString("MMM dd").slice(16, 24);
      console.log("time", time);
      result.push({ x: array[0].formattedTime, y: array.length });
    });
    return result;
  };

  // props.events[props.currDatabase].forEach((event) => {
  //   const date = new Date(event.timestamp).toString("MMM, dd");

  //   eventTimesArray.push({
  //     name: event.key,
  //     timeInMs: event.timestamp,
  //     timeInMsSinceStart: event.timestamp - initialTime,
  //     time: date.slice(16, 24),
  //   });
  // });

  // const plottableTimesArray = [];
  // // let temp = [];
  // // let rangeX = 0;
  // // let rangeY = 60000;
  // for (let i = 0; i < eventTimesArray.length; i++) {
  //   if (
  //     eventTimesArray[i].timeInMsSinceStart >= rangeX &&
  //     eventTimesArray[i].timeInMsSinceStart < rangeY
  //   ) {
  //     temp.push(eventTimesArray[i]);
  //   } else {
  //     if (temp.length < 2) break;
  //     else {
  //       plottableTimesArray.push(temp);
  //       temp = [eventTimesArray[i]];
  //       rangeX += 60000;
  //       rangeY += 60000;
  //     }
  //   }
  // }
  const initialTime = props.events[props.currDatabase][0].timestamp;
  console.log(initialTime);

  const eventsArray = props.events[props.currDatabase];
  const plotData = graphDataConverter(eventsArray, initialTime);

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
