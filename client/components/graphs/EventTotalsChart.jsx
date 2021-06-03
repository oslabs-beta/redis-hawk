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
      filterIntervalId: 0,
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
    // this.getMoreFilteredData = this.getMoreFilteredData.bind(this);
    this.setIntFilter = this.setIntFilter.bind(this);
  }

  componentDidMount() {
    Chart.register(zoomPlugin);
    this.getInitialData();
    setTimeout(this.setInt, 10000);
  }

  getInitialData() {
    const URI = `api/v2/events/totals/${this.props.currInstance}/${this.props.currDatabase}/?timeInterval=7000`;
    fetch(URI)
      .then((res) => res.json())
      .then((response) => {
        const allEvents = response;
        console.log("response in GETINIT FETCH", response);
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

  getInitialFilteredData(currInstance, currDatabase, queryParams) {
    this.clearInt();
    console.log(
      "queryParams.keynameFilter in getInitialFilteredData",
      queryParams.keynameFilter
    );
    console.log(
      "type of queryparmskeynamefilter",
      typeof queryParams.keynameFilter
    );
    let URI;
    // if (queryParams) {
    if (queryParams.keynameFilter)
      URI = `/api/v2/events/totals/${currInstance}/${currDatabase}/?timeInterval=7000&keynameFilter=${queryParams.keynameFilter}`;
    if (queryParams.filterType)
      URI = `/api/v2/events/totals/${currInstance}/${currDatabase}/?timeInterval=7000&keynameFilter=${queryParams.filterType}`;
    console.log("URI in handleSubmit FETCH", URI);
    fetch(URI)
      .then((res) => res.json())
      .then((response) => {
        console.log("response in GETMOREFILTERED of Filter", response);
        const allEvents = response;
        const dataCopy = Object.assign({}, this.state.data);
        dataCopy.labels = [];
        console.log();
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

  // getMoreFilteredData(currInstance, currDatabase, totalEvents, queryParams) {
  //   let URI;
  //   // if (queryParams) {
  //   if (queryParams.keynameFilter)
  //     URI = `/api/v2/events/totals/${currInstance}/${currDatabase}/?totalEvents=${totalEvents}&keynameFilter=${queryParams.keynameFilter}`;
  //   if (queryParams.filterType)
  //     URI = `/api/v2/events/totals/${currInstance}/${currDatabase}/?totalEvents=${totalEvents}&keynameFilter=${queryParams.filterType}`;
  //   console.log("URI in handleSubmit FETCH", URI);
  //   fetch(URI)
  //     .then((res) => res.json())
  //     .then((response) => {
  //       const eventTotal = response.eventTotal;
  //       const eventCount = response.eventTotals[0].eventCount;
  //       const dataCopy = Object.assign({}, this.state.data);
  //       const time = new Date(response.eventTotals[0].end_time)
  //         .toString("MMddd")
  //         .slice(16, 24);
  //       dataCopy.labels.push(time);
  //       dataCopy.datasets[0].data.push(eventCount);

  //       this.setState({
  //         ...this.state,
  //         totalEvents: eventTotal,
  //         data: dataCopy,
  //       });
  //     });

  //   // setTimeout(getMoreFilteredData, 7000);
  // }

  setInt() {
    this.intervalID = setInterval(this.getMoreData, 7000);
    if (!this.state.intervalStart) {
      this.setState({
        intervalStart: true,
      });
    }
  }

  clearInt() {
    this.setState({
      intervalStart: false,
    });
    clearInterval(this.intervalID);
  }

  setIntFilter(currInstance, currDatabase, totalEvents, queryParams) {
    if (this.state.filterIntervalId){
      this.clearIntFilter()
    }
    let self = this
    function getMoreFilteredData() {
      // currInstance,
      // currDatabase,
      // totalEvents,
      // queryParams
      let URI;
      // if (queryParams) {
      if (queryParams.keynameFilter)
        URI = `/api/v2/events/totals/${currInstance}/${currDatabase}/?eventTotal=${totalEvents}&keynameFilter=${queryParams.keynameFilter}`;
      if (queryParams.filterType)
        URI = `/api/v2/events/totals/${currInstance}/${currDatabase}/?eventTotal=${totalEvents}&keynameFilter=${queryParams.filterType}`;
      console.log("URI in getMoreFiltered FETCH", URI);
      fetch(URI)
        .then((res) => res.json())
        .then((response) => {
          const eventTotal = response.eventTotal;
          const eventCount = response.eventTotals[0].eventCount;
          console.log('this.state looking for DATA', self.state)
          const dataCopy = Object.assign({}, self.state.data);
          for (let i = response.eventTotals.length - 1; i >= 0; i--) {
            const time = new Date(response.eventTotals[i].end_time)
              .toString("MMddd")
              .slice(16, 24);

            dataCopy.labels.push(time);
            dataCopy.datasets[0].data.push(response.eventTotals[i].eventCount);
          }
          console.log('this.filterInterval')
          self.setState({
            ...self.state,
            totalEvents: eventTotal,
            data: dataCopy,
          });
        });

      // setTimeout(getMoreFilteredData, 7000);
    }
    const id = setInterval(getMoreFilteredData, 7000);
    this.setState({
      intervalStart: true,
      filterIntervalId: id,
    });
  }

  clearIntFilter() {
    clearInterval(this.state.filterIntervalId);
    this.setState({
      intervalStart: false,
      filterIntervalId: 0,
    });
  }
  resetState() {
    // const newDatasets= [];
    // const newLabels = [];
    const newState = Object.assign({}, this.state);
    newState.data.labels = [];
    newState.data.datasets[0].data = [];
    this.setState({
      ...newState,
    });
    console.log("STATE AFTER RESET STATE", this.state)
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
          setInt={this.setInt}
          clearInt={this.clearInt}
          intervalStart={this.state.intervalStart}
          resetState={this.resetState}
          currInstance={this.props.currInstance}
          currDatabase={this.props.currDatabase}
          totalEvents={this.state.totalEvents}
          getInitialFilteredData={this.getInitialFilteredData}
          getMoreFilteredData={this.getMoreFilteredData}
          setIntFilter={this.setIntFilter}
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
