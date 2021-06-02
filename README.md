(insert centered logo here)

(insert link to launch website and medium article here)

(insert badges here)
# redis-hawk

redis-hawk is an easy-to-use monitoring and visualizing web application for understanding granular key-level details for your Redis deployment.

It can be deployed locally on your desktop or on a server for continuous and remote monitoring of your Redis deployment.

## Table of Contents
---

* [Features](##Features)
* [Demo](##Demo)
* [Installation](##Installation)
* [Configuration](##Configuration)
* [Feature Roadmap](##feature-roadmap)

## Features
---

redis-hawk allows you to monitor the keyspace and its events within all databases of any number of deployed instances.

* View details on every keyspace in your Redis deployment
* View a log of keyspace events occuring in every keyspace
* View graphs to understand both key and event volumes over time
* Utilize flexible filters to filter based on a keyname pattern, specific data type, and/or event type.

## Demo - TBD
---

(screenshot initial state of app)

(how to switch instances / databases)

(demo of keyspace tab and filtering/pagination)

(demo of events tab and filtering/pagination)

(demo of graphs and filtering)


## Installation
---

redis-hawk is a web application that you can either run locally or deploy on a server for continuous and remote monitoring.

To install: 

```
npm install
```
then, either

```
npm run build
npm start
```

OR 

```
npm run dev
```

Then, please configure your redis-hawk monitoring options as decribed in the subsequent [Configuration](##Configuration) section.
## Configuration
---

Currently, configuration for your redis-hawk monitoring deployment must be managed via a `config.json`, located in the root directory of the repository. We will aim to support configuration directly via the web application in the near future.

We support connecting via either a host/port combination or via a conenction URL. Using one option is required to monitor an instance.

<br/>

| Field | Description |
| --- | --- |
| **host** (string) | IP address of the Redis server |
| **port** (number) | Port of the Redis server |
| **url** (string) | URL of the Redis server. The format should be `[redis[s]:]//[[user][:password@]][host][:port][/db-number][?db=db-number[&password=bar[&option=value]]]`. For more information, please reference [IANA](https://www.iana.org/assignments/uri-schemes/prov/redis).|
| **recordKeyspaceHistoryFrequency** (number) | The frequency at which keyspace histories should be recorded, in milliseconds. For more information, please see the configuration notes below. |

<br/>

The `config.json` defaults to monitoring the default local Redis instance via the following configuration options:

```
{
  "host": "127.0.0.1",
  "port": 6379,
  "recordKeyspaceHistoryFrequency": 60000
}
```
### Notes:

* If setting `recordKeyspaceHistoryFrequency` to sub-minute frequencies or deployments with extensively high key volumes, please consider the impact on the performance for both your server and monitored Redis deployment.
  * Every `recordKeyspaceHistoryFrequency` milliseconds, the server will perform a non-blocking redis `SCAN` command against each database of the instance to record a snapshot of keyspace details.
  * While the `SCAN` command is non-blocking and rapid, it may have performance impacts for your Redis deployment if utilized very frequently for larger Redis deployments.
  * For more details on `SCAN` performance and behavior, please read the [Redis documentation](https://redis.io/commands/scan).

<a name="feature-roadmap"></a>
## Feature Roadmap
---

The development team intends to continue improving redis-hawk and adding more features. Future features will include:

* Ability to configure monitoring preferences directly via the `redis-hawk` UI.
* Ability to configure maximum volumes of events and keyspace histories to record.
* Additional graphs, such as viewing memory usage by keys over time
* Additional database-level and instance-level metrics, such as overall memory usage and average key TTL
* Performance recommendations based on observed metrics and patterns in your Redis deployment