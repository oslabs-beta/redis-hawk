import React from 'react';

const DatabaseSelector = (props) => {
  const options = [];

  for (let i = 0; i < props.dbCount; i++) {
    options.push(
      <option className='database-selection-option' key={i} value={i}>
        {`db${i}`}
      </option>
    );
  }

  return (
    <div className='database-selector-container'>
      <span className='database-selector-prompt'>Select Database: </span>
      <select
        className='database-selector'
        onChange={(e) => {
          props.switchDatabase(e.target.value);
        }}
        value={props.currDatabase}
      >
        {options}
      </select>
    </div>
  );
};

export default DatabaseSelector;
