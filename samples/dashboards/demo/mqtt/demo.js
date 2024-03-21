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


function createKpiComponent(pgIdx, title, maxPowr) {
    return {
        type: 'KPI',
        renderTo: 'kpi-agg-' + pgIdx,
        title: title,
        chartOptions: {
            chart: kpiGaugeOptions.chart,
            pane: kpiGaugeOptions.pane,
            yAxis: {
                ...kpiGaugeOptions.yAxis,
                min: 0,
                max: maxPowr,
                title: {
                    text: 'Power',
                    y: -55
                },
                accessibility: {
                    description: title
                }
            }
        }
    };
}


function createChartComponent(connId, pgIdx, title, maxPowr) {
    return {
        type: 'Highcharts',
        renderTo: 'chart-agg-' + pgIdx,
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
                max: maxPowr,
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


function createDatagridComponent(connId, pgIdx, title) {
    return {
        type: 'DataGrid',
        renderTo: 'data-grid-' + pgIdx,
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
            const aggInfo = powerPlantInfo.aggs[i];

            // Power generator index (1...n)
            const pgIdx = i + 1;

            // Data connector ID
            const connId = 'mqtt-data-' + pgIdx;

            // Name of power generator unit
            const title = `Aggregat "${aggInfo.name}"`;

            // Get maximum generated power
            const maxPowr = aggInfo.P_max;

            // Data connectors
            powerGenUnits.connectors.push(createDataConnector(connId));

            // Dash components
            powerGenUnits.components.push(createKpiComponent(
                pgIdx, title, maxPowr
            ));
            powerGenUnits.components.push(
                createChartComponent(connId, pgIdx, title, maxPowr)
            );
            powerGenUnits.components.push(
                createDatagridComponent(connId, pgIdx, title)
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
        const pgIdx = i + 1;
        const connId = 'mqtt-data-' + pgIdx;

        const dataTable = await dataPool.getConnectorTable(connId);

        // Clear the data
        await dataTable.deleteRows();

        // Get measurement history (24 hours, 10 minute intervals)
        const hist = powerPlantInfo.aggs[i].P_hist;
        let time = new Date(hist.start).valueOf();

        const interval = hist.res * 1000; // Resolution: seconds
        const rowData = [];
        const histLen = hist.values.length;

        for (let j = 0; j < histLen; j++) {
            const power = hist.values[j];

            // Add row with historical data (reversed)
            rowData.push([time, power]);

            // Next measurement
            time += interval;
        }

        // Add the latest measurement
        time = new Date(powerPlantInfo.time).valueOf();
        const power = powerPlantInfo.aggs[i].P_gen;

        // Add row with latest data
        rowData.push([time, power]);

        // Add all rows to the data table
        await dataTable.setRows(rowData);

    }
    // Refresh all Dashboards components
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
        const pgIdx = i + 1;
        const connId = 'mqtt-data-' + pgIdx;

        // Get data
        const dataTable = await board.dataPool.getConnectorTable(connId);
        const rowCount = await dataTable.getRowCount();

        // KPI
        const kpiComp = getComponent(board, 'kpi-agg-' + pgIdx);
        await kpiComp.update({
            value: rowCount > 0 ?
                dataTable.getCellAsNumber('power', rowCount - 1) : 0
        });

        // Chart
        const chartComp = getComponent(board, 'chart-agg-' + pgIdx);
        await chartComp.update({
            connector: {
                id: connId
            }
        });

        // Datagrid
        const gridComp = getComponent(board, 'data-grid-' + pgIdx);
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
//     https://www.hivemq.com/blog/mqtt-client-library-encyclopedia-paho-js/
//     https://eclipse.dev/paho/files/jsdoc/Paho.MQTT.Client.html

// NB! REMOVE before publishing on the web !!!!

// Private credentials: highsoft, Qs0URPjxnWlcuYBmFWNK
// Private topics: prod/[stad]/[kraftverk]/overview

// Available:
//  - LEIK/leikanger
//  - SOG/aaroy_I|aaroy_II
//  - VAD/dyrnesli
//  - SOG/aaroy_I
//  - KUV/fosseteigen|tynjadalen|leinafoss
//  - NYD/helgheim|timbra|nydalselva|indreboe|sandal|steinsvik
//  - SMKR/dale|thue|horpedal
//  - FJL/berge|bjaastad|hatlestad|jordal|lidal|romoyri

// For test
const kraftverk = 'SOG/aaroy_II';

// MQTT handle
let mqtt;

// Connection parameters
const host = 'mqtt.sognekraft.no';
const port = 8083;
const reconnectTimeout = 10000;
const mqttTopic = 'prod/' + kraftverk + '/overview'; // public/test/overview';
const mqttQos = 0;

// NB! Replace with public before publishing on the web !!!!!
const userName = 'highsoft'; // 'public';
const password = 'Qs0URPjxnWlcuYBmFWNK'; // 'public';

// Connection status
let connectFlag;
let msgCount;
let nConnectedUnits;


// Connection status UI
const connectBar = {
    el: null,
    offColor: '', // Populated from CSS
    onColor: 'hsla(202.19deg, 100%, 37.65%, 1)',
    errColor: 'red'
};

// Initialize the application
window.onload = () => {
    msgCount = 0;
    nConnectedUnits = 0;
    connectFlag = false;
    const el = document.getElementById('connect_bar');
    connectBar.offColor = el.style.backgroundColor; // From CSS
    connectBar.el = el;
};


function setConnectionStatus(connected) {
    const connBtn = document.getElementById('connect_toggle');

    setStatus(connected ? 'Connected' : 'Disconnected');
    const el = connectBar.el;
    el.style.backgroundColor = connected ? connectBar.onColor : connectBar.offColor;
    connBtn.disabled = false;
    connBtn.innerHTML = connected ? 'Disconnect' : 'Connect';
}


async function onConnectionLost(resp) {
    nConnectedUnits = 0;
    connectFlag = false;
    setConnectionStatus(false);
    if (resp.errorCode !== 0) {
        setError(resp.errorMessage);
    }
}


function onFailure(resp) {
    nConnectedUnits = 0;
    connectFlag = false;
    setConnectionStatus(false);
    setError(resp.errorMessage);
}


function updateUnitVisibility(visible, nUnits = 0) {
    const powUnits = document.getElementsByClassName('el-aggr');

    for (let i = 0; i < powUnits.length; i++) {
        const el = powUnits[i];
        const unitVisible = visible && i < nUnits;

        el.style.display = unitVisible ? 'flex' : 'none';
    }
}


async function onMessageArrived(mqttPacketRaw) {
    const mqttData = JSON.parse(mqttPacketRaw.payloadString);

    const powerPlantInfo = {
        // Power plant name
        name: mqttData.name,
        // Packet timestamp
        time: mqttData.tst_iso,
        // Number of power generator units (aggregat)
        nAggs: mqttData.aggs.length,
        // Measurement data
        aggs: mqttData.aggs
    };

    if (msgCount === 0) {
        // Connect the Dashboard
        await connectBoard(powerPlantInfo);
    }

    if (nConnectedUnits !== powerPlantInfo.nAggs) {
        // Refresh Dashboard
        updateUnitVisibility(true, powerPlantInfo.nAggs);
    }
    msgCount++;
    nConnectedUnits = powerPlantInfo.nAggs;

    updateBoard(powerPlantInfo);

    setStatus(`Data from <b>${powerPlantInfo.name}</b>.`);
}


async function onConnect() {
    // Connection successful
    connectFlag = true;

    setStatus('Connected to ' + host + ' on port ' + port);
    setConnectionStatus(true);

    // Subscribe to the default topic
    subscribe();
}


function MQTTconnect() {
    // Disable connect button while connecting/disconnecting
    const connBtn = document.getElementById('connect_toggle');
    connBtn.disabled = true;

    if (connectFlag) {
        // Already connect, so disconnect
        setStatus('disconnecting...');

        mqtt.disconnect();
        connectFlag = false;

        // Hide components
        updateUnitVisibility(false);

        return;
    }

    setStatus('connecting...');

    const cname = 'orderform-' + Math.floor(Math.random() * 10000);

    // eslint-disable-next-line no-undef
    mqtt = new Paho.MQTT.Client(host, port, cname);

    // Register callbacks
    mqtt.onConnectionLost = onConnectionLost;
    mqtt.onMessageArrived = onMessageArrived;

    // Connect to broker
    mqtt.connect({
        useSSL: true,
        timeout: 5,
        cleanSession: true,
        onSuccess: onConnect,
        onFailure: onFailure,
        userName: userName,
        password: password
    });
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
        setError('Not connected, subscription not possible');
    }
}


function setStatus(msg) {
    document.getElementById('status').innerHTML = msg;
}


function setError(msg) {
    connectBar.el.style.backgroundColor = connectBar.errColor;

    document.getElementById('status').innerHTML = 'Error: ' + msg;
}