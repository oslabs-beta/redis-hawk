import React from "react";

const InstanceComponent = (props) => {
  return (
    <div className='instance-container'>
      <p className='instance-display-text' onClick={() => {
        props.switchInstance(props.instanceId);
      }}>
        Instance: {props.instanceDisplayName}
      </p>
      {props.databases}
    </div>
  );
};

export default InstanceComponent;
