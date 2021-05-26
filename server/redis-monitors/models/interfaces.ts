/*
Library of interfaces to represent data structures used by the RedisMonitors.
*/

import { RedisClient } from 'redis';

export interface RedisInstance {
  host: string;
  port: number;
};

export interface RedisMonitor {
  instanceId: number;
  redisClient: RedisClient;
  keyspaceSubscriber: RedisClient;
  host: RedisInstance['host'];
  port: RedisInstance['port'];
  databases?: number; //Check property - should this be optional on object initialization?
  keyspaces: Keyspace[];
};

export interface Keyspace {
  eventLog: EventLog;
  keySnapshots: KeySnapshot[];
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
  timestamp: Date;
}

export interface KeyspaceEventNode extends KeyspaceEvent {
  key: string;
  event: string;
  timestamp: Date;
  next: null | KeyspaceEvent;
  previous: null | KeyspaceEvent;
};

export interface KeySnapshot {
  timestamp: Date;
  keys: string[];
};
