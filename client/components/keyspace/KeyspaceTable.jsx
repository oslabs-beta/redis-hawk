import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import regeneratorRuntime from 'regenerator-runtime';

function KeyspaceTable(props) {
  console.log('props in keyspace table', props);

  const [pageSize, setPageSize] = React.useState(25);
  const [loading, setLoading] = React.useState(false);

  const handlePageChange = (params) => {
    console.log('current page in params in handle page change', params.page);
    props.updatePageNum(params.page + 1);
    console.log('pageNum in props in handle page change', props.pageNum);
    const funcOptions = {
      pageSize: props.pageSize,
      pageNum: params.page + 1,
      refreshScan: 0,
    };
    // console.log('my funcOptions', funcOptions);
    props.changeKeyspacePage(
      props.currInstance,
      props.currDatabase,
      funcOptions
    );
  };

  const handlePageSizeChange = (params) => {
    setPageSize(params.pageSize);
    props.updatePageSize(params.pageSize);
    console.log('my current pageNum in params', params.page);
    console.log('my current pageNum in props', props.pageNum);
    //this is so if your current page is 50 and you select 100, the page will refresh with 100
    if (params.pageSize > props.pageSize) {
      const funcOptions = {
        pageSize: params.pageSize,
        pageNum: params.page + 1,
        refreshScan: 0,
      };
      props.changeKeyspacePage(
        props.currInstance,
        props.currDatabase,
        funcOptions
      );
    }
  };

  const filterQuery = {
    pageSize: props.pageSize,
    pageNum: props.pageNum,
  };

  const handleFilterModelChange = (params) => {
    console.log('params in onfilterchange', params);
    console.log('params i need', params.filterModel.items[0].columnField);
    console.log('params i need', params.filterModel.items[0].value);

    if (params.filterModel.items[0].columnField === 'name') {
      filterQuery.keyNameFilter = params.filterModel.items[0].value;
    }
    //value filter not done in the backend yet
    // if (params.filterModel.items[0].columnField === 'value') {
    //   filterQuery.keyValueFilter = params.filterModel.items[0].value
    // }
    if (params.filterModel.items[0].columnField === 'type') {
      filterQuery.keyTypeFilter = params.filterModel.items[0].value;
    }
    console.log(filterQuery);
  };

  const data =
    props.keyspace[props.currInstance - 1].keyspaces[props.currDatabase].data;

  for (let i = 0; i < data.length; i += 1) {
    data[i].id = i;
  }

  // console.log('data in keyspace table', data);
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        autoPageSize={false}
        loading={loading}
        pagination
        paginationMode='server'
        filterMode='server'
        onFilterModelChange={handleFilterModelChange}
        rowCount={props.myCount}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        onPageSizeChange={handlePageSizeChange}
        onPageChange={handlePageChange}
        columns={[
          { field: 'key', width: '25%' },
          { field: 'value', width: '49%' },
          { field: 'type', width: '25%' },
        ]}
        rows={data}
        isRowSelectable={false}
      />
    </div>
  );
}
export default KeyspaceTable;
