// import * as React from 'react';
// import { DataGrid } from '@material-ui/data-grid';
// import { useDemoData } from '@material-ui/x-grid-data-generator';

// function loadServerRows(page, data) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(data.rows.slice(page * 5, (page + 1) * 5));
//     }, Math.random() * 500 + 100); // simulate network latency
//   });
// }

// function KeyspaceTable() {
//   const { data } = useDemoData({
//     dataSet: 'Commodity',
//     rowLength: 100,
//     maxColumns: 6,
//   });

//   const [page, setPage] = React.useState(0);
//   const [rows, setRows] = React.useState([]);
//   const [loading, setLoading] = React.useState(false);

//   const handlePageChange = (params) => {
//     setPage(params.page);
//   };

//   React.useEffect(() => {
//     let active = true;

//     (async () => {
//       setLoading(true);
//       const newRows = await loadServerRows(page, data);

//       if (!active) {
//         return;
//       }

//       setRows(newRows);
//       setLoading(false);
//     })();

//     return () => {
//       active = false;
//     };
//   }, [page, data]);

//   return (
//     <div style={{ height: 400, width: '100%' }}>
//       <DataGrid
//         rows={rows}
//         columns={data.columns}
//         pagination
//         pageSize={5}
//         rowCount={100}
//         paginationMode='server'
//         onPageChange={handlePageChange}
//         loading={loading}
//       />
//     </div>
//   );
// }

import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

function KeyspaceTable(props) {
  // console.log('props in keyspace table', props);

  const [pageSize, setPageSize] = React.useState(25);
  const [loading, setLoading] = React.useState(false);

  const handlePageChange = (params) => {
    console.log('current page in params', params.page);
    props.updatePageNum(params.page + 1);
    console.log('pageNum in props', props.pageNum + 1);
    const funcOptions = {
      pageSize: props.pageSize,
      pageNum: props.pageNum + 1,
      refreshScan: 0,
    };
    console.log('my funcOptions', funcOptions);
    props.changeKeyspacePage(
      props.currInstance,
      props.currDatabase,
      funcOptions
    );
  };

  const handlePageSizeChange = (params) => {
    setPageSize(params.pageSize);
    props.updatePageSize(params.pageSize);
  };

  const data =
    props.keyspace[props.currInstance - 1].keyspaces[props.currDatabase].data;

  for (let i = 0; i < data.length; i += 1) {
    data[i].id = i;
  }

  // console.log('data in keyspace table', data);
  return (
    <div
      style={{ height: 400, width: '100%', backgroundColor: 'rgb(233, 0, 0)' }}
    >
      <DataGrid
        autoPageSize={false}
        loading={loading}
        pagination
        paginationMode='server'
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
      />
    </div>
  );
}

export default KeyspaceTable;
