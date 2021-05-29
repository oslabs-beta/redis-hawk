import React, { Component } from "react";
import { connect } from "react-redux";
import InstanceComponent from "./InstanceComponent.jsx";
import * as actions from "../../action-creators/connections";

const mapStateToProps = (store) => ({
  instanceInfo: store.instanceInfoStore.instanceInfo,
  currInstance: store.currInstanceStore.currInstance,
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
    console.log("props in Instance", this.props);
    // if (this.props.instanceInfo[this.props.currInstance - 1]) {

    const instanceArray = [];
    if (this.props.currInstance) {
      for (let i = 0; i < this.props.instanceInfo.length; i++) {
        instanceArray.push(
          <InstanceComponent
            handleClick={this.props.switchInstance}
            currInstance={i + 1}
            key={i}
          />
        );
      }
    }
    return (
      <div className='InstanceNav-Container'>
        <div id='redisInstance' instanceinfo={this.props.currInstance}>
          <div id='instanceHolder'>{instanceArray}</div>
        </div>
      </div>
    );

    // else{
    //   return (
    //     <div className='InstanceNav-Container'>
    //     <div id='redisInstance' instanceinfo={this.props.currInstance}>
    //       <div id='instanceHolder'>loading</div>
    //     </div>
    //   </div>
    //   )
    // }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InstanceNav);
