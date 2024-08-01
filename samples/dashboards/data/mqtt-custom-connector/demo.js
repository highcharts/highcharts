/* *
 *
 *  Sample application using a custom MQTT connector
 *
 * */


// MQTT connection configuration
const mqttConfig = {
    host: 'mqtt.sognekraft.no',
    port: 8083,
    user: 'highsoft',
    password: 'Qs0URPjxnWlcuYBmFWNK',
    connectionHandler: function (isConnected) {
        console.log('MQTT broker connection:', isConnected);
    },
    errorHandler: function (error) {
        console.error('Error:', error);
    }
};

// Connector configuration
const connConfig = {
    firstRowAsNames: false,
    columnNames: [
        'Generator',
        'Generated power',
        'Maximum power'
    ],
    beforeParse: data => {
        // Application specific data parsing, extracts power production data
        const modifiedData = [];
        if (data.aggs) {
            const plantName = data.name;
            data.aggs.forEach(agg => {
                const name = `${plantName} - ${agg.name}`;
                modifiedData.push([name, agg.P_gen, agg.P_max]);
            });
        }
        return modifiedData;
    }
};


// Create the dashboard
function createDashboard() {

    return Dashboards.board('container', {
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
                id: 'mqtt-data-1'
            },
            chartOptions: {
                chart: {
                    type: 'column',
                    animation: true
                },
                title: {
                    text: 'Production'
                }
            }
        }, {
            renderTo: 'data-grid-1',
            type: 'DataGrid',
            connector: {
                id: 'mqtt-data-1'
            }
        }, {
            renderTo: 'column-chart-2',
            type: 'Highcharts',
            connector: {
                id: 'mqtt-data-2'
            },
            chartOptions: {
                chart: {
                    type: 'column',
                    animation: true
                },
                title: {
                    text: 'Production'
                }
            }
        }, {
            renderTo: 'data-grid-2',
            type: 'DataGrid',
            connector: {
                id: 'mqtt-data-2'
            }
        }],
        gui: {
            layouts: [{
                rows: [{
                    cells: [{
                        id: 'column-chart-1'
                    }, {
                        id: 'data-grid-1'
                    }]
                }, {
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
 *  MQTT connector class - custom connector
 *
 * */

/* eslint-disable no-underscore-dangle */
const modules = Dashboards._modules;

const DataConnector = modules['Data/Connectors/DataConnector.js'];
const JSONConverter = modules['Data/Converters/JSONConverter.js'];
const U = modules['Core/Utilities.js'];
const { merge } = U;

// Connector instances, indexed by clientID
const instanceTable = {};

// eslint-disable-next-line no-undef
const MQTTClient = Paho.MQTT.Client;


/* *
 *
 *  Class
 *
 * */

class MQTTConnector extends DataConnector {
    /**
     * Constructs an instance of MQTTConnector
     *
     * @param {MQTTConnector.UserOptions} [options]
     * Options for the connector and converter.
     */
    constructor(options) {
        const mergedOptions = merge(
            MQTTConnector.defaultOptions,
            options
        );
        super(mergedOptions);
        this.converter = new JSONConverter(mergedOptions);
        this.options = mergedOptions;

        // Set up event handlers
        this.connectionHandler = options.connectionHandler;

        // Connection status
        this.connected = false;
        this.packetCount = 0;

        // Generate a unique client ID
        const clientID = 'clientID-' + Math.floor(Math.random() * 10000);
        this.clientID = clientID;

        // Store connector instance (for use in callbacks from MQTT client)
        instanceTable[clientID] = this;
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Sets up the MQTT connection and subscribes to the topic.
     *
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {Promise<this>}
     * Same connector instance with modified table.
     */
    async load(eventDetail) {
        const connector = this,
            table = connector.table,
            {
                data, host, port
            } = connector.options;

        connector.emit({
            type: 'load',
            data,
            detail: eventDetail,
            table
        });

        // Start MQTT client
        this.mqtt = new MQTTClient(host, port, this.clientID);
        this.mqtt.onConnectionLost = this.onConnectionLost;
        this.mqtt.onMessageArrived = this.onMessageArrived;

        await this.connect();

        return connector;
    }

    /**
     * Connects to an MQTT broker.
     *
     * @param {url} [string]
     * URL of the MQTT broker, e.g. 'wss://mqtt.eclipse.org:443/mqtt'.
     *
     * @return {Promise<this>}
     * Return same instance of MqttConnector.
     */
    async connect() {
        if (this.connected) {
            throw Error('Already connected');
        }
        const { user, password, timeout } = this.options;

        // Connect to broker
        this.mqtt.connect({
            useSSL: true,
            timeout: timeout,
            cleanSession: true,
            onSuccess: () => this.onConnect(),
            onFailure: resp => this.onFailure(resp),
            userName: user,
            password: password
        });
    }

    /**
     * Disconnects from an MQTT broker.
     *
     */
    async disconnect() {
        if (this.connected) {
            this.mqtt.disconnect();
        }
    }

    /**
     * Subscribe to an MQTT topic.
     *
     */
    async subscribe() {
        if (this.connected) {
            const { topic, qOs } = this.options;
            this.mqtt.subscribe(topic, { qos: qOs });
            return;
        }
        throw Error('Not connected: subscription not possible');
    }

    /**
     * Unsubscribe from an MQTT topic.
     *
     */
    unsubscribe() {
        if (this.connected) {
            this.mqtt.unsubscribe(this.options.topic);
        }
    }

    /**
     * Handle established connection
     *
     */
    onConnect() {
        this.connected = true;
        this.connectionHandler(true);

        // Subscribe to the topic
        this.subscribe();
    }

    /**
     * Handle incoming messages
     *
     */
    onMessageArrived(mqttPacket) {
        // Executes in Paho.MQTT.Client context
        const connector = instanceTable[this.clientId],
            converter = connector.converter,
            table = connector.table;

        connector.packetCount++;

        // Parse the message
        const data = JSON.parse(mqttPacket.payloadString);
        converter.parse({ data });

        // Update the data table
        table.deleteColumns();
        table.setColumns(converter.getTable().getColumns());
        table.setRowKeysColumn(data.length);
    }

    /**
     * Handle lost connection
     *
     */
    onConnectionLost(responseObject) {
        // Executes in Paho.MQTT.Client context
        if (responseObject.errorCode !== 0) {
            console.log('onConnectionLost:', responseObject.errorMessage);
        }
        const connector = instanceTable[this.clientId];
        connector.connected = false;
        connector.packetCount = 0;

        // Execute custom connection handler
        if (connector.options.connectionHandler) {
            connector.options.connectionHandler(false);
        }
    }

    /**
     * Handle failure
     *
     */
    onFailure(response) {
        console.error('Failed to connect:', response);
        this.connected = false;
        this.packetCount = 0;

        // Execute custom error handler
        if (this.options.errorHandler) {
            this.options.errorHandler(response);
        }
    }
}

/**
 *
 *  Static Properties
 *
 */
MQTTConnector.defaultOptions = {
    host: 'test.mosquitto.org',
    port: 1883,
    user: '',
    password: '',
    timeout: 10,
    qOs: 0,  // Quality of Service
    topic: 'mqtt',
    firstRowAsNames: true
};

// Register the connector
MQTTConnector.registerType('MQTT', MQTTConnector);

/**
 *
 *  Launch the application
 *
 */
createDashboard();
