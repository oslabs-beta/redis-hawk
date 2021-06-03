import React, { Component } from "react";
import EventsChartFilter from "./EventsChartFilter.jsx";
import "../styles/graphfilters.scss";

class EventsChartFilterNav extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    // console.log("props in EventsChartFilterNav", this.props);
    return (
      <div className='graph-filter-nav-container'>
        <EventsChartFilter
          id='searchFilter'
          currInstance={this.props.currInstance}
          currDatabase={this.props.currDatabase}
          setInt={this.props.setInt}
          clearInt={this.props.clearInt}
          intervalStart={this.props.intervalStart}
          getInitialFilteredData={this.props.getInitialFilteredData}
          setIntFilter={this.props.setIntFilter}
          resetState={this.props.resetState}
          totalEvents={this.props.totalEvents}
          getMoreData={this.props.getMoreData}
          getInitialData={this.props.getInitialData}
          intervals={this.props.intervals}
          clearFilterIntID={this.props.clearFilterIntID}
          refresh={this.props.refresh}
        />
        <div className='graph-filter-button-container'>
          <button
            className='toggleInterval'
            id='clear-interval-button'
            onClick={(e) => {
              console.log("props.intervalStart", this.props.intervalStart);
              // console.log("intervalId in click", this.props.intervalId);
              if (this.props.intervalStart) {
                this.props.clearInt();
              } else {
                console.log("setting interval");
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
              document.getElementById("standard-secondary").value = "";
              document.getElementById("event-type-filter").value = "";
              this.props.clearInt();
              this.props.clearFilterIntID();
              this.props.resetState();
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

export default EventsChartFilterNav;
