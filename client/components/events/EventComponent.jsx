// import React, { Component } from "react";
// import { connect } from "react-redux";

// import EventTable from "./EventTable.jsx";

// const mapStateToProps = (store) => {
//   return {
//     currInstance: store.currInstanceStore.currInstance,
//     currDatabase: store.currDatabaseStore.currDatabase,
//     events: store.eventsStore.events,
//     currDisplay: store.currDisplayStore.currDisplay,
//   };
// };

// class EventComponent extends Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     console.log("props in EventComponent", this.props);
//     return (
//       <div id='eventComponentContainer' className='EventComponent-Container'>
//         <EventTable
//           currDisplay={this.props.currDisplay}
//           currDatabase={this.props.currDatabase}
//           events={this.props.events}
//           currInstance={this.props.currInstance}
//         />
//       </div>
//     );
//   }
// }

// export default connect(mapStateToProps, null)(EventComponent);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import EventTable from './EventTable.jsx';
import * as actions from '../../action-creators/connections';
import * as eventActions from '../../action-creators/eventsConnections';

//withRouter??? -- for props.history -- stretch??

const mapStateToProps = (store) => {
  return {
    currInstance: store.currInstanceStore.currInstance,
    currDatabase: store.currDatabaseStore.currDatabase,
    events: store.eventsStore.events,
    currDisplay: store.currDisplayStore.currDisplay,
    pageSize: store.dataPageStore.pageSize,
    pageNum: store.dataPageStore.pageNum,
  };
};
const mapDispatchToProps = (dispatch) => ({
  updatePageSize: (pageSize) =>
    dispatch(actions.updatePageSizeActionCreator(pageSize)),
  updatePageNum: (pageNum) =>
    dispatch(actions.updatePageNumActionCreator(pageNum)),
  changeEventsPage: (instanceId, dbIndex, queryOptions) =>
    dispatch(
      eventActions.changeEventsPageActionCreator(
        instanceId,
        dbIndex,
        queryOptions
      )
    ),
});

class EventComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('all the props in event component', this.props);

    return (
      <div id='eventComponentContainer' className='EventComponent-Container'>
        <EventTable
          currInstance={this.props.currInstance}
          currDatabase={this.props.currDatabase}
          events={this.props.events}
          currDisplay={this.props.currDisplay}
          updatePageSize={this.props.updatePageSize}
          updatePageNum={this.props.updatePageNum}
          changeEventsPage={this.props.changeEventsPage}
          pageNum={this.props.pageNum}
          pageSize={this.props.pageSize}
          myCount={
            this.props.events[this.props.currInstance - 1].keyspaces[
              this.props.currDatabase
            ].eventTotal
          }
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventComponent);
