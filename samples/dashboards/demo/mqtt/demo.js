/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

let connectFlag = false;
let mqtt;
const reconnectTimeout = 2000;
const host = 'mqtt.sognekraft.no';
const port = 8083;
let row = 0;
let outMsg = '';
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
    outMsg = '<b>' + rawMessage.destinationName + '</b> = ' + rawMessage.payloadString + '<br>';

    try {
        document.getElementById('out_messages').innerHTML += outMsg;
    } catch (err) {
        document.getElementById('out_messages').innerHTML = err.message;
    }

    if (row === 10) {
        row = 1;
        document.getElementById('out_messages').innerHTML = outMsg;
    } else {
        row += 1;
    }

    msgCount += 1;
}

function onConnected(recon, url) {
    console.log(' in onConnected ' + recon);
}

function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    document.getElementById('status_messages').innerHTML = 'Connected to ' + host + ' on port ' + port;
    connectFlag = true;
    document.getElementById('status').innerHTML = 'Connected';
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
    document.getElementById('out_messages').innerHTML = null;
    mqtt.subscribe(stopic, soptions);

    return false;
}
