import React, { Component } from "react";
import { connect } from "react-redux";
import KeyEventComponent from "./KeyEventComponent.jsx";
import EventsPagination from "./EventsPagination.jsx";

const mapStateToProps = (store) => {
  return {
    database: store.currDatabaseStore.database,
    events: store.eventsStore.events,
  };
};

class EventComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('In eventComponent')
    let listOfEvents;
    if (this.props.events) {
      listOfEvents = this.props.events.map((obj, idx) => {
        <KeyEventComponent events={obj[idx]} database={this.props.database} />;
      });
    }

    return (
      <div id='eventComponentContainer'>
        <div id='KeyEventsDiv'>
          <ul id='keyEventList'>{listOfEvents}</ul>
        </div>
        {/* <EventsPagination /> */}
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(EventComponent);
