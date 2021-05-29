import React, { Component } from "react";
import { connect } from "react-redux";
import DatabaseComponent from "./DatabaseComponent.jsx";
import * as actions from "../../action-creators/connections";

const mapStateToProps = (store) => ({
  instanceInfo: store.instanceInfoStore.instanceInfo,
  currInstance: store.currInstanceStore.currInstance,
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

    if (this.props.instanceInfo[this.props.currInstance - 1].databases > 0) {
      for (
        let i = 0;
        i < this.props.instanceInfo[this.props.currInstance - 1].databases;
        i++
      ) {
        dbArray.push(
          <DatabaseComponent
            handleClick={this.props.switchDatabase}
            databaseNum={i}
            key={i}
          />
        );
      }
      return (
        <div className='databaseNavContainer'>
          <div
            id='redisInstance'
            databaseinfo={
              this.props.instanceInfo[this.props.currInstance - 1].instanceId
            }>
            <p>
              {" "}
              <span className='db-host'>Host</span>{" "}
              {this.props.instanceInfo[this.props.currInstance - 1].host}
            </p>
            <p>
              {" "}
              <span className='db-port'>Port</span>{" "}
              {this.props.instanceInfo[this.props.currInstance - 1].port}
            </p>
            <div id='databaseHolder'>{dbArray}</div>
          </div>
        </div>
      );
    } else if (
      this.props.instanceInfo[this.props.currInstance - 1].databases === 0
    ) {
      return <div>loading</div>;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DatabaseNav);
