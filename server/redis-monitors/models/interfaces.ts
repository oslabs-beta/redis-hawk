/*
Library of interfaces to represent data structures used by the RedisMonitors.
*/

import { RedisClient } from 'redis';

export interface RedisInstance {
  host: string;
  port: number;
  recordKeyspaceHistoryFrequency: number,
};

export interface RedisMonitor {
  instanceId: number;
  redisClient: RedisClient;
  keyspaceSubscriber: RedisClient;
  host: RedisInstance['host'];
  port: RedisInstance['port'];
  databases?: number; //Check property - should this be optional on object initialization?
  keyspaces: Keyspace[];
  recordKeyspaceHistoryFrequency: RedisInstance['recordKeyspaceHistoryFrequency'],
};

export interface Keyspace {
  eventLog: EventLog;
  keyspaceHistories: KeyspaceHistoriesLog;
};

export interface EventLog {
  head: null | KeyspaceEventNode;
  tail: null | KeyspaceEventNode;
  eventTotal: number;
  add: (key: string, event: string) => void;
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