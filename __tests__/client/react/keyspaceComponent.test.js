//need to complete pagination

import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';

import KeyspaceComponent from '../../../client/components/keyspace/KeyspaceComponent.jsx';
import KeyspaceTable from '../../../client/components/keyspace/KeyspaceTable.jsx';

configure({ adapter: new Adapter() });

describe('React Keyspace unit tests', () => {
  describe('KeyspaceComponent', () => {
    let wrapper;
    const props = {
      keyspace: [
        [
          {
            name: 'keyName',
            value: 'hello',
            type: 'SET',
          },
        ],
      ],
      currDisplay: 'keyspace',
      currDatabase: 0,
    };

    beforeAll(() => {
      wrapper = shallow(<KeyspaceComponent {...props} />);
    });

    it('render the KeyspaceTable component with all props passed to the KeyspaceTable', () => {
      expect(wrapper.find('keyspaceComponentContainer').find('div'))
      expect(
        wrapper.containsAllMatchingElements([
          <div>
          <KeyspaceTable
          currDatabase={this.props.currDatabase}
          keyspace={this.props.keyspace}
          currDisplay={this.props.currDisplay}
        />
        </div>
        ])
      ).toEqual(true);
    });
  });

  describe('KeyspaceTable', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(<KeyspaceTable props={...props} />);
    });

    it('renders a div with Material UI keyspace components', () => {
      expect(wrapper.containsAllMatchingElements(
        <TableContainer id='tableContainer' className="Table-Container" component={Paper}>
      <Table className={classes.table} aria-label='custom pagination table'>
        <TableHead>
          <TableRow>
            <TableCell style={{ color: 'white' }}>Keyname</TableCell>
            <TableCell style={{ color: 'white' }} align='right'>
              Value
            </TableCell>
            <TableCell style={{ color: 'white' }} align='right'>
              Type
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
                {row.value}
              </TableCell>
              <TableCell
                className='tableCell'
                style={{ width: 160, color: 'white' }}
                align='right'
              >
                {row.type}
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
      ))
    });
  });
  
    
  });

