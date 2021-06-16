import React, { Component } from "react";
import KeyspaceChartFilter from "./KeyspaceChartFilter.jsx";
import "../styles/graphfilters.scss";

class KeyspaceChartFilterNav extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    // console.log("this.props in KEYSPACECHARTFILTERNAV", this.props);
    return (
      <div className='graph-filter-nav-container'>
        <KeyspaceChartFilter
          id='searchFilter'
          currInstance={this.props.currInstance}
          currDatabase={this.props.currDatabase}
          setInt={this.props.setInt}
          clearInt={this.props.clearInt}
          intervalStart={this.props.intervalStart}
          getInitialFilteredData={this.props.getInitialFilteredData}
          setIntFilter={this.props.setIntFilter}
          resetState={this.props.resetState}
          getMoreData={this.props.getMoreData}
          getInitialData={this.props.getInitialData}
          clearFilterIntID={this.props.clearFilterIntID}
        />
        <div
          className='graph-filter-button-container'
          id='keyspace-graph-filter-buttons-container'>
          <button
            className='toggleInterval'
            id='clear-interval-button'
            onClick={(e) => {
              e.preventDefault();
              if (this.props.intervalStart) {
                this.props.clearInt();
              } else {
                this.props.setInt();
              }
            }}>
            Pause Interval
          </button>
          <button
            className='filter-button'
            id='refreshButton'
            onClick={(e) => {
              e.preventDefault();

              document.getElementById("my-text-field").value = "";
              this.props.clearInt();
              this.props.clearFilterIntID();
              this.props.resetState();
              // this.props.getInitialData();
              this.props.getMoreData();
              this.props.setInt();
            }}>
            Refresh
          </button>
        </div>
      </div>
    );
  }
}

export default KeyspaceChartFilterNav;
