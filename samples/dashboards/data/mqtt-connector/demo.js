/* *
 *
 *  Sample application using a MQTT connector (custom connector)
 *
 * */

// Global board instance for use in event handlers
let board = null;


// Highcharts common options
Highcharts.setOptions({
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
            text: 'Power (MW)'
        }
    },
    tooltip: {
        useHTML: true,
        formatter: function () {
            const date = Highcharts.dateFormat('%A, %b %e, %H:%M', this.x);
            return `<b>${date} (UTC)</b><hr>Generated power: ${this.y} MW<br/>`;
        }
    }
});

const dataGridOptions = {
    cellHeight: 38,
    editable: false,
    columns: {
        time: {
            headerFormat: 'Time (UTC)',
            cellFormatter: function () {
                const date = new Date(this.value);
                return Highcharts.dateFormat('%H:%M', date);
            }
        },
        power: {
            headerFormat: 'Power (MW)'
        }
    }
};

// MQTT connection configuration
const mqttConfig = {
    host: 'mqtt.sognekraft.no',
    port: 8083,
    user: 'highsoft',
    password: 'Qs0URPjxnWlcuYBmFWNK'
};

// Connector configuration
const connConfig = {
    columnNames: [
        'time',
        'power'
    ],
    beforeParse: data => {
        // Application specific data parsing, extracts power production data
        const modifiedData = [];
        if (data.aggs) {
            const ts = new Date(data.tst_iso).valueOf();
            // Generated power in MW
            modifiedData.push([ts, data.aggs[0].P_gen]);
        }
        return modifiedData;
    },
    connectEvent: (isConnected, host, port, user) => {
        setConnectStatus(isConnected);
        // eslint-disable-next-line max-len
        logAppend(`Client ${isConnected ? 'connected' : 'disconnected'}: host: ${host}, port: ${port}, user: ${user}`);
    },
    subscribeEvent: (isSubscribed, topic) => {
        logAppend(
            `Client ${isSubscribed ? 'subscribed' : 'unsubscribed'}: ${topic}`
        );
    },
    packetEvent: (topic, packet, packetCount) => {
        if (packetCount === 1) {
            // Extract data that are only needed at startup
            const data = JSON.parse(packet);
            setPowerPlantName(topic, data.name);
        }
        logAppend(`Packet #${packetCount} received: ${topic} - ${packet}`);
    },
    errorEvent: error => {
        setConnectStatus(false);
        logAppend(`<span style="color:red">${error}</span>`);
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
                    ...mqttConfig,
                    topic: 'prod/DEMO_Highsoft/kraftverk_1/overview',
                    ...connConfig
                }
            }, {
                type: 'MQTT',
                id: 'mqtt-data-2',
                options: {
                    ...mqttConfig,
                    topic: 'prod/DEMO_Highsoft/kraftverk_2/overview',
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
                    seriesId: 'power',
                    data: ['time', 'power']
                }]
            },
            sync: {
                highlight: true
            },
            chartOptions: {
                title: {
                    text: 'Power Station 1'
                }
            }
        }, {
            renderTo: 'data-grid-1',
            type: 'DataGrid',
            connector: {
                id: 'mqtt-data-1'
            },
            sync: {
                highlight: true
            },
            dataGridOptions: dataGridOptions
        }, {
            renderTo: 'column-chart-2',
            type: 'Highcharts',
            connector: {
                id: 'mqtt-data-2',
                columnAssignment: [{
                    seriesId: 'power',
                    data: ['time', 'power']
                }]
            },
            sync: {
                highlight: true
            },
            chartOptions: {
                title: {
                    text: 'Power Station 2'
                }
            }
        }, {
            renderTo: 'data-grid-2',
            type: 'DataGrid',
            connector: {
                id: 'mqtt-data-2'
            },
            sync: {
                highlight: true
            },
            dataGridOptions: dataGridOptions
        }, {
            renderTo: 'html-log',
            type: 'HTML',
            title: 'MQTT Event Log',
            html: '<pre id="log-content"></pre>'
        },  {
            renderTo: 'app-control',
            type: 'HTML',
            html: '<button id="clear-log">Clear log</button>' +
            '<span id="connect-status">disconnected</span>'
        }],
        gui: {
            layouts: [{
                rows: [{
                    // For power station 1
                    cells: [{
                        id: 'column-chart-1'
                    }, {
                        id: 'data-grid-1'
                    }]
                }, {
                    // For power station 2
                    cells: [{
                        id: 'column-chart-2'
                    }, {
                        id: 'data-grid-2'
                    }]
                }, {
                    // Log/info area
                    cells: [{
                        id: 'html-log'
                    }]
                }, {
                    // Application control
                    cells: [{
                        id: 'app-control'
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
    // Initialize log
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
    logContent.innerHTML = `${time}: ${message}\n` + logContent.innerHTML;
}

function logClear() {
    logContent.innerHTML = '';
}

function setConnectStatus(isConnected) {
    connectStatus.innerHTML = isConnected ? 'connected' : 'disconnected';
    connectStatus.style.color = isConnected ? 'green' : 'red';
}

function setPowerPlantName(topic, name) {
    let component;

    if (topic.includes('kraftverk_1')) {
        component = board.getComponentByCellId('column-chart-1');
    } else if (topic.includes('kraftverk_2')) {
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
    logAppend('Power plant name: ' + name);
}

/* *
 *
 * MQTT connector class - custom connector
 *
 *
 * Paho MQTT library documentation
 *
 * https://bito.ai/resources/paho-mqtt-javascript-javascript-explained/
 * https://eclipse.dev/paho/files/jsdoc/Paho.MQTT.Client.html
 *
 */

let MQTTClient;
try {
    // eslint-disable-next-line no-undef
    MQTTClient = Paho.MQTT.Client;
} catch (e) {
    console.error('Paho MQTT library not found:', e);
}

/* eslint-disable no-underscore-dangle */
const modules = Dashboards._modules;

const DataConnector = modules['Data/Connectors/DataConnector.js'];
const JSONConverter = modules['Data/Converters/JSONConverter.js'];
const U = modules['Core/Utilities.js'];
const { merge } = U;

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
        connectorTable[clientId] = this;
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Creates the MQTT client.
     *
     */
    async load() {
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
        const { topic, qOs, subscribeEvent, failureEvent } = this.options;
        this.mqtt.subscribe(topic, {
            qos: qOs,
            onSuccess: () => {
                if (subscribeEvent) {
                    subscribeEvent(true, topic);
                }
            },
            onFailure: response => {
                if (subscribeEvent) {
                    failureEvent(response.errorMessage);
                }
            },
            timeout: 10
        });
    }

    /**
     * Unsubscribe from an MQTT topic.
     *
     */
    unsubscribe() {
        const { topic, subscribeEvent, failureEvent } = this.options;

        this.mqtt.unsubscribe(topic, {
            onSuccess: () => {
                if (subscribeEvent) {
                    subscribeEvent(false, topic);
                }
            },
            onFailure: response => {
                if (subscribeEvent) {
                    failureEvent(response.errorMessage);
                }
            }
        });

        if (subscribeEvent) {
            subscribeEvent(false, topic);
        }
    }

    /**
     * Process connection success
     *
     */
    onConnect() {
        this.connected = true;
        const { host, port, user, connectEvent, autoSubscribe } = this.options;

        if (connectEvent) {
            connectEvent(true, host, port, user);
        }

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
        // Executes in Paho.MQTT.Client context
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
        const packetEvent = connector.options.packetEvent;
        if (packetEvent) {
            packetEvent(
                mqttPacket.destinationName,
                mqttPacket.payloadString,
                connector.packetCount
            );
        }
    }

    /**
     * Process lost connection
     *
     */
    onConnectionLost(response) {
        // Executes in Paho.MQTT.Client context
        const connector = connectorTable[this.clientId];
        connector.connected = false;
        connector.packetCount = 0;

        const { connectEvent, errorEvent } = connector.options;

        // Execute custom connection handler
        if (connectEvent) {
            connectEvent(false);
        }

        if (response.errorCode !== 0) {
            // Execute custom error handler
            if (errorEvent) {
                errorEvent(response.errorMessage);
            }
        }
    }

    /**
     * Process failure
     *
     */
    onFailure(response) {
        this.connected = false;
        this.packetCount = 0;

        // Execute custom error handler
        if (this.options.errorEvent) {
            this.options.errorEvent(response.errorMessage);
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
    host: 'test.mosquitto.org',
    port: 1883,
    user: '',
    password: '',
    timeout: 10,
    qOs: 0,  // Quality of Service
    topic: 'mqtt',
    useSSL: true,
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
