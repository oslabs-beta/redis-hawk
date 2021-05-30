import { RequestHandler } from 'express';

//type definition for response body data
// import { RedisInstance, Keyspace, KeyData } from './interfaces';
import type { KeyspacesResponseBody, KeyDetails, Keyspace } from './interfaces';
import { getKeyspace } from './utils';

interface KeyspacesController {
  getKeyspacesForInstance: RequestHandler;
  refreshKeyspace: RequestHandler;
  getKeyspacePages: RequestHandler;
}

const keyspacesController: KeyspacesController = {

  getKeyspacesForInstance: async (req, res, next) => {

    const keyspacesResponse: KeyspacesResponseBody = { data: [] };
    const dbIndex = req.params.dbIndex;

    if (dbIndex) { //Grab specified keyspace for the instance
      const keyspaceData = await getKeyspace(res.locals.monitors[0].redisClient, +dbIndex);
      keyspacesResponse.data = [{
        instanceId: res.locals.monitors[0].instanceId,
        keyspaces: [keyspaceData]
      }];

    } else { //Grab all keyspaces for the instance

      for (let monitor of res.locals.monitors) {
        const keyspaces: Keyspace[] = [];

        let idx = 0;
        for (const keyspace of monitor.keyspaces) {
          const keyspaceData = await getKeyspace(monitor.redisClient, idx);
          keyspaces.push(keyspaceData);
          idx += 1;
        }

        keyspacesResponse.data.push({
          instanceId: monitor.instanceId,
          keyspaces: keyspaces
        });
      }
    }

    res.locals.keyspaces = keyspacesResponse;
    return next();
  },

  refreshKeyspace: async (req, res, next) => {
  /*
    If request specifies to "refreshScan"
      - Rescan the keyspace and obtain corresponding types/values for keys
      - Store the results in the monitor's keyspaceSnapshot
  */
    const { refreshScan } = req.query; 

    //Skip middleware if a refresh is not required
    if (refreshScan === '0') return next();

    //Handle invalid parameter value - if refreshScan is undefined, the default behavior will be to scan.
    if (refreshScan !== '1' && refreshScan !== undefined) return next({
      log: 'Request included invalid refreshScan query parameter',
      status: 400,
      message: {err: 'Please provide a valid refreshScan value: 1 or 0'}
    });

    const dbIndex = +req.params.dbIndex
    try {
      if (dbIndex >= 0) { //Refresh keyspace snapshot for this specific keyspace
        const monitor = res.locals.monitors[0]
        monitor.keyspaces[dbIndex].keyspaceSnapshot = await getKeyspace(monitor.redisClient, dbIndex);
      
      } else { //Refresh keyspace snapshots for all keyspaces for monitor(s)
        
        for (let monitor of res.locals.monitors) {

          let idx = 0;
          for (let keyspace of monitor.keyspaces) {
            monitor.keyspaces[idx].keyspaceSnapshot = await getKeyspace(monitor.redisClient, idx);
            idx += 1;
          }
        };

      }
    } catch (e) { //Invoke global error handler in case of scanning error
      return next({
        log: `Error encountered while rescanning keyspace: ${e}`,
        message: {err: 'Server error occured while rescanning keyspace'}
      });
    }

    return next();

  },

  getKeyspacePages: (req, res, next) => {
    /*
      Based on any pagination and filter parameters,
        - Identify the keyspaceSnapshot for any necessary keyspace(s)
        - Filter the keyspaceSnapshot based on any filter parameters
        - Return the proper subset of the keyspaceSnapshot based on the pagination parameters
        - Constructs the proper response body
    */
    const { keynameFilter, keytypeFilter, pageNum, pageSize } = req.query;

    let validatedPageNum = pageNum ? +pageNum : 1;
    let validatedPageSize = pageSize ? +pageSize : 5;

    const getPaginatedKeyspaceData = (keyspaceSnapshot: KeyDetails[]): [number, KeyDetails[]] => {
    //Helper function for filtering and indexing the keyspaceSnapshot

      if (keynameFilter) {
        keyspaceSnapshot = keyspaceSnapshot.filter((keyDetails: KeyDetails): boolean => {
          return keyDetails.key.includes(keynameFilter.toString());
        });
      }

      if (keytypeFilter) {
        keyspaceSnapshot = keyspaceSnapshot.filter((keyDetails: KeyDetails): boolean => {
          return keyDetails.type === keytypeFilter.toString();
        });
      }

      const keyTotal = keyspaceSnapshot.length;

      const startIndex = ((validatedPageNum - 1) * validatedPageSize)
      const endIndex = validatedPageNum * validatedPageSize
      return [ keyTotal, keyspaceSnapshot.slice(startIndex, endIndex) ];
    }

    const dbIndex = +req.params.dbIndex
    if (dbIndex >= 0) { 
    
      const monitor = res.locals.monitors[0]
      const [ keyTotal, paginatedData ] = getPaginatedKeyspaceData(monitor.keyspaces[dbIndex].keyspaceSnapshot)
      res.locals.keyspaces = {
        keyTotal: keyTotal,
        pageSize: validatedPageSize,
        pageNum: validatedPageNum,
        data: paginatedData
      }

    } else {
      
      const keyspacesResponse = {data: []};
      for (let monitor of res.locals.monitors) {

        const keyspaceData = [];

        let idx = 0;
        for (let keyspace of monitor.keyspaces) {
          const [keyTotal, paginatedData] = getPaginatedKeyspaceData(monitor.keyspaces[idx].keyspaceSnapshot);
          keyspaceData.push({
            keyTotal: keyTotal,
            pageSize: validatedPageSize,
            pageNum: validatedPageNum,
            data: paginatedData
          });
          idx += 1
        }

        keyspacesResponse.data.push({
          instanceId: monitor.instanceId,
          keyspaces: keyspaceData
        });
      }

      res.locals.keyspaces = keyspacesResponse;
    }

    return next();
  }

};

export default keyspacesController;