import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchFilter from './SearchFilter.jsx';
import * as actions from '../../action-creators/connections';
import * as keyspaceActions from '../../action-creators/keyspaceConnections';
import * as eventActions from '../../action-creators/eventsConnections';

import '../styles/filternav.scss';

const mapStateToProps = (store) => {
  return {
    keyspace: store.keyspaceStore.keyspace,
    events: store.eventsStore.events,
    keyGraph: store.keyGraphStore.keyGraph,
    currDatabase: store.currDatabaseStore.currDatabase,
    currPage: store.currPageStore.currPage,
    currDisplay: store.currDisplayStore.currDisplay,
    currInstance: store.currInstanceStore.currInstance,
    pageSize: store.dataPageStore.pageSize,
    pageNum: store.dataPageStore.pageNum,
  };
};
const mapDispatchToProps = (dispatch) => ({
  refreshEvents: (currInstance, currDatabase, pageSize, pageNum, refreshData) =>
    dispatch(
      eventActions.refreshEventsActionCreator(
        currInstance,
        currDatabase,
        pageSize,
        pageNum,
        refreshData
      )
    ),
  changeEventsPage: (instanceId, dbIndex, queryOptions) =>
    dispatch(
      eventActions.changeEventsPageActionCreator(
        instanceId,
        dbIndex,
        queryOptions
      )
    ),
  changeKeyspacePage: (instanceId, dbIndex, queryOptions) =>
    dispatch(
      keyspaceActions.changeKeyspacePageActionCreator(
        instanceId,
        dbIndex,
        queryOptions
      )
    ),
  refreshKeyspace: (instanceId, dbIndex, pageSize, pageNum, refreshScan) =>
    dispatch(
      keyspaceActions.refreshKeyspaceActionCreator(
        instanceId,
        dbIndex,
        pageSize,
        pageNum,
        refreshScan
      )
    ),
  updateKeyGraph: (keyGraph) =>
    dispatch(actions.updateKeyGraphActionCreator(keyGraph)),
  updateCurrDisplay: (object) =>
    dispatch(actions.updateCurrDisplayActionCreator(object)),
  updatePageNum: (pageNum) => {
    actions.updatePageActionCreator(pageNum);
  },
});

class FilterNav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.currPage === 'graphs') {
      return <div className='filterNavContainer'></div>;
    } else if (this.props.currPage === 'events') {
      return (
        <div className='filterNavContainer'>
          <SearchFilter
            id='searchFilter'
            events={this.props.events[this.props.currDatabase]}
            currPage={this.props.currPage}
            updateCurrDisplay={this.props.updateCurrDisplay}
            currDisplay={this.props.currDisplay}
            currDatabase={this.props.currDatabase}
            currInstance={this.props.currInstance}
            changeEventsPage={this.props.changeEventsPage}
            pageSize={this.props.pageSize}
            pageNum={this.props.pageNum}
          />

          <button
            className='filter-button'
            id='searchButton'
            onClick={(e) => {
              e.preventDefault();
              console.log(
                'currInstance',
                this.props.currInstance,
                'currDatabase',
                this.props.currDatabase
              );
              //pageNum is always going to be 1 on refresh and refreshScan is going to be 1
              this.props.refreshEvents(
                this.props.currInstance,
                this.props.currDatabase,
                this.props.pageSize,
                1,
                1
              );
              //need to have current graph updated to page 1 -- re render?
              this.props.updatePageNum(1);
              document.getElementById('standard-secondary').value = '';
              document.getElementById('secondary-secondary').value = '';
            }}
            id='refreshButton'
          >
            Refresh
          </button>
        </div>
      );

      //KEYSPACE PAGE : COMPLETED
    } else {
      return (
        <div className='filterNavContainer'>
          <SearchFilter
            id='searchFilter'
            keyspace={this.props.keyspace[this.props.currDatabase]}
            currPage={this.props.currPage}
            updateCurrDisplay={this.props.updateCurrDisplay}
            pageNum={this.props.pageNum}
            pageSize={this.props.pageSize}
            changeKeyspacePage={this.props.changeKeyspacePage}
            currDisplay={this.props.currDisplay}
            currDatabase={this.props.currDatabase}
            currInstance={this.props.currInstance}
          />
          <button
            className='filter-button'
            id='searchButton'
            onClick={(e) => {
              e.preventDefault();
              console.log(
                'currInstance',
                this.props.currInstance,
                'currDatabase',
                this.props.currDatabase
              );
              //pageNum is always going to be 1 on refresh and refreshScan is going to be 1
              this.props.refreshKeyspace(
                this.props.currInstance,
                this.props.currDatabase,
                this.props.pageSize,
                1,
                1
              );
              //need to have current graph updated to page 1 -- re render?
              this.props.updatePageNum(1);
              document.getElementById('standard-secondary').value = '';
            }}
            id='refreshButton'
          >
            Refresh
          </button>
        </div>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterNav);
