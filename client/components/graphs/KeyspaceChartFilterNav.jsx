import React, { Component } from "react";
import KeyspaceChartFilter from "./KeyspaceChartFilter.jsx";
import "../styles/graphfilters.scss";

class KeyspaceChartFilterNav extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log("this.props in EventsChartFilter", this.props);
    return (
      <div className='graph-filter-nav-container'>
        <KeyspaceChartFilter
          id='searchFilter'
          currInstance={this.props.currInstance}
          currDatabase={this.props.currDatabase}
          filterBy={this.props.filterBy}
          setInt={this.props.setInt}
          clearInt={this.props.clearInt}
        />
        <div 
          className='graph-filter-button-container'
          id='keyspace-graph-filter-buttons-container' 
        >
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

export default KeyspaceChartFilterNav;
