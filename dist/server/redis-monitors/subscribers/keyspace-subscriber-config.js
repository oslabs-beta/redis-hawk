var configureKeyspaceSubscriber = function (database, redisClient) {
    redisClient.subscribe("__keyspace@" + database + "__:0");
};
