import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';

import '../styles/tables.scss';

function KeyspaceTable(props) {
  // console.log('props in keyspace table', props);

  const [pageSize, setPageSize] = React.useState(25);
  const [loading, setLoading] = React.useState(false);

  const handlePageChange = (params) => {
    props.updatePageNum(params.page + 1);

    const funcOptions = {
      pageSize: props.pageSize,
      pageNum: params.page + 1,
      keyNameFilter: props.currDisplay.keyNameFilter,
      keyTypeFilter: props.currDisplay.keyTypeFilter,
      refreshScan: 0,
    };

    props.changeKeyspacePage(
      props.currInstance,
      props.currDatabase,
      funcOptions
    );
  };

  const handlePageSizeChange = (params) => {
    setPageSize(params.pageSize);
    props.updatePageSize(params.pageSize);

    //this is so if your current page is 50 and you select 100, the page will refresh with 100
    if (params.pageSize > props.pageSize) {
      const funcOptions = {
        pageSize: params.pageSize,
        pageNum: params.page + 1,
        refreshScan: 0,
        keyNameFilter: props.currDisplay.keyNameFilter,
        keyTypeFilter: props.currDisplay.keyTypeFilter,
      };
      props.changeKeyspacePage(
        props.currInstance,
        props.currDatabase,
        funcOptions
      );
    }
  };

  const data =
    props.keyspace[props.currInstance - 1].keyspaces[props.currDatabase].data;

  //replace all objects in an array with strings

  for (let i = 0; i < data.length; i += 1) {
    data[i].id = i;

    if (data[i].type === 'hash') {
      // console.log('this is what i looked like before', data[i].value);
      let obj = data[i].value;
      // console.log('obj', obj);
      let objArray = Object.keys(obj);
      let newString = '';
      objArray.forEach((el) => {
        newString += `${el}: ${obj[el]}, `;
      });
      // console.log(newString);
      data[i].value = newString;
      // console.log('my new hash', data[i]);
    }
  }

  const useStyles = makeStyles({
    dataGrid: {
      borderRadius: 3,
      border: 'solid rgb(200, 200, 200) 1px',
      color: 'rgb(200, 200, 200)',
      fontFamily: "'Nunito Sans', 'sans-serif'",
    },
  });
  const classes = useStyles();

  // console.log('data in keyspace table', data);
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        // autoHeight={true}
        // disableExtendRowFullWidth={true}
        className={classes.dataGrid}
        disableColumnFilter
        autoPageSize={false}
        loading={loading}
        pagination
        paginationMode='server'
        disableSelectionOnClick={true}
        rowCount={props.myCount}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        onPageSizeChange={handlePageSizeChange}
        onPageChange={handlePageChange}
        columns={[
          {
            field: 'key',
            // headerAlign: 'center',
            flex: 0.2,
            headerClassName: 'table-header',
          },
          {
            field: 'value',
            flex: 0.63,
            // headerAlign: 'center',
            headerClassName: 'table-header',
          },
          {
            field: 'type',
            flex: 0.17,
            // headerAlign: 'center',
            headerClassName: 'table-header',
          },
        ]}
        rows={data}
        isRowSelectable={false}
      />
    </div>
  );
}

export default KeyspaceTable;
