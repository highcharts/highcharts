/* eslint-disable camelcase */

//
// Application configuration
//

// Information about the received measurement data
const measInfo = measDataInfo();

// Configuration for power generator
const powerPlantConfig = {
    // Fields to display in tooltip and info table
    infoFields: ['q_turb', 'q_min', 'q_max', 'P_gen', 'P_max'],

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

const defaultZoom = 11;

// The Dashboard and DataHandler instances are created when the first
// MQTT packet is received. The instances are then used to update the
// Dashboard components and the data pool.
let dashboard = null;
let dataHandler = null;

// Max generators per power plant
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

        // Information on power plant level
        dashConfig.components.push(
            createInfoComponent()
        );

        // Map on power plant level
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
                ]
            }
        };
    }

    // Custom HTML component for displaying power plant, reservoir and
    // water intake parameters. If a briefiption of the power plant
    // is available, it is also briefibed here.
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

    // Highcharts map with points for power plant, reservoirs and intakes.
    function createMapComponent() {
        return {
            type: 'Highcharts',
            renderTo: 'el-map',
            chartConstructor: 'mapChart',
            title: 'Power plant with water reservoirs and intakes',
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
            chartOptions: {
                ...commonChartOptions,
                chart: {
                    type: 'solidgauge',
                    styledMode: false
                },
                pane: {
                    background: {
                        innerRadius: '80%',
                        outerRadius: '120%',
                        shape: 'arc'
                    },
                    center: ['50%', '70%'],
                    endAngle: 90,
                    startAngle: -90
                },
                yAxis: {
                    title: {
                        text: measInfo.descr('P_gen'),
                        y: -80
                    },
                    labels: {
                        distance: '100%',
                        y: 5,
                        align: 'auto'
                    },
                    minorTicks: false,
                    tickAmount: 1,
                    visible: true,
                    min: 0,
                    max: 0 // Populated on update
                },
                series: [{
                    name: measInfo.brief('P_gen'),
                    enableMouseTracking: true,
                    innerRadius: '80%',
                    radius: '120%'
                }],
                tooltip: {
                    valueSuffix: ' ' + powerUnit
                }
            }
        };
    }

    // Chart for displaying the history of generated power
    // over the last 'n' hours. Latest measurement to the right.
    function createChartComponent(connId, pgIdx) {
        return {
            type: 'Highcharts',
            renderTo: 'chart-agg-' + pgIdx,
            connector: {
                id: connId,
                columnAssignment: [{
                    seriesId: measInfo.brief('P_gen'),
                    data: ['time', 'power']
                }]
            },
            sync: {
                highlight: {
                    enabled: true,
                    autoScroll: true
                }
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
                        text: measInfo.descr('P_gen')
                    }
                },
                tooltip: {
                    valueSuffix: ' ' + powerUnit
                }
            }
        };
    }

    // Datagrid displaying the history of generated power
    // over the last 'n' hours. Oldest measurements at the top.
    function createDatagridComponent(connId, pgIdx) {
        return {
            type: 'DataGrid',
            renderTo: 'data-grid-' + pgIdx,
            connector: {
                id: connId
            },
            sync: {
                highlight: {
                    enabled: true,
                    autoScroll: true
                }
            },
            dataGridOptions: {
                editable: false,
                columns: {
                    time: {
                        headerFormat: 'Measure time (UTC)',
                        cellFormatter: function () {
                            // eslint-disable-next-line max-len
                            return Highcharts.dateFormat('%Y-%m-%d', this.value) + ' ' +
                                Highcharts.dateFormat('%H:%M:%S', this.value);
                        }
                    },
                    power: {
                        headerFormat: measInfo.descr('P_gen')
                    }
                }
            }
        };
    }
}

// Power stations: Name indexes topic and traffic stats.
// Dynamically updated by incoming messages.
const powerStationLookup = {};

// Number of generators
let nGenerators;


// Maintain power plant list and selection menu
function updatePowerStationList(data, topic) {
    const stationName = data.name;
    if (stationName in powerStationLookup) {
        return;
    }

    // Add station if these conditions are satisfied:
    // - valid location data
    // - valid generator data
    if (data.location && data.location.lon && data.aggs.length > 0) {
        powerStationLookup[stationName] = {
            topic: topic
        };
    }
    // Update dropdown list
    // eslint-disable-next-line no-use-before-define
    if (connectBarInst) {
        // eslint-disable-next-line no-use-before-define
        connectBarInst.updateDropwdownList(Object.keys(powerStationLookup));
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


// Update all Dashboards components
async function dashboardsComponentUpdate(mqttData) {
    function getInfoRecord(item, fields) {
        const ret = [];
        fields.forEach(field => {
            const isKnown = item !== null && item[field] !== null;
            ret.push({
                name: measInfo.brief(field),
                value: isKnown ? item[field] : '?',
                unit: measInfo.unit(field)
            });
        });
        return ret;
    }

    function getHeaderFields(fields) {
        const cols = getInfoRecord(null, fields);
        let colHtml = '';

        cols.forEach(col => {
            const name = col.name;
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

    function createInfoTable(header, fields, data) {
        if (Object.keys(data).length === 0) {
            return '';
        }

        // Fields to display
        let colHtml = getHeaderFields(fields);
        const colHtmlUnit = getUnitFields(fields);

        let html = `<table class="info-field"><caption>${header}</caption>
            <tr><th>Name</th>${colHtml}</tr>
            <tr class="unit"><th></th>${colHtmlUnit}</tr>`;

        // Populate fields
        data.forEach(item => {
            const name = item.name.replace('_', ' ');

            colHtml = getDataFields(item, fields);
            html += `<tr><td>${name}</td>${colHtml}</tr>`;
        });
        html += '</table>';

        return html;
    }

    async function addIntakeMarkers(mapComp, data) {
        data.intakes.forEach(item => {
            if (item.location) {
                // Add intake to map
                mapComp.addPoint({
                    name: item.name.replace('_', ' '),
                    lon: item.location.lon,
                    lat: item.location.lat,
                    marker: intakeConfig.mapMarker,
                    info: getInfoRecord(item, intakeConfig.infoFields)
                });
            }
        });
    }

    async function addReservoirMarkers(mapComp, data) {
        data.reservoirs.forEach(item => {
            if (item.location) {
                // Add reservoir to map
                mapComp.addPoint({
                    name: item.name,
                    lon: item.location.lon,
                    lat: item.location.lat,
                    marker: reservoirConfig.mapMarker,
                    info: getInfoRecord(item, reservoirConfig.tooltipFields)
                });
            }
        });
    }

    async function updateMap(data) {
        // Map
        const mapComp = dashboard.getComponentByCellId('el-map');
        const mapPoints = mapComp.chart.series[1];

        // Erase existing map points
        while (mapPoints.data.length > 0) {
            await mapPoints.data[0].remove();
        }

        if (!data.location) {
            // No location data available
            return;
        }

        // Create tooltip content for power plant
        let infoItems = [];
        data.aggs.forEach(item => {
            infoItems = infoItems.concat(
                getInfoRecord(item, powerPlantConfig.infoFields)
            );
        });

        // Add power plant map point
        const location = data.location;
        await mapPoints.addPoint({
            name: data.name,
            lon: location.lon,
            lat: location.lat,
            marker: powerPlantConfig.mapMarker,
            info: infoItems
        });

        // Add reservoir map points if applicable
        await addReservoirMarkers(mapPoints, data);

        // Add intake map points if applicable
        await addIntakeMarkers(mapPoints, data);

        // Center map at the new power plant location
        const mapView = mapComp.chart.mapView;
        await mapView.setView(
            [location.lon, location.lat],
            defaultZoom
        );
    }

    async function updateInfoHtml(data) {
        // HTML component title
        const infoComp = dashboard.getComponentByCellId('el-info');

        await infoComp.update({
            title: data.name
        });

        // Description of power plant (if available)
        let html = '';
        if (data.description !== null) {
            html = `<span class="pw-descr">
                ${data.description}</span>`;
        }

        // Location info
        if (data.location) {
            const loc = data.location;
            html += `<h3>${loc.lon} (lon.), ${loc.lat} (lat.)</h3>`;
        }

        // Power plant info
        html += createInfoTable(
            'Power plant', powerPlantConfig.infoFields, data.aggs
        );

        // Intakes info
        html += createInfoTable(
            'Water intakes', intakeConfig.infoFields, data.intakes
        );

        // Reservoir info
        html += createInfoTable(
            'Water reservoirs', reservoirConfig.infoFields, data.reservoirs
        );

        // Render HTML
        const el = document.querySelector(
            'div#el-info .highcharts-dashboards-component-html-content'
        );
        el.innerHTML = '<div id="info-container">' + html + '</div';
    }

    // Update map component
    await updateMap(mqttData);

    // Update info component (Custom HTML)
    await updateInfoHtml(mqttData);

    // Update KPI, chart and datagrid (one per power generator)
    const numGenerators = mqttData.aggs.length;
    for (let i = 0; i < numGenerators; i++) {
        const aggInfo = mqttData.aggs[i];
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

        // Add generator name only if the plant has multiple generators
        let aggName = mqttData.name;
        if (numGenerators > 1) {
            aggName += ` "${aggInfo.name}"`;
        }

        // KPI
        const kpiComp = dashboard.getComponentByCellId('kpi-agg-' + pgIdx);
        await kpiComp.update({
            value: rowCount > 0 ?
                dataTable.getCellAsNumber('power', rowCount - 1) : 0,
            chartOptions: chartOptions,
            title: aggName
        });

        // Spline chart
        const chartComp = dashboard.getComponentByCellId('chart-agg-' + pgIdx);
        await chartComp.update({
            connector: {
                id: connId
            },
            chartOptions: chartOptions,
            title: aggName
        });

        // Datagrid
        const gridComp = dashboard.getComponentByCellId('data-grid-' + pgIdx);
        await gridComp.update({
            connector: {
                id: connId
            },
            title: aggName
        });
    }
}

/*
 *  Data handler for Sognekraft, maintains the data pool
 */
class SkDataHandler {
    constructor(dashboard) {
        this.dataPool = dashboard.dataPool;
    }

    async dataTableUpdate(mqttData) {
        const nGenerators = mqttData.aggs.length;

        // Clear content of data table
        await this.dataTableReset(nGenerators);

        // Update all generators of the power plant
        for (let i = 0; i < nGenerators; i++) {
            const pgIdx = i + 1;
            const connId = 'mqtt-data-' + pgIdx;

            const dataTable = await this.dataPool.getConnectorTable(connId);

            // Get measurement history (24 hours, 10 minute intervals)
            const hist = mqttData.aggs[i].P_hist;
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
            const latest = new Date(mqttData.tst_iso).valueOf();
            const power = mqttData.aggs[i].P_gen;
            rowData.push([latest, power]);

            // Add all rows to the data table
            dataTable.setRows(rowData);
        }
    }

    // Remove all data from the data table
    async dataTableReset(nGenerators) {
        for (let i = 0; i < nGenerators; i++) {
            const puId = i + 1;
            const dataTable = await this.dataPool.getConnectorTable(
                'mqtt-data-' + puId
            );

            // Clear the data
            dataTable.deleteRows();
            dataTable.modified.deleteRows();
        }
    }
}

/*
 *  Message handler for Sognekraft, maintains the data pool
 *  and updates the dashboard, based on incoming MQTT data.
 */

let selectedTopic = null;

async function skMessageHandler(mqttData, topic) {
    updatePowerStationList(mqttData, topic);

    if (selectedTopic === null || selectedTopic !== topic) {
        // Ignore packets for stations that are not selected
        return;
    }

    // Create the Dashboard if it doesn't exist
    if (dashboard === null) {
        dashboard = await dashboardCreate();
        // eslint-disable-next-line no-use-before-define
        dataHandler = new SkDataHandler(dashboard);
    }

    // Has a power generator been added or removed?
    const nGenLatest = mqttData.aggs.length;
    if (nGenerators !== nGenLatest) {
        nGenerators = nGenLatest;
        uiSetComponentVisibility(true, nGenerators);
    }

    // Update data pool
    await dataHandler.dataTableUpdate(mqttData);

    // Update Dashboard
    await dashboardsComponentUpdate(mqttData);
}


/*
 *  MQTT client for Sognekraft production data
 */

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

let skMqttInst = null;

// Documentation for PAHO MQTT client:
//     https://www.hivemq.com/blog/mqtt-client-library-encyclopedia-paho-js/
//     https://eclipse.dev/paho/files/jsdoc/Paho.MQTT.Client.html

/* global Paho */

class SkMqtt {
    constructor() {
        if (skMqttInst) {
            throw new Error('SkMqtt instance already exists!!');
        }
        skMqttInst = this;

        // Message handler
        this.messageHandler = skMessageHandler;

        // Default connect handler, console messages only
        this.connectStatus = {
            showError: msg => console.error(msg),
            setConnectState: state => console.log('Connect status: ' + state),
            showStatus: (msg, arg = '') => console.log(msg, arg),
            setLogoVisibility: visible =>
                console.log('Logo visibility: ' + visible)
        };

        // Connection status
        this.connected = false;
        this.nMqttPackets = 0;
        this.topic = mqttConfig.topic;

        // Start MQTT client
        const cname = 'orderform-' + Math.floor(Math.random() * 10000);

        this.mqtt = new Paho.Client(
            mqttConfig.host,
            mqttConfig.port,
            cname
        );
        this.mqtt.onConnectionLost = this.onConnectionLost;
        this.mqtt.onMessageArrived = this.onMessageArrived;
    }

    connect() {
        if (this.connected) {
            this.connectStatus.showError('Already connected');
            return;
        }

        // Connect to broker
        this.mqtt.connect({
            useSSL: true,
            timeout: mqttConfig.timeout,
            cleanSession: true,
            onSuccess: () => this.onConnect(),
            onFailure: resp => this.onFailure(resp),
            userName: mqttConfig.user,
            password: mqttConfig.password
        });
    }

    isConnected() {
        return this.connected;
    }

    subscribe(topic) {
        if (this.connected) {
            // Subscribe to new topic
            this.mqtt.subscribe(topic, {
                qos: mqttConfig.qOs
            });
            console.log('Subscribed: ' + topic);
        } else {
            this.status.showError('Not connected, operation not possible');
        }
    }

    async resubscribe(newTopic) {
        if (this.connected) {
            // Unsubscribe any existing topics
            const unsubscribeOptions = {
                onSuccess: async () => {
                    this.subscribe(newTopic);
                    this.topic = newTopic;
                },
                onFailure: () => {
                    this.showError('Unsubscribe failed');
                },
                timeout: 10
            };
            this.mqtt.unsubscribe('/#', unsubscribeOptions);
        } else {
            this.showError('Not connected, operation not possible');
        }
    }

    // eslint-disable-next-line no-unused-vars
    unsubscribe() {
        if (this.connected) {
            // Unsubscribe any existing topics
            this.mqtt.unsubscribe(mqttConfig.topic);
        } else {
            this.connectStatus.showError(
                'Not connected, operation not possible'
            );
        }
    }

    disconnect() {
        if (!this.connected) {
            this.connectStatus.showError('Already disconnected');
            return;
        }
        // Unsubscribe any existing topics
        this.mqtt.unsubscribe('/#');

        // Disconnect
        this.mqtt.disconnect();
    }

    // eslint-disable-next-line class-methods-use-this
    onConnectionLost(resp) {
        const st = skMqttInst.connectStatus;

        skMqttInst.connected = false;
        st.setConnectState(false);

        if (resp.errorCode !== 0) {
            st.showError(resp.errorMessage);
        } else {
            st.showStatus('Disconnected');
        }
    }

    onFailure(resp) {
        this.connected = false;
        this.connectStatus.setConnectState(false);
        this.connectStatus.showError(resp.errorMessage);
    }

    // eslint-disable-next-line class-methods-use-this
    async onMessageArrived(mqttPacket) {
        console.log('Message received: ' + mqttPacket.destinationName);

        // Decode incoming data
        const mqttData = JSON.parse(mqttPacket.payloadString);
        const topic = mqttPacket.destinationName;

        // Process data
        skMqttInst.messageHandler(mqttData, topic);
        skMqttInst.nMqttPackets++;
    }

    onConnect() {
        // Connection successful
        this.connected = true;
        this.nMqttPackets = 0;

        // Update status information
        const st = this.connectStatus;
        st.setConnectState(true);
        st.showStatus(
            '<b>Connected</b> ' + mqttConfig.host +
            ':' + mqttConfig.port
        );

        // Subscribe if a topic exists
        if (mqttConfig.topic !== null) {
            this.subscribe(mqttConfig.topic);
        }
    }
}

/*
 *  Connection and status bar for Sognekraft
 */
let connectBarInst = null;

class SkConnectBar {

    constructor() {
        if (connectBarInst) {
            throw new Error('SkConnectBar instance already exists!!');
        }

        connectBarInst = this;

        // Connect bar colors
        this.color = {
            offColor: '', // Populated from CSS
            onColor: 'hsla(202.19deg, 100%, 37.65%, 1)',
            errColor: '#c33'
        };

        this.elConnectBar = document.getElementById('connect-bar');
        this.elConnectStatus = document.getElementById('connect-status');
        this.color.offColor =
            this.elConnectBar.style.backgroundColor; // From CSS

        this.elLogo = document.getElementById('logo-img-1');
        this.elLogoText = document.getElementById('logo-text');

        // Connect/Disconnect button
        this.elToggle = document.getElementById('connect-toggle');

        // Dropdown menu button for selecting power plant
        this.elDropdown = document.getElementById('dropdown-container');
        this.elDropdownButton = document.getElementById('dropdown-button');
        this.elDropdownContent = document.getElementById('dropdown-content');

        this.elDropdownButton.title = 'Click to select a power plant';
        this.elDropdownButton.innerHTML = 'Power plant &nbsp;&#9662;';
    }

    setConnectState(connected) {
        const st = this.elConnectBar.style;
        st.backgroundColor = connected ?
            this.color.onColor : this.color.offColor;

        // Use logo image only when connected, otherwise text
        this.setLogoVisibility(connected);

        this.elDropdown.style.visibility = connected ? 'visible' : 'hidden';
        this.elToggle.checked = connected;
    }

    setLogoVisibility() {
        // Use logo image only on a wider screen, otherwise text only.
        const el = this.elLogo;
        if (el) {
            const showLogo = (window.innerWidth > 576);
            el.style.display = showLogo ? 'inline' : 'none';
            if (this.elLogoText) {
                this.elLogoText.style.display = showLogo ? 'none' : 'block';
            }
        }
    }

    showStatus(msg, arg = '') {
        if (this.elConnectStatus) {
            this.elConnectStatus.innerHTML = msg + ' ' + arg;
        }
    }

    showError(msg) {
        const el = this.elConnectBar;

        el.style.backgroundColor = this.color.errColor;
        this.showStatus('Error: ' + msg);
    }

    updateDropwdownList(names) {
        const el = this.elDropdownContent;
        el.innerHTML = '';

        for (const key of names) {
            el.innerHTML +=
                `<a class="dropdown-select" href="#">${key}</a>`;
        }
    }

    clickHandler(event) {
        if (event.target === this.elDropdownButton) {
            // Reveals the dropdown list of power stations
            this.elDropdownContent.classList.toggle('show');
        } else if (event.target === this.elToggle) {
            // Connect/Disconnect button
            if (!skMqttInst.isConnected()) {
                skMqttInst.connect();
            } else {
                skMqttInst.disconnect();
            }
        } else {
            // Power plant menu items
            if (event.target.matches('.dropdown-select')) {
                const name = event.target.innerText;
                if (name in powerStationLookup) {
                    // This forces a redraw on the next MQTT packet
                    nGenerators = 0;
                    selectedTopic = powerStationLookup[name].topic;
                    skMqttInst.resubscribe(selectedTopic);

                    // Show the power plant name in the connection bar
                    this.elDropdownButton.innerHTML = name + '&nbsp;&#9662;';
                }
            }

            // Hide the power plant dropdown if the user clicks outside of it
            const dropdowns =
                document.getElementsByClassName('dropdown-content');
            for (let i = 0; i < dropdowns.length; i++) {
                const item = dropdowns[i];
                if (item.classList.contains('show')) {
                    item.classList.remove('show');
                }
            }
        }
    }
}

/*
 *  Application initialization
 */

window.onload = () => {
    connectBarInst = new SkConnectBar();

    // Hide the logo on small devices
    window.onresize = () => {
        connectBarInst.setLogoVisibility();
    };

    // Initialize the data transport layer (MQTT)
    skMqttInst = new SkMqtt();

    // Register the connect bar
    skMqttInst.connectStatus = connectBarInst;

    // Determine the maximum number of supported power generators ("aggregat")
    // per power plant. The number is determined by the definition
    // in the HTML file.
    maxPowerGenerators = document.getElementsByClassName('el-aggr').length;

    // Custom click handler
    window.onclick = event => {
        connectBarInst.clickHandler(event);
    };
};


//
// briefiption and unit of received MQTT measurement data
//
function measDataInfo() {
    return {
        // Power generation parameters
        P_gen: {
            brief: 'Generated power',
            unit: 'MW'
        },
        P_max: {
            brief: 'Generated power (max.)',
            unit: 'MW'
        },
        q_turb: {
            brief: 'Water usage',
            unit: 'm3/sec'
        },
        q_min: {
            brief: 'Water usage (min.)',
            unit: 'm3/sec'
        },
        q_max: {
            brief: 'Water usage (max.)',
            unit: 'm3/sec'
        },
        h: {
            brief: 'Elevation',
            unit: 'moh'
        },
        location: {
            brief: 'Location',
            unit: 'lat/lon'
        },
        volume: {
            brief: 'Volume',
            unit: 'mill. m3'
        },
        drain: {
            brief: 'Drain',
            unit: 'm3/sec'
        },
        inflow: {
            brief: 'Inflow',
            unit: 'm3/sec'
        },
        level: {
            brief: 'level',
            unit: 'moh'
        },
        HRV: {
            brief: 'Highest regulated level',
            unit: 'moh'
        },
        LRV: {
            brief: 'Lowest regulated level',
            unit: 'moh'
        },
        energy: {
            brief: 'Energy',
            unit: 'MWh'
        },
        net_flow: {
            brief: 'Net flow',
            unit: 'm3/sec'
        },
        q_min_set: {
            brief: 'Required minimal flow',
            unit: 'm3/sec'
        },
        q_min_act: {
            brief: 'Measured minimal flow',
            unit: 'm3/sec'
        },

        // Brief description of measurement
        brief: function (id) {
            if (id in this) {
                if ('brief' in this[id]) {
                    return this[id].brief;
                }
            }
            return '';
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

        // Full description, brief + unit
        descr: function (id) {
            return this.brief(id) + ' (' + this.unit(id) + ')';
        }
    };
}
