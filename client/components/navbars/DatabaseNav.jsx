import React, { Component } from "react";
import { connect } from "react-redux";
import DatabaseComponent from "./DatabaseComponent.jsx";
import * as actions from "../../action-creators/connections";

const mapStateToProps = (store) => ({
  databaseInfo: store.databaseInfoStore.databaseInfo,
});

const mapDispatchToProps = (dispatch) => ({
  switchDatabase: (database) =>
    dispatch(actions.switchDatabaseActionCreator(database)),
});

class DatabaseNav extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const dbArray = [];
    if (this.props.databaseInfo.dataNum) {
      for (let i = 0; i < this.props.databaseInfo.dataNum; i++) {
        dbArray.push(
          <DatabaseComponent
            handleClick={this.props.switchDatabase}
            databaseNum={i}
            key={i}
          />
        );
      }
    }

    return (
      <div className='databaseNavContainer'>
        <div id='redisInstance' databaseinfo={this.props.databaseInfo}>
          <p>
            {" "}
            <span className='db-host'>Host</span> {this.props.databaseInfo.host}
          </p>
          <p>
            {" "}
            <span className='db-port'>Port</span> {this.props.databaseInfo.port}
          </p>
          <div id='databaseHolder'>{dbArray}</div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DatabaseNav);
