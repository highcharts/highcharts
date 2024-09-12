/* *
 *
 *  Sample application using a MQTT connector (custom connector),
 *  one MQTT topic per connector. The example uses the public
 *  HIVE MQTT test server, no user credentials required, not encrypted.
 *
 *  Format of the incoming packets (example):
 *  {
 *    "name": "North Sea",
 *    "unit": "m/s",
 *    "value": 35.69,
 *    "timestamp": "2024-09-12T08:12:01.028Z"
 *  }
 *
 *  Valid MQTT topics: highsoft/test/topic1, highsoft/test/topic2
 *
 * */

// Global Dashboards instance for use in event handlers.
let board = null;

// Options for chart
const chartOptions = {
    chart: {
        type: 'spline',
        animation: true
    },
    legend: {
        enabled: false
    },
    xAxis: {
        type: 'datetime',
        labels: {
            format: '{value:%H:%M}'
        }
    },
    yAxis: {
        title: {
            text: 'Wind speed (m/s)'
        }
    },
    tooltip: {
        useHTML: true,
        formatter: function () {
            const date = Highcharts.dateFormat('%A, %b %e, %H:%M', this.x);
            return `<b>${date} (UTC)</b><hr>Wind speed: ${this.y} m/s <br/>`;
        }
    }
};

// Options for datagrid
const dataGridOptions = {
    cellHeight: 38,
    editable: false,
    columns: {
        time: {
            headerFormat: 'Time (UTC)',
            cellFormatter: function () {
                const date = new Date(this.value);
                return Highcharts.dateFormat('%H:%M:%S', date);
            }
        },
        value: {
            headerFormat: 'Wind speed (m/s)'
        }
    }
};


// Connector configuration
const connConfig = {
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
        if (count === 1) {
            setChartTitle(topic, event.data.name);
        }
        logAppend(`Packet #${count} received: ${topic}`);
    },
    errorEvent: event => {
        const { code, message } = event.detail;
        setConnectStatus(false);
        // eslint-disable-next-line max-len
        logAppend(`${message} (error code #${code})`);
    }
};


// Create the board
async function createDashboard() {
    board = await Dashboards.board('container', {
        dataPool: {
            connectors: [{
                type: 'MQTT',
                id: 'mqtt-data-1',
                options: {
                    topic: 'highsoft/test/topic1',
                    ...connConfig
                }
            }, {
                type: 'MQTT',
                id: 'mqtt-data-2',
                options: {
                    topic: 'highsoft/test/topic2',
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
            dataGridOptions: dataGridOptions
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

window.onload = () => {
    // Initialize the message log
    logContent = document.getElementById('log-content');
    logClear();
    logAppend('Application started');

    // Initialize connection status
    connectStatus = document.getElementById('connect-status');

    // Add event listener to clear log button
    const clearButton = document.getElementById('clear-log');
    clearButton.addEventListener('click', () => {
        logClear();
        logAppend('Log cleared by user');
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
    connectStatus.innerText = connected ? 'connected' : 'disconnected';
    connectStatus.style.color = connected ? 'green' : 'red';
}

function setChartTitle(topic, name) {
    let component;

    if (topic.includes('topic1')) {
        component = board.getComponentByCellId('column-chart-1');
    } else if (topic.includes('topic2')) {
        component = board.getComponentByCellId('column-chart-2');
    }

    // Update chart title
    component.update({
        chartOptions: {
            title: {
                text: name
            }
        }
    });
    logAppend('Data object name: ' + name);
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
     * Constructs an instance of MQTTConnector.
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

        // Connection status
        this.packetCount = 0;

        // Generate a unique client ID
        const clientId = 'clientId-' + Math.floor(Math.random() * 10000);
        this.clientId = clientId;

        // Store connector instance (for use in callbacks from MQTT client)
        const connector = this;
        connectorTable[clientId] = connector;

        // Register events
        connector.registerEvents();
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Creates the MQTT client and initiates the connection
     * if autoConnect is set to true.
     *
     */
    async load() {
        super.load();

        const connector = this,
            {
                host, port, autoConnect
            } = connector.options;

        // Start MQTT client
        this.mqtt = new MQTTClient(host, port, this.clientId);
        this.mqtt.onConnectionLost = this.onConnectionLost;
        this.mqtt.onMessageArrived = this.onMessageArrived;

        if (autoConnect) {
            await this.connect();
        }

        return connector;
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
        const { topic, qOs } = this.options;
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
    onMessageArrived(mqttPacket) {
        console.log(mqttPacket.destinationName);
        console.log(mqttPacket.payloadString);

        // Executes in Paho.Client context
        const connector = connectorTable[this.clientId],
            converter = connector.converter,
            connTable = connector.table;

        // Parse the message
        const data = JSON.parse(mqttPacket.payloadString);
        converter.parse({ data });
        const convTable = converter.getTable();

        // Append the incoming data to the current table
        if (connTable.getRowCount() === 0) {
            // First message, initialize columns for data storage
            connTable.setColumns(convTable.getColumns());
        } else {
            // Subsequent message, append as row
            connTable.setRows(convTable.getRows());
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
    timeout: 10,
    qOs: 0,  // Quality of Service
    topic: 'highsoft',
    useSSL: false,
    cleanSession: true,

    // Custom connector properties
    autoConnect: true,
    autoSubscribe: true
};

// Register the connector
MQTTConnector.registerType('MQTT', MQTTConnector);

/**
 *
 *  Launch the application
 *
 */
createDashboard();
