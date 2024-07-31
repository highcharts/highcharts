/* eslint-disable no-underscore-dangle */
const modules = Dashboards._modules;

const JSONConnector = modules['Data/Connectors/JSONConnector.js'];
const JSONConverter = modules['Data/Converters/JSONConverter.js'];
const U = modules['Core/Utilities.js'];

/* *
 *
 *  Custom Connector for MQTT.
 *
 *  Author(s):
 *  - Jomar Hønsi
 *
 * */

const { merge } = U;

/* *
 *
 *  Class
 *
 * */

class MQTTConnector extends JSONConnector {
    /* *
     *
     *  Constructor
     *
     * */
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
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Connects to an MQTT broker.
     *
     * @param {url} [string]
     * URL of the MQTT broker, e.g. 'wss://mqtt.eclipse.org:443/mqtt'.
     *
     * @return {Promise<this>}
     * Return same instance of MqttConnector.
     */
    connect(url, user, password, eventDetail) {
        const connector = this,
            converter = connector.converter,
            table = connector.table,
            { dataModifier, firstRowAsNames } = connector.options;

        connector.emit({
            type: 'connect',
            detail: eventDetail,
            table,
            url
        });
    }

    /**
     * Disconnects from an MQTT broker.
     *
     */
    disconnect(eventDetail) {
        const connector = this,
            converter = connector.converter,
            table = connector.table,
            { dataModifier, firstRowAsNames, url } = connector.options;

        connector.emit({
            type: 'disconnect',
            detail: eventDetail,
            table,
            url
        });
    }

    /**
     * Subscribe to an MQTT topic.
     *
     */
    subscribe(topic, eventDetail) {
        const connector = this,
            converter = connector.converter,
            table = connector.table,
            { dataModifier, firstRowAsNames, url } = connector.options;

        connector.emit({
            type: 'subscribe',
            detail: eventDetail,
            table,
            url
        });
    }

    /**
     * Unsubscribe from an MQTT topic.
     *
     */
    unsubscribe(topic, eventDetail) {
        const connector = this,
            converter = connector.converter,
            table = connector.table,
            { dataModifier, firstRowAsNames, url } = connector.options;

        connector.emit({
            type: 'subscribe',
            detail: eventDetail,
            table,
            url
        });
    }
}

/**
 *
 *  Static Properties
 *
 */
MQTTConnector.defaultOptions = {
    host: 'mqtt.sognekraft.no',
    port: 8083,
    user: 'highsoft',
    password: 'Qs0URPjxnWlcuYBmFWNK',
    timeout: 10,
    qOs: 0,  // Quality of Service
    topic: 'prod/+/+/overview',
    firstRowAsNames: true
};

MQTTConnector.registerType('MQTT', MQTTConnector);


/* *
 *
 *  Start of demo section
 *
 * */

// MQTT configuration
const mqttConfig = {
    host: 'mqtt.sognekraft.no',
    port: 8083,
    user: 'highsoft',
    password: 'Qs0URPjxnWlcuYBmFWNK',
    timeout: 10,
    qOs: 0,  // Quality of Service
    topic: 'prod/+/+/overview'
};

// Instantiate the connector
Dashboards.board('container', {
    dataPool: {
        connectors: [{
            // ...mqttConfig,
            type: 'MQTT',
            id: 'fetched-data',
            options: {
                firstRowAsNames: false,
                dataRefreshRate: 5,
                enablePolling: true,
                columnNames: ['time', 'value', 'rounded'],
                dataUrl: 'https://demo-live-data.highcharts.com/time-rows.json',
                beforeParse: function (data) {
                    data.map(el => el.push(Math.round(el[1])));

                    return data;
                }
            }
        }]
    },
    components: [{
        renderTo: 'chart',
        type: 'Highcharts',
        connector: {
            id: 'fetched-data'
        }
    }, {
        renderTo: 'fetched-columns',
        type: 'DataGrid',
        connector: {
            id: 'fetched-data'
        }
    }],
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'chart'
                }, {
                    id: 'fetched-columns'
                }]
            }]
        }]
    }
}, true);
