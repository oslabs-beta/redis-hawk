import React from "react";

const InstanceComponent = (props) => {
  return (
    <div
      className='singleInstance'
      onClick={() => {
        props.handleClick(props.currInstance);
      }}>
      {`- Database ${props.currInstance}`}
    </div>
  );
};

export default InstanceComponent;
