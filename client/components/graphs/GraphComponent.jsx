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
    console.log("this.props after getEvents", this.props);

    // setInterval(self.getEvents, 60000);
  }
  // setGraphUpdate() {
  //   this.props.getTotalEvents(1, this.props.currDatabase, this.props.currTotal);
  // }

  render() {
    return (
      <div id='graphsComponentContainer' className='GraphComponent-Container'>
        <LineChart
          currInstance={this.props.currInstance}
          currDatabase={this.props.currDatabase}
          eventTotals={this.props.eventsTotals}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphComponent);
