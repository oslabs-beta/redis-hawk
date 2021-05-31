import React, { Component } from 'react';
import { connect } from 'react-redux';
import KeyspaceTable from './KeyspaceTable.jsx';
import * as actions from '../../action-creators/connections';
import * as keyspaceActions from '../../action-creators/keyspaceConnections';

//withRouter??? -- for props.history -- stretch??

const mapStateToProps = (store) => {
  return {
    currInstance: store.currInstanceStore.currInstance,
    currDatabase: store.currDatabaseStore.currDatabase,
    keyspace: store.keyspaceStore.keyspace,
    currDisplay: store.currDisplayStore.currDisplay,
    pageSize: store.dataPageStore.pageSize,
    pageNum: store.dataPageStore.pageNum,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateEvents: (events, currData, currIndex) =>
    dispatch(actions.updateEventsActionCreator(events, currData, currIndex)),
  updateKeyGraph: (keyGraph) =>
    dispatch(actions.updateKeyGraphActionCreator(keyGraph)),
  updateCurrDisplay: (filter, category) =>
    dispatch(actions.updateCurrDisplayActionCreator(filter, category)),
  updatePageNum: (pageNum) => {
    actions.updatePageActionCreator(pageNum);
  },
  changeKeyspacePage: (instanceId, dbIndex, queryOptions) =>
    dispatch(
      keyspaceActions.changeKeyspacePageActionCreator(
        instanceId,
        dbIndex,
        queryOptions
      )
    ),
  updatePageSize: (pageSize) => {
    actions.updatePageSizeActionCreator(pageSize);
  },
});

class KeyspaceComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // console.log('all the props in keyspace component', this.props);
    return (
      <div
        id='keyspaceComponentContainer'
        className='KeyspaceComponent-Container'
      >
        <KeyspaceTable
          currDatabase={this.props.currDatabase}
          keyspace={this.props.keyspace}
          currDisplay={this.props.currDisplay}
          currInstance={this.props.currInstance}
          updatePageSize={this.props.updatePageSize}
          updatePageNum={this.props.updatePageNum}
          changeKeyspacePage={this.props.changeKeyspacePage}
          pageNum={this.props.pageNum}
          pageSize={this.props.pageSize}
          myCount={
            this.props.keyspace[this.props.currInstance - 1].keyspaces[
              this.props.currDatabase
            ].keyTotal
          }
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(KeyspaceComponent);
