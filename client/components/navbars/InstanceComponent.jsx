import React from "react";

const InstanceComponent = (props) => {
  return (
    <div className='instance-container'>
      <p className='instance-display-text' onClick={() => {
        props.switchInstance(props.instanceDetails.instanceId);
      }}>
        Instance: {props.instanceDetails.host}@{props.instanceDetails.port}
      </p>
      {props.databases}
    </div>
  );
};

export default InstanceComponent;
