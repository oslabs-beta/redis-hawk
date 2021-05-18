import React, { Component } from 'react';
import { connect } from 'react-redux';
import MainComponent from './MainComponent.jsx';
import KeyspacePagination from './KeyspacePagination.jsx';

//withRouter??? -- for props.history -- stretch??

const mapStateToProps = (store) => {
  return {
    database: store.database,
    keyspace: store.keyspace,
  };
};

// const mapDispatchToProps = (dispatch) => ({
//   processSomething: () => dispatch(deleteMediaActionCreator(mediaId, userId)),
// });

class KeyspaceComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id='keyspaceComponentContainer'>
        <MainComponent
          database={this.props.database}
          keyspace={this.props.keyspace}
        />
        <KeyspacePagination
          database={this.props.database}
          keys={this.props.keyspace}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(KeyspaceComponent);
