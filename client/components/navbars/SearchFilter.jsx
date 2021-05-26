import React, { useState } from 'react';

const SearchFilter = (props) => {
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  function handleClick(event) {
    setCategory(event.target.id);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setValue('');
    props.updateCurrDisplay(value, category);
  };

  if (props.currPage === 'events') {
    return (
      <div className='searchFilterDiv'>
        <form id='filter-form' onSubmit={handleSubmit}>
          <label>Search:</label>
          <input
            id='uniqueInput'
            type='text'
            value={value}
            onChange={handleChange}
          />
          <input
            className='form-filter-button'
            id='name'
            type='submit'
            value='filter by name'
            onClick={handleClick}
          />
          <input
            className='form-filter-button'
            id='event'
            type='submit'
            value='filter by event'
            onClick={handleClick}
          />
        </form>
      </div>
    );
  } else if (props.currPage === 'graphs') {
    return (
      <div className='searchFilterDiv'>
        <form id='filter-form' onSubmit={handleSubmit}>
          <label>Search:</label>
          <input type='text' value={value} onChange={handleChange} />
          <input
            className='form-filter-button'
            id='name'
            type='submit'
            value='filter by name'
            onClick={handleClick}
          />
          <input
            className='form-filter-button'
            id='event'
            type='submit'
            value='filter by event'
            onClick={handleClick}
          />
        </form>
      </div>
    );
  } else {
    return (
      <div className='searchFilterDiv'>
        <form id='filter-form' onSubmit={handleSubmit}>
          <label>Search:</label>
          <input type='text' value={value} onChange={handleChange} />
          <input
            className='form-filter-button'
            id='name'
            type='submit'
            value='filter by name'
            onClick={handleClick}
          />
          <input
            className='form-filter-button'
            id='type'
            type='submit'
            value='filter by type'
            onClick={handleClick}
          />
        </form>
      </div>
    );
  }
};

export default SearchFilter;
