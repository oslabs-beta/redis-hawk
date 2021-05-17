import React, { Component } from 'react';
import { connect } from 'react-redux';
import KeyEventComponent from './KeyEventComponent.jsx';
import PaginationComponent from '../navbars/PaginationComponent.jsx';

const mapStateToProps = (store) => {
  return {
    database: store.database,
    events: store.events,
  };
};

class EventComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const listOfEvents = this.props.events.map((obj) => {
      <KeyEventComponent
        events={obj.props.events}
        database={obj.props.database}
      />;
    });
    return (
      <div id="eventComponentContainer">
        <div id='KeyEventsDiv'>
          <ul id='keyEventList'>{listOfEVents}</ul>
        </div>
        <PaginationComponent />
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(EventComponent);
