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
    this.state = {
      wasCalled: false,
    };
    this.setGraphUpdate = this.setGraphUpdate.bind(this);
  }

  componentDidMount() {
    const params = { timeInterval: 20000 };
    const eventParams = { eventTotal: this.props.totalEvents.eventTally };
    console.log("eventParams", eventParams);
    const self = this;
    // this.props.getEvents(
    //   this.props.currInstance,
    //   this.props.currDatabase,
    //   params
    // );
    // this.setState({
    //   wasCalled: true,
    // });
    // if (this.state.wasCalled === true) {
    //   setInterval(function () {
    //     self.setGraphUpdate(
    //       this.props.currInstance,
    //       this.props.currDatabase,
    //       eventParams
    //     );
    //   }, 3000);
    // }
    // // console.log("this.props", this.props.totalEvents.eventTally);
    // setInterval(self.setGraphUpdate(this.props.currInstance, this.props.currDatabase, eventParams), params.timeInterval);
  }

  setGraphUpdate(currInstance, currDB, params) {
    this.props.getEvents(currInstance, currDB, params);
  }

  render() {
    // console.log("this.props in render of graph comoponent", this.props);
    console.log("totalEvents", this.props.totalEvents);
    if (this.props.totalEvents) {
      return (
        <div id='graphsComponentContainer' className='GraphComponent-Container'>
          <LineChart
            getEvents={this.props.getEvents}
            currInstance={this.props.currInstance}
            currDatabase={this.props.currDatabase}
            totalEvents={this.props.totalEvents}
          />
        </div>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphComponent);
