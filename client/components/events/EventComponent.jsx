import React, { Component } from "react";
import { connect } from "react-redux";

import EventTable from "./EventTable.jsx";

const mapStateToProps = (store) => {
  return {
    currInstance: store.currInstanceStore.currInstance,
    currDatabase: store.currDatabaseStore.currDatabase,
    events: store.eventsStore.events,
    currDisplay: store.currDisplayStore.currDisplay,
  };
};

class EventComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("props in EventComponent", this.props);
    return (
      <div id='eventComponentContainer' className='EventComponent-Container'>
        <EventTable
          currDisplay={this.props.currDisplay}
          currDatabase={this.props.currDatabase}
          events={this.props.events}
          currInstance={this.props.currInstance}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(EventComponent);
