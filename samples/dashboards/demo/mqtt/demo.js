// Data cache

let board = null;
let dataTable = null;

const powerUnit = 'kWh';

const kpiGaugeOptions = {
    chart: {
        type: 'solidgauge',
        spacing: [8, 8, 8, 8]
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
        typeDescription: 'The gauge chart with 1 data point.'
    }
};


const xAxisOptions = {
    type: 'datetime',
    labels: {
        format: '{value:%H:%M}',
        accessibility: {
            description: 'Hours, minutes'
        }
    }
};

const yAxisOptions = {
    title: {
        text: powerUnit
    }
};


// Launches the Dashboards application
async function setupDashboard() {
    board = await Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'mqtt-data',
                type: 'JSON',
                options: {
                    firstRowAsNames: true,
                    data: [
                        ['time', 'aggr1', 'aggr2'],
                        [Date.UTC(2024, 0, 1), 0.5, 0.7]
                    ]
                }
            }]
        },
        components: [{
            type: 'KPI',
            renderTo: 'kpi-agg-1',
            value: 0,
            valueFormat: '{value}',
            title: 'Aggregat 1',
            chartOptions: {
                chart: kpiGaugeOptions.chart,
                pane: kpiGaugeOptions.pane,
                yAxis: {
                    ...kpiGaugeOptions.yAxis,
                    min: 0,
                    max: 20,
                    accessibility: {
                        description: 'Årøy, aggregat 1'
                    }
                }
            }
        }, {
            type: 'KPI',
            renderTo: 'kpi-agg-2',
            value: 0,
            title: 'Aggregat 2',
            valueFormat: '{value}',
            chartOptions: {
                chart: kpiGaugeOptions.chart,
                pane: kpiGaugeOptions.pane,
                yAxis: {
                    ...kpiGaugeOptions.yAxis,
                    min: 0,
                    max: 20,
                    accessibility: {
                        description: 'Årøy, aggregat 2'
                    }
                }
            }
        }, {
            type: 'Highcharts',
            renderTo: 'dashboard-col-0',
            connector: {
                id: 'mqtt-data',
                columnAssignment: [{
                    seriesId: 'Aggregat 1',
                    data: ['time', 'aggr1']
                }]
            },
            sync: {
                visibility: true,
                highlight: true,
                extremes: true
            },
            chartOptions: {
                xAxis: xAxisOptions,
                yAxis: yAxisOptions,
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: true,
                    verticalAlign: 'top'
                },
                chart: {
                    type: 'spline'
                },
                title: {
                    text: ''
                },
                tooltip: {
                    valueSuffix: powerUnit
                }
            }
        }, {
            type: 'Highcharts',
            renderTo: 'dashboard-col-1',
            connector: {
                id: 'mqtt-data',
                columnAssignment: [{
                    seriesId: 'Aggregat 2',
                    data: ['time', 'aggr2']
                }]
            },
            sync: {
                visibility: true,
                highlight: true,
                extremes: true
            },
            chartOptions: {
                xAxis: xAxisOptions,
                yAxis: yAxisOptions,
                credits: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                legend: {
                    enabled: true,
                    verticalAlign: 'top'
                },
                chart: {
                    animation: false,
                    type: 'spline'
                },
                tooltip: {
                    valueSuffix: powerUnit,
                    stickOnContact: true
                }
            }
        }, {
            type: 'DataGrid',
            renderTo: 'dashboard-col-2',
            connector: {
                id: 'mqtt-data'
            },
            sync: {
                highlight: true,
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
                    aggr1: {
                        headerFormat: 'Aggregat 1'
                    },
                    aggr2: {
                        headerFormat: 'Aggregat 2'
                    }
                }
            }
        }]
    });
    // Load initial data table
    dataTable = await board.dataPool.getConnectorTable('mqtt-data');
}

// Launch  Dashboard
setupDashboard();

async function updateBoard(msg) {
    dataTable = await board.dataPool.getConnectorTable('mqtt-data');

    const data = JSON.parse(msg.payloadString);

    if (dataTable.getRowCount() === 0) {
        // Get history
        const hist = data.aggs[1].P_hist;
        const d = new Date(hist.start);
        let time = Number(d.valueOf());

        const step = hist.res * 1000; // P_hist resolution: seconds
        const rowData = [];
        const histLen = hist.values.length;

        for (let i = 0; i < histLen; i++) {
            const p1 = 0; // TBD: grab data
            const p2 = hist.values[i];

            // Add row with historical data (reversed)
            rowData.push([time, p1, p2]);

            // Next measurement
            time += step;
        }
        // Add the rows to the data table
        await dataTable.setRows(rowData);
    } else {
        const d = new Date(data.tst_iso);
        const time = d.valueOf();

        const p1 = data.aggs[0].P_gen;
        const p2 = data.aggs[1].P_gen;

        // Add row with latest data
        await dataTable.setRow([time, p1, p2]);
    }
    // Refresh all components
    await updateComponents();
}

async function connectBoard() {
    dataTable = await board.dataPool.getConnectorTable('mqtt-data');

    // Clear the data
    await dataTable.deleteRows();
    await updateComponents();
}

async function updateComponents() {
    for (let i = 2; i < board.mountedComponents.length; i++) {
        const comp = board.mountedComponents[i].component;
        await comp.update({
            connector: {
                id: 'mqtt-data'
            }
        });
    }

    // Update the KPI components
    dataTable = await board.dataPool.getConnectorTable('mqtt-data');
    const lastRow = await dataTable.getRowCount() - 1;

    const kpiAgg1 = board.mountedComponents[0].component;
    await kpiAgg1.update({
        value: dataTable.getCellAsNumber('aggr1', lastRow)
    });

    const kpiAgg2 = board.mountedComponents[1].component;
    await kpiAgg2.update({
        value: dataTable.getCellAsNumber('aggr2', lastRow)
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

// Connection status
let msgCount = 0;
let connectFlag = false;

// Contains id's of UI elements
let uiId;

window.onload = () => {
    msgCount = 0;
    connectFlag = false;

    uiId = {
        status: document.getElementById('status'),
        statusMsg: document.getElementById('status_messages')
    };
};


function setConnectionStatus(connected) {
    setUiElement('status', connected ? 'Connected' : 'Disconnected');
    const el = document.getElementById('status_bar');
    el.style.backgroundColor = connected ? 'green' : 'red';
}


function onConnectionLost() {
    setConnectionStatus(false);
    setUiElement('statusMsg', '');
    subscribeEnable(false);
    topicEnable(true);
}


function onFailure(message) {
    setUiElement('statusMsg', 'Failed: ' + message);
    subscribeEnable(false);
}


function onMessageArrived(rawMessage) {
    msgCount += 1;

    // Test
    updateBoard(rawMessage);
}


function onConnected(recon, url) {
    console.log(' in onConnected ' + recon);
}


async function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    setUiElement('statusMsg', 'Connected to ' + host + ' on port ' + port);
    connectFlag = true;
    setConnectionStatus(true);

    connectBoard();
    subscribeEnable(true);
    topicEnable(false);
}


function disconnect() {
    if (connectFlag) {
        mqtt.disconnect();
        connectFlag = false;
    }
}


function MQTTconnect() {
    const connBtn = document.getElementsByName('conn')[0];

    if (connectFlag) {
        setUiElement('statusMsg', 'disconnecting...');
        disconnect();
        connBtn.value = 'Connect';

        return false;
    }

    const userName = document.forms.connform.username.value;
    const password = document.forms.connform.password.value;

    setUiElement('statusMsg', 'connecting...');

    const cname = 'orderform-' + Math.floor(Math.random() * 10000);

    // eslint-disable-next-line no-undef
    mqtt = new Paho.MQTT.Client(host, port, cname);

    const options = {
        useSSL: true,
        timeout: 3,
        cleanSession: true,
        onSuccess: onConnect,
        onFailure: onFailure
    };

    if (userName !== '') {
        options.userName = document.forms.connform.username.value;
    }

    if (password !== '') {
        options.password = document.forms.connform.password.value;
    }

    mqtt.onConnectionLost = onConnectionLost;
    mqtt.onMessageArrived = onMessageArrived;
    mqtt.onConnected = onConnected;

    mqtt.connect(options);

    connBtn.value = 'Disconnect';

    return false;
}


function subTopics() {
    if (connectFlag === 0) {
        setUiElement('statusMsg', 'Not connected, subscription not possible');

        return false;
    }

    const stopic = document.forms.subs.Stopic.value;
    const sqos = 0;

    // document.getElementById('status_messages').innerHTML = 'Subscribing to topic =' + stopic;
    setUiElement('statusMsg', 'Subscribing to topic =' + stopic);

    const soptions = {
        qos: sqos
    };

    mqtt.unsubscribe('/#');
    mqtt.subscribe(stopic, soptions);

    return false;
}

function subscribeEnable(enabled) {
    document.getElementById('subscribe').disabled = !enabled;
}


function topicEnable(enabled) {
    // TBD: static topic until application is made scalable
    document.getElementById('topic').disabled = enabled;
}


function setUiElement(elName, msg) {
    uiId[elName].innerHTML = msg;
}