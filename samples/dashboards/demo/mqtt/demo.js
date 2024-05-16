/* eslint-disable camelcase */

//
// Application configuration
//

// Support for Nynorsk (nn) and English (en)
const lang = getLanguageSupport('en');

// Configuration for power generator
const stationConfig = {
    // Fields to display in tooltip and info table
    infoFields: ['q_turb', 'P_gen'],

    // Visual appearance on map
    mapMarker: {
        symbol: 'circle',
        radius: 10,
        fillColor: 'green'
    }
};

// Configuration for water reservoir
const reservoirConfig = {
    // Fields to display in tooltip
    tooltipFields: ['h', 'volume', 'drain', 'net_flow'],

    // Fields to display in info table
    infoFields: [
        'volume', 'drain', 'energy',
        'h', 'LRV', 'HRV', 'net_flow'
    ],

    // Visual appearance on map
    mapMarker: {
        symbol: 'mapmarker',
        radius: 8,
        fillColor: '#33c'
    }
};

// Configuration for water intake
const intakeConfig = {
    // Fields to display in tooltip and info table
    infoFields: ['q_min_set', 'q_min_act'],

    // Visual appearance on map
    mapMarker: {
        symbol: 'triangle-down',
        radius: 6,
        fillColor: 'red'
    }
};

const defaultZoom = 9;

// The Dashboard is created on MQTT connection
let dashboard = null;

// Max generators per power station
let maxPowerGenerators;


// Creates the dashboard
async function dashboardCreate() {
    const powerUnit = 'MW';

    const commonChartOptions = {
        title: {
            text: ''
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                stickyTracking: false
            }
        }
    };

    // Create configuration for power generator units
    const dashConfig = await createDashConfig();

    return await Dashboards.board('container', {
        dataPool: {
            connectors: dashConfig.connectors
        },
        components: dashConfig.components
    });

    async function createDashConfig() {
        const dashConfig = {
            connectors: [],
            components: []
        };

        // Information on power station level
        dashConfig.components.push(
            createInfoComponent()
        );

        // Map on power station level
        dashConfig.components.push(
            createMapComponent()
        );

        for (let i = 0; i < maxPowerGenerators; i++) {
            // Power generator index (1...n)
            const pgIdx = i + 1;

            // Data connector ID
            const connId = 'mqtt-data-' + pgIdx;

            // Data connectors
            dashConfig.connectors.push(
                createDataConnector(connId)
            );

            // Dash components
            dashConfig.components.push(
                createKpiComponent(pgIdx)
            );
            dashConfig.components.push(
                createChartComponent(connId, pgIdx)
            );
            dashConfig.components.push(
                createDatagridComponent(connId, pgIdx)
            );
        }
        return dashConfig;
    }

    // The data pool is updated by incoming MQTT data
    function createDataConnector(connId) {
        return {
            id: connId,
            type: 'JSON',
            options: {
                firstRowAsNames: false,
                columnNames: ['time', 'power'],
                data: [
                    // TBD: to be removed. For now the table doesn't get
                    // populated unless the first row is present at start-up.
                    [Date.UTC(2024, 0, 1), 0]
                ],
                dataModifier: {
                    // The incoming data must be sorted in ascending order
                    // for the 'spline' chart to work correctly.
                    type: 'Sort',
                    orderByColumn: 'time'
                }
            }
        };
    }

    // Custom HTML component for displaying power station, reservoirs and
    // water intake parameters. If a description of the power station
    // is available, it is also described here.
    function createInfoComponent() {
        return {
            type: 'HTML',
            renderTo: 'el-info',
            chartOptions: {
                chart: {
                    styledMode: false
                }
            }
        };
    }

    // Highcharts map with points for power station, reservoirs and intakes.
    function createMapComponent() {
        return {
            type: 'Highcharts',
            renderTo: 'el-map',
            chartConstructor: 'mapChart',
            title: lang.tr('mapTitle'),
            chartOptions: {
                ...commonChartOptions,
                chart: {
                    styledMode: false,
                    animation: false
                },
                mapNavigation: {
                    enabled: true,
                    buttonOptions: {
                        alignTo: 'spacingBox'
                    }
                },
                series: [{
                    type: 'tiledwebmap',
                    provider: {
                        type: 'OpenStreetMap',
                        theme: 'Standard'
                    }
                }, {
                    type: 'mappoint',
                    name: 'stations',
                    color: 'white',
                    dataLabels: {
                        align: 'left',
                        crop: false,
                        enabled: true,
                        format: '{point.name}',
                        padding: 0,
                        verticalAlign: 'bottom',
                        y: -2,
                        x: 10
                    },
                    tooltip: {
                        headerFormat: '',
                        footerFormat: '',
                        pointFormatter: function () {
                            let rows = '';
                            this.info.forEach(item => {
                                const unit = item.value === '?' ?
                                    '' : item.unit;
                                rows += `<tr>
                                    <td>${item.name}</td>
                                    <td>${item.value}</td>
                                    <td>${unit}</td>
                                </tr>`;
                            });

                            return `<table class="map-tooltip">
                            <caption>${this.name}</caption>
                            ${rows}
                            </table>`;
                        }
                    },
                    data: [] // Populated on update
                }],
                tooltip: {
                    useHTML: true
                }
            }
        };
    }

    // KPI components for displaying the latest generated power.
    // One KPI for each generator.
    function createKpiComponent(pgIdx) {
        return {
            type: 'KPI',
            renderTo: 'kpi-agg-' + pgIdx,
            title: '',
            chartOptions: {
                ...commonChartOptions,
                chart: {
                    type: 'solidgauge',
                    styledMode: true
                },
                pane: {
                    background: {
                        innerRadius: '80%',
                        outerRadius: '130%',
                        shape: 'arc'
                    },
                    center: ['50%', '70%'],
                    endAngle: 90,
                    startAngle: -90
                },
                yAxis: {
                    title: {
                        text: lang.hdr('P_gen'),
                        y: -80
                    },
                    labels: {
                        distance: '105%',
                        y: 5,
                        align: 'auto'
                    },
                    lineWidth: 2,
                    minorTicks: false,
                    tickWidth: 2,
                    tickAmount: 2,
                    visible: true,
                    min: 0,
                    max: 0 // Populated at update
                },
                series: [{
                    name: lang.tr('P_gen'),
                    enableMouseTracking: true,
                    innerRadius: '80%',
                    radius: '130%'
                }],
                tooltip: {
                    valueSuffix: ' ' + powerUnit
                }
            }
        };
    }

    // Spline chart for displaying the history of generated power
    // over the last 'n' hours. Latest measurement to the right.
    function createChartComponent(connId, pgIdx) {
        return {
            type: 'Highcharts',
            renderTo: 'chart-agg-' + pgIdx,
            connector: {
                id: connId,
                columnAssignment: [{
                    seriesId: lang.tr('P_gen'),
                    data: ['time', 'power']
                }]
            },
            chartOptions: {
                ...commonChartOptions,
                chart: {
                    type: 'spline',
                    animation: true
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: {
                    min: 0,
                    max: 0, // Populated on update
                    title: {
                        text: lang.hdr('P_gen')
                    }
                },
                tooltip: {
                    valueSuffix: ' ' + powerUnit
                }
            }
        };
    }

    // Datagrid displaying the history of generated power
    // over the last 'n' hours. Latest measurement at the top.
    function createDatagridComponent(connId, pgIdx) {
        return {
            type: 'DataGrid',
            renderTo: 'data-grid-' + pgIdx,
            connector: {
                id: connId
            },
            dataGridOptions: {
                editable: false,
                columns: {
                    time: {
                        headerFormat: lang.tr('Measure time') + ' (UTC)',
                        cellFormatter: function () {
                            // eslint-disable-next-line max-len
                            return Highcharts.dateFormat('%Y-%m-%d', this.value) + ' ' +
                                Highcharts.dateFormat('%H:%M:%S', this.value);
                        }
                    },
                    power: {
                        headerFormat: lang.tr('P_gen') +
                            ' (' + lang.unit('P_gen') + ')'
                    }
                }
            }
        };
    }
}

// Updates the data pool when a new MQTT message arrives. The old data
// is removed before the new data is added. When complete, the Dasboards
// components are updated.
async function dashboardUpdate(powerStationData) {
    const dataPool = dashboard.dataPool;

    // Clear content of data table
    await dataPoolReset();

    // Update all generators of the power station
    for (let i = 0; i < powerStationData.nGenerators; i++) {
        const pgIdx = i + 1;
        const connId = 'mqtt-data-' + pgIdx;

        const dataTable = await dataPool.getConnectorTable(connId);

        // Get measurement history (24 hours, 10 minute intervals)
        const hist = powerStationData.aggs[i].P_hist;
        let time = new Date(hist.start).valueOf();

        const interval = hist.res * 1000; // Resolution: seconds
        const rowData = [];
        const histLen = hist.values.length;

        for (let j = 0; j < histLen; j++) {
            const power = hist.values[j];

            // Add row with historical data
            rowData.push([time, power]);

            // Next measurement
            time += interval;
        }

        // Add the latest measurement
        const latest = new Date(powerStationData.tst_iso).valueOf();
        const power = powerStationData.aggs[i].P_gen;
        rowData.push([latest, power]);

        // Add all rows to the data table
        await dataTable.setRows(rowData);
    }

    // Refresh all Dashboards components
    await dashboardsComponentUpdate(powerStationData);
}

// The dashboard is created when the first MQTT message arrives.
// (at this stage we know how many generators ech power station has).
async function dashboardConnect(powerStationData) {
    // Launch  Dashboard
    if (dashboard === null) {
        dashboard = await dashboardCreate();
    }

    const dataPool = dashboard.dataPool;
    for (let i = 0; i < powerStationData.nGenerators; i++) {
        const puId = i + 1;
        const dataTable = await dataPool.getConnectorTable('mqtt-data-' + puId);

        // Clear the data
        await dataTable.deleteRows();
    }

    await dashboardsComponentUpdate(powerStationData);
}

// Update all Dashboards components
async function dashboardsComponentUpdate(powerStationData) {
    function getComponent(dashboard, id) {
        return dashboard.mountedComponents.map(c => c.component)
            .find(c => c.options.renderTo === id);
    }

    function getInfoRecord(item, fields) {
        const ret = [];
        fields.forEach(field => {
            const isKnown = item !== null && item[field] !== null;
            ret.push({
                name: lang.tr(field),
                value: isKnown ? item[field] : '?',
                unit: lang.unit(field)
            });
        });
        return ret;
    }

    function getHeaderFields(fields) {
        const cols = getInfoRecord(null, fields);
        let colHtml = '';

        cols.forEach(col => {
            const name = lang.tr(col.name);
            colHtml += `<th>${name}</th>`;
        });

        return colHtml;
    }

    function getUnitFields(fields) {
        const cols = getInfoRecord(null, fields);
        let colHtml = '';

        cols.forEach(col => {
            colHtml += `<th>${col.unit}</th>`;
        });

        return colHtml;
    }

    function getDataFields(item, fields) {
        const cols = getInfoRecord(item, fields);
        let colHtml = '';

        cols.forEach(col => {
            colHtml += `<td>${col.value}</td>`;
        });

        return colHtml;
    }

    function getIntakeHtml(powerStationData) {
        if (powerStationData.nIntakes === 0) {
            const str = lang.tr('No intakes');

            return `<h3 class="intake">${str}</h3>`;
        }

        // Description
        let html = '';
        if (powerStationData.description !== null) {
            html = `<span class="pw-descr">
            ${powerStationData.description}</span>`;

        }
        const intake = lang.tr('intakes');
        const name = lang.tr('Name');

        // Fields to display
        const fields = intakeConfig.infoFields;
        let colHtml = getHeaderFields(fields);
        const colHtmlUnit = getUnitFields(fields);

        html += `<table class="intake"><caption>${intake}</caption>
            <tr><th>${name}</th>${colHtml}</tr>
            <tr class="unit"><th></th>${colHtmlUnit}</tr>`;

        for (let i = 0; i < powerStationData.nIntakes; i++) {
            const item = powerStationData.intakes[i];
            const name = item.name.replace('_', ' ');

            colHtml = getDataFields(item, fields);
            html += `<tr><td>${name}</td>${colHtml}</tr>`;
        }
        html += '</table>';

        return html;
    }

    function getReservoirHtml(powerStationData) {
        if (powerStationData.nReservoirs === 0) {
            const str = lang.tr('No connected reservoirs');

            return `<h3 class="intake">${str}</h3>`;
        }

        // Fields to display in table
        const fields = reservoirConfig.infoFields;
        let colHtml = getHeaderFields(fields);
        const colHtmlUnit = getUnitFields(fields);
        const name = lang.tr('Name');
        const res = lang.tr('reservoirs');

        let html = `<table class="intake"><caption>${res}</caption>
            <tr><th>${name}</th>${colHtml}</tr>
            <tr class="unit"><th></th>${colHtmlUnit}</tr>`;

        for (let i = 0; i < powerStationData.nReservoirs; i++) {
            const item = powerStationData.reservoirs[i];
            colHtml = getDataFields(item, fields);

            html += `<tr><td>${item.name}</td>${colHtml}</tr>`;
        }
        html += '</table>';

        return html;
    }

    async function addIntakeMarkers(mapComp, powerStationData) {
        for (let i = 0; i < powerStationData.nIntakes; i++) {
            const item = powerStationData.intakes[i];
            if (item.location === null) {
                continue;
            }

            // Add reservoir to map
            await mapComp.addPoint({
                name: item.name.replace('_', ' '),
                lon: item.location.lon,
                lat: item.location.lat,
                marker: intakeConfig.mapMarker,
                info: getInfoRecord(item, intakeConfig.infoFields)
            });
        }
    }

    async function addReservoirMarkers(mapComp, powerStationData) {
        for (let i = 0; i < powerStationData.nReservoirs; i++) {
            const item = powerStationData.reservoirs[i];
            if (item.location === null) {
                continue;
            }

            // Add reservoir to map
            await mapComp.addPoint({
                name: item.name,
                lon: item.location.lon,
                lat: item.location.lat,
                marker: reservoirConfig.mapMarker,
                info: getInfoRecord(item, reservoirConfig.tooltipFields)
            });
        }
    }

    async function updateMap(powerStationData) {
        // Map
        const mapComp = getComponent(dashboard, 'el-map');
        const mapPoints = mapComp.chart.series[1];

        // Erase existing map points
        while (mapPoints.data.length > 0) {
            await mapPoints.data[0].remove();
        }

        // Create tooltip content for power station
        let infoItems = [];
        powerStationData.aggs.forEach(item => {
            infoItems = infoItems.concat(
                getInfoRecord(item, stationConfig.infoFields)
            );
        });

        // Add power station map point
        const location = powerStationData.location;
        await mapPoints.addPoint({
            name: powerStationData.name,
            lon: location.lon,
            lat: location.lat,
            marker: stationConfig.mapMarker,
            info: infoItems
        });

        // Add reservoir map points if applicable
        await addReservoirMarkers(mapPoints, powerStationData);

        // Add intake map points if applicable
        await addIntakeMarkers(mapPoints, powerStationData);

        // Center map at the new power station location
        const mapView = mapComp.chart.mapView;
        await mapView.setView(
            [location.lon, location.lat],
            defaultZoom
        );
    }

    async function updateInfoHtml(data) {
        // Information
        const stationName = data.name;
        const location = data.location;

        const posInfo = `${location.lon} (lon.), ${location.lat} (lat.)`;

        const infoComp = getComponent(dashboard, 'el-info');
        await infoComp.update({
            title: stationName
        });

        const intakeHtml = getIntakeHtml(data);
        const reservoirHtml = getReservoirHtml(data);

        const el = document.querySelector(
            'div#el-info .highcharts-dashboards-component-content'
        );
        el.innerHTML = `<div id="info-container">
    <h3>${posInfo}</h3>
    ${intakeHtml}
    ${reservoirHtml}
    </div>
    `;

    }

    // Update map component
    await updateMap(powerStationData);

    // Update info component (Custom HTML)
    await updateInfoHtml(powerStationData);

    // Update KPI, chart and datagrid (one per power generator)
    for (let i = 0; i < powerStationData.nGenerators; i++) {
        const aggInfo = powerStationData.aggs[i];
        const pgIdx = i + 1;
        const connId = 'mqtt-data-' + pgIdx;

        // Get data
        const dataTable = await dashboard.dataPool.getConnectorTable(connId);
        const rowCount = await dataTable.getRowCount();

        const chartOptions = {
            yAxis: {
                max: aggInfo.P_max
            }
        };

        // Add generator name only if the station has multiple generators
        let aggName = powerStationData.name;
        if (powerStationData.nGenerators > 1) {
            aggName += ` "${aggInfo.name}"`;
        }

        // KPI
        const kpiComp = getComponent(dashboard, 'kpi-agg-' + pgIdx);
        await kpiComp.update({
            value: rowCount > 0 ?
                dataTable.getCellAsNumber('power', rowCount - 1) : 0,
            chartOptions: chartOptions,
            title: aggName
        });

        // Spline chart
        const chartComp = getComponent(dashboard, 'chart-agg-' + pgIdx);
        await chartComp.update({
            connector: {
                id: connId
            },
            chartOptions: chartOptions,
            title: aggName
        });

        // Datagrid
        const gridComp = getComponent(dashboard, 'data-grid-' + pgIdx);
        await gridComp.update({
            connector: {
                id: connId
            },
            title: aggName
        });
    }
}

// Remove all data from the data pool
async function dataPoolReset() {
    const dataPool = dashboard.dataPool;
    for (let i = 0; i < maxPowerGenerators; i++) {
        const puId = i + 1;
        const dataTable = await dataPool.getConnectorTable('mqtt-data-' + puId);

        // Clear the data
        await dataTable.deleteRows();
        await dataTable.modified.deleteRows();
    }
}

// Update component visibility according to the number
// of used power generator (or entirely hidden).
function uiSetComponentVisibility(visible, nGenerators = 0) {
    const powGenCells = document.getElementsByClassName('el-aggr');

    for (let i = 0; i < powGenCells.length; i++) {
        const el = powGenCells[i];
        const unitVisible = visible && i < nGenerators;

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

// MQTT handle
let mqtt = null;

// MQTT connection parameters
const host = 'mqtt.sognekraft.no';
const port = 8083;
let mqttActiveTopic = null;
const mqttQos = 0;

// Authentication
let user = 'highsoft';
let password = 'Qs0URPjxnWlcuYBmFWNK';

// Connection status
let mqttConnected;
let nMqttPackets;
let nGenerators;

// Connection status UI
const connectBar = {
    offColor: '', // Populated from CSS
    onColor: 'hsla(202.19deg, 100%, 37.65%, 1)',
    errColor: '#c33'
};

// Overview of power stations, as MQTT topic.
const powerStationLookup = {
    Kråkeelvi: {
        topic: 'prod/DEMO_Highsoft/kraftverk_1/overview'
    }
};

/*
 *  Application interface
 */
window.onload = () => {
    // Initialize the data transport layer
    mqttInit();

    // Determine the maximum number of supported power generators ("aggregat")
    // per power station. The number is determined by the definition in the HTML file.
    maxPowerGenerators = document.getElementsByClassName('el-aggr').length;

    // UI objects
    const el = document.getElementById('connect-bar');
    connectBar.offColor = el.style.backgroundColor; // From CSS

    const dropDownButton = document.getElementById('dropdown-button');

    // Language dependencies
    dropDownButton.title = lang.tr('powerStationHelp');
    dropDownButton.innerHTML = lang.tr('Power station') + '&nbsp;&#9662;';
    document.getElementById('user-label').innerText = lang.tr('Username');
    document.getElementById('pass-label').innerText = lang.tr('Password');
    document.getElementById('auth-submit').value = lang.tr('Apply');

    // Populate power station selection menu
    const dropdownDiv = document.getElementById('dropdownContent');
    for (const key of Object.keys(powerStationLookup)) {
        dropdownDiv.innerHTML += `<a class="dropdown-select" href="#">${key}</a>`;
    }

    // Custom click handler
    window.onclick = event => {
        if (event.target !== dropDownButton) {
            // Power station menu items
            if (event.target.matches('.dropdown-select')) {
                const name = event.target.innerText;
                if (name in powerStationLookup) {
                    onStationClicked(name);
                }
            }

            // Hide the power station menu if the user clicks outside of it
            const dropdowns = document.getElementsByClassName('dropdown-content');
            for (let i = 0; i < dropdowns.length; i++) {
                const item = dropdowns[i];
                if (item.classList.contains('show')) {
                    item.classList.remove('show');
                }
            }
        }
    };

    // Hide the logo on small devices
    window.onresize = () => {
        uiSetLogoVisibility(mqttConnected);
    };
};


/*
 *  Application user interface
 */
function onConnectClicked() {
    // Connect to (or disconnect from) the MQTT server
    if (mqttConnected) {
        mqttDisconnect();
    } else {
        mqttConnect();
    }
}


function onConnectCancel() {
    document.getElementById('connect-toggle').checked = false;
    user = null;
    password = null;
}


function onStationSelectClicked() {
    // Reveals the dropdown list of power stations
    document.getElementById('dropdownContent').classList.toggle('show');
}


async function onStationClicked(station) {
    // This forces a redraw on the next MQTT packet
    nGenerators = 0;

    // Change topic to currently selected power station
    await mqttResubscribe(powerStationLookup[station].topic);
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

    // Connection status
    nMqttPackets = 0;
    mqttConnected = false;
}


function mqttConnect() {
    if (mqttConnected) {
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
        userName: user,
        password: password
    });
}


function mqttSubscribe(topic) {
    if (mqttConnected) {
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
    if (mqttConnected) {
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
    if (mqttConnected) {
        // Unsubscribe any existing topics
        console.log('Unsubscribe: ' + mqttActiveTopic);
        mqtt.unsubscribe(mqttActiveTopic);
    } else {
        uiShowError('Not connected, operation not possible');
    }
}


function mqttDisconnect() {
    if (!mqttConnected) {
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


/*
 *  MQTT callbacks
 */
async function onConnectionLost(resp) {
    nGenerators = 0;
    mqttConnected = false;
    uiSetConnectStatus(false);

    if (resp.errorCode !== 0) {
        uiShowError(resp.errorMessage);
    }
    onConnectCancel();
}


function onFailure(resp) {
    nGenerators = 0;
    mqttConnected = false;

    uiSetConnectStatus(false);
    uiShowError(resp.errorMessage);

    onConnectCancel();
}


async function onMessageArrived(mqttPacket) {
    if (mqttActiveTopic !== mqttPacket.destinationName) {
        console.log('Topic ignored: ' + mqttPacket.destinationName);
        return;
    }

    // Process incoming active topic
    const powerStationData = JSON.parse(mqttPacket.payloadString);
    powerStationData.nGenerators = powerStationData.aggs.length;
    powerStationData.nIntakes = powerStationData.intakes.length;
    powerStationData.nReservoirs = powerStationData.reservoirs.length;

    if (nMqttPackets === 0) {
        // Connect and create the Dashboard when the first packet arrives
        await dashboardConnect(powerStationData);
    }

    // Has a power generator been added or removed?
    if (nGenerators !== powerStationData.nGenerators) {
        nGenerators = powerStationData.nGenerators;
        uiSetComponentVisibility(true, powerStationData.nGenerators);
    }

    // Update Dashboard
    dashboardUpdate(powerStationData);

    // Update header
    uiShowStatus(`<b>${powerStationData.name}</b>`);

    nMqttPackets++;
}


async function onConnect() {
    // Connection successful
    mqttConnected = true;
    nGenerators = 0;

    console.log('Connected to ' + host + ' on port ' + port);
    uiSetConnectStatus(true);
    uiShowStatus('noStation');

    // Subscribe if a topic exists
    if (mqttActiveTopic !== null) {
        mqttSubscribe(mqttActiveTopic);
    }
}

/*
 *  Custom UI (not Dashboard)
 */
function uiSetConnectStatus(connected) {
    let el = document.getElementById('connect-bar');
    el.style.backgroundColor = connected ? connectBar.onColor : connectBar.offColor;

    el = document.getElementById('dropdown-container');
    el.style.visibility = connected ? 'visible' : 'hidden';

    el = document.getElementById('connect-toggle');
    el.checked = connected;

    // Use logo image only when connected, otherwise text
    uiSetLogoVisibility(connected);
}


function uiSetLogoVisibility(connected) {
    // Use logo image only when connected and on a wider screen,
    // otherwise text only.
    let el = document.getElementById('logo-img');
    if (el) {
        const showLogo = (window.innerWidth > 576) && connected;
        el.style.display = showLogo ? 'inline' : 'none';

        el = document.getElementById('logo-text');
        el.style.display = showLogo ? 'none' : 'block';
    }
}


function uiShowStatus(msg) {
    document.getElementById('connect-status').innerHTML = lang.tr(msg);
}


function uiShowError(msg) {
    const el = document.getElementById('connect-bar');

    el.style.backgroundColor = connectBar.errColor;
    document.getElementById('connect-status').innerHTML = 'Error: ' + msg;
}


//
// Language support
//
function getLanguageSupport(lang) {
    return {
        // Selected language
        current: lang,

        // Translations, fixed strings
        Username: {
            nn: 'Brukarnamn'
        },
        Password: {
            nn: 'Passord'
        },
        Apply: {
            nn: 'Bruk'
        },
        Name: {
            nn: 'Namn'
        },
        'Power station': {
            nn: 'Kraftverk'
        },
        'Location unknown': {
            nn: 'Ukjend plassering'
        },
        'No connected reservoirs': {
            nn: 'Ingen tilknyta magasin'
        },
        'No intakes': {
            nn: 'Ingen inntak'
        },
        mapTitle: {
            nn: 'Kraftverk med magasin og inntak',
            en: 'Power station with water reservoirs and intake'
        },
        noStation: {
            nn: 'Ingen kraftverk valgd',
            en: 'No power station selected'
        },
        powerStationHelp: {
            en: 'Click to select a power station',
            nn: 'Klikk for å velgja kraftstasjon'
        },

        // Power generation parameters
        'Measure time': {
            nn: 'Måletidspunkt',
            unit: 'UTC'
        },
        P_gen: {
            nn: 'Effekt',
            en: 'Generated power',
            unit: 'MW'
        },
        q_turb: {
            nn: 'Vassforbruk',
            en: 'Water usage',
            unit: 'm3/sek'
        },
        h: {
            nn: 'Høgde',
            en: 'Elevation',
            unit: 'moh'
        },
        location: {
            nn: 'Plassering',
            en: 'Location',
            unit: 'lat/lon'
        },
        volume: {
            nn: 'Volum',
            en: 'Volume',
            unit: 'mill. m3'
        },
        intakes: {
            nn: 'Inntak',
            en: 'Intakes'
        },
        reservoirs: {
            nn: 'Vassmagasin',
            en: 'Reservoirs'
        },
        drain: {
            nn: 'Avlaup',
            en: 'Drain',
            unit: 'm3/sek'
        },
        inflow: {
            nn: 'Tilsig',
            en: 'Inflow',
            unit: 'm3/sek'
        },
        level: {
            nn: 'Nivå',
            en: 'level',
            unit: 'moh'
        },
        HRV: {
            nn: 'Høgaste regulerte vasstand',
            en: 'Highest regulated level',
            unit: 'moh'
        },
        LRV: {
            nn: 'Lågaste regulerte vasstand',
            en: 'Lowest regulated level',
            unit: 'moh'
        },
        energy: {
            nn: 'Energi',
            en: 'Energy',
            unit: 'MWh'
        },
        net_flow: {
            nn: 'Netto endring',
            en: 'Net flow',
            unit: 'm3/sek'
        },
        q_min_set: {
            nn: 'Minstevassføring krav',
            en: 'Required minimal flow',
            unit: 'm3/sek'
        },
        q_min_act: {
            nn: 'Minstevassføring målt',
            en: 'Measured minimal flow',
            unit: 'm3/sek'
        },

        // Translator function
        tr: function (str) {
            const item = str in this ? this[str] : null;
            if (item === null) {
                // No translation exists, return original
                return str;
            }

            let ret = str;
            if (this.current in this[str]) {
                ret = this[str][this.current];
            }

            return ret;
        },

        // Get measurement unit (if applicable)
        unit: function (id) {
            if (id in this) {
                if ('unit' in this[id]) {
                    return this[id].unit;
                }
            }
            return '';
        },

        // Name + unit
        hdr: function (id) {
            return this.tr(id) + ' (' + this.unit(id) + ')';
        }
    };
}
