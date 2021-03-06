import React, { Component } from "react";
import { connect } from "react-redux";
import InstanceComponent from "./InstanceComponent.jsx";
import DatabaseSelector from "./DatabaseSelector.jsx";
import * as actions from "../../action-creators/connections";

import '../styles/instances.scss';

const mapStateToProps = (store) => ({
  instanceInfo: store.instanceInfoStore.instanceInfo,
  currInstance: store.currInstanceStore.currInstance,
  currDatabase: store.currDatabaseStore.currDatabase
});

const mapDispatchToProps = (dispatch) => ({
  switchInstance: (instance) => {
    dispatch(actions.switchInstanceActionCreator(instance));

    //When switching instances, automatically flip to db0
    dispatch(actions.switchDatabaseActionCreator(0)); 
  },
  switchDatabase: (database) => {
    dispatch(actions.switchDatabaseActionCreator(database));
  }
});

class InstanceNav extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    const instances = [];
    this.props.instanceInfo.forEach((instance, idx) => {

      //If instance is currently selected
      //Pass down a DatabaseSelector component
      let databases, className;
      if (instance.instanceId === this.props.currInstance) {
        databases = <DatabaseSelector 
          switchDatabase={this.props.switchDatabase}
          dbCount={instance.databases}
          currDatabase={this.props.currDatabase}
          />

        className = 'selected-instance-container';
      } else {
        className = 'instance-container';
      }

      let instanceDisplayName;
      if (instance.host && instance.port) {
        instanceDisplayName = `${instance.host}@${instance.port}`
      } else if (instance.url) {
        instanceDisplayName = instance.url;
      } else {
        instanceDisplayName = 'N/A';
      }

      instances.push(
        <InstanceComponent
          instanceDetails={instance}
          instanceId={instance.instanceId}
          instanceDisplayName={instanceDisplayName}
          databases={databases}
          switchInstance={this.props.switchInstance}
          key={`instance-${idx}`}
          className={className}
        />
      )
    })

    return (
      <div className='instance-nav-container'>
        <h2 className='instance-nav-header'>Connections</h2>
        {instances}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InstanceNav);
