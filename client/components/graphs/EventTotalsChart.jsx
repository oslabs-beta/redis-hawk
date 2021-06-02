import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import Hammer from "hammerjs";
import Chart from "chart.js/auto";

class EventTotalsChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalEvents: 0,
      data: {
        labels: [],
        datasets: [
          {
            label: "Number of Events",
            data: [],
            backgroundColor: ["red"],
            borderColor: "white",
            borderWidth: "2",
            pointBorderColor: "red",
            pointHoverBackgroundColor: "#55bae7",
          },
        ],
      },
    };
    this.getInitialData = this.getInitialData.bind(this);
    this.getMoreData = this.getMoreData.bind(this);
  }

  componentDidMount() {
    Chart.register(zoomPlugin);
    this.getInitialData();
    setTimeout(setInterval(this.getMoreData, 7000), 10000);
  }

  getInitialData() {
    const queryParams = { timeInterval: 7000 };
    const URI = `api/v2/events/totals/${this.props.currInstance}/${this.props.currDatabase}/?timeInterval=7000`;
    console.log("URI in fetch", URI);
    fetch(URI)
      .then((res) => res.json())
      .then((response) => {
        console.log("response in fetch of LineChartBeta", response);
        const allEvents = response;
        console.log("this.state.data before assign", this.state.data);
        const dataCopy = Object.assign({}, this.state.data);
        dataCopy.labels = [];
        console.log("dataCopy before loop", dataCopy);

        // const labels = [];
        // const datasets = [];
        for (let i = response.eventTotals.length - 1; i >= 0; i--) {
          const time = new Date(response.eventTotals[i].end_time)
            .toString("MMddd")
            .slice(16, 24);

          dataCopy.labels.push(time);
          dataCopy.datasets[0].data.push(response.eventTotals[i].eventCount);
        }
        console.log("dataCopy", dataCopy);
        this.setState({
          ...this.state,
          totalEvents: allEvents.eventTotal,
          data: dataCopy,
        });
      });
  }

  getMoreData() {
    const URI = `api/v2/events/totals/${this.props.currInstance}/${this.props.currDatabase}/?eventTotal=${this.state.totalEvents}`;
    console.log("URI in fetch", URI);
    fetch(URI)
      .then((res) => res.json())
      .then((response) => {
        console.log("response in GETMOREDATA fetch of LineChartBeta", response);
        const eventTotal = response.eventTotal;
        const eventCount = response.eventTotals[0].eventCount;
        console.log("this.state.data before assign", this.state.data);
        const dataCopy = Object.assign({}, this.state.data);
        const time = new Date(response.eventTotals[0].end_time)
          .toString("MMddd")
          .slice(16, 24);
        dataCopy.labels.push(time);
        dataCopy.datasets[0].data.push(eventCount);

        this.setState({
          ...this.state,
          totalEvents: eventTotal,
          data: dataCopy,
        });
      });
  }

  render() {
    return (
      <div>
        <Line
          data={this.state.data}
          height={400}
          width={600}
          options={{
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
                    speed: 0.05,
                    modifier: "shift",
                  },
                  pinch: {
                    enabled: true,
                  },
                  mode: "xy",
                  // drag: {
                  //   enabled: true,
                  //   backgroundColor: "cyan",
                  // },
                },

                limits: {
                  y: {
                    min: 0,
                    // minRange: Math.max(...props.data.datasets.data) + 50,
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
                  // major: {
                  //   enabled: true,
                  // },
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
                  beginAtZero: true,
                  autoskip: true,
                  max: 5,
                  color: "white",
                },
              },
            },
          }}
          style={{ backgroundColor: "black" }}></Line>
        <button
          onClick={() => {
            // labels.push(`${Date.now().toString()}`);
            // dataArray.push(Math.round(Math.random() * 100));
          }}>
          Refresh Zoom
        </button>
      </div>
    );
  }
  // }
  // else {
  //   return <div>Loading...</div>;
  // }
}

// export default LineChart;

export default EventTotalsChart;
