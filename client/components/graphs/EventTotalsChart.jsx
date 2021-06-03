import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import Hammer from "hammerjs";
import Chart from "chart.js/auto";
import EventsChartFilterNav from "./EventsChartFilterNav.jsx";
import "../styles/graphs.scss";

class EventTotalsChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalStart: false,
      intervalFilterStart: false,
      refresh: false,
      totalEvents: 0,
      intervals: 0,
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
            pointRadius: "2",
            pointHoverBackgroundColor: "gray",
          },
        ],
      },
    };
    this.getInitialData = this.getInitialData.bind(this);
    this.getMoreData = this.getMoreData.bind(this);
    this.setInt = this.setInt.bind(this);
    this.clearInt = this.clearInt.bind(this);
    this.resetState = this.resetState.bind(this);
    this.getInitialFilteredData = this.getInitialFilteredData.bind(this);
    this.setIntFilter = this.setIntFilter.bind(this);
    this.clearChart = this.clearInt.bind(this);
    this.clearFilterIntID = this.clearFilterIntID.bind(this);
  }
  chartReference = {};
  componentDidMount() {
    Chart.register(zoomPlugin);
    this.getInitialData();
    setTimeout(this.setInt, 10000);

    console.log("chartRef", this.chartReference);
  }

  getInitialData() {
    // console.log("interval count", this.state.intervals);
    const URI = `api/v2/events/totals/${this.props.currInstance}/${this.props.currDatabase}/?timeInterval=7000`;
    fetch(URI)
      .then((res) => res.json())
      .then((response) => {
        const allEvents = response;
        // console.log("response in GETINIT FETCH", response);
        const dataCopy = Object.assign({}, this.state.data);
        dataCopy.labels = [];
        dataCopy.datasets[0].data = [];
        for (let i = response.eventTotals.length - 1; i >= 0; i--) {
          const time = new Date(response.eventTotals[i].end_time)
            .toString("MMddd")
            .slice(16, 24);

          dataCopy.labels.push(time);
          dataCopy.datasets[0].data.push(response.eventTotals[i].eventCount);
        }
        console.log("dataCopy after loop", dataCopy);
        this.setState({
          ...this.state,
          totalEvents: allEvents.eventTotal,
          data: dataCopy,
        });
      });
  }

  getMoreData() {
    // console.log("intervals count IN GET MORE DATA", this.state.intervals);
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

  getInitialFilteredData(currInstance, currDatabase, queryParams) {
    // if (this.intervalID) {
    console.log();
    this.clearInt();
    // }
    // if (this.filterIntID) {
    this.clearFilterIntID();
    // }
    // this.resetState();
    // this.clearChart();
    console.log("intervals count IN GETINITIALFILTERED", this.state.intervals);
    const URI = `/api/v2/events/totals/${currInstance}/${currDatabase}/?timeInterval=7000&keynameFilter=${queryParams.keynameFilter}`;

    console.log("URI in handleSubmit FETCH", URI);
    fetch(URI)
      .then((res) => res.json())
      .then((response) => {
        console.log("response in GETMOREFILTERED of Filter", response);
        const allEvents = response;
        const dataCopy = Object.assign({}, this.state.data);
        dataCopy.labels = [];
        dataCopy.datasets[0].data = [];

        console.log();
        // const labels = [];
        // const datasets = [];
        for (let i = response.eventTotals.length - 1; i >= 0; i--) {
          if (response.eventTotals[i].eventCount > 0) {
            const time = new Date(response.eventTotals[i].end_time)
              .toString("MMddd")
              .slice(16, 24);

            dataCopy.labels.push(time);
            dataCopy.datasets[0].data.push(response.eventTotals[i].eventCount);
          }
        }

        this.setState({
          ...this.state,
          totalEvents: allEvents.eventTotal,
          data: dataCopy,
        });
      });
  }

  setInt() {
    console.log("intervalStart", this.state.intervalStart);
    console.log("INTERVALSCOUNT IN SETINT", this.state.intervals);

    if (!this.state.intervalStart) {
      this.intervalID = setInterval(this.getMoreData, 7000);
      const newInt = this.state.intervals + 1;
      this.setState({
        ...this.state,
        intervalStart: true,
        intervals: newInt,
      });
    }
  }

  clearInt() {
    console.log("INTERVALS STATE IN CLEARINT", this.state.intervals);
    console.log("intervalStart", this.state.intervalStart);
    console.log("clearing IntervalID:", this.intervalID);
    if (this.intervalID) {
      const newInt = this.state.intervals - 1;
      clearInterval(this.intervalID);
      this.setState({
        ...this.state,
        intervalStart: false,
        intervals: newInt,
      });
    }
  }
  clearFilterIntID() {
    if (this.filterIntID) {
      ("console.log clearing FILTER_INT_ID");
      clearInterval(this.filterIntID);
      this.setState({
        ...this.state,
        intervalFilterStart: false,
      });
    }
  }
  clearChart() {
    let lineChart = this.reference.chartInstance;
    lineChart.resetState();
  }
  setIntFilter(currInstance, currDatabase, totalEvents, queryParams) {
    console.log("props.intervalStart", this.state.intervalStart);
    console.log("intervalID", this.intervalID);
    console.log("filterIntID", this.filterIntID);
    // console.log("intervals count in SETINTFILTER", this.state.intervals);
    // const newInt = this.state.intervals + 1;
    // this.setState({
    //   ...this.state,
    //   intervals: newInt
    // })
    if (this.intervalID) {
      this.clearInt();
    }
    if (this.filterIntID) {
      this.clearFilterIntID();
    }
    let self = this;
    function getMoreFilteredData() {
      // console.log("intervals count in GETMOREFILTEREDDATA", self.state.intervals);

      const URI = `/api/v2/events/totals/${currInstance}/${currDatabase}/?eventTotal=${totalEvents}&keynameFilter=${queryParams.keynameFilter}`;
      console.log("URI in getMoreFiltered FETCH", URI);
      fetch(URI)
        .then((res) => res.json())
        .then((response) => {
          const eventTotal = response.eventTotal;
          const eventCount = response.eventTotals[0].eventCount;
          console.log("this.state looking for DATA", self.state);
          const dataCopy = Object.assign({}, self.state.data);
          for (let i = response.eventTotals.length - 1; i >= 0; i--) {
            const time = new Date(response.eventTotals[i].end_time)
              .toString("MMddd")
              .slice(16, 24);

            dataCopy.labels.push(time);
            dataCopy.datasets[0].data.push(response.eventTotals[i].eventCount);
          }
          console.log("this.filterInterval");
          const newInt = self.state.intervals + 1;

          self.setState({
            ...self.state,
            totalEvents: eventTotal,
            data: dataCopy,
          });
        });

      // setTimeout(getMoreFilteredData, 7000);
    }
    this.filterIntID = setInterval(getMoreFilteredData, 7000);
    this.setState({
      intervalFilterStart: true,
    });
  }

  // clearIntFilter() {
  //   clearInterval(this.state.filterIntervalId);
  //   this.setState({
  //     intervalStart: false,
  //     filterIntervalId: 0,
  //   });
  // }
  resetState() {
    const newState = Object.assign({}, this.state);
    this.clearInt();
    newState.data.labels = [];
    newState.data.datasets[0].data = [];
    newState.totalEvents = 0;
    console.log("newstate", newState);
    this.setState({
      ...newState,
    });
  }

  render() {
    return (
      <div>
        <h3>Events Over Time</h3>
        <EventsChartFilterNav
          getInitialData={this.getInitialData}
          getMoreData={this.getMoreData}
          setInt={this.setInt}
          clearInt={this.clearInt}
          intervalStart={this.state.intervalStart}
          intervalId={this.state.intervalId}
          resetState={this.resetState}
          currInstance={this.props.currInstance}
          currDatabase={this.props.currDatabase}
          totalEvents={this.state.totalEvents}
          getInitialFilteredData={this.getInitialFilteredData}
          getMoreFilteredData={this.getMoreFilteredData}
          setIntFilter={this.setIntFilter}
          intervals={this.state.intervals}
          clearFilterIntID={this.clearFilterIntID}
          refresh={this.state.refresh}
        />

        <Line
          ref={(reference) => (this.chartReference = reference)}
          data={this.state.data}
          height={200}
          width={600}
          options={{
            responsive: true,
            layout: {
              padding: 10,
            },
            animation: {
              duration: 0,
            },
            plugins: {
              zoom: {
                pan: {
                  enabled: true,
                  mode: "xy",
                  speed: 10,
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
                    // minRange: Math.max(...this.props.data.datasets.data) + 50,
                  },
                },
                legends: {
                  labels: {
                    font: {
                      family: " 'Nunito Sans', 'sans-serif'",
                    },
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
                  borderColor: "white",
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
                  borderColor: "white",
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
          style={{ backgroundColor: "rgba(49, 51, 51)" }}></Line>

        <hr></hr>
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
