export interface RedisInstance {
  instanceId: number,
  keyspaces: Keyspace[]
};

export type Keyspace = KeyData[];
export interface KeyData {
  key: string,
  value: any,
  type: string
}
