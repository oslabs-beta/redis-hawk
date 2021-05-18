import React, { Component } from 'react';
import { connect } from 'react-redux';
import DatabaseComponent from './DatabaseComponent.jsx';

const mapStateToProps = (store) => ({
  databaseInfo: store.databaseInfoStore.databaseInfo,
  // currInstance: store.currInstance.currInstance,
  currDatabase: store.currDatabaseStore.currDatabase,
});
// dispatchToProps: current instance and current database

class DatabaseNav extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const dbArray = [];
    console.log('DatabaseNav props', this.props);
    if (this.props.databaseInfo.dataNum) {
      for (let i = 0; i < this.props.databaseInfo.dataNum; i++) {
        <DatabaseComponent databaseNum={i} />;
      }
    }

    return (
      <div id='DatabaseNavContainer'>
        <div id='redisInstance' databaseInfo={this.props.databaseInfo}></div>
        <div id='databaseHolder'>{dbArray}</div>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(DatabaseNav);
