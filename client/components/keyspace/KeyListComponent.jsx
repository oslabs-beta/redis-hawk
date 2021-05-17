import React, { Component } from 'react';
import { connect } from 'react-redux';

const mapDispatchToProps = (dispatch) => ({
  processSomething: () => dispatch(deleteMediaActionCreator(mediaId, userId)),
});

class KeyListComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        KeyList Component!
        <button onClick={this.props.processSomething}></button>
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(KeyListComponent);
