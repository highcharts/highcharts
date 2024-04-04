let board = null;
let maxConnectedUnits;

// Language support

const lang = {
    // Selected language
    current: 'en',

    // Translations
    Name: {
        nn: 'Namn'
    },
    Elevation: {
        nn: 'Høgde',
        unit: 'moh'
    },
    'Power station': {
        nn: 'Kraftstasjon'
    },
    'Measure time': {
        nn: 'Måletidspunkt',
        unit: 'UTC'
    },
    'Generated power': {
        nn: 'Effekt',
        unit: 'MW'
    },
    Location: {
        nn: 'Koordinatar'
    },
    Volume: {
        nn: 'Volum',
        unit: 'm3'
    },
    Intakes: {
        nn: 'Inntak'
    },
    Reservoirs: {
        nn: 'Vassmagasin'
    },
    Drain: {
        nn: 'Avlaup'
    },
    Inflow: {
        nn: 'Tilsig',
        unit: 'm3/sek'
    },
    Level: {
        nn: 'Nivå',
        unit: 'moh'
    },
    Energy: {
        nn: 'Energi',
        unit: 'MWh'
    },
    'Net flow': {
        nn: 'Netto endring',
        unit: 'm3/sek'
    },
    'Required minimal flow': {
        nn: 'Minstevassføring krav',
        unit: 'm3/sek'
    },
    'Measured minimal flow': {
        nn: 'Minstevassføring målt',
        unit: 'm3/sek'
    },

    // Translator function
    tr: function (str) {
        const trans = str in this && this.current !== 'en';
        return trans ? this[str][this.current] : str;
    }
};

// Map view when the location is unknown
const defaultMapView = {
    // Sogndal-ish
    center: [7.08, 61.22],
    zoom: 9
};

// Map marker for power generator facility
const stationMarker = {
    symbol: 'circle',
    radius: 10,
    fillColor: 'green',
    lineColor: '#ffffff',
    lineWidth: 2
};

// Map marker for water reservoir
const reservoirMarker = {
    symbol: 'mapmarker',
    radius: 10,
    fillColor: 'blue'
};

// Map marker for water intake
const intakeMarker = {
    symbol: 'triangle-down',
    radius: 6,
    fillColor: 'red'
};

// Launches the Dashboards application
async function dashboardCreate() {
    const powerUnit = 'MW';

    // Create configuration for power generator units
    const pu = createPowerGeneratorUnit();

    return await Dashboards.board('container', {
        dataPool: {
            connectors: pu.connectors
        },
        components: pu.components
    }, true);

    function createInfoComponent() {
        return {
            type: 'HTML',
            renderTo: 'el-info'
        };
    }

    function createPowerGeneratorUnit() {
        const powerGenUnits = {
            connectors: [],
            components: []
        };

        // Information on power station level
        powerGenUnits.components.push(
            createInfoComponent()
        );

        // Map on power station level
        powerGenUnits.components.push(
            createMapComponent()
        );

        for (let i = 0; i < maxConnectedUnits; i++) {
            // Power generator index (1...n)
            const pgIdx = i + 1;

            // Data connector ID
            const connId = 'mqtt-data-' + pgIdx;

            // Data connectors
            powerGenUnits.connectors.push(
                createDataConnector(connId)
            );

            // Dash components
            powerGenUnits.components.push(
                createKpiComponent(pgIdx)
            );
            powerGenUnits.components.push(
                createChartComponent(connId, pgIdx)
            );
            powerGenUnits.components.push(
                createDatagridComponent(connId, pgIdx)
            );
        }
        return powerGenUnits;
    }

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

    function createMapComponent() {
        return {
            type: 'Highcharts',
            renderTo: 'el-map',
            chartConstructor: 'mapChart',
            chartOptions: {
                title: {
                    text: ''
                },
                chart: {
                    styledMode: false
                },
                legend: {
                    enabled: false
                },
                mapNavigation: {
                    enabled: true,
                    buttonOptions: {
                        alignTo: 'spacingBox'
                    }
                },
                mapView: defaultMapView,
                series: [{
                    type: 'tiledwebmap',
                    provider: {
                        type: 'OpenStreetMap',
                        theme: 'Standard'
                    },
                    showInLegend: false
                }, {
                    type: 'mappoint',
                    name: 'stations',
                    color: 'blue',
                    dataLabels: {
                        align: 'left',
                        crop: false,
                        enabled: true,
                        format: '{point.name}',
                        padding: 0,
                        verticalAlign: 'top',
                        x: -2,
                        y: 5
                    },
                    marker: {
                        symbol: 'square'
                    },
                    tooltip: {
                        footerFormat: '',
                        headerFormat: '',
                        pointFormat: (
                            '<b>{point.name}</b>'
                        )
                    },
                    data: []
                }]
            }
        };
    }

    function createKpiComponent(pgIdx) {
        return {
            type: 'KPI',
            renderTo: 'kpi-agg-' + pgIdx,
            title: '',
            chartOptions: {
                chart: {
                    type: 'solidgauge',
                    styledMode: false
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
                series: [{
                    name: lang.tr('Generated power')
                }],
                yAxis: {
                    labels: {
                        distance: '75%',
                        y: 5,
                        align: 'auto'
                    },
                    lineWidth: 2,
                    minorTicks: false,
                    tickWidth: 2,
                    tickAmount: 2,
                    visible: true,
                    min: 0,
                    max: 0, // Populated on update
                    title: {
                        text: lang.tr('Generated power') + ' (MW)',
                        y: -60
                    }
                },
                tooltip: {
                    valueSuffix: ' ' + powerUnit
                }
            }
        };
    }

    function createChartComponent(connId, pgIdx) {
        return {
            type: 'Highcharts',
            renderTo: 'chart-agg-' + pgIdx,
            connector: {
                id: connId,
                columnAssignment: [{
                    seriesId: lang.tr('Generated power'),
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
                    min: 0,
                    max: 0, // Populated on update
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
                    valueSuffix: ' ' + powerUnit
                }
            }
        };
    }

    function createDatagridComponent(connId, pgIdx) {
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
                        headerFormat: lang.tr('Measure time') + ' (UTC)',
                        cellFormatter: function () {
                            // eslint-disable-next-line max-len
                            return Highcharts.dateFormat('%Y-%m-%d', this.value) + ' ' + Highcharts.dateFormat('%H:%M', this.value);
                        }
                    },
                    power: {
                        headerFormat: lang.tr('Generated power') + ' (MW)'
                    }
                }
            }
        };
    }
}


async function dashboardUpdate(powerPlantInfo) {
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
    await dashboardsComponentUpdate(powerPlantInfo);
}


async function dashboardConnect(powerPlantInfo) {
    // Launch  Dashboard
    if (board === null) {
        board = await dashboardCreate();
    }

    const dataPool = board.dataPool;
    for (let i = 0; i < powerPlantInfo.nAggs; i++) {
        const puId = i + 1;
        const dataTable = await dataPool.getConnectorTable('mqtt-data-' + puId);

        // Clear the data
        await dataTable.deleteRows();
    }

    await dashboardsComponentUpdate(powerPlantInfo);
}


async function dashboardsComponentUpdate(powerPlantInfo) {
    function getComponent(board, id) {
        return board.mountedComponents.map(c => c.component)
            .find(c => c.options.renderTo === id);
    }

    function getFormattedValue(obj) {
        if (obj === null) {
            return '-';
        }

        if (typeof obj === 'object') {
            return JSON.stringify(obj).replaceAll(/["{}]/g, '');
        }
        // Assume float
        return obj.toFixed(2);
    }

    function createIntakeTable(powerPlantInfo) {
        const loc = lang.tr('Location');
        const intake = lang.tr('Intakes');
        const qMin = lang.tr('Required minimal flow');
        const qAct = lang.tr('Measured minimal flow');
        const name = lang.tr('Name');
        const elevation = lang.tr('Elevation');

        let html = `<table class="intake"><caption>${intake}</caption>
            <tr><th>${name}</th><th>${qMin} l/sec</th><th>${qAct} l/sec</th>
            <th>${elevation}</th><th>${loc}</th></tr>`;

        for (let i = 0; i < powerPlantInfo.nIntakes; i++) {
            const item = powerPlantInfo.intakes[i];
            const qMinSet = getFormattedValue(item.q_min_set);
            const qMinAct = getFormattedValue(item.q_min_act);
            const elevation = getFormattedValue(item.h);
            const location = getFormattedValue(item.location);

            html += `<tr><td>${item.name}</td>
                <td>${qMinSet}</td>
                <td>${qMinAct}</td>
                <td>${elevation}</td>
                <td>${location}</td>
            </tr>`;
        }
        html += '</table>';

        return html;
    }

    async function addIntakeMarkers(mapComp, powerPlantInfo) {
        for (let i = 0; i < powerPlantInfo.nIntakes; i++) {
            const item = powerPlantInfo.intakes[i];
            if (item.location === null) {
                continue;
            }
            // Add reservoir to map
            await mapComp.addPoint({
                name: item.name,
                lon: item.location.lon,
                lat: item.location.lat,
                marker: intakeMarker
            });
        }
    }

    function createReservoirTable(powerPlantInfo) {
        const loc = lang.tr('Location');
        const res = lang.tr('Reservoirs');
        const vol = lang.tr('Volume');
        const drain = lang.tr('Drain');
        const energy = lang.tr('Energy');
        const name = lang.tr('Name');
        const elevation = lang.tr('Elevation');

        let html = `<table class="intake"><caption>${res}</caption>
            <tr><th>${name}</th><th>${vol}</th><th>${drain}</th>
            <th>${energy}</th><th>${elevation}</th><th>${loc}</th></tr>`;

        for (let i = 0; i < powerPlantInfo.nReservoirs; i++) {
            const item = powerPlantInfo.reservoirs[i];

            const volume = getFormattedValue(item.volume);
            const drain = getFormattedValue(item.drain);
            const energy = getFormattedValue(item.energy);
            const elevation = getFormattedValue(item.h);
            const location = getFormattedValue(item.location);

            html += `<tr><td>${item.name}</td>
                <td>${volume}</td>
                <td>${drain}</td>
                <td>${energy}</td>
                <td>${elevation}</td>
                <td>${location}</td>
            </tr>`;
        }
        html += '</table>';

        return html;
    }

    async function addReservoirMarkers(mapComp, powerPlantInfo) {
        for (let i = 0; i < powerPlantInfo.nReservoirs; i++) {
            const item = powerPlantInfo.reservoirs[i];
            if (item.location === null) {
                continue;
            }
            // Add reservoir to map
            await mapComp.addPoint({
                name: item.name,
                lon: item.location.lon,
                lat: item.location.lat,
                marker: reservoirMarker
            });
        }
    }

    const stationName = powerPlantInfo.name;
    const location = powerPlantInfo.location;
    let posInfo = lang.tr('Location unavailable');
    if (location !== null) {
        posInfo = `${location.lon} (lon.), ${location.lat} (lat.)`;
    }

    // Information
    const infoComp = getComponent(board, 'el-info');
    await infoComp.update({
        title: stationName,
        html: '<h3>Oppdatert</h3>' + stationName // Does not work
    });

    const intakeHtml = powerPlantInfo.nIntakes === 0 ?
        lang.tr('Intakes') + ' -' : createIntakeTable(powerPlantInfo);
    const reservoirHtml = powerPlantInfo.nReservoirs === 0 ?
        lang.tr('Reservoirs') + ' -' : createReservoirTable(powerPlantInfo);

    const el = document.querySelector(
        'div#el-info .highcharts-dashboards-component-content'
    );
    el.innerHTML = `<div id="info-container">
    <h3>${posInfo}</h6>
    ${intakeHtml}
    ${reservoirHtml}
    </div>
    `;

    // Map
    const mapComp = getComponent(board, 'el-map');
    const mapPoints = mapComp.chart.series[1];

    while (mapPoints.data.length > 0) {
        await mapPoints.data[0].remove();
    }

    if (location !== null) {
        // Power station marker
        await mapPoints.addPoint({
            name: stationName,
            lon: location.lon,
            lat: location.lat,
            marker: stationMarker
        });

        // Add reservoir markers if present
        await addReservoirMarkers(mapPoints, powerPlantInfo);

        // Add intake markers if present
        await addIntakeMarkers(mapPoints, powerPlantInfo);

        // Update station name, map center and zoom
        await mapComp.update({
            title: stationName,
            chartOptions: {
                mapView: {
                    center: [location.lon, location.lat + 0.1],
                    zoom: 9
                }
            }
        });
    } else {
        await mapPoints.addPoint({
            name: '?',
            lon: defaultMapView.center[0],
            lat: defaultMapView.center[1],
            marker: {
                symbol: 'square'
            }
        });

        await mapComp.update({
            title: stationName,
            chartOptions: {
                mapView: defaultMapView
            }
        });
    }

    // Update dashboard components
    for (let i = 0; i < powerPlantInfo.nAggs; i++) {
        const aggInfo = powerPlantInfo.aggs[i];
        const pgIdx = i + 1;
        const connId = 'mqtt-data-' + pgIdx;
        const maxPower = aggInfo.P_max;
        const chartOptions = {
            yAxis: {
                max: maxPower
            }
        };

        // Add generator name only if the plant has multiple generators
        let aggName = stationName;
        if (powerPlantInfo.nAggs > 1) {
            aggName += ` "${aggInfo.name}"`;
        }

        // Get data
        const dataTable = await board.dataPool.getConnectorTable(connId);
        const rowCount = await dataTable.getRowCount();

        // KPI
        const kpiComp = getComponent(board, 'kpi-agg-' + pgIdx);
        await kpiComp.update({
            value: rowCount > 0 ?
                dataTable.getCellAsNumber('power', rowCount - 1) : 0,
            chartOptions: chartOptions,
            title: aggName
        });

        // Chart
        const chartComp = getComponent(board, 'chart-agg-' + pgIdx);
        await chartComp.update({
            connector: {
                id: connId
            },
            chartOptions: chartOptions,
            title: aggName
        });

        // Datagrid
        const gridComp = getComponent(board, 'data-grid-' + pgIdx);
        await gridComp.update({
            connector: {
                id: connId
            },
            title: aggName
        });
    }
}


async function dashboardReset() {
    const dataPool = board.dataPool;
    for (let i = 0; i < maxConnectedUnits; i++) {
        const puId = i + 1;
        const dataTable = await dataPool.getConnectorTable('mqtt-data-' + puId);

        // Clear the data
        await dataTable.deleteRows();
        await dataTable.modified.deleteRows();
    }
}


function uiSetComponentVisibility(visible, nUnits = 0) {
    const powUnitCells = document.getElementsByClassName('el-aggr');

    for (let i = 0; i < powUnitCells.length; i++) {
        const el = powUnitCells[i];
        const unitVisible = visible && i < nUnits;

        el.style.display = unitVisible ? 'flex' : 'none';
    }

    let el = document.getElementById('el-info');
    el.style.display = visible ? 'flex' : 'none';

    el = document.getElementById('el-map');
    el.style.display = visible ? 'flex' : 'none';
}


/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

// Documentation for PAHO MQTT client:
//     https://www.hivemq.com/blog/mqtt-client-library-encyclopedia-paho-js/
//     https://eclipse.dev/paho/files/jsdoc/Paho.MQTT.Client.html

// NB! REMOVE before publishing on the web !!!!

// Private credentials: ******
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


// MQTT handle
let mqtt = null;

// Connection parameters
const host = 'mqtt.sognekraft.no';
const port = 8083;
let mqttActiveTopic = null;
const mqttQos = 0;

// NB! Replace with public before publishing on the web !!!!!
const userName = 'highsoft';
const password = 'Qs0URPjxnWlcuYBmFWNK';

// Log functionality
const logEnabled = true;

// Connection status
let connectFlag;
let msgCount;
let nConnectedUnits;

// Connection status UI
const connectBar = {
    offColor: '', // Populated from CSS
    onColor: 'hsla(202.19deg, 100%, 37.65%, 1)',
    errColor: 'red'
};

// Overview of power plants, as MQTT topics (TBD: create dynamically)
const plantLookup = {
    'Årøy I': {
        topic: 'prod/SOG/aaroy_I/overview'
    },
    'Årøy II': {
        topic: 'prod/SOG/aaroy_II/overview'
    },
    Mundalselvi: {
        topic: 'prod/SOG/mundalselvi/overview'
    },
    Dyrnesli: {
        topic: 'prod/VAD/dyrnesli/overview'
    },
    Leikanger: {
        topic: 'prod/LEIK/leikanger/overview'
    },
    Fosseteigen: {
        topic: 'prod/KUV/fosseteigen/overview'
    },
    Dale: {
        topic: 'prod/SMKR/dale/overview'
    },
    Thue: {
        topic: 'prod/SMKR/thue/overview'
    },
    Nydalselva: {
        topic: 'prod/NYD/nydalselva/overview'
    }
};

/*
 *  Application interface
 */
window.onload = () => {
    // Invoked when page has finished loading
    msgCount = 0;
    nConnectedUnits = 0;
    connectFlag = false;
    maxConnectedUnits = document.getElementsByClassName('el-aggr').length;

    // Initialize data transport
    mqttInit();

    const el = document.getElementById('connect_bar');
    connectBar.offColor = el.style.backgroundColor; // From CSS

    // Populate dropdown menu
    const dropdownDiv = document.getElementById('dropdownContent');
    for (const key of Object.keys(plantLookup)) {
        dropdownDiv.innerHTML += `<a class="dropdown-select" href="#">${key}</a>`;
    }

    // Custom click handler (dropdown button for selecting power stations)
    window.onclick = function (event) {
        if (!event.target.matches('.dropdown-button')) {
            // Close the dropdown menu if the user clicks outside of it
            const dropdowns = document.getElementsByClassName('dropdown-content');

            for (let i = 0; i < dropdowns.length; i++) {
                const openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }

            // Handle dropdown items
            if (event.target.matches('.dropdown-select')) {
                const name = event.target.innerText;
                if (name in plantLookup) {
                    onStationClicked(name);
                }
            }
        }
    };
};

/*
 *  Application user interface
 */
function onConnectClicked() {
    // Connect to (or disconnect from) the MQTT server
    if (connectFlag) {
        mqttDisconnect();
    } else {
        mqttConnect();
    }
}


function onStationSelectClicked() {
    // Reveals the dropdown list of power stations
    document.getElementById('dropdownContent').classList.toggle('show');
}


async function onStationClicked(station) {
    nConnectedUnits = 0;

    // Change topic to currently selected power station
    await mqttResubscribe(plantLookup[station].topic);
}


/*
 *  MQTT API
 */
function mqttInit() {
    const cname = 'orderform-' + Math.floor(Math.random() * 10000);

    // eslint-disable-next-line no-undef
    mqtt = new Paho.MQTT.Client(host, port, cname);

    // Register callbacks
    mqtt.onConnectionLost = onConnectionLost;
    mqtt.onMessageArrived = onMessageArrived;
}


function mqttConnect() {
    if (connectFlag) {
        uiShowError('Already connected');
        return;
    }

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


function mqttSubscribe(topic) {
    if (connectFlag) {
        // Subscribe to new topic
        mqtt.subscribe(topic, {
            qos: mqttQos
        });
        console.log('Subscribed: ' + topic);
    } else {
        uiShowError('Not connected, operation not possible');
    }
}


async function mqttResubscribe(newTopic) {
    if (connectFlag) {
        // Unsubscribe any existing topics
        const unsubscribeOptions = {
            onSuccess: async () => {
                console.log('Unsubscribed: ' + mqttActiveTopic);
                mqttSubscribe(newTopic);
                mqttActiveTopic = newTopic;
            },
            onFailure: () => {
                uiShowError('Unsubscribe failed');
            },
            timeout: 10
        };
        mqtt.unsubscribe('/#', unsubscribeOptions);
    } else {
        uiShowError('Not connected, operation not possible');
    }
}


function mqttUnubscribe() {
    if (connectFlag) {
        // Unsubscribe any existing topics
        console.log('Unsubscribe: ' + mqttActiveTopic);
        mqtt.unsubscribe(mqttActiveTopic);
    } else {
        uiShowError('Not connected, operation not possible');
    }
}


function mqttDisconnect() {
    if (!connectFlag) {
        uiShowError('Already disconnected');
        return;
    }
    // Unsubscribe any existing topics
    mqtt.unsubscribe('/#');

    // Disconnect
    uiShowStatus('');
    mqtt.disconnect();

    // Hide Dashboard components
    uiSetComponentVisibility(false);
}


function mqttLog(msg) {
    if (logEnabled) {
        console.log('Topic:     ' + msg.destinationName);
        console.log('QoS:       ' + msg.qos);
        console.log('Retained:  ' + msg.retained);
        // Read Only, set if message might be a duplicate sent from broker
        console.log('Duplicate: ' + msg.duplicate);
    }
}


/*
 *  MQTT callbacks
 */
async function onConnectionLost(resp) {
    nConnectedUnits = 0;
    connectFlag = false;
    uiSetConnectStatus(false);

    if (resp.errorCode !== 0) {
        uiShowError(resp.errorMessage);
    }
}


function onFailure(resp) {
    nConnectedUnits = 0;
    connectFlag = false;
    uiSetConnectStatus(false);

    uiShowError(resp.errorMessage);
}


async function onMessageArrived(mqttPacket) {
    mqttLog(mqttPacket);

    if (mqttActiveTopic !== mqttPacket.destinationName) {
        console.log('Topic ignored: ' + mqttPacket.destinationName);
        return;
    }

    // Process incoming active topic
    const powerPlantInfo = JSON.parse(mqttPacket.payloadString);
    powerPlantInfo.nAggs = powerPlantInfo.aggs.length;
    powerPlantInfo.nIntakes = powerPlantInfo.intakes.length;
    powerPlantInfo.nReservoirs = powerPlantInfo.reservoirs.length;
    powerPlantInfo.time = powerPlantInfo.aggs.tst_iso;
    console.dir(powerPlantInfo);

    if (msgCount === 0) {
        // Connect and create the Dashboard when the first packet arrives
        await dashboardConnect(powerPlantInfo);
    }

    // Has a power generator has been added or removed?
    if (nConnectedUnits !== powerPlantInfo.nAggs) {
        nConnectedUnits = powerPlantInfo.nAggs;
        uiSetComponentVisibility(true, powerPlantInfo.nAggs);

        // Reset the entire dashboard
        await dashboardReset();
    }

    // Update Dashboard
    msgCount++;
    dashboardUpdate(powerPlantInfo);

    // Update header
    uiShowStatus(`<b>${powerPlantInfo.name}</b>`);
}


async function onConnect() {
    // Connection successful
    connectFlag = true;
    nConnectedUnits = 0;

    console.log('Connected to ' + host + ' on port ' + port);
    uiSetConnectStatus(true);

    // Subscribe if a topic exists
    if (mqttActiveTopic !== null) {
        mqttSubscribe(mqttActiveTopic);
    }
}

/*
 *  Custom UI (not Dashboard)
 */
function uiSetConnectStatus(connected) {
    let el = document.getElementById('connect_bar');
    el.style.backgroundColor = connected ? connectBar.onColor : connectBar.offColor;

    el = document.getElementById('dropdown-container');
    el.style.visibility = connected ? 'visible' : 'hidden';

    el = document.getElementById('connect_toggle');
    el.checked = connected;
}


function uiShowStatus(msg) {
    document.getElementById('connect_status').innerHTML = msg;
}


function uiShowError(msg) {
    const el = document.getElementById('connect_bar');

    el.style.backgroundColor = connectBar.errColor;
    document.getElementById('connect_status').innerHTML = 'Error: ' + msg;
}
