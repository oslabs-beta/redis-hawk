import React, { Component } from "react";
import GraphHolder from "./GraphHolder.jsx";
import { connect } from "react-redux";
import * as actions from "../../action-creators/connections";

const mapStateToProps = (store) => {
  return {
    currDatabase: store.currDatabaseStore.currDatabase,
    events: store.eventsStore.events,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateCurrentDisplay: (filter, category) =>
    dispatch(actions.updateCurrDisplayActionCreator(filter, category)),
  updateEvents: (instanceId, dbIndex, currIndex) =>
    dispatch(actions.updateEventsActionCreator(instanceId, dbIndex, currIndex)),
});

class GraphComponent extends Component {
  constructor(props) {
    super(props);
    this.setGraphUpdate = this.setGraphUpdate.bind(this);
  }

  componentDidMount() {
    const self = this;
    console.log("props", this.props);
    setInterval(self.setGraphUpdate, 5000);
  }
  setGraphUpdate() {
    console.log("fetching");
    let currIndex = this.props.events[this.props.currDatabase].length - 1;
    this.props.updateEvents(1, this.props.currDatabase, currIndex);
  }

  render() {
    console.log("props in GraphComponent", this.props);
    return (
      <div id='graphsComponentContainer'>
        <GraphHolder
          currDatabase={this.props.currDatabase}
          events={this.props.events}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphComponent);
