/* *
 *
 *  Sample application using a MQTT connector (custom connector),
 *  with one MQTT topic per connector. The example uses the public
 *  Hive MQTT test server, no user credentials nor encryption.
 *
 *  Format of the incoming packets (example):
 *  {
 *    "name": "North Sea",
 *    "value": 35.69,
 *    "timestamp": "2024-09-12T08:12:01.028Z"
 *  }
 *
 *  Valid MQTT topics: highcharts/topic1, highcharts/topic2
 *
 * */

// Global Dashboards instance for use in event handlers.
let board;

// Mapping of MQTT topics to Dashboards components
const topicMap = {
    'highcharts/topic1': {
        chart: 'column-chart-1',
        dataGrid: 'data-grid-1'
    },
    'highcharts/topic2': {
        chart: 'column-chart-2',
        dataGrid: 'data-grid-2'
    }
};

// Options for chart
const chartOptions = {
    chart: {
        type: 'spline'
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    xAxis: {
        type: 'datetime',
        labels: {
            format: '{value:%H:%M:%S}'
        }
    },
    yAxis: {
        title: {
            text: 'Wind speed (m/s)'
        }
    },
    tooltip: {
        useHTML: true,
        format: '<b>{x:%A, %b %e, %H:%M:%S} </b><hr>Wind speed: {y} m/s <br/>'
    }
};

// Options for datagrid
const dataGridOptions = {
    cellHeight: 30,
    editable: false,
    credits: {
        enabled: false
    },
    columns: [{
        id: 'time',
        header: {
            format: 'Time (UTC)'
        },
        cells: {
            formatter: function () {
                return Highcharts.dateFormat('%H:%M:%S', this.value);
            }
        }
    }, {
        id: 'value',
        header: {
            format: 'Wind speed (m/s)'
        },
        cells: {
            format: '{value:.1f}'
        }
    }]
};


// Connector configuration
const connConfig = {
    autoSubscribe: true,
    maxRows: 10,
    columnNames: [
        'time',
        'value'
    ],
    beforeParse: data => {
        // Application specific data parsing
        const modifiedData = [];
        const ts = new Date(data.timestamp).valueOf();

        modifiedData.push([ts, data.value]);

        return modifiedData;
    },
    connectEvent: event => {
        console.log('connectEvent:', event);
        const { connected, host, port } = event.detail;
        setConnectStatus(connected);
        // eslint-disable-next-line max-len
        logAppend(`Client ${connected ? 'connected' : 'disconnected'}: host: ${host}, port: ${port}`);
    },
    subscribeEvent: event => {
        const { subscribed, topic } = event.detail;
        logAppend(
            `Client ${subscribed ? 'subscribed' : 'unsubscribed'}: ${topic}`
        );
    },
    packetEvent: event => {
        const { topic, count } = event.detail;
        logAppend(`Packet #${count} received: ${topic}`);

        // Get components
        if (!topicMap[topic]) {
            logAppend('Invalid topic:', topic);
            return;
        }

        if (count === 1) {
            // Update the chart title
            const compInfo = topicMap[topic];
            const chartComp = board.getComponentByCellId(compInfo.chart);

            chartComp.update({
                chartOptions: {
                    title: {
                        text: event.data.name
                    }
                }
            });
        }
    },
    errorEvent: event => {
        const { code, message } = event.detail;
        logAppend(`${message} (error code #${code})`);
    }
};

async function createDashboard() {
    board = await Dashboards.board('container', {
        dataPool: {
            connectors: [{
                type: 'MQTT',
                id: 'mqtt-data-1',
                options: {
                    topic: Object.keys(topicMap)[0],
                    ...connConfig
                }
            }, {
                type: 'MQTT',
                id: 'mqtt-data-2',
                options: {
                    topic: Object.keys(topicMap)[1],
                    ...connConfig
                }
            }]
        },
        components: [{
            renderTo: 'column-chart-1',
            type: 'Highcharts',
            connector: {
                id: 'mqtt-data-1',
                columnAssignment: [{
                    seriesId: 'value',
                    data: ['time', 'value']
                }]
            },
            sync: {
                highlight: true
            },
            chartOptions: {
                ...chartOptions,
                title: {
                    text: 'No data 1'
                }
            }
        }, {
            renderTo: 'data-grid-1',
            type: 'DataGrid',
            connector: {
                id: 'mqtt-data-1'
            },
            sync: {
                highlight: {
                    enabled: true,
                    autoScroll: true
                }
            },
            dataGridOptions
        }, {
            renderTo: 'column-chart-2',
            type: 'Highcharts',
            connector: {
                id: 'mqtt-data-2',
                columnAssignment: [{
                    seriesId: 'value',
                    data: ['time', 'value']
                }]
            },
            sync: {
                highlight: true
            },
            chartOptions: {
                ...chartOptions,
                title: {
                    text: 'No data 2'
                }
            }
        }, {
            renderTo: 'data-grid-2',
            type: 'DataGrid',
            connector: {
                id: 'mqtt-data-2'
            },
            sync: {
                highlight: {
                    enabled: true,
                    autoScroll: true
                }
            },
            dataGridOptions: dataGridOptions
        }],
        gui: {
            layouts: [{
                rows: [{
                    // For topic 1
                    cells: [{
                        id: 'column-chart-1'
                    }, {
                        id: 'data-grid-1'
                    }]
                }, {
                    // For topic 2
                    cells: [{
                        id: 'column-chart-2'
                    }, {
                        id: 'data-grid-2'
                    }]
                }]
            }]
        }
    }, true);
}

/* *
 *
 *  Event log and application control functions
 *
 * */
let logContent;
let connectStatus;
let connectButton;

window.onload = () => {
    // Initialize the message log
    logContent = document.getElementById('log-content');
    logClear();
    logAppend('Application started');

    // Initialize connection status
    connectStatus = document.getElementById('connect-status');

    // Event listener for buttons
    const clearButton = document.getElementById('btn-clear-log');
    clearButton.addEventListener('click', () => {
        logClear();
        logAppend('Log cleared by user');
    });

    connectButton = document.getElementById('btn-connect');
    connectButton.addEventListener('click', async () => {
        async function toggleConnect(connName) {
            const con = await board.dataPool.getConnector(connName);
            if (con.connected) {
                await con.disconnect();
            } else {
                const { host, port } = con.options;
                logAppend(`Connecting to ${host}, port: ${port}`);
                await con.connect();
            }
        }
        // Connect/disconnect both connectors
        await toggleConnect('mqtt-data-1');
        await toggleConnect('mqtt-data-2');
    });
};

function logAppend(message) {
    // Prepend message with timestamp
    const time = new Date().toLocaleTimeString();
    logContent.innerText = `${time}: ${message}\n` + logContent.innerText;
}

function logClear() {
    logContent.innerText = '';
}

function setConnectStatus(connected) {
    connectButton.innerText = connected ? 'Disconnect' : 'Connect';
    connectStatus.innerText = connected ? 'connected' : 'disconnected';
}

/* *
 *
 * MQTT connector class - a custom DataConnector,
 * interfacing with the Paho MQTT client library.
 *
 *
 * Paho MQTT client documentation
 *
 * https://bito.ai/resources/paho-mqtt-javascript-javascript-explained/
 *
 */

let MQTTClient;
try {
    // eslint-disable-next-line no-undef
    MQTTClient = Paho.Client;
} catch (e) {
    console.error('Paho MQTT library not found:', e);
}

/* eslint-disable no-underscore-dangle */
const modules = Dashboards._modules;
const DataConnector = Dashboards.DataConnector;
// eslint-disable-next-line max-len
const JSONConverter = modules['Data/Converters/JSONConverter.js']; // TBD: use namespace when becoming available
const merge = Highcharts.merge;

// Connector instances
const connectorTable = {};

/* *
 *
 *  Class MQTTConnector
 *
 * */

class MQTTConnector extends DataConnector {
    /**
     * Creates an instance of the MQTTConnector, including the MQTT client.
     *
     */
    constructor(options) {
        const mergedOptions = merge(
            MQTTConnector.defaultOptions,
            options
        );
        super(mergedOptions);
        mergedOptions.firstRowAsNames = false;

        this.converter = new JSONConverter(mergedOptions);
        this.options = mergedOptions;
        this.connected = false;

        // Connection status
        this.packetCount = 0;

        // Generate a unique client ID
        const clientId = 'clientId-' + Math.floor(Math.random() * 10000);
        this.clientId = clientId;

        // Store connector instance (for use in callbacks from MQTT client)
        connectorTable[clientId] = this;

        // Register events
        this.registerEvents();

        const connector = this,
            {
                host, port
            } = connector.options;


        // Create MQTT client
        this.mqtt = new MQTTClient(host, port, this.clientId);
        this.mqtt.onConnectionLost = this.onConnectionLost;
        this.mqtt.onMessageArrived = this.onMessageArrived;
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Initiates the connection if autoConnect is set to true and
     * not already connected.
     *
     */
    async load() {
        const connector = this;

        if (connector.options.autoConnect && !connector.connected) {
            await this.connect();
        }
        super.load();

        return connector;
    }

    /**
     * Clear the data table and reset the packet count.
     *
     */
    async reset() {
        const connector = this,
            table = connector.table;

        connector.packetCount = 0;
        await table.deleteColumns();
    }

    /**
     * Connects to the MQTT broker.
     *
     */
    async connect() {
        const { user, password, timeout, useSSL, cleanSession } = this.options;

        // Connect to broker
        this.mqtt.connect({
            useSSL: useSSL,
            timeout: timeout,
            cleanSession: cleanSession,
            onSuccess: () => this.onConnect(),
            onFailure: resp => this.onFailure(resp),
            userName: user,
            password: password
        });
    }

    /**
     * Disconnects from the MQTT broker.
     *
     */
    async disconnect() {
        this.mqtt.disconnect();
    }

    /**
     * Subscribe to an MQTT topic.
     *
     */
    async subscribe() {
        const { topic, qOs, autoReset } = this.options;

        if (autoReset) {
            // Reset the data table
            await this.reset();
        }

        this.mqtt.subscribe(topic, {
            qos: qOs,
            onSuccess: () => {
                this.emit({
                    type: 'subscribeEvent',
                    detail: {
                        subscribed: true,
                        topic: topic
                    }
                });
            },
            onFailure: response => {
                // Execute custom error handler
                this.onFailure(response);
            },
            timeout: 10
        });
    }

    /**
     * Unsubscribe from an MQTT topic.
     *
     */
    unsubscribe() {
        const { topic } = this.options;

        this.mqtt.unsubscribe(topic, {
            onSuccess: () => {
                this.emit({
                    type: 'subscribeEvent',
                    detail: {
                        subscribed: false,
                        topic: topic
                    }
                });
            },
            onFailure: response => {
                // Execute custom error handler
                this.onFailure(response);
            }
        });
    }

    /**
     * Process connection success
     *
     */
    onConnect() {
        const { host, port, user, autoSubscribe } = this.options;

        this.connected = true;

        // Execute custom connect handler
        this.emit({
            type: 'connectEvent',
            detail: {
                connected: true,
                host: host,
                port: port,
                user: user
            }
        });

        // Subscribe to the topic
        if (autoSubscribe) {
            this.subscribe();
        }
    }

    /**
     * Process incoming message
     *
     */
    async onMessageArrived(mqttPacket) {
        // Executes in Paho.Client context
        const connector = connectorTable[this.clientId],
            converter = connector.converter,
            connTable = connector.table;

        // Parse the packets
        let data;
        const payload = mqttPacket.payloadString;
        try {
            data = JSON.parse(payload);
        } catch (e) {
            connector.emit({
                type: 'errorEvent',
                detail: {
                    code: -1,
                    message: 'Invalid JSON: ' + payload,
                    jsError: e
                }
            });
            return; // Skip invalid packets
        }

        converter.parse({ data });
        const convTable = converter.getTable();
        const nRowsCurrent = connTable.getRowCount();

        if (nRowsCurrent === 0) {
            // Initialize the table on first packet
            connTable.setColumns(convTable.getColumns());
        } else {
            const maxRows = connector.options.maxRows;
            const nRowsParsed = convTable.getRowCount();

            if (nRowsParsed === 1) {
                const rows = convTable.getRows();
                // One row, append to table
                if (nRowsCurrent === maxRows) {
                    // Remove the oldest row
                    connTable.deleteRows(0, 1);
                }
                connTable.setRows(rows);
            } else {
                // Multiple rows, replace table content
                const rows = convTable.getRows();

                if (nRowsParsed >= maxRows) {
                    // Get the newest 'maxRows' rows
                    rows.splice(0, nRowsParsed - maxRows);
                    connTable.deleteRows();
                }
                connTable.setRows(rows);
            }
        }
        connector.packetCount++;

        // Execute custom packet handler
        connector.emit({
            type: 'packetEvent',
            data,
            detail: {
                topic: mqttPacket.destinationName,
                count: connector.packetCount
            }
        });
    }

    /**
     * Process lost connection
     *
     */
    onConnectionLost(response) {
        // Executes in Paho.Client context
        const connector = connectorTable[this.clientId];
        const { host, port, user } = connector.options;

        // Execute custom connect handler
        connector.emit({
            type: 'connectEvent',
            detail: {
                connected: false,
                host: host,
                port: port,
                user: user
            }
        });

        if (response.errorCode === 0) {
            connector.connected = false;

            return;
        }

        // Execute custom error handler
        connector.onFailure(response);
    }

    /**
     * Process failure
     *
     */
    onFailure(response) {
        this.connected = false;
        this.packetCount = 0;

        // Execute custom error handler
        this.emit({
            type: 'errorEvent',
            detail: {
                code: response.errorCode,
                message: response.errorMessage
            }
        });
    }

    /**
     * Register events
     *
     */
    registerEvents() {
        const connector = this;
        // Register general connector events (load, afterLoad, loadError)
        // Not used, included for reference only.
        connector.on('load', event => {
            console.log('Connector load event:', event);
        });

        connector.on('afterLoad', event => {
            console.log('Connector afterLoad event:', event);
        });

        connector.on('loadError', event => {
            console.log('Connector loadError event:', event);
        });

        // Register MQTT specific connector events
        if (connector.options.connectEvent) {
            connector.on('connectEvent', connector.options.connectEvent);
        }

        if (connector.options.subscribeEvent) {
            connector.on('subscribeEvent', connector.options.subscribeEvent);
        }

        if (connector.options.packetEvent) {
            connector.on('packetEvent', connector.options.packetEvent);
        }

        if (connector.options.errorEvent) {
            connector.on('errorEvent', connector.options.errorEvent);
        }
    }
}

/**
 *
 *  Static Properties
 *
 */
MQTTConnector.defaultOptions = {
    // MQTT client properties
    host: 'broker.hivemq.com',
    port: 8000,
    user: '',
    password: '',
    topic: 'highcharts/test',
    timeout: 10,
    qOs: 0,  // Quality of Service
    useSSL: false,
    cleanSession: true,

    // Custom connector properties
    autoConnect: false,  // Automatically connect after load
    autoSubscribe: false, // Automatically subscribe after connect
    autoReset: false,   // Clear data table on subscribe
    maxRows: 100
};

// Register the connector
MQTTConnector.registerType('MQTT', MQTTConnector);

/**
 *
 *  Launch the application
 *
 */
createDashboard();
