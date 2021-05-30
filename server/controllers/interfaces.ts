import * as redisMonitorInterfaces from '../redis-monitors/models/interfaces';

export interface InstanceConnectionDetail extends redisMonitorInterfaces.RedisInstance {
  instanceId: number;
  databases: number;
}

export interface ConnectionsResponseBody {
  instances: InstanceConnectionDetail[];
}

export interface KeyDetails {
  key: string;
  value: any;
  type: string;
}

export type Keyspace = KeyDetails[];
interface InstanceKeyspaceDetail {
  instanceId: number;
  keyspaces: Keyspace[];
}
export interface KeyspacesResponseBody {
  data: InstanceKeyspaceDetail[];
}

export interface KeyspaceResponsePage {
  keyTotal: number;
  pageSize: number;
  pageNum: number;
  data: KeyDetails[];
}