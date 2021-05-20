import React, { Component } from "react";
import { connect } from "react-redux";
import MainComponent from "./MainComponent.jsx";
import KeyspacePagination from "./KeyspacePagination.jsx";
import KeyspaceTable from "./KeyspaceTable.jsx";

//withRouter??? -- for props.history -- stretch??

const mapStateToProps = (store) => {
  return {
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
      <div id='keyspaceComponentContainer'>
        {/* <MainComponent
        
          database={this.props.database}
          keyspace={this.props.keyspace}
        /> */}
        <KeyspaceTable
          currDatabase={this.props.currDatabase}
          keyspace={this.props.keyspace}
          currDisplay={this.props.currDisplay}
        />
        {/* <KeyspacePagination
          database={this.props.database}
          keys={this.props.keyspace}
        /> */}
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(KeyspaceComponent);

//
