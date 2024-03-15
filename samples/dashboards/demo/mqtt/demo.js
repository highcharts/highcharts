// Data cache

let board = null;

// Launches the Dashboards application
async function setupDashboard() {
    board = await Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'mqtt-data',
                type: 'JSON',
                options: {
                    firstRowAsNames: true,
                    enablePolling: true,
                    dataRefreshRate: 5,
                    data: [
                        ['Event', 'Aggregat 1', 'Aggregat 2'],
                        ['Start', 0.1, 9.1],
                        ['Test', 0.2, 9.6]
                    ]
                }
            }]
        },
        editMode: {
            enabled: true,
            contextMenu: {
                enabled: true,
                items: ['editMode']
            }
        },
        components: [{
            type: 'KPI',
            renderTo: 'kpi-vitamin-a',
            value: 1,
            valueFormat: '{value}',
            title: 'Aggregat 1'
        }, {
            type: 'KPI',
            renderTo: 'kpi-iron',
            value: 1,
            title: 'Aggregat 2',
            valueFormat: '{value}'
        }, {
            sync: {
                visibility: true,
                highlight: true,
                extremes: true
            },
            connector: {
                id: 'mqtt-data',
                columnAssignment: [{
                    seriesId: 'Aggregat 1',
                    data: ['Aggregat 1']
                }]
            },
            renderTo: 'dashboard-col-0',
            type: 'Highcharts',
            chartOptions: {
                yAxis: {
                    title: {
                        text: 'KWH'
                    }
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: true,
                    verticalAlign: 'top'
                },
                chart: {
                    animation: false,
                    type: 'column',
                    spacing: [30, 30, 30, 20]
                },
                title: {
                    text: ''
                },
                tooltip: {
                    valueSuffix: ' KWH',
                    stickOnContact: true
                }
            }
        }, {
            renderTo: 'dashboard-col-1',
            sync: {
                visibility: true,
                highlight: true,
                extremes: true
            },
            connector: {
                id: 'mqtt-data',
                columnAssignment: [{
                    seriesId: 'Aggregat 2',
                    data: ['Aggregat 2']
                }]
            },
            type: 'Highcharts',
            chartOptions: {
                yAxis: {
                    title: {
                        text: 'KWH'
                    }
                },
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
                    type: 'column',
                    spacing: [30, 30, 30, 20]
                },
                tooltip: {
                    valueSuffix: ' KWH',
                    stickOnContact: true
                }
            }
        }, {
            renderTo: 'dashboard-col-2',
            connector: {
                id: 'mqtt-data'
            },
            type: 'DataGrid',
            sync: {
                highlight: true,
                visibility: true
            }
        }]
    });

    const dataPool = board.dataPool;
    const dataTable = await dataPool.getConnectorTable('mqtt-data');
}

// Launch  Dashboard
setupDashboard();

async function updateBoard(msg) {
    const dataTable = await board.dataPool.getConnectorTable('mqtt-data');

    // Add a row
    await dataTable.setRow(['mqtt', 3, 8]);
    updateComponents();
}

async function connectBoard() {
    const dataTable = await board.dataPool.getConnectorTable('mqtt-data');

    // Clear the data
    await dataTable.deleteRows();
    updateComponents();
}

async function updateComponents() {
    for (let i = 2; i <= 4; i++) {
        const comp = board.mountedComponents[i].component;
        await comp.update({
            connector: {
                id: 'mqtt-data'
            }
        });
    }
}

/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

let connectFlag = false;
let mqtt;
const reconnectTimeout = 10000;
const host = 'mqtt.sognekraft.no';
const port = 8083;
let msgCount = 0;


function onConnectionLost() {
    document.getElementById('status').innerHTML = 'Disconnected';
    document.getElementById('status_messages').innerHTML = 'Connection lost';
}

function onFailure(message) {
    console.log('Failed');
    document.getElementById('status_messages').innerHTML = 'Connection failed - Retrying';

    if (connectFlag) {
        setTimeout(MQTTconnect, reconnectTimeout);
    }
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
    document.getElementById('status_messages').innerHTML = 'Connected to ' + host + ' on port ' + port;
    connectFlag = true;
    document.getElementById('status').innerHTML = 'Connected';

    connectBoard();
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
        document.getElementById('status_messages').innerHTML = 'disconnecting';
        disconnect();
        connBtn.value = 'Connect';

        return false;
    }

    const userName = document.forms.connform.username.value;
    const password = document.forms.connform.password.value;

    document.getElementById('status_messages').innerHTML = 'connecting';

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
    document.getElementById('status_messages').innerHTML = '';

    if (connectFlag === 0) {
        const outMsg = '<b>Not Connected so can\'t subscribe</b>';
        document.getElementById('status_messages').innerHTML = outMsg;

        return false;
    }

    const stopic = document.forms.subs.Stopic.value;
    const sqos = 0;

    document.getElementById('status_messages').innerHTML = 'Subscribing to topic =' + stopic;
    const soptions = {
        qos: sqos
    };

    mqtt.unsubscribe('/#');
    mqtt.subscribe(stopic, soptions);

    return false;
}
