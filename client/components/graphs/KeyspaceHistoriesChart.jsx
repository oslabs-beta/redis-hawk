import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import Hammer from "hammerjs";
import Chart from "chart.js/auto";
import KeyspaceChartFilterNav from "./KeyspaceChartFilterNav.jsx";
import "../styles/graphs.scss";

class KeyspaceHistoriesChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalStart: false,
      intervalFilterStart: false,
      historyCount: 0,
      filterIntervalId: 0,
      data: {
        labels: [],
        datasets: [
          {
            label: "Number of Keys",
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
    this.clearFilterIntID = this.clearFilterIntID.bind(this);
  }

  componentDidMount() {
    Chart.register(zoomPlugin);
    this.getInitialData();
    setTimeout(this.setInt, 10000);
  }

  // if you want to test at a smaller interval, run npm run cp after changing
  //number to server/configs/config.json
  getInitialData() {
    const URI = `api/v2/keyspaces/histories/${this.props.currInstance}/${this.props.currDatabase}/`;
    fetch(URI)
      .then((res) => res.json())
      .then((response) => {
        const allHistories = response;
        const dataCopy = Object.assign({}, this.state.data);
        // const labels = [];
        // const datasets = [];
        dataCopy.labels = [];
        dataCopy.datasets[0].data = [];
        for (let i = response.histories.length - 1; i >= 0; i--) {
          const time = new Date(response.histories[i].end_time)
            .toString("MMddd")
            .slice(16, 24);

          dataCopy.labels.push(time);
          dataCopy.datasets[0].data.push(response.histories[i].keyCount);
        }
        // this.setState({
        //   ...this.state,
        //   historyCount: allHistories.historyCount,
        //   data: dataCopy,
        // });
        this.setState(() => {
          return {
            ...this.state,
            historyCount: allHistories.historyCount,
            data: dataCopy,
          };
        });
      });
  }

  getMoreData() {
    const URI = `api/v2/keyspaces/histories/${this.props.currInstance}/${this.props.currDatabase}/?historyCount=${this.state.historyCount}`;
    fetch(URI)
      .then((res) => res.json())
      .then((response) => {
        const historyCount = response.historyCount;
        const keyCount = response.histories[0].keyCount;
        const dataCopy = Object.assign({}, this.state.data);
        const time = new Date(response.histories[0].timestamp)
          .toString("MMddd")
          .slice(16, 24);
        dataCopy.labels.push(time);
        dataCopy.datasets[0].data.push(keyCount);

        // this.setState({
        //   ...this.state,
        //   historyCount: historyCount,
        //   data: dataCopy,
        // });
        this.setState(() => {
          return {
            ...this.state,
            historyCount: historyCount,
            data: dataCopy,
          };
        });
      });
  }
  getInitialFilteredData(currInstance, currDatabase, queryParams) {
    if (this.intervalID) {
      this.clearInt();
    }
    if (this.filterIntID) {
      this.clearFilterIntID();
    }
    this.resetState();
    const URI = `/api/v2/keyspaces/histories/${currInstance}/${currDatabase}/?historiesCount=0&keynameFilter=${queryParams.keynameFilter}`;

    console.log("URI in handleSubmit FETCH", URI);
    fetch(URI)
      .then((res) => res.json())
      .then((response) => {
        const allHistories = response;

        const dataCopy = Object.assign({}, this.state.data);
        // const labels = [];
        // const datasets = [];
        dataCopy.labels = [];
        dataCopy.datasets[0].data = [];
        for (let i = response.histories.length - 1; i >= 0; i--) {
          const time = new Date(response.histories[i].end_time)
            .toString("MMddd")
            .slice(16, 24);

          dataCopy.labels.push(time);
          dataCopy.datasets[0].data.push(response.histories[i].keyCount);
        }
        // this.setState({
        //   ...this.state,
        //   historyCount: allHistories.historyCount,
        //   data: dataCopy,
        // });
        this.setState(() => {
          return {
            ...this.state,
            historyCount: allHistories.historyCount,
            data: dataCopy,
          };
        });
      });
  }
  setIntFilter(currInstance, currDatabase, totalEvents, queryParams) {
    console.log("props.intervalStart", this.state.intervalStart);

    if (this.intervalID) {
      this.clearInt();
    }
    if (this.filterIntID) {
      this.clearFilterIntID();
    }
    let self = this;
    function getMoreFilteredData() {
      const URI = `/api/v2/keyspaces/histories/${currInstance}/${currDatabase}/?historiesCount=${self.state.historyCount}&keynameFilter=${queryParams.keynameFilter}`;
      console.log("URI in getMoreFiltered FETCH", URI);
      fetch(URI)
        .then((res) => res.json())
        .then((response) => {
          console.log(
            "response in KEYSPACES HISTORIES GETMOREFILTERED of Filter",
            response
          );
          const allHistories = response;
          const dataCopy = Object.assign({}, self.state.data);
          // const labels = [];
          // const datasets = [];
          dataCopy.labels = [];
          dataCopy.datasets[0].data = [];
          for (let i = response.histories.length - 1; i >= 0; i--) {
            const time = new Date(response.histories[i].end_time)
              .toString("MMddd")
              .slice(16, 24);

            dataCopy.labels.push(time);
            dataCopy.datasets[0].data.push(response.histories[i].keyCount);
          }
          // this.setState({
          //   ...this.state,
          //   historyCount: allHistories.historyCount,
          //   data: dataCopy,
          // });
          self.setState(() => {
            return {
              ...self.state,
              historyCount: allHistories.historyCount,
              data: dataCopy,
            };
          });
        });

      // setTimeout(getMoreFilteredData, 7000);
    }
    this.filterIntID = setInterval(getMoreFilteredData, 7000);
    this.setState({
      intervalFilterStart: true,
    });
  }
  setInt() {
    if (!this.state.intervalStart) {
      this.intervalID = setInterval(this.getMoreData, 7000);
      this.setState({
        ...this.state,
        intervalStart: true,
      });
    }
  }
  clearInt() {
    if (this.state.intervalStart) {
      clearInterval(this.intervalID);
      this.setState({
        ...this.state,
        intervalStart: false,
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
  resetState() {
    // const newDatasets= [];
    // const newLabels = [];
    const newState = Object.assign({}, this.state);
    newState.labels = [];
    newState.data.datasets[0].data = [];
    // this.setState({
    //   newState,
    // });
    this.setState(() => {
      return newState;
    });
  }

  render() {
    return (
      <div>
        <h3>Keyspaces Over Time</h3>
        <KeyspaceChartFilterNav
          getInitialData={this.getInitialData}
          getMoreData={this.getMoreData}
          setInt={this.setInt}
          clearInt={this.clearInt}
          intervalStart={this.state.intervalStart}
          filterBy={this.state.filterBy}
          resetState={this.resetState}
          currInstance={this.props.currInstance}
          currDatabase={this.props.currDatabase}
          getInitialFilteredData={this.getInitialFilteredData}
          setIntFilter={this.setIntFilter}
          clearFilterIntID={this.clearFilterIntID}
        />

        <Line
          data={this.state.data}
          height={200}
          width={600}
          options={{
            responsive: true,
            // maintainAspectRatio:false,
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
                  text: "Total Keys in Keyspace",
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
      </div>
    );
  }
  // }
  // else {
  //   return <div>Loading...</div>;
  // }
}

// export default LineChart;

export default KeyspaceHistoriesChart;
