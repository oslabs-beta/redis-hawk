import React, { Component } from "react";
import { connect } from "react-redux";
import DatabaseComponent from './DatabaseComponent.jsx'

mapStateToProps = (store) => {
  databaseInfo: store.databaseInfo;
};
// dispatchToProps: current instance and current database

class DatabaseNav extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const dbArray = [];
    for (let i = 0; i < this.props.databaseInfo.dataNum; i++) {
      <DatabaseComponent databaseNum={i} />
    }
    return (
      <div id="DatabaseNavContainer">
        <div id="redisInstance" databaseInfo={this.props.databaseInfo} >
        </div>
        <div id="databaseHolder" >
          { dbArray }
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DatabaseNav);
