import React, { Component } from 'react';
import { connect } from 'react-redux';

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
    return (
      <div id='eventComponentContainer' className="EventComponent-Container">
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
