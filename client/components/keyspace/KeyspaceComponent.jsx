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

//object we will receive
instance: {
  {
    keyspace: [
      //first database
      [
        { name: keyname, value: keyvalue, type: keytype },
        { name: keyname, value: keyvalue, type: keytype },
        { name: keyname, value: keyvalue, type: keytype },
      ],
      //second database
      [
        { name: keyname, value: keyvalue, type: keytype },
        { name: keyname, value: keyvalue, type: keytype },
        { name: keyname, value: keyvalue, type: keytype },
      ],
    ];
  }
  {
    events: [
      //first database
      [
        { name: keyname, event: keyEvent, time: keytime },
        { name: keyname, event: keyEvent, time: keytime },
        { name: keyname, event: keyEvent, time: keytime },
      ],
      //second database
      [
        { name: keyname, event: keyEvent, time: keytime },
        { name: keyname, event: keyEvent, time: keytime },
        { name: keyname, event: keyEvent, time: keytime },
      ],
    ];
  }
}

//state we will be working with
keyspace: [
  //first database
  [
    { name: keyname, value: keyvalue, type: keytype },
    { name: keyname, value: keyvalue, type: keytype },
    { name: keyname, value: keyvalue, type: keytype },
  ],
  //second database
  [
    { name: keyname, value: keyvalue, type: keytype },
    { name: keyname, value: keyvalue, type: keytype },
    { name: keyname, value: keyvalue, type: keytype },
  ],
];

events: [
  //first database
  [
    { name: keyname, event: keyEvent, time: keytime },
    { name: keyname, event: keyEvent, time: keytime },
    { name: keyname, event: keyEvent, time: keytime },
  ],
  //second database
  [
    { name: keyname, event: keyEvent, time: keytime },
    { name: keyname, event: keyEvent, time: keytime },
    { name: keyname, event: keyEvent, time: keytime },
  ],
];
