import React, { Component } from 'react';
import { connect } from 'react-redux';
import KeyEventComponent from './KeyEventComponent.jsx';
import EventTable from './EventTable.jsx';

const mapStateToProps = (store) => {
  return {
    database: store.currDatabaseStore.currDatabase,
    events: store.eventsStore.events,
    currDisplay: store.currDisplayStore.currDisplay,
  };
};

class EventComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('In eventComponent', this.props.database);
    let listOfEvents;
    if (this.props.events) {
      listOfEvents = this.props.events.map((obj, idx) => {
        <KeyEventComponent events={obj[idx]} database={this.props.database} />;
      });
    }

    return (
      <div id='eventComponentContainer'>
        <EventTable
          currDisplay={this.props.currDisplay}
          currDatabase={this.props.database}
          events={this.props.events}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(EventComponent);
