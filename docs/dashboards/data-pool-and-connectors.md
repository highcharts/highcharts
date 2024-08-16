Data Pool & Connectors
======================

The data pool provides the central access to data and data management in a
dashboard. It manages connectors and their tables in a on-demand-manner, so
that data is only loaded when actually requested by a dashboard component.

Data connectors manage the transaction and preparation of data. Loading data
from a source is an asynchronous process as the source is usually a web server.



DataPool
--------

Each dashboard has one `DataPool` instance for all components. It is available
via the `Board.dataPool` class property and can be configured with the
`BoardOptions.dataPool` option. Usually one or more connectors get defined,
containing and ID, the data source, and whether the data needs some form of
additional modification. The ID is used to retrieve a connector, which is an
asynchronous process.

### DataPool Example

``` JavaScript
async function run() {
  const board = await Dashboards.board('container', {
    // ...
    dataPool: {
      connectors: [{
        type: 'JSON',
        id: 'My Series Data',
        enablePolling: true,
        jsonURL: 'https://'
      }, {
        type: 'CSV',
        id: 'My Currency Data',
        csvURL: 'https://'
        dataModifier: {
            type: 'Math',
            columnFormulas: [{
                column: 'My Fixed Rate',
                formula: 'A1*7.8'
            }]
        }
      }]
    }
    // ...
  }, true);
  // Access to the data pool is usually performed by a component.
  const table = await board.dataPool.getConnectorTable('My Currency Data');
  const modifiedTable = table.modified;
}
run();
```



DataConnector
-------------

The `DataConnector` is the base class for all connectors and can not be used by
its own to load or save data. It includes common functionality like events,
server polling, and the management of meta information like the column order.

Additionally the `DataConnector` also contains the registry of all available
connectors. You can access the registry via `DataConnector.types`.



CSVConnector
------------

The `CSVConnector` allows the loading of structured text data, where each table
cell is separated by comma or semicolon, while each row is separated by a line
break. You can provided data via an URL or directly with a CSV string. Details
of all available options can be found in the
[API documentation](https://api.highcharts.com/dashboards/#interfaces/Data_Connectors_CSVConnectorOptions.CSVConnectorOptions-1).

### CSVConnector Example

``` JavaScript
async function run() {
    const connector = new DataConnector.types.CSV({
        csvURL: 'https://demo-live-data.highcharts.com/updating-set.csv'
    });
    await connector.load();
}
run();
```



GoogleSheetsConnector
---------------------

With the `GoogleSheetsConnector` is it possible to load table data from a Google
Docs spreadsheet. The connector needs the API key related to a Google account
and the document ID itself. See the
[API documentation](https://api.highcharts.com/dashboards/#interfaces/Data_Connectors_GoogleSheetsConnectorOptions.GoogleSheetsConnectorOptions-1)
for all options.

Please note that the Google account needs read access to the document. Usually
the Google account should not be the owner of the document as this decreases the
possibilities of limiting access.

### GoogleSheetsConnector Example

``` JavaScript
async function run() {
    const connector = new DataConnector.types.GoogleSheets({
        googleAPIKey: 'AIzaSyDaGmWKa4JsXZ-HjGw7ISLn_3namBGewQe',
        googleSpreadsheetKey: '1U17c4GljMWpgk1bcTvUzIuWT8vdOnlCBHTm5S8Jh8tw'
    });
    await connector.load();
}
run();
```



HTMLTableConnector
------------------

The `HTMLTableConnector` allows the import and export of an HTML table as a
`DataTable`. It is the only connector, that does not support loading from a
remote source. Instead one provides an element reference from the current web
page. Details are listed in the
[API documentation](https://api.highcharts.com/dashboards/#interfaces/Data_Connectors_HTMLTableConnectorOptions.HTMLTableConnectorOptions-1).

### HTMLTableConnector Example

``` JavaScript
async function run() {
    const connector = new DataConnector.types.HTMLTable({
        table: document.querySelector('#table');
    });
    await connector.load();
}
run();
```



JSONConnector
-------------

The `JSONConnector` supports loading data in a row-oriented structure as found
in Highcharts series types. The connector options can also control how columns
and rows are structured in the JSON array to support other structures. See the
[API documentation](https://api.highcharts.com/dashboards/#interfaces/Data_Connectors_JSONConnectorOptions.JSONConnectorOptions-1)
for all possible combinations.

### JSONConnector Example

``` JavaScript
async function run() {
    const connector = new DataConnector.types.JSON({
        data: [
            ['row 1', 1, 2, 3],
            ['row 2', 2, 3, 4],
            ['row 3', 0, 1, 2]
        ]
    });
    await connector.load();
}
run();
```



Custom Data Connectors
----------------------

It is possible to create additional DataConnectors based on the `DataConnector`
base class. An implementation has usually three steps to fulfill:

1. Load the data from the source and react to possible transaction errors.

2. Create a `DataTable` and add the data to it.

3. Make the table available and in case of related options update the table with
   incoming changes from the source.

You can see a typical implementation of this in the
[GoogleSheetsConnector](https://github.com/highcharts/highcharts/blob/master/ts/Data/Connectors/GoogleSheetsConnector.ts).
Please note that the included connectors use a separate converter instance for
the second step regarding adding the data to the `DataTable`.

### Custom Connector Tutorial

This tutorial shows how to implement a `Custom Data Connector` for the *MQTT protocol* and how to deploy it in a simple Highcharts Dashboards application. The connector is implemented in JavaScript and is independent of the application.

#### About MQTT
[MQTT](https://en.wikipedia.org/wiki/MQTT) is the de-facto standard protocol for low resource, low power devices and is widely used in [IoT](https://en.wikipedia.org/wiki/Internet_of_things) applications across a wide range of industries: Mobile Internet, Smart Hardware, Internet of Vehicles, Smart Cities, Telemedicine, Power, Oil, Energy, and other fields.

The hub of the MQTT network infrastructure is the so-called broker, a server that applications can send messages to and where clients (e.g. a web application) can subscribe to a *topic*. MQTT is a protocol on top of TCP/IP, for web clients available as [WebSocket](https://en.wikipedia.org/wiki/WebSocket).

##### Data
The data in an MQTT packet is a JSON object, consisting of the *topic* and a application specific payload. The payload is usually a hierarchical object.

##### Connecting
Establish a data link to a MQTT broker typically consists of these steps:
* Connect to the server with a given host name and port number, and optional authentication credentials (user, password).
* Wait for a successful connection.
* Subscribe to one or more topics
* Wait for confirmation of the subscription.
* Packets now arrive at a rate determined by the data provider (often a wireless sensor application).
* Process the incoming packets.

The MQTT client may also send packets to a broker but this feature is not implemented in the Data Connector we use for this tutorial.

#### MQTT Custom Connector

The base class for the `MQTTConnector` is the `DataConnector` where the constructor and the `load` methods are re-implemented. The `load` method differs from that of the CSV and JSON connectors by not waiting for data to arrive (due to the nature of the MQTT protocol there may not be any data available immediately). It does however establish the connection and subscribes to the subject defined in the connector `options` providing the `autoConnect` and `autoSubscribe` options are set (this is the default behavior).

The `MQTT Connector` uses the `JSONConverter` for parsing and thus provides the application with a `beforeParse` callback that is invoked on every packet reception. This callback is crucial to implementing an application because the payload of the incoming packet typically is a hierarchical JSON object but Dashboards requires a single-level data structure.

In addition, the `MQTTConnector` provides these custom methods:
* connect
* subscribe
* unsubscribe
* disconnect

In a typical application these are not needed as the whole connect/subscribe sequence is executed by default in the `load` method.

The `MQTT` connector supports the following callbacks (event handlers):

* beforeParse - fired before an incoming packet is parsed
* connectEvent - covers both connect/disconnect
* subscribeEvent - covers subscribe/unsubscribe
* packetEvent - fired on an incoming packet
* errorEvent - reports errors from the MQTT client or the connector

Although the `JSONConnector` and the `MQTTConnector` have much in common there are some important differences:

* The MQTT Connector does not use polling
* The `load` method does not return any data
* The `orientation` option is fixed to `columns`
* The options `dataUrl`, `dataModifier` and `firstRowAsNames` are not supported
* The options `autoConnect` and `autoSubscribe` are specific to the MQTT connector

#### MQTT client options

The `MQTTConnector` uses the [PAHO client library](https://eclipse.dev/paho/index.php?page=clients/js/index.php) (version 1.1.0) for access control and communication with the MQTT Broker. This library supports MQTT versions 3.1 and 3.1.1.

The client options are the following:

* host - the name of the MQTT broker (e.g. mqtt.mosquitto.com or mqtt.sognekraft.no)
* port - 8083 for secure connections, otherwise 1083
* user - empty for anonymous clients
* password - empty for anonymous clients
* useSSL - true for a secure connection
* topic - MQTT topic
* timeout - connection timeout, value in seconds
* qOs - quality of service

#### The sample application

The `MQTTConnector`is implemented as part of a sample application that uses data from the Norwegian electricity producer `Sognekraft`. The incoming payload is a hierarchical JSON structure with many measured values but for the purpose of this sample we use only the generated power. The connection uses SSL encryption and is password protected, receiving data on a `WebSocket` (TCP/IP).

The data is provided as one topic for each of the two power plants, and each topic maps to a connector instance. In the demo we thus use two connectors.

Each connector provides data for a `spline`chart and a `DataGrid` component. The timestamped events and the raw data are displayed in a `HTML component` as unformatted text. The user can clear the log.

Data packets arrive every 2 minutes so the user will have to wait some minutes before a meaningful chart and data grid is drawn.

#### Reuse

The `MQTTConnector` can be reused for other applications by simply copying the entire class from the demo's Javascript file. The implementation is found at the bottom of the file. It is important to copy also the `MQTTConnector.defaultOptions` and the code line that registers the connector as a `Dashboards` component.

```javascript
// Register the connector
MQTTConnector.registerType('MQTT', MQTTConnector);
```

<iframe style="width: 100%; height: 450px; border: none;" src="https://www.highcharts.com/samples/embed/dashboards/data/mqtt-connector" allow="fullscreen"></iframe>
