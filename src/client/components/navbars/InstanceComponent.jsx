import React from "react";

const InstanceComponent = (props) => {
  return (
    <div className={props.className}>
      <p className='instance-display-text' onClick={() => {
        props.switchInstance(props.instanceId);
      }}>
        {props.instanceDisplayName}
      </p>
      {props.databases}
    </div>
  );
};

export default InstanceComponent;
