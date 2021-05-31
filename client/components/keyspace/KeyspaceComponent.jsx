import React, { Component } from "react";
import { connect } from "react-redux";
import KeyspaceTable from "./KeyspaceTable.jsx";

//withRouter??? -- for props.history -- stretch??

const mapStateToProps = (store) => {
  return {
    currInstance: store.currInstanceStore.currInstance,
    currDatabase: store.currDatabaseStore.currDatabase,
    keyspace: store.keyspaceStore.keyspace,
    currDisplay: store.currDisplayStore.currDisplay,
  };
};

class KeyspaceComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        id='keyspaceComponentContainer'
        className='KeyspaceComponent-Container'>
        <KeyspaceTable
          currDatabase={this.props.currDatabase}
          keyspace={this.props.keyspace}
          currDisplay={this.props.currDisplay}
          currInstance={this.props.currInstance}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(KeyspaceComponent);
