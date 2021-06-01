import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import Hammer from "hammerjs";
import Chart from "chart.js/auto";

const LineChart = (props) => {
  const [chartData, setChartData] = useState({});
  // const labels = [
  //   "07:00",
  //   "07:10",
  //   "07:15",
  //   "07:30",
  //   "07:40",
  //   "07:50",
  //   "08:00",
  //   "08:10",
  //   "08:20",
  //   "08:30",
  //   "08:40",
  //   "08:50",
  //   "09:00",
  //   "09:10",
  //   "09:20",
  //   "07:00",
  //   "07:10",
  //   "07:15",
  //   "07:30",
  //   "07:40",
  //   "07:50",
  //   "08:00",
  //   "08:10",
  //   "08:20",
  //   "08:30",
  //   "08:40",
  //   "08:50",
  //   "09:00",
  //   "09:10",
  //   "09:20",
  //   "07:00",
  //   "07:10",
  //   "07:15",
  //   "07:30",
  //   "07:40",
  //   "07:50",
  //   "08:00",
  //   "08:10",
  //   "08:20",
  //   "08:30",
  //   "08:40",
  //   "08:50",
  //   "09:00",
  //   "09:10",
  //   "09:20",
  //   "07:00",
  //   "07:10",
  //   "07:15",
  //   "07:30",
  //   "07:40",
  //   "07:50",
  //   "08:00",
  //   "08:10",
  //   "08:20",
  //   "08:30",
  //   "08:40",
  //   "08:50",
  //   "09:00",
  //   "09:10",
  //   "09:20",
  // ];
  // const dataArray = [
  //   80, 50, 75, 90, 100, 60, 70, 80, 99, 23, 50, 88, 99, 100, 105, 80, 200, 135,
  //   108, 100, 60, 70, 80, 99, 23, 50, 88, 99, 100, 105, 80, 200, 230, 200, 100,
  //   60, 70, 80, 99, 23, 50, 88, 99, 100, 105, 80, 35, 75, 200, 100, 60, 70, 80,
  //   99, 23, 50, 88, 99, 100, 105,
  // ];

  // array is newest to oldest
  let labels = [];
  let eventsArray = [];
  if (props.totalEvents) {
    const totalEvents = props.totalEvents.eventTotals;
    for (let i = totalEvents.length - 1; i >= 0; i--) {
      // console.log(totalEvents[i]);
      const time = new Date(totalEvents[i].end_time)
        .toString("MMddd")
        .slice(16, 24);
      // console.log(time);
      labels.push(time);
      eventsArray.push(totalEvents[i].eventCount);
    }
  }
  // console.log("timeArray", timeArray);
  // console.log("eventsArray", eventsArray);
  const chart = () => {
    //  const params = { timeInterval: 10000 };

    // props.getEvents(props.currInstance, props.currDatabase, params);
    setChartData({
      labels,
      datasets: [
        {
          label: "Number of Events",
          data: eventsArray,
          backgroundColor: ["red"],
          borderColor: "white",
          borderWidth: "2",
          pointBorderColor: "red",
          pointHoverBackgroundColor: "#55bae7",
        },
      ],
    });
  };

  useEffect(() => {
    console.log("props in useEffect", props);
    Chart.register(zoomPlugin);
    chart();
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
    grid: {
      color: "white",
    },
  };
  if (props.totalEvents) {
    return (
      <div>
        <Line
          data={chartData}
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
  }
};

export default LineChart;
