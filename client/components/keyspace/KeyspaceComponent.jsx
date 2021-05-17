import React, { Component } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (store) => {
  return{
    database: store.database,
    keyspace: store.keyspace,
  }
  
}

// const mapDispatchToProps = (dispatch) => ({
//   processSomething: () => dispatch(deleteMediaActionCreator(mediaId, userId)),
// });

class KeyspaceComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <MainComponent database={this.props.database} keyspace={this.props.keyspace}/>
        <PaginationComponent database={this.props.database} keys={this.props.keyspace} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(KeyspaceComponent);
