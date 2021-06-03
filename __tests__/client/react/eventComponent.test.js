//need to complete pagination

import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import EventTable from '../../../src/components/events/EventTable.jsx'

configure({ adapter: new Adapter() });

describe('React Events unit tests', () => {
  describe('EventComponent', () => {
    let wrapper;
    const props = {
      events: [[
        {
          name: 'hey!',
          event: 'scan',
          time: '8:30',
        },
      ]],
      currDisplay: 'events',
      currDatabase: 0
    };

    beforeAll(() => {
      wrapper = shallow(<EventComponent {...props} />);
    });

    it('render a div with classname EventComponent-Container, and the EventTable component with currDisplay, currDatabase, and events properties passed into it', () => {
      expect(
        wrapper.containsAllMatchingElements([
          <div
            id='eventComponentContainer'
            className='EventComponent-Container'>
            <EventTable
              currDisplay={this.props.currDisplay}
              currDatabase={this.props.database}
              events={this.props.events}
            />
          </div>,
        ])
      ).toEqual(true);
    });
  });

  describe('EventTable', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(<EventTable props={...props} />);
    });

    it('renders a div with of material UI components', () => {
      expect(
        wrapper.containsAllMatchingElements(
          <TableContainer id='tableContainer' component={Paper}>
            <Table
              className={classes.table}
              aria-label='custom pagination table'>
              <TableHead>
                <TableRow>
                  <TableCell style={{ color: "white" }}>Keyname</TableCell>
                  <TableCell style={{ color: "white" }} align='right'>
                    Event
                  </TableCell>
                  <TableCell style={{ color: "white" }} align='right'>
                    Timestamp
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody id='tableBody'>
                {(rowsPerPage > 0
                  ? rows.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : rows
                ).map((row) => (
                  <TableRow
                    key={
                      row.keyname + row.event + getRandomInt(100000).toString()
                    }>
                    <TableCell
                      style={{ color: "white" }}
                      className='tableCell'
                      component='th'
                      scope='row'>
                      {row.keyname}
                    </TableCell>
                    <TableCell
                      className='tableCell'
                      style={{ width: 160, color: "white" }}
                      align='right'>
                      {row.event}
                    </TableCell>
                    <TableCell
                      className='tableCell'
                      style={{ width: 160, color: "white" }}
                      align='right'>
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
                    style={{ color: "white" }}
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    colSpan={3}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: { "aria-label": "rows per page" },
                      native: true,
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    // ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        )
      );
    });
  });
});
