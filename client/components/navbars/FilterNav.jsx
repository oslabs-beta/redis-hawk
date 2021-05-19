import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchFilter from './SearchFilter.jsx';

const mapStateToProps = (store) => {
  return {
    keyspaces: store.keyspaceStore.keyspaces,
    events: store.eventsStore.events,
    database: store.currDatabaseStore.currDatabase
  };
};
const mapDispatchToProps = (dispatch) => ({
  updateEvents: (events) => dispatch(actions.updateEventsActionCreator(events)),
  updateKeyspace: (keyspace) => dispatch(actions.updateKeyspaceActionCreator(keyspace)),
  updateKeyGraph: (keyGraph) => dispatch(actions.updateKeyGraphActionCreator(keyGraph))
});

class FilterNav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    //assign a variable to each search filter option\
    if (this.props.whichPage === 'Graph Page') {
      //working on the events graphs
      return (
        <div className='searchFilterContainer'>
          {/* conditional rendering */}
          <SearchFilter id='searchFilter' events={this.props.events} />
          {/* insert onClick */}
          <button onClick={this.props.updateKeyGraph} id='refreshButton'>Refresh</button>
        </div>
      );
    } else if (this.props.whichPage === 'Events Page') {
      return (
        <div className='searchFilterContainer'>
          {/* conditional rendering */}
          <SearchFilter id='searchFilter' events={this.props.events} />
          {/* insert onClick */}
          <button onClick={this.props.updateEvents}id='refreshButton'>Refresh</button>
        </div>
      );
    } else {
      return (
        <div className='searchFilterContainer'>
          {/* conditional rendering */}
          <SearchFilter id='searchFilter' keyspaces={this.props.keyspaces} />
          {/* insert onClick */}
          <button onClick={this.props.updateKeyspace} id='refreshButton'>Refresh</button>
        </div>
      );
    }
  }
}

export default connect(mapStateToProps, null)(FilterNav);
