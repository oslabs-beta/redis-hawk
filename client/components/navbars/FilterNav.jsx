import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchFilter from './SearchFilter.jsx'

const mapStateToProps = (store) => {
  return {
    keyspaces: store.keyspaces,
    events: store.events,
  };
};

class FilterNav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    //assign a variable to each search filter option\
    if (this.props.whichPage === 'Graph Page') {
      //working on the events graphs
      return(
        <div className="searchFilterContainer">
          {/* conditional rendering */}
          <SearchFilter id='searchFilter' events={this.props.events}/>
          <button id="refreshButton" onclick={}>Refresh</button>
        </div>
      )
    }
    else if(this.props.whichPage === 'Events Page') {
      return(
        <div className="searchFilterContainer">
          {/* conditional rendering */}
          <SearchFilter id='searchFilter' events={this.props.events}/>
          <button id="refreshButton" onclick={}>Refresh</button>
        </div>
      )
    }else {
      return(
        <div className="searchFilterContainer">
          {/* conditional rendering */}
          <SearchFilter id='searchFilter' keyspaces={this.props.keyspaces}/>
          <button id="refreshButton" onclick={}>Refresh</button>
        </div>
      )
    }
  }
}

export default connect(mapStateToProps, null)(FilterNav);
