import React from "react";

const InstanceComponent = (props) => {
  console.log("props in instancecomponent", props);
  return (
    <div
      className='singleInstance'
      onClick={() => {
        props.handleClick(props.currInstance);
      }}>
      {`- Instance ${props.currInstance}`}
    </div>
  );
};

export default InstanceComponent;
