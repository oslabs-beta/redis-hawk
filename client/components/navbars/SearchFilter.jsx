import React from "react";

// add onclicks to the #filtertypes

const SearchFilter = (props) => {
  if (props.keyspace) {
    return (
      <div>
        <div className='searchFilterContainer'>
          <input id='searchInput' />
          <button id='searchButton'>Search</button>
        </div>
        <div className='filterType'>Filter By Keyname</div>
        <div className='filterType'>Filter By KeyType</div>
      </div>
    );
  }
  if (props.events) {
    return (
      <div>
        <div className='searchFilterContainer'>
          <input id='searchInput' />
          <button>Search</button>
        </div>
        <div className='filterType'>Filter By Keyname</div>
        <div className='filterType'>Filter By KeyType</div>
        <div className='filterType'>Filter By Event</div>
      </div>
    );
  }

  if (props.graphs) {
    return (
      <div>
        <div className='searchFilterContainer'>
          <input id='searchInput' />
          <button>Search</button>
        </div>
        <div className='filterType'>Filter By Keyname</div>
        <div className='filterType'>Filter By KeyType</div>
        <div className='filterType'>Filter By KeyEvent</div>
        <div className='filterType'>Filter By Time</div>
      </div>
    );
  } else return null;
};

export default SearchFilter;
