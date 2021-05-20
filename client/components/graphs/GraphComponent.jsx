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
});

class GraphComponent extends Component {
  constructor(props) {
    super(props);
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
