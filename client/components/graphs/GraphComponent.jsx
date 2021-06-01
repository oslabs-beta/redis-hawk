import React, { Component } from "react";
import GraphHolder from "./GraphHolder.jsx";
import LineChart from "./LineChart.jsx";
import { connect } from "react-redux";
import * as actions from "../../action-creators/connections";
import * as eventActions from "../../action-creators/eventsConnections";

const mapStateToProps = (store) => {
  return {
    currInstance: store.currInstanceStore.currInstance,
    currDatabase: store.currDatabaseStore.currDatabase,
    totalEvents: store.totalEventsStore.totalEvents,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateCurrentDisplay: (filter, category) =>
    dispatch(actions.updateCurrDisplayActionCreator(filter, category)),
  getEvents: (instanceId, dbIndex, queryParams) =>
    dispatch(
      eventActions.getTotalEventsActionCreator(instanceId, dbIndex, queryParams)
    ),
});

class GraphComponent extends Component {
  constructor(props) {
    super(props);
    // this.setGraphUpdate = this.setGraphUpdate.bind(this);
  }

  componentDidMount() {
    const params = { timeInterval: 10000 };
    
    const self = this;
    self.props.getEvents(
      this.props.currInstance,
      this.props.currDatabase,
      params
    );
    console.log('this.props', this.props.totalEvents.eventTally)
  }
  // setGraphUpdate() {
  //   this.props.getTotalEvents(1, this.props.currDatabase, this.props.currTotal);
  // }

  render() {
    // console.log("this.props in render of graph comoponent", this.props);
    return (
      <div id='graphsComponentContainer' className='GraphComponent-Container'>
        <LineChart
          currInstance={this.props.currInstance}
          currDatabase={this.props.currDatabase}
          totalEvents={this.props.totalEvents}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphComponent);
