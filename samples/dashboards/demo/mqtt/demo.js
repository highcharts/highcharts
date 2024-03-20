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
                type: 'datetime',
                labels: {
                    format: '{value:%H:%M}',
                    accessibility: {
                        description: 'Hours, minutes'
                    }
                }
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

        for (let i = 0; i < powerPlantInfo.numGenerators; i++) {
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


async function updateBoard(mqttData) {
    const dataTable1 = await board.dataPool.getConnectorTable('mqtt-data-1');
    const dataTable2 = await board.dataPool.getConnectorTable('mqtt-data-2');

    if (dataTable1.getRowCount() === 0) {
        // Get history
        const hist = mqttData.aggs[1].P_hist; // TBD: make modular
        const d = new Date(hist.start);
        let time = Number(d.valueOf());

        const step = hist.res * 1000; // P_hist resolution: seconds
        const rowData1 = [];
        const rowData2 = [];
        const histLen = hist.values.length;

        for (let i = 0; i < histLen; i++) {
            const p1 = 0; // TBD: grab data
            const p2 = hist.values[i];

            // Add row with historical data (reversed)
            rowData1.push([time, p1]);
            rowData2.push([time, p2]);

            // Next measurement
            time += step;
        }
        // Add the rows to the data table
        await dataTable1.setRows(rowData1);
        await dataTable2.setRows(rowData2);
    } else {
        const d = new Date(mqttData.tst_iso);
        const time = d.valueOf();

        const p1 = mqttData.aggs[0].P_gen;
        const p2 = mqttData.aggs[1].P_gen;

        // Add row with latest data
        await dataTable1.setRow([time, p1]);
        await dataTable2.setRow([time, p2]);
    }
    // Refresh all components
    await updateComponents();
}


async function connectBoard(powerPlantInfo) {
    // Launch  Dashboard
    if (board === null) {
        board = await setupDashboard(powerPlantInfo);
    }

    const dataTable1 = await board.dataPool.getConnectorTable('mqtt-data-1');
    const dataTable2 = await board.dataPool.getConnectorTable('mqtt-data-2');

    // Clear the data
    await dataTable1.deleteRows();
    await dataTable2.deleteRows();

    await updateComponents();
}


async function updateComponents() {
    // Update charts and datagrids
    for (let i = 0; i < board.mountedComponents.length; i++) {
        const comp = board.mountedComponents[i].component;
        if (comp.type !== 'KPI') {
            await comp.initConnector();
        }

        if (comp.type === 'Highcharts') {
            await comp.update({
                connector: {
                    columnAssignment: [{
                        seriesId: 'power',
                        data: ['time', 'power']
                    }]
                }
            });
        }
    }

    // Update the KPI components
    const dataTable1 = await board.dataPool.getConnectorTable('mqtt-data-1');
    const dataTable2 = await board.dataPool.getConnectorTable('mqtt-data-2');
    const rowCount = await dataTable1.getRowCount();
    let data1, data2;

    if (rowCount > 0) {
        data1 = dataTable1.getCellAsNumber('power', rowCount - 1);
        data2 = dataTable2.getCellAsNumber('power', rowCount - 1);
    } else {
        data1 = 0;
        data2 = 0;
    }

    // TBD: calculate indexes
    const kpiAgg1 = board.mountedComponents[0].component;
    await kpiAgg1.update({
        value: data1
    });

    const kpiAgg2 = board.mountedComponents[3].component;
    await kpiAgg2.update({
        value: data2
    });
}


/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

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

// Connection bar
const connectBar = {
    el: null,
    offColor: '',
    onColor: 'green'
};

let msgCount;
let connectFlag;

// Contains id's of UI elements
let uiId;

window.onload = () => {
    msgCount = 0;
    connectFlag = false;
    connectBar.el = document.getElementById('connect_bar');
    connectBar.offColor = connectBar.id.style.backgroundColor;
};


function setConnectionStatus(connected) {
    setStatus(connected ? 'Connected' : 'Disconnected');
    const el = connectBar.el;
    el.style.backgroundColor = connected ? connectBar.onColor : connectBar.offColor;
}


async function onConnectionLost() {
    setConnectionStatus(false);
}


function onFailure(message) {
    setStatus('Failed: ' + message);
}


async function onMessageArrived(mqttPacketRaw) {
    const mqttData = JSON.parse(mqttPacketRaw.payloadString);

    if (msgCount === 0) {
        // Connect the Dashboard
        const powerPlantStatus = {
            name: mqttData.name,
            timestamp: mqttData.tst_iso,
            numGenerators: mqttData.aggs.length
        };
        await connectBoard(powerPlantStatus);
        setStatus(`Data from <b>${powerPlantStatus.name}</b>.`); // Connected: ${powerPlantStatus.timestamp}`);
    }
    msgCount += 1;

    updateBoard(mqttData);
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