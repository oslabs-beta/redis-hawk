import React, { Component } from 'react';
import KeyListComponent from './KeyListComponent.jsx';

class MainComponent extends Component {
  constructor(props) {
    super(props);
    const state = {
      displayValue: '',
    };
    this.renderValue = this.renderValue.bind.this;
  }

  renderValue(e) {
    e.preventDefault();
    const value = e.target.props.keyspace.value;
    this.state.displayValue = value;
  }

  render() {
    //functionality to render the proper number of KeyListComponents -- obj.props.keyspace???
    const listOfKeys = this.props.keyspace.map((obj) => {
      <KeyListComponent
        keyspace={obj.props.keyspace}
        handleClick={this.renderValue}
      />;
    });
    return (
      <div id='mainComponentContainer'>
        <div id='keyListHolder'>
          <ul id='keyList'>{listOfKeys}</ul>
        </div>
        <div id='valueDisplay'>
          <h3>{this.state.displayValue}</h3>
        </div>
      </div>
    );
  }
}

export default MainComponent;
