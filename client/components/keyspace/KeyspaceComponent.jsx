import React, { Component } from 'react';
import { connect } from 'react-redux';
import KeyspaceTable from './KeyspaceTable.jsx';

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
    console.log('props in KeyspaceComponent', this.props);
    return (
      <div
        id='keyspaceComponentContainer'
        className='KeyspaceComponent-Container'
      >
        <KeyspaceTable
          currDatabase={this.props.currDatabase}
          keyspace={this.props.keyspace}
          currDisplay={this.props.currDisplay}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(KeyspaceComponent);
