import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import Hammer from "hammerjs";
import Chart from "chart.js/auto";
import EventsChartFilterNav from "./EventsChartFilterNav.jsx";

class EventTotalsChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalStart: false,
      totalEvents: 0,
      data: {
        labels: [],
        datasets: [
          {
            label: "Number of Events",
            data: [],
            backgroundColor: ["red"],
            borderColor: "white",
            borderWidth: ".75",
            pointBorderColor: "red",
            pointBorderWidth: "1",
            pointRadius: "2.5",
            pointHoverBackgroundColor: "gray",
          },
        ],
      },
      setInt: () => {
        setInterval(this.getMoreData, 7000);
        this.state.intervalStart = true;
      }
    };
    this.getInitialData = this.getInitialData.bind(this);
    this.getMoreData = this.getMoreData.bind(this);
  }

  componentDidMount() {
    Chart.register(zoomPlugin);
    this.getInitialData();
    setTimeout(setInterval(this.setInt), 10000);
  }
  
  getInitialData() {
    const URI = `api/v2/events/totals/${this.props.currInstance}/${this.props.currDatabase}/?timeInterval=7000`;
    console.log("URI in fetch", URI);
    fetch(URI)
      .then((res) => res.json())
      .then((response) => {
        const allEvents = response;
        const dataCopy = Object.assign({}, this.state.data);
        dataCopy.labels = [];

        // const labels = [];
        // const datasets = [];
        for (let i = response.eventTotals.length - 1; i >= 0; i--) {
          const time = new Date(response.eventTotals[i].end_time)
            .toString("MMddd")
            .slice(16, 24);

          dataCopy.labels.push(time);
          dataCopy.datasets[0].data.push(response.eventTotals[i].eventCount);
        }
        this.setState({
          ...this.state,
          totalEvents: allEvents.eventTotal,
          data: dataCopy,
        });
      });
  }

  getMoreData() {
    const URI = `api/v2/events/totals/${this.props.currInstance}/${this.props.currDatabase}/?eventTotal=${this.state.totalEvents}`;
    fetch(URI)
      .then((res) => res.json())
      .then((response) => {
        const eventTotal = response.eventTotal;
        const eventCount = response.eventTotals[0].eventCount;
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

  clearInt () {
    clearInterval(this.state.setInt)
    this.state.intervalStart = false;
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
          <EventsChartFilterNav 
            getInitialData={this.getInitialData}
            getMoreData={this.getMoreData}
            setInt={this.state.setInt}
            clearInt={this.clearInt}
            intervalStart={this.state.intervalStart}
          />
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
