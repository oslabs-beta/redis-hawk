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
        />
        <div className='graph-filter-button-container'>
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
              this.props.clearInt();
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
