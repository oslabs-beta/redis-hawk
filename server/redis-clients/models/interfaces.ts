export interface RedisInstance {
  host: string,
  port: number
};

export interface RedisMonitor {
  client: any,
  host: RedisInstance['host'],
  port: RedisInstance['port'],
  databases?: number, //Check property - should this be optional on object initialization?
  keyspaces: Keyspace[]
};

export interface Keyspace {
  eventLog: KeyspaceEvent[],
  keySnapshots: KeySnapshot[]
};

export interface EventLog {
  head: null | KeyspaceEvent,
  tail: null | KeyspaceEvent,
  eventTotal: number,
  add: (key: string, event: string) => void
}

export interface KeyspaceEvent {
  key: string,
  event: string,
  timestamp: Date,
  next: null | KeyspaceEvent,
  previous: null | KeyspaceEvent
};

export interface KeySnapshot {
  timestamp: Date,
  keys: string[]
};
