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
    data: store.totalEventsStore.data,
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
      params: { timeInterval: 20000 },
      eventParams: { eventTotal: this.props.eventTotal },
    };
    this.setGraphUpdate = this.setGraphUpdate.bind(this);
  }
  componentDidMount() {
    console.log("in graphComponent CDMount");
    console.log("state event paraws", this.state.eventParams);
    const self = this;
    // if (this.state.wasCalled === true) {
    //   setInterval(
    //     self.setGraphUpdate(
    //       this.props.currInstance,
    //       this.props.currDatabase,
    //       this.state.eventParams
    //     ),
    //     3000
    //   );
    // } else {
    this.getInitialData(
      this.props.currInstance,
      this.props.currDatabase,
      this.state.params
    );
    // }
    setInterval(this.setGraphUpdate, 5000);
  }
  getInitialData(currInstance, currDB, params) {
    this.props.getEvents(currInstance, currDB, params);
    this.setState({
      wasCalled: true,
    });
    console.log("this.state.wasCalled", this.state.wasCalled);
  }
  setGraphUpdate() {
      console.log('this.props.eventTotal',this.props.totalEvents)

    return this.props.getEvents(
      this.props.currInstance,
      this.props.currDatabase,
      // this.state.eventParams
      { eventTotal: this.props.totalEvents }
    );
  }

  render() {
    console.log("props in graphComponent", this.props);

    // if (this.props.data) {
    return (
      <div id='graphsComponentContainer' className='GraphComponent-Container'>
        <LineChart
          getEvents={this.props.getEvents}
          currInstance={this.props.currInstance}
          currDatabase={this.props.currDatabase}
          // totalEvents={this.props.totalEvents}
          data={this.props.data}
        />
      </div>
    );
    // }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphComponent);
