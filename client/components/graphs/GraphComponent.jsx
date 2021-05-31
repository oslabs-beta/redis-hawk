import React, { Component } from "react";
import GraphHolder from "./GraphHolder.jsx";
import LineChart from "./LineChart.jsx";
import { connect } from "react-redux";
import * as actions from "../../action-creators/connections";
import * as eventActions from "../../action- creators/eventsConnections";

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
  getTotalEvents: (instanceId, dbIndex, currIndex) =>
    dispatch(
      eventActions.getTotalEventsActionCreator(instanceId, dbIndex, currTotal)
    ),
});

class GraphComponent extends Component {
  constructor(props) {
    super(props);
    this.setGraphUpdate = this.setGraphUpdate.bind(this);
  }

  componentDidMount() {
    const self = this;
    setInterval(self.setGraphUpdate, 60000);
  }
  setGraphUpdate() {
    this.props.getTotalEvents(1, this.props.currDatabase, this.props.currTotal);
  }

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
