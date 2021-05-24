import * as redisMonitorInterfaces from '../redis-monitors/models/interfaces';

interface InstanceConnectionDetail extends redisMonitorInterfaces.RedisInstance {
  instanceId: number,
  databases: number
}

export interface ConnectionsResponseBody {
  instances: InstanceConnectionDetail[];
}
