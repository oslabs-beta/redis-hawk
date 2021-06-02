// import React, { useState } from 'react';

// const SearchFilter = (props) => {
//   const [value, setValue] = useState('');
//   const [category, setCategory] = useState('');

//   const handleChange = (event) => {
//     setValue(event.target.value);
//   };
//   function handleClick(event) {
//     setCategory(event.target.id);
//   }

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     setValue('');
//     props.updateCurrDisplay(value, category);
//   };

//   if (props.currPage === 'events') {
//     return (
//       <div className='searchFilterDiv'>
//         <form id='filter-form' onSubmit={handleSubmit}>
//           <label>Search:</label>
//           <input
//             id='uniqueInput'
//             type='text'
//             value={value}
//             onChange={handleChange}
//           />
//           <input
//             className='form-filter-button'
//             id='name'
//             type='submit'
//             value='filter by name'
//             onClick={handleClick}
//           />
//           <input
//             className='form-filter-button'
//             id='event'
//             type='submit'
//             value='filter by event'
//             onClick={handleClick}
//           />
//         </form>
//       </div>
//     );
//   } else if (props.currPage === 'graphs') {
//     return (
//       <div className='searchFilterDiv'>
//         <form id='filter-form' onSubmit={handleSubmit}>
//           <label>Search:</label>
//           <input type='text' value={value} onChange={handleChange} />
//           <input
//             className='form-filter-button'
//             id='name'
//             type='submit'
//             value='filter by name'
//             onClick={handleClick}
//           />
//           <input
//             className='form-filter-button'
//             id='event'
//             type='submit'
//             value='filter by event'
//             onClick={handleClick}
//           />
//         </form>
//       </div>
//     );
//   } else {
//     return (
//       <div className='searchFilterDiv'>
//         <form id='filter-form' onSubmit={handleSubmit}>
//           <label>Search:</label>
//           <input type='text' value={value} onChange={handleChange} />
//           <input
//             className='form-filter-button'
//             id='name'
//             type='submit'
//             value='filter by name'
//             onClick={handleClick}
//           />
//           <input
//             className='form-filter-button'
//             id='type'
//             type='submit'
//             value='filter by type'
//             onClick={handleClick}
//           />
//         </form>
//       </div>
//     );
//   }
// };

// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import InputLabel from '@material-ui/core/InputLabel';
// import Input from '@material-ui/core/Input';
// import MenuItem from '@material-ui/core/MenuItem';
// import FormControl from '@material-ui/core/FormControl';
// import Select from '@material-ui/core/Select';

// const useStyles = makeStyles((theme) => ({
//   container: {
//     display: 'flex',
//     flexWrap: 'wrap',
//   },
//   formControl: {
//     margin: theme.spacing(1),
//     minWidth: 120,
//   },
// }));

// function SearchFilter() {
//   const classes = useStyles();
//   const [open, setOpen] = React.useState(false);
//   const [age, setAge] = React.useState('');

//   const handleChange = (event) => {
//     setAge(Number(event.target.value) || '');
//   };

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <div>
//       <Button onClick={handleClickOpen}>Filter</Button>
//       <Dialog
//         disableBackdropClick
//         disableEscapeKeyDown
//         open={open}
//         onClose={handleClose}
//       >
//         <DialogTitle>Fill the form</DialogTitle>
//         <DialogContent>
//           <form className={classes.container}>
//             <FormControl className={classes.formControl}>
//               <InputLabel htmlFor='demo-dialog-native'>Input</InputLabel>
//               <input
//                 native
//                 value={age}
//                 onChange={handleChange}
//                 input={<Input id='demo-dialog-native' />}
//                 type='text'
//               ></input>
//             </FormControl>
//             <FormControl className={classes.formControl}>
//               <InputLabel id='demo-dialog-select-label'>category</InputLabel>
//               <Select
//                 labelId='demo-dialog-select-label'
//                 id='demo-dialog-select'
//                 value={age}
//                 onChange={handleChange}
//                 input={<Input />}
//               >
//                 <MenuItem value=''>
//                   <em>None</em>
//                 </MenuItem>
//                 <MenuItem value={'key'}>key</MenuItem>
//                 <MenuItem value={'type'}>type</MenuItem>
//               </Select>
//             </FormControl>
//           </form>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color='primary'>
//             Cancel
//           </Button>
//           <Button onClick={handleClose} color='primary'>
//             Ok
//           </Button>
//           <Button>+</Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }

// export default SearchFilter;

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
    console.log('handling change');
    setValue(event.target.value);
  };
  function selectChange(event) {
    setCategory(event.target.value);
  }

  //submitting the filter
  function handleSubmit() {
    console.log('my value and category', value, category);
    //change the state of currDisplay
    props.updateCurrDisplay({
      filterType: 'keyType',
      filterValue: category,
    });
    props.updateCurrDisplay({ filterType: 'keyName', filterValue: value });
    console.log('my current display in handle submit', props.currDisplay);
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

  function clearFilter() {
    setValue('');
    setCategory('');
    props.updateCurrDisplay({ filterType: 'keyName', filterValue: '' });
    props.updateCurrDisplay({ filterType: 'keyType', filterValue: '' });
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

  const newArea = [];

  return (
    <div style={{ width: '75%', display: 'flex', flexDirection: 'column' }}>
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
          <MenuItem value=''>
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
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItem: 'center',
        }}
      >
        <Button onClick={clearFilter} color='default'>
          Clear
        </Button>
        <Button onClick={handleSubmit} color='default'>
          Filter
        </Button>
        <Button color='default'>+</Button>
      </div>
      <div>{newArea}</div>
    </div>
  );
}

// <button
//             className='filter-button'
//             id='clearFilterButton'
//             onClick={(e) => {
//               e.preventDefault();
//               this.props.updateCurrDisplay('', '');
//             }}
//           >
//             Clear Filter
//           </button>
