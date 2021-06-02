import React, { Component } from "react";
// import { connect } from "react-redux";
// import EventsChartSearchFilter from "./EventsChartSearchFilter.jsx";
// import * as actions from "../../action-creators/connections";
// import * as keyspaceActions from "../../action-creators/keyspaceConnections";
// import * as eventActions from "../../action-creators/eventsConnections";
import EventsChartSearchFilter from "./EventsChartSearchFilter.jsx"
import "../styles/filternav.scss";

class EventsChartFilterNav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='filterNavContainer'>
        <EventsChartSearchFilter
          id='searchFilter'
          events={this.props.events}
        />
        <button
          className='toggleInterval'
          id='clearFilterButton'
          onClick={(e) => {
            e.preventDefault();
            if (this.props.intervalStart){
            this.props.clearInt;

            }
            else {
              this.props.setInt()
            }
          }}>
          Stop/Start Update
        </button>
        <button
          className='filter-button'
          id='refreshButton'
          onClick={(e) => {
            e.preventDefault();
            this.props.clearInt();
            this.props.getMoreData();
            this.props.setInt();}}>
          Refresh
        </button>
      </div>
    );
  }
}

export default EventsChartFilterNav;
