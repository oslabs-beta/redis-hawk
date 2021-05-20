import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        style={{ color: 'white' }}
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label='first page'
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        style={{ color: 'white' }}
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label='previous page'
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        style={{ color: 'white' }}
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='next page'
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        style={{ color: 'white' }}
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='last page'
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function createData(keyname, event, time) {
  return { keyname, event, time };
}

// const rows = [
//   createData("Wesley", "geo-wiz", "string"),
//   createData("nothing", "value: null", "hash"),
//   createData("Abby", "Boss", "string"),
//   createData("random", "159", "string"),
//   createData("james", "sensei", "string"),
//   createData("realdata", "isTrue: false", "hash"),
//   createData("Ice cream sandwich", "yum", "string"),
//   createData("Jelly Bean", "binary: 0101", "hash"),
//   createData("KitKat", "password: 123456", "hash"),
//   createData("Lollipop", "somevalue", "string"),
//   createData("Marshmallow", "somevalue", "string"),
//   createData("Nougat", "somevalue", "string"),
//   createData("Oreo", "trueValue", "string"),
// ].sort((a, b) => (a.calories < b.calories ? -1 : 1));

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
});

function EventTable(props) {
  const rows = [];
  // console.log("EventTable props", props);
  // if props.currDisplay.category  === 'name'
  // use that name to match event.key with that name from event.key[0]
  // e.g. event.key[0] === 'wesley';  props.currDisplay.filter === 'wes'
  // so that event gets pushed into rows

  // if props.currDisplay.category === 'event'
  // event.event === 'SET'. props.currDisplay.filter === 'SET, that shit gets pushed to rows

  console.log('props.currDisplay', props.currDisplay);
  console.log('EventTable props.events', props.events[props.currDatabase]);
  props.events[props.currDatabase].forEach((event) => {
    const date = new Date(event.timestamp);
    if (props.currDisplay.category === 'name') {
      if (event.key.includes(props.currDisplay.filter)) {
        rows.push(createData(event.key, event.event, date.toString('MMM dd')));
      }
    } else if (props.currDisplay.category === 'event') {
      if (event.event === props.currDisplay.filter) {
        rows.push(createData(event.key, event.event, date.toString('MMM dd')));
      }
    } else
      rows.push(createData(event.key, event.event, date.toString('MMM dd')));
  });
  console.log('rows in EventTable', rows);
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer id='tableContainer' component={Paper}>
      <Table className={classes.table} aria-label='custom pagination table'>
        <TableHead>
          <TableRow>
            <TableCell style={{ color: 'white' }}>Keyname</TableCell>
            <TableCell style={{ color: 'white' }} align='right'>
              Event
            </TableCell>
            <TableCell style={{ color: 'white' }} align='right'>
              Timestamp
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody id='tableBody'>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.keyname}>
              <TableCell
                style={{ color: 'white' }}
                className='tableCell'
                component='th'
                scope='row'
              >
                {row.keyname}
              </TableCell>
              <TableCell
                className='tableCell'
                style={{ width: 160, color: 'white' }}
                align='right'
              >
                {row.event}
              </TableCell>
              <TableCell
                className='tableCell'
                style={{ width: 160, color: 'white' }}
                align='right'
              >
                {row.time}
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              style={{ color: 'white' }}
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export default EventTable;
