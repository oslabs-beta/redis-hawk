import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function SearchFilter(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState('');
  const [category, setCategory] = React.useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
    console.log('handlechange', event.target.value);
  };
  function selectChange(event) {
    setCategory(event.target.value);
    console.log('selectchange', event.target.value);
  }

  //submitting the filter
  function handleSubmit() {
    //change the state of currDisplay
    props.updateCurrDisplay({
      filterType: 'keyType',
      filterValue: category,
    });
    props.updateCurrDisplay({ filterType: 'keyName', filterValue: value });

    const queryOptions = {
      pageSize: props.pageSize,
      pageNum: props.pageNum,
      keyNameFilter: props.currDisplay.keyNameFilter,
      keyTypeFilter: props.currDisplay.keyTypeFilter,
      refreshScan: 0,
    };
    props.changeKeyspacePage(
      props.currInstance,
      props.currDatabase,
      queryOptions
    );
  }

  function handleEventSubmit() {
    props.updateCurrDisplay({
      filterType: 'keyEvent',
      filterValue: category,
    });
    props.updateCurrDisplay({ filterType: 'keyName', filterValue: value });
    const queryOptions = {
      pageSize: props.pageSize,
      pageNum: props.pageNum,
      keyNameFilter: props.currDisplay.keyNameFilter,
      keyEventFilter: props.currDisplay.keyEventFilter,
      refreshScan: 0,
    };
    console.log('myquery options in handle event submit', queryOptions);
    props.changeEventsPage(
      props.currInstance,
      props.currDatabase,
      queryOptions
    );
  }

  function clearFilter() {
    setValue('');
    setCategory('');
    document.getElementById('standard-secondary').value = '';

    props.updateCurrDisplay({ filterType: 'keyName', filterValue: '' });
    props.updateCurrDisplay({ filterType: 'keyType', filterValue: '' });
    console.log('value', value);
    console.log('category', category);
    const queryOptions = {
      pageSize: props.pageSize,
      pageNum: props.pageNum,
      refreshScan: 0,
      keyNameFilter: props.currDisplay.keyNameFilter,
      keyTypeFilter: props.currDisplay.keyTypeFilter,
    };
    props.changeKeyspacePage(
      props.currInstance,
      props.currDatabase,
      queryOptions
    );
  }

  function clearEventFilter() {
    setValue('');
    setCategory('');
    document.getElementById('standard-secondary').value = '';
    document.getElementById('secondary-secondary').value = '';

    props.updateCurrDisplay({ filterType: 'keyName', filterValue: '' });
    props.updateCurrDisplay({ filterType: 'keyEvent', filterValue: '' });
    const queryOptions = {
      pageSize: props.pageSize,
      pageNum: props.pageNum,
      refreshScan: 0,
      keyNameFilter: props.currDisplay.keyNameFilter,
      keyEventFilter: props.currDisplay.keyEventFilter,
    };
    props.changeEventsPage(
      props.currInstance,
      props.currDatabase,
      queryOptions
    );
  }

  const newArea = [];

  if (props.currPage === 'keyspace') {
    return (
      <div className='search-filters'>
        <FormControl className={classes.formControl}>
          <TextField
            id='standard-secondary'
            label='key name filter'
            color='secondary'
            onChange={handleChange}
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor='grouped-select'>key type filter</InputLabel>
          <Select defaultValue='' id='grouped-select' onChange={selectChange}>
            <MenuItem value='' selected>
              <em>None</em>
            </MenuItem>
            <MenuItem value={'string'}>string</MenuItem>
            <MenuItem value={'list'}>list</MenuItem>
            <MenuItem value={'set'}>set</MenuItem>
            <MenuItem value={'zset'}>zset</MenuItem>
            <MenuItem value={'hash'}>hash</MenuItem>
          </Select>
        </FormControl>
        <div
          className='filter-buttons-container'
        >
          <Button onClick={clearFilter} color='default'>
            Clear Filter
          </Button>

          <Button onClick={handleSubmit} color='default'>
            Apply Filter
          </Button>
          {/* <Button color='default'>+</Button> */}
        </div>
        <div>{newArea}</div>
      </div>
    );

    ////////////////////////
  } else if (props.currPage === 'events') {
    return (
      <div className='search-filters'>
        <FormControl className={classes.formControl}>
          <TextField
            id='standard-secondary'
            label='key name filter'
            color='secondary'
            onChange={handleChange}
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            id='secondary-secondary'
            label='key event filter'
            color='secondary'
            onChange={selectChange}
          />
        </FormControl>
        <div
          className='filter-buttons-container'
        >
          <Button onClick={clearEventFilter} color='default'>
            Clear Filter
          </Button>
          <Button onClick={handleEventSubmit} color='default'>
            Apply Filter
          </Button>
          {/* <Button color='default'>+</Button> */}
        </div>
        <div>{newArea}</div>
      </div>
    );
  }
}
