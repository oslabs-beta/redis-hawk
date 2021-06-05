/*
Library of interfaces to represent data structures used by the RedisMonitors.
*/

import { RedisClient } from 'redis';

export interface RedisInstance {
  readonly host?: string;
  readonly port?: number;
  readonly url?: string;
  readonly recordKeyspaceHistoryFrequency: number,
  readonly maxKeyspaceHistoryCount: number,
  readonly eventGraphRefreshFrequency: number,
  readonly maxEventLogSize: number,
};

export interface RedisMonitor {
  readonly instanceId: number;
  readonly redisClient: RedisClient;
  readonly keyspaceSubscriber: RedisClient;
  host?: RedisInstance['host'];
  port?: RedisInstance['port'];
  url?: RedisInstance['url'];
  databases?: number; //Check property - should this be optional on object initialization?
  keyspaces: Keyspace[];
  readonly recordKeyspaceHistoryFrequency: RedisInstance['recordKeyspaceHistoryFrequency'];
  readonly maxKeyspaceHistoryCount: RedisInstance['maxKeyspaceHistoryCount'];
  readonly eventGraphRefreshFrequency: RedisInstance['eventGraphRefreshFrequency'];
  readonly maxEventLogSize: RedisInstance['maxEventLogSize'];
};

export interface Keyspace {
  eventLog: EventLog;
  keyspaceHistories: KeyspaceHistoriesLog;
  keyspaceSnapshot: KeyspaceKeyDetail[];
  eventLogSnapshot: KeyspaceEvent[];
};
export interface KeyspaceKeyDetail {
  key: string;
  value: any;
  type: string;
}
export interface EventLog {
  head: null | KeyspaceEventNode;
  tail: null | KeyspaceEventNode;
  eventTotal: number;
  add: (key: string, event: string) => void;
  reset: () => void;
  returnLogAsArray: (eventTotal: number) => KeyspaceEvent[];
}
export interface KeyspaceEvent {
  key: string;
  event: string;
  timestamp: number;
}

export interface KeyspaceEventNode extends KeyspaceEvent {
  next: null | KeyspaceEventNode;
  previous: null | KeyspaceEventNode;
};

export interface KeyspaceHistoriesLog {
  head: null | KeyspaceHistoryNode;
  tail: null | KeyspaceHistoryNode;
  historiesCount: number;
  add: (keyDetails: KeyDetails[]) => void;
  reset: () => void;
  returnLogAsArray: (historiesCount: number) => KeyspaceHistory[];
}

export interface KeyspaceHistory {
  timestamp: number;
  keys: KeyDetails[];
};

export interface KeyspaceHistoryNode extends KeyspaceHistory {
  next: null | KeyspaceHistoryNode;
  previous: null | KeyspaceHistoryNode;
}

export interface KeyDetails {
  key: string,
  memoryUsage: number
}