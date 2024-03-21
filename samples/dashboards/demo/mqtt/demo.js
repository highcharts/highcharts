let board = null;
const powerUnit = 'kWh';


const kpiGaugeOptions = {
    chart: {
        type: 'solidgauge'
    },
    pane: {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },
    yAxis: {
        labels: {
            distance: '105%',
            y: 5,
            align: 'auto'
        },
        lineWidth: 2,
        minorTicks: false,
        tickWidth: 2,
        tickAmount: 2,
        visible: true
    },
    accessibility: {
        typeDescription: 'Gauge chart with 1 data point.'
    }
};


function createDataConnector(connId) {
    return {
        id: connId,
        type: 'JSON',
        options: {
            firstRowAsNames: true,
            data: [
                ['time', 'power'],
                // Test data: to be removed
                [Date.UTC(2024, 0, 1), 0]
            ],
            dataModifier: {
                type: 'Sort',
                orderByColumn: 'time'
            }
        }
    };
}


function createKpiComponent(unitIndex, title) {
    return {
        type: 'KPI',
        renderTo: 'kpi-agg-' + unitIndex,
        value: 0,
        valueFormat: '{value}',
        title: title,
        chartOptions: {
            chart: kpiGaugeOptions.chart,
            pane: kpiGaugeOptions.pane,
            yAxis: {
                ...kpiGaugeOptions.yAxis,
                min: 0,
                max: 20, // TBD: use actual data from power generation unit
                accessibility: {
                    description: title
                }
            }
        }
    };
}


function createChartComponent(connId, unitIndex, title) {
    return {
        type: 'Highcharts',
        renderTo: 'chart-agg-' + unitIndex,
        connector: {
            id: connId,
            columnAssignment: [{
                seriesId: title,
                data: ['time', 'power']
            }]
        },
        sync: {
            visibility: true,
            extremes: true,
            highlight: true
        },
        chartOptions: {
            chart: {
                type: 'spline',
                styledMode: true,
                animation: true
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: powerUnit
                }
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            title: {
                text: ''
            },
            tooltip: {
                valueSuffix: powerUnit
            }
        }
    };
}


function createDatagridComponent(connId, unitIndex, title) {
    return {
        type: 'DataGrid',
        renderTo: 'data-grid-' + unitIndex,
        connector: {
            id: connId
        },
        sync: {
            highlight: true,
            extremes: true,
            visibility: true
        },
        dataGridOptions: {
            editable: false,
            columns: {
                time: {
                    headerFormat: 'Time UTC',
                    cellFormatter: function () {
                        // eslint-disable-next-line max-len
                        return Highcharts.dateFormat('%Y-%m-%d', this.value) + ' ' + Highcharts.dateFormat('%H:%M', this.value);
                    }
                },
                power: {
                    headerFormat: title
                }
            }
        }
    };
}


// Launches the Dashboards application
async function setupDashboard(powerPlantInfo) {
    function createPowerGeneratorUnit() {
        const powerGenUnits = {
            connectors: [],
            components: []
        };

        for (let i = 0; i < powerPlantInfo.nAggs; i++) {
            // Power generator index (1...n)
            const unitIndex = i + 1;

            // Data connector ID
            const connId = 'mqtt-data-' + unitIndex;

            // Name of power generator unit
            const title = 'Aggregat ' + unitIndex;

            // Data connectors
            powerGenUnits.connectors.push(createDataConnector(connId));

            // Dash components
            powerGenUnits.components.push(createKpiComponent(unitIndex, title));
            powerGenUnits.components.push(
                createChartComponent(connId, unitIndex, title)
            );
            powerGenUnits.components.push(
                createDatagridComponent(connId, unitIndex, title)
            );
        }
        return powerGenUnits;
    }

    // Create configuration for power generator units
    const pu = createPowerGeneratorUnit();

    return await Dashboards.board('container', {
        dataPool: {
            connectors: pu.connectors
        },
        components: pu.components
    });
}


async function updateBoard(powerPlantInfo) {
    const dataPool = board.dataPool;
    for (let i = 0; i < powerPlantInfo.nAggs; i++) {
        const puId = i + 1;
        const dataTable = await dataPool.getConnectorTable('mqtt-data-' + puId);

        if (dataTable.getRowCount() === 0) {
            // Get power generation history history
            const hist = powerPlantInfo.aggs[i].P_hist;
            let time = new Date(hist.start).valueOf();

            const step = hist.res * 1000; // Resolution: seconds
            const rowData = [];
            const histLen = hist.values.length;

            for (let j = 0; j < histLen; j++) {
                const power = hist.values[j];

                // Add row with historical data (reversed)
                rowData.push([time, power]);

                // Next measurement
                time += step;
            }
            // Add the rows to the data table
            await dataTable.setRows(rowData);
        } else {
            // Add single measurement
            const time = new Date(powerPlantInfo.time).valueOf();
            const power = powerPlantInfo.aggs[i].P_gen;

            // Add row with latest data
            await dataTable.setRow([time, power]);
        }
    }
    // Refresh all components
    await updateComponents(powerPlantInfo);
}


async function connectBoard(powerPlantInfo) {
    // Launch  Dashboard
    if (board === null) {
        board = await setupDashboard(powerPlantInfo);
    }

    const dataPool = board.dataPool;
    for (let i = 0; i < powerPlantInfo.nAggs; i++) {
        const puId = i + 1;
        const dataTable = await dataPool.getConnectorTable('mqtt-data-' + puId);

        // Clear the data
        await dataTable.deleteRows();
    }

    await updateComponents(powerPlantInfo);
}


async function updateComponents(powerPlantInfo) {
    function getComponent(board, id) {
        return board.mountedComponents.map(c => c.component)
            .find(c => c.options.renderTo === id);
    }

    // Update the KPI components
    for (let i = 0; i < powerPlantInfo.nAggs; i++) {
        const puId = i + 1;
        const connId = 'mqtt-data-' + puId;

        // Get data
        const dataTable = await board.dataPool.getConnectorTable(connId);
        const rowCount = await dataTable.getRowCount();

        // KPI
        const kpiComp = getComponent(board, 'kpi-agg-' + puId);
        await kpiComp.update({
            value: rowCount > 0 ?
                dataTable.getCellAsNumber('power', rowCount - 1) : 0
        });

        // Chart
        const chartComp = getComponent(board, 'chart-agg-' + puId);
        await chartComp.update({
            connector: {
                id: connId
            }
        });

        // Datagrid
        const gridComp = getComponent(board, 'data-grid-' + puId);
        await gridComp.update({
            connector: {
                id: connId
            }
        });
    }
}


/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

// Documentation for PAHO MQTT client:
// https://www.hivemq.com/blog/mqtt-client-library-encyclopedia-paho-js/

// MQTT handle
let mqtt;

// Connection parameters
const host = 'mqtt.sognekraft.no';
const port = 8083;
const reconnectTimeout = 10000;
const mqttTopic = 'public/test/overview';
const mqttQos = 0;
const userName = 'public';
const password = 'public';

// Connection status
let connectFlag;
let msgCount;


// Connection status UI
const connectBar = {
    el: null,
    offColor: '', // Populated from CSS
    onColor: 'hsla(202.19deg, 100%, 37.65%, 1)'
};

// Initialize the application
window.onload = () => {
    msgCount = 0;
    connectFlag = false;
    const el = document.getElementById('connect_bar');
    connectBar.offColor = el.style.backgroundColor; // From CSS
    connectBar.el = el;
};


function setConnectionStatus(connected) {
    setStatus(connected ? 'Connected' : 'Disconnected');
    const el = connectBar.el;
    el.style.backgroundColor = connected ? connectBar.onColor : connectBar.offColor;
}


async function onConnectionLost(responseObject) {
    setConnectionStatus(false);
    console.log(responseObject);
}


function onFailure(message) {
    setStatus('Failed: ' + message);
}


async function onMessageArrived(mqttPacketRaw) {
    const mqttData = JSON.parse(mqttPacketRaw.payloadString);

    const powerPlantInfo = {
        name: mqttData.name,
        time: mqttData.tst_iso,
        nAggs: mqttData.aggs.length,
        aggs: mqttData.aggs
    };

    if (msgCount === 0) {
        // Connect the Dashboard
        await connectBoard(powerPlantInfo);
    }

    updateBoard(powerPlantInfo);

    setStatus(`Data from <b>${powerPlantInfo.name}</b>.`);
    msgCount++;
}


function onConnected(recon, url) {
    console.log(' in onConnected ' + recon);
}


async function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    setStatus('Connected to ' + host + ' on port ' + port);
    connectFlag = true;
    setConnectionStatus(true);

    // Subscribe to the default topic
    subscribe();
}


function disconnect() {
    if (connectFlag) {
        mqtt.disconnect();
        connectFlag = false;
    }
}


function MQTTconnect() {
    const connBtn = document.getElementById('connect_toggle');

    if (connectFlag) {
        // Already connect, so disconnect
        setStatus('disconnecting...');
        disconnect();
        connBtn.innerHTML = 'Connect';

        return false;
    }

    setStatus('connecting...');

    const cname = 'orderform-' + Math.floor(Math.random() * 10000);

    // eslint-disable-next-line no-undef
    mqtt = new Paho.MQTT.Client(host, port, cname);

    // Register callbacks
    mqtt.onConnectionLost = onConnectionLost;
    mqtt.onMessageArrived = onMessageArrived;
    mqtt.onConnected = onConnected;

    // Connect to broker
    mqtt.connect({
        useSSL: true,
        timeout: 3,
        cleanSession: true,
        onSuccess: onConnect,
        onFailure: onFailure,
        userName: userName,
        password: password
    });

    connBtn.innerHTML = 'Disconnect';

    return false;
}


function subscribe() {
    if (connectFlag) {
        // Unsubscribe any existing topics
        mqtt.unsubscribe('/#');

        // Subscribe to new topic
        mqtt.subscribe(mqttTopic, {
            qos: mqttQos
        });
    } else {
        setStatus('Not connected, subscription not possible');
    }
}


function setStatus(msg) {
    document.getElementById('status').innerHTML = msg;
}