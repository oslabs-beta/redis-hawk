import React, { Component } from "react";
import { connect } from "react-redux";
import SearchFilter from "./SearchFilter.jsx";
import * as actions from "../../action-creators/connections";

const mapStateToProps = (store) => {
  return {
    keyspace: store.keyspaceStore.keyspace,
    events: store.eventsStore.events,
    keyGraph: store.keyGraphStore.keyGraph,
    currDatabase: store.currDatabaseStore.currDatabase,
    currPage: store.currPageStore.currPage,
    currDisplay: store.currDisplayStore.currDisplay,
  };
};
const mapDispatchToProps = (dispatch) => ({
  updateEvents: (events, currData, currIndex) =>
    dispatch(actions.updateEventsActionCreator(events, currData, currIndex)),
  updateKeyspace: (keyspace) =>
    dispatch(actions.updateKeyspaceActionCreator(keyspace)),
  updateKeyGraph: (keyGraph) =>
    dispatch(actions.updateKeyGraphActionCreator(keyGraph)),
  updateCurrentDisplay: (filter, category) =>
    dispatch(actions.updateCurrDisplayActionCreator(filter, category)),
});

class FilterNav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    //assign a variable to each search filter option\
    if (this.props.currPage === "graphs") {
      //working on the events graphs

      // have filters for events graph:
        // adjust time range (inputs with buttons for incrementing?)
        // filter by key name, filter by event 
      return (
        <div className='filterNavContainer'>
          {/* conditional rendering */}
          <SearchFilter
            id='searchFilter'
            events={this.props.events[this.props.currDatabase]}
          />
          {/* insert onClick */}
          <button
            className='filter-button'
            id='clearFilterButton'
            onClick={(e) => {
              e.preventDefault();
              this.props.updateCurrentDisplay("", "");
            }}>
            Clear Filter
          </button>
          <button
            className='filter-button'
            id='refreshButton'
            onClick={(e) => {
              e.preventDefault();
              let currLength =
                this.props.events[this.props.currDatabase].length - 1;
              console.log("current length of events", currLength);
              this.props.updateEvents(1, this.props.currDatabase, currLength);
            }}>
            Refresh
          </button>
        </div>
      );
    } else if (this.props.currPage === "events") {
      return (
        <div className='filterNavContainer'>
          {/* conditional rendering */}
          <SearchFilter
            id='searchFilter'
            events={this.props.events[this.props.currDatabase]}
          />
          {/* insert onClick */}
          <button
            className='filter-button'
            id='clearFilterButton'
            onClick={(e) => {
              e.preventDefault();
              this.props.updateCurrentDisplay("", "");
            }}>
            Clear Filter
          </button>
          <button
            className='filter-button'
            id='searchButton'
            onClick={(e) => {
              e.preventDefault();
              let currLength =
                this.props.events[this.props.currDatabase].length - 1;
              console.log("current length of events", currLength);
              this.props.updateEvents(1, this.props.currDatabase, currLength);
            }}
            id='refreshButton'>
            Refresh
          </button>
        </div>
      );
    } else {
      return (
        <div className='filterNavContainer'>
          <SearchFilter
            id='searchFilter'
            keyspace={this.props.keyspace[this.props.currDatabase]}
          />
          {/* insert onClick */}
          <button
            className='filter-button'
            id='clearFilterButton'
            onClick={(e) => {
              e.preventDefault();
              this.props.updateCurrentDisplay("", "");
            }}>
            Clear Filter
          </button>
          <button
            className='filter-button'
            id='searchButton'
            onClick={(e) => {
              e.preventDefault();
              this.props.updateKeyspace(1, this.props.currDatabase);
            }}
            id='refreshButton'>
            Refresh
          </button>
        </div>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterNav);
