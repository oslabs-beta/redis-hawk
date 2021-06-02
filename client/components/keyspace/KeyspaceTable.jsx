import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import regeneratorRuntime from 'regenerator-runtime';
import { updateCurrDisplayActionCreator } from '../../action-creators/connections';

function KeyspaceTable(props) {
  // console.log('props in keyspace table', props);

  const [pageSize, setPageSize] = React.useState(25);
  const [loading, setLoading] = React.useState(false);
  // const [filterQuery, setFilterQuery] = React.useState({
  //   pageNum: null,
  //   pageSize: null,
  //   refreshScan: null,
  //   keyNameFilter: null,
  //   keyTypeFilter: null,
  // });

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
      };
      props.changeKeyspacePage(
        props.currInstance,
        props.currDatabase,
        funcOptions
      );
    }
  };

  // const handleFilterModelChange = React.useCallback((params) => {

  //   setFilterQuery(
  //     (filterQuery.pageSize = props.pageSize),
  //     (filterQuery.pageNum = props.pageNum),
  //     (filterQuery.refreshScan = 0)
  //   );

  //   // console.log('filterQuery', filterQuery);
  //   if (params.filterModel.items[0].columnField === 'name') {
  //     let keyNameFilter = params.filterModel.items[0].value;
  //     setFilterQuery((filterQuery.keyNameFilter = keyNameFilter));
  //   }
  //   // value filter not done in the backend yet
  //   // if (params.filterModel.items[0].columnField === 'value') {
  //   //   filterQuery.keyValueFilter = params.filterModel.items[0].value
  //   // }
  //   if (params.filterModel.items[0].columnField === 'type') {
  //     let keyTypeFilter = params.filterModel.items[0].value;

  //     setFilterQuery((filterQuery.keyTypeFilter = keyTypeFilter));
  //   }

  //   props.changeKeyspacePage(
  //     props.currInstance,
  //     props.currDatabase,
  //     filterQuery
  //   );
  // }, []);

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
        disableSelectionOnClick={true}
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
