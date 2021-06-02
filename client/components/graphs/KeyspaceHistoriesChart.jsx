import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import Hammer from "hammerjs";
import Chart from "chart.js/auto";
import KeyspaceChartFilterNav from "./KeyspaceChartFilterNav.jsx";

class KeyspaceHistoriesChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyCount: 0,
      filterBy: { eventTypes: "", keynameFilter: "" },
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
  }

  componentDidMount() {
    console.log("in keyspaceHistories chart");
    Chart.register(zoomPlugin);
    this.getInitialData();
    setTimeout(setInterval(this.getMoreData, 20000), 10000);
  }

  // if you want to test at a smaller interval, run npm run cp after changing
  //number to server/configs/config.json
  getInitialData() {
    const URI = `api/v2/keyspaces/histories/${this.props.currInstance}/${this.props.currDatabase}/`;
    console.log("URI in fetch", URI);
    console.log("this.state before fetch in initialData", this.state);
    fetch(URI)
      .then((res) => res.json())
      .then((response) => {
        console.log("response in fetch of KeyspaceChart", response);
        const allHistories = response;
        console.log("this.state.data before assign", this.state.data);
        const dataCopy = Object.assign({}, this.state.data);
        console.log("dataCopy before loop", dataCopy);
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
        console.log("dataCopy", dataCopy);
        this.setState({
          ...this.state,
          historyCount: allHistories.historyCount,
          data: dataCopy,
        });
      });
  }

  getMoreData() {
    const URI = `api/v2/keyspaces/histories/${this.props.currInstance}/${this.props.currDatabase}/?historyCount=${this.state.historyCount}`;
    console.log("URI in fetch", URI);
    console.log("this.state before fetch in getMoreData", this.state);
    fetch(URI)
      .then((res) => res.json())
      .then((response) => {
        console.log("response in GETMOREDATA fetch of LineChartBeta", response);
        console.log(
          "this.state.labels in get more events before reassignment",
          this.state.data.labels
        );
        const historyCount = response.historyCount;
        const keyCount = response.histories[0].keyCount;
        console.log("this.state.data before assign", this.state.data);
        const dataCopy = Object.assign({}, this.state.data);
        const time = new Date(response.histories[0].timestamp)
          .toString("MMddd")
          .slice(16, 24);
        console.log("time var in keyspaceHisto");
        dataCopy.labels.push(time);
        dataCopy.datasets[0].data.push(keyCount);

        this.setState({
          ...this.state,
          historyCount: historyCount,
          data: dataCopy,
        });
      });
  }
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
  resetState() {
    // const newDatasets= [];
    // const newLabels = [];
    const newState = Object.assign({}, this.state);
    newState.labels = [];
    newState.data.datasets[0].data = [];
    this.setState({
      newState,
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
                  text: "Total Keys in Keyspace",
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

export default KeyspaceHistoriesChart;
