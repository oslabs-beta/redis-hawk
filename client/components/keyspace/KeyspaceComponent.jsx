import React, { Component } from 'react';

const mapDispatchToProps = (dispatch) => ({
  processSomething: () => dispatch(deleteMediaActionCreator(mediaId, userId))
})

class KeyspaceComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div>Keyspace Component!

      <button onClick={this.props.processSomething}></button>
    </div>);
  }
}

export default connect(null, mapDispatchToProps)(KeyspaceComponent);
