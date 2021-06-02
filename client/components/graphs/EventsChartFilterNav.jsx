import React, { Component } from "react";
// import { connect } from "react-redux";
// import EventsChartSearchFilter from "./EventsChartSearchFilter.jsx";
// import * as actions from "../../action-creators/connections";
// import * as keyspaceActions from "../../action-creators/keyspaceConnections";
// import * as eventActions from "../../action-creators/eventsConnections";
import EventsChartFilter from "./EventsChartFilter.jsx";
import "../styles/filternav.scss";

class EventsChartFilterNav extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log("this.props.intervalStart", this.props.intervalStart);
    return (
      <div className='filterNavContainer'>
        <EventsChartFilter
          id='searchFilter'
          currInstance={this.props.currInstance}
          currDatabase={this.props.currDatabase}
          filterBy={this.props.filterBy}
          setInt={this.props.setInt}
          clearInt={this.props.clearInt}
        />
        <button
          className='toggleInterval'
          id='clearFilterButton'
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
    );
  }
}

export default EventsChartFilterNav;
