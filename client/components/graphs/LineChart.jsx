import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import Hammer from "hammerjs";
import Chart from "chart.js/auto";

const LineChart = (props) => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true)
  console.log("props in LineChart", props);
  // array is newest to oldest
  let labels = [];
  let eventsArray = [];
  const params = {
    timeInterval: 10000,
  };
  // const chart = () => {
  //   // if (props.totalEvents) {
  //   const totalEvents = props.totalEvents.eventTotals;
  //   for (let i = totalEvents.length - 1; i >= 0; i--) {
  //     // console.log(totalEvents[i]);
  //     const time = new Date(totalEvents[i].end_time)
  //       .toString("MMddd")
  //       .slice(16, 24);
  //     // console.log(time);
  //     labels.push(time);
  //     eventsArray.push(totalEvents[i].eventCount);
  //   }
  //   // }
  // };
  console.log('loading in LineChart', loading)
  // useState inside chart function
  // const data = {
  //   labels: labels,
  //   datasets: [
  //     {
  //       label: "Number of Events",
  //       data: eventsArray,
  //       backgroundColor: ["red"],
  //       borderColor: "white",
  //       borderWidth: "2",
  //       pointBorderColor: "red",
  //       pointHoverBackgroundColor: "#55bae7",
  //     },
  //   ],
  // };
  // function addData(chart, label, data) {
  //   chart.data.labels.push(label);
  //   chart.data.datasets.forEach((dataset) => {
  //     dataset.data.push(data);
  //   });
  //   chart.update();
  // }

  // console.log("timeArray", timeArray);
  // console.log("eventsArray", eventsArray);
  // const chart = () => {
  //   //  const params = { timeInterval: 10000 };

  //   // props.getEvents(props.currInstance, props.currDatabase, params);
  //   setChartData({
  //     labels,
  //     datasets: [
  //       {
  //         label: "Number of Events",
  //         data: eventsArray,
  //         backgroundColor: ["red"],
  //         borderColor: "white",
  //         borderWidth: "2",
  //         pointBorderColor: "red",
  //         pointHoverBackgroundColor: "#55bae7",
  //       },
  //     ],
  //   });
  // };
  // chart();

  useEffect(() => {
    // console.log("props in useEffect", props);
    Chart.register(zoomPlugin);
  }, []);

  const options = {
    responsive: true,
    animation: {
      duration: 0,
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: "xy",
          speed: 7,
        },
        zoom: {
          wheel: {
            enabled: true,
            speed: 0.075,
          },
          pinch: {
            enabled: true,
          },
          mode: "xy",
        },
        limits: {
          y: {
            min: 0,
            max: Math.max(...eventsArray) + 5,
          },
        },
      },
    },
    scales: {
      x: {
        // type: "time",
        title: {
          display: true,
          text: "Times",
          color: "white",
        },
        ticks: {
          major: {
            enabled: true,
          },
          color: "white",
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Event Totals",
          color: "white",
        },
        grid: {
          display: false,
        },
        ticks: {
          major: {
            enabled: true,
          },
          color: "white",
        },
      },
    },
  };
  if (props.data) {
  return (
    <div>
      <Line
        data={props.data}
        height={400}
        width={600}
        options={options}
        style={{ backgroundColor: "black" }}></Line>
      <button
        onClick={() => {
          // labels.push(`${Date.now().toString()}`);
          // dataArray.push(Math.round(Math.random() * 100));
          chart();
        }}>
        Refresh Zoom
      </button>
    </div>
  );
  } else {
    return <div>Loading...</div>;
  }
};

export default LineChart;
