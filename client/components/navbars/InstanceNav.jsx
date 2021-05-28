import React, { Component } from "react";
import { connect } from "react-redux";
import InstanceComponent from "./InstanceComponent.jsx";
import * as actions from "../../action-creators/connections";


const mapStateToProps = (store) => ({
  instances: store.instanceInfoStore.instanceInfoReducer,
  currInstance: store.currInstanceStore.instanceReducer
});

const mapDispatchToProps = (dispatch) => ({
  switchInstance: (instance) =>
    dispatch(actions.switchInstanceActionCreator(instance)),
});

class InstanceNav extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const instanceArray = [];
    if (this.props.currInstance) {
      for (let i = 0; i < this.props.instances.length; i++) {
        dbArray.push(
          <InstanceComponent
            handleClick={this.props.switchInstance}
            databaseNum={i}
            key={i}
          />
        );
      }
    }

    return (
      <div className='InstanceNav-Container'>
        <div id='redisInstance' instanceInfo={this.props.currInstance}>
          <div id='databaseHolder'>{instanceArray}</div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InstanceNav);
