// Data cache

let board = null;
let dataTable = null;

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
                        ['Event', 'Aggregat 1', 'Aggregat 2'],
                        ['Test 1', 8.1, 9.1],
                        ['Test 2', 4.2, 9.6]
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
            renderTo: 'kpi-agg-1',
            value: 0,
            valueFormat: '{value}',
            title: 'Aggregat 1'
        }, {
            type: 'KPI',
            renderTo: 'kpi-agg-2',
            value: 0,
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
                    type: 'column'
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
                    type: 'spline'
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
    // Load initial data table
    dataTable = await board.dataPool.getConnectorTable('mqtt-data');
}

// Launch  Dashboard
setupDashboard();

async function updateBoard(msg) {
    dataTable = await board.dataPool.getConnectorTable('mqtt-data');
    const data = JSON.parse(msg.payloadString);
    const p1 = data.aggs[0].P_gen;
    const p2 = data.aggs[1].P_gen;

    // Add a row
    await dataTable.setRow(['mqtt', p1, p2]);
    await updateComponents();
}

async function connectBoard() {
    dataTable = await board.dataPool.getConnectorTable('mqtt-data');

    // Clear the data
    await dataTable.deleteRows();
    await updateComponents();
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


function onConnectionLost() {
    setUiElement('status', 'Disconnected');
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
    setUiElement('status', 'Connected');

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
    document.getElementById('topic').disabled = enabled;
}

function setUiElement(elName, msg) {
    uiId[elName].innerHTML = msg;
}