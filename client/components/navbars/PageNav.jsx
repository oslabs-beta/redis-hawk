import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import * as actions from '../../action-creators/connections';
import * as keyspaceActions from '../../action-creators/keyspaceConnections';

import { connect } from 'react-redux';

const mapStateToProps = (store) => {
  return {
    currPage: store.currPageStore.currPage,
    currInstance: store.currInstanceStore.currInstance,
    currDatabase: store.currDatabaseStore.currDatabase,
    pageSize: store.dataPageStore.pageSize,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updatePage: (page) => dispatch(actions.updatePageActionCreator(page)),
  updatePageNum: (num) => dispatch(actions.updatePageNumActionCreator(num)),
  updateCurrDisplay: (object) =>
    dispatch(actions.updateCurrDisplayActionCreator(object)),
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
});

const PageNav = (props) => {
  function handleKeyspaceClick() {
    console.log('this.props', props);
    props.updateCurrDisplay({ filterType: 'keyName', filterValue: '' });
    props.updateCurrDisplay({ filterType: 'keyType', filterValue: '' });
    props.updatePage('keyspace');
    props.refreshKeyspace(
      props.currInstance,
      props.currDatabase,
      props.pageSize,
      1,
      1
    );
    //need to have current graph updated to page 1 -- re render?
    props.updatePageNum(1);
  }
  return (
    <div id='pageNavContainer'>
      <Link to='/' style={{ textDecoration: 'none' }}>
        <div
          id='keyspaceLink'
          className={
            props.currPage === 'keyspace'
              ? 'selected-page-toggle'
              : 'page-toggle'
          }
          onClick={handleKeyspaceClick}
        >
          Keyspace
        </div>
      </Link>
      <Link to='/events' style={{ textDecoration: 'none' }}>
        <div
          id='eventsLink'
          className={
            props.currPage === 'events' ? 'selected-page-toggle' : 'page-toggle'
          }
          onClick={() => {
            props.updatePage('events');
          }}
        >
          Events
        </div>
      </Link>
      <Link to='/graphs' style={{ textDecoration: 'none' }}>
        <div
          id='graphsLink'
          className={
            props.currPage === 'graphs' ? 'selected-page-toggle' : 'page-toggle'
          }
          onClick={() => {
            props.updatePage('graphs');
          }}
        >
          Graphs
        </div>
      </Link>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PageNav);
