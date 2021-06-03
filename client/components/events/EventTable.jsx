import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';

function EventTable(props) {
  // console.log('props in keyspace table', props);

  const [pageSize, setPageSize] = React.useState(25);
  const [loading, setLoading] = React.useState(false);

  const handleEventPageChange = (params) => {
    console.log('props in eventTable', props, 'params in eventTable', params);
    props.updatePageNum(params.page + 1);

    const funcOptions = {
      pageSize: props.pageSize,
      pageNum: params.page + 1,
      keyNameFilter: props.currDisplay.keyNameFilter,
      keyEventFilter: props.currDisplay.keyEventFilter,
      refreshData: 0,
    };

    props.changeEventsPage(props.currInstance, props.currDatabase, funcOptions);
  };

  const handleEventPageSizeChange = (params) => {
    setPageSize(params.pageSize);
    props.updatePageSize(params.pageSize);

    //this is so if your current page is 50 and you select 100, the page will refresh with 100
    if (params.pageSize > props.pageSize) {
      const funcOptions = {
        pageSize: params.pageSize,
        pageNum: params.page + 1,
        refreshData: 0,
        keyNameFilter: props.currDisplay.keyNameFilter,
        keyEventFilter: props.currDisplay.keyEventFilter,
      };
      props.changeEventsPage(
        props.currInstance,
        props.currDatabase,
        funcOptions
      );
    }
  };

  const data =
    props.events[props.currInstance - 1].keyspaces[props.currDatabase].data;

  console.log(' props in event table', props);
  console.log('data in event table', data);

  for (let i = 0; i < data.length; i += 1) {
    data[i].id = i;
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
        onPageSizeChange={handleEventPageSizeChange}
        onPageChange={handleEventPageChange}
        columns={[
          {
            field: 'key',
            flex: 0.4,
            // headerAlign: 'center',
            headerClassName: 'table-header',
          },
          {
            field: 'event',
            flex: 0.3,
            // headerAlign: 'center',
            headerClassName: 'table-header',
          },
          {
            field: 'timestamp',
            flex: 0.4,
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

export default EventTable;
