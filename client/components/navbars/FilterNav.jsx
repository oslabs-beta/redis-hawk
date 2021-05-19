import React, { Component } from "react";
import { connect } from "react-redux";
import SearchFilter from "./SearchFilter.jsx";
import * as actions from "../../action-creators/connections";

const mapStateToProps = (store) => {
  return {
    keyspaces: store.keyspaceStore.keyspaces,
    events: store.eventsStore.events,
    database: store.currDatabaseStore.currDatabase,
  };
};
const mapDispatchToProps = (dispatch) => ({
  updateEvents: (events) => dispatch(actions.updateEventsActionCreator(events)),
  updateKeyspace: (keyspace) =>
    dispatch(actions.updateKeyspaceActionCreator(keyspace)),
  updateKeyGraph: (keyGraph) =>
    dispatch(actions.updateKeyGraphActionCreator(keyGraph)),
});

class FilterNav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("which page", this.props.whichPage);
    //assign a variable to each search filter option\
    if (this.props.whichPage === "Graph Page") {
      //working on the events graphs
      return (
        <div className='searchFilterContainer'>
          {/* conditional rendering */}
          <SearchFilter id='searchFilter' events={this.props.events} />
          {/* insert onClick */}
          <button
            id='searchButton'
            onClick={(e) => {
              e.preventDefault();
              this.props.updateKeyGraph(1, this.props.database);
            }}
            id='refreshButton'>
            Refresh
          </button>
        </div>
      );
    } else if (this.props.whichPage === "Events Page") {
      return (
        <div className='searchFilterContainer'>
          {/* conditional rendering */}
          <SearchFilter id='searchFilter' events={this.props.events} />
          {/* insert onClick */}
          <button
            id='searchButton'
            onClick={(e) => {
              e.preventDefault();
              this.props.updateEvents(1, this.props.database);
            }}
            id='refreshButton'>
            Refresh
          </button>
        </div>
      );
    } else if (this.props.whichPage === "Keyspace Page") {
      return (
        <div className='searchFilterContainer'>
          {/* conditional rendering */}
          <SearchFilter id='searchFilter' keyspaces={this.props.keyspaces} />
          {/* insert onClick */}
          <button
            id='searchButton'
            onClick={(e) => {
              e.preventDefault();
              this.props.updateKeyspace(1, this.props.database);
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
