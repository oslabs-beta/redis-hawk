import React, { Component } from 'react';
import { connect } from 'react-redux';
import DatabaseComponent from './DatabaseComponent.jsx';
import * as actions from '../../action-creators/connections';

const mapStateToProps = (store) => ({
  databaseInfo: store.databaseInfoStore.databaseInfo,
  // currInstance: store.currInstance.currInstance,
  currDatabase: store.currDatabaseStore.currDatabase,
});
// dispatchToProps: current instance and current database

const mapDispatchToProps = (dispatch) => ({
  //send this down
  switchDatabase: (database) =>
    dispatch(actions.switchDatabaseActionCreator(database)),
});

class DatabaseNav extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const dbArray = [];
    // console.log('DatabaseNav props', this.props);
    if (this.props.databaseInfo.dataNum) {
      for (let i = 0; i < this.props.databaseInfo.dataNum; i++) {
        dbArray.push(
          <DatabaseComponent
            handleClick={this.props.switchDatabase}
            databaseNum={i}
          />
        );
      }
    }

    return (
      <div id='databaseNavContainer'>
        <div id='redisInstance' databaseinfo={this.props.databaseInfo}>
          Host: {this.props.databaseInfo.host} Port:{' '}
          {this.props.databaseInfo.port}
        </div>
        <div id='databaseHolder'>{dbArray}</div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DatabaseNav);
