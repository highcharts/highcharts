/* eslint-disable camelcase */

//
// Application objects
//
let controlBar;
let dashboard;

// Whether or not to use historical data
const useHistoricalData = true;

// Default map zoom level
const defaultZoom = 11;

// Unit for generated power (megawatts)
const powerUnit = 'MW';

// Options log (comment out to disable)
const log = console.log;

// Currently active power plant/generator
const activeItem = {
    fullName: '',
    plantName: '',
    generatorId: 1
};


// MQTT configuration for Sognekraft AS broker
const mqttLinkConfig = {
    host: 'mqtt.sognekraft.no',
    port: 8083,
    user: 'highsoft',
    password: 'Qs0URPjxnWlcuYBmFWNK',
    useSSL: true
};

// Mapping of MQTT topics to MQTT connectors
let nDiscoveredTopics = 0;
const topicMap = {
    'prod/DEMO_Highsoft/kraftverk_1/overview': 'mqtt-data-1',
    'prod/DEMO_Highsoft/kraftverk_2/overview': 'mqtt-data-2'
};
// Default connector ID
const defaultConnId = 'mqtt-data-1';


// Information about the received measurement data
const measInfo = measDataInfo();

// Configuration for power plant
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

// Common chart options for Highcharts components
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


// Custom HTML component for displaying power plant, reservoir and
// water intake parameters. If a description of the power plant
// is available, it is also shown here.
const infoComponent = {
    type: 'HTML',
    renderTo: 'el-info',
    chartOptions: {
        chart: {
            styledMode: false
        }
    }
};

// Highcharts map with points for power plant, reservoirs and intakes.
const mapComponent = {
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

// KPI components for displaying the latest generated power.
const kpiComponent = {
    type: 'KPI',
    renderTo: 'el-kpi',
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

// Chart for displaying generated power.
const chartComponent = {
    type: 'Highcharts',
    renderTo: 'el-chart',
    connector: {
        id: defaultConnId,
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

// Datagrid displaying the history of generated power
// over the last 'n' hours. Oldest measurements at the top.
const datagridComponent = {
    type: 'DataGrid',
    renderTo: 'el-datagrid',
    connector: {
        id: defaultConnId
    },
    sync: {
        highlight: {
            enabled: true,
            autoScroll: true
        }
    },
    dataGridOptions: {
        credits: {
            enabled: false
        },
        columns: [{
            id: 'time',
            header: {
                format: 'Time (UTC)'
            },
            cells: {
                formatter: function () {
                    return Highcharts.dateFormat(
                        '%H:%M:%S',
                        this.value
                    );
                }
            }
        }, {
            id: 'power',
            header: {
                format: measInfo.descr('P_gen')
            },
            cells: {
                format: '{value:.2f}'
            }
        }]
    }
};

// Print log message
function printLog(msg) {
    if (log) {
        log(msg);
    }
}

// Creates the dashboard
async function createDashboard() {

    // Create configuration for power generator units
    const dashConfig = await createDashConfig();

    dashboard = await Dashboards.board('container', {
        dataPool: {
            connectors: dashConfig.connectors
        },
        components: dashConfig.components
    });

    function dataParser(data) {
        if (!data.aggs) {
            return data;
        }

        // Extract power production data
        const modifiedData = [];
        const idx = activeItem.generatorId - 1;
        const aggData = data.aggs[idx];

        if (useHistoricalData) {
            // Get measurement history (24 hours, 10 minute intervals)
            const hist = aggData.P_hist;
            let ts = new Date(hist.start).valueOf();

            const interval = hist.res * 1000; // Resolution: seconds
            const histLen = hist.values.length;

            for (let j = 0; j < histLen; j++) {
                const power = hist.values[j];

                // Add row with historical data
                modifiedData.push([ts, power]);

                // Next measurement
                ts += interval;
            }
        } else {
            // Use latest measurement
            const ts = new Date(data.tst_iso).valueOf();
            modifiedData.push([ts, aggData.P_gen]);
        }

        return modifiedData;
    }

    async function createDashConfig() {
        const dashConfig = {
            connectors: [],
            components: []
        };

        // One connector per data source (MQTT topic)
        for (const [key, value] of Object.entries(topicMap)) {
            dashConfig.connectors.push(
                createDataConnector(key, value)
            );
        }

        // Information component (HTML)
        dashConfig.components.push(infoComponent);

        // Map for displaying power plant, reservoirs and intakes locations
        dashConfig.components.push(mapComponent);

        // KPI for displaying the latest generated power
        dashConfig.components.push(kpiComponent);

        // Chart component for displaying generated power (history)
        dashConfig.components.push(chartComponent);

        // Datagrid component for displaying generated power (history)
        dashConfig.components.push(datagridComponent);

        return dashConfig;
    }

    // The data pool is updated by incoming MQTT data
    function createDataConnector(topic, connId) {
        return {
            id: connId,
            type: 'MQTT',
            options: {
                ...mqttLinkConfig,
                topic: topic,
                autoConnect: true,
                autoReset: true, // Clear data table on subscribe
                autoClear: useHistoricalData, // Avoid reuse of historical data

                columnNames: ['time', 'power'],
                beforeParse: data => dataParser(data),
                connectEvent: event => {
                    const { connected, host, port } = event.detail;
                    controlBar.setConnectState(connected);
                    if (connected) {
                        controlBar.showStatus(`Connected to ${host}:${port}`);
                    } else {
                        controlBar.showStatus('Not connected');
                        uiSetComponentVisibility(false);
                    }
                    // eslint-disable-next-line max-len
                    printLog(`Client ${connected ? 'connected' : 'disconnected'}: host: ${host}, port: ${port}`);
                },
                subscribeEvent: event => {
                    const { subscribed, topic } = event.detail;
                    printLog(
                        // eslint-disable-next-line max-len
                        `Client ${subscribed ? 'subscribed' : 'unsubscribed'}: ${topic}`
                    );
                    uiSetComponentVisibility(subscribed);
                },
                packetEvent: event => {
                    const { topic, count } = event.detail;
                    printLog(`Packet #${count} received: ${topic}`);
                    dashboardUpdate(event.data, connId);
                },
                errorEvent: event => {
                    const { code, message } = event.detail;
                    printLog(`${message} (error code #${code})`);
                    controlBar.showError(message);
                }
            }
        };
    }

    // Update component visibility. Hide all but first row if not connected.
    function uiSetComponentVisibility(visible) {
        const cells = document.getElementsByClassName('row');

        for (let i = 1; i < cells.length; i++) {
            const el = cells[i];
            el.style.display = visible ? 'flex' : 'none';
        }
    }
}

// Power stations: Name indexes topic and traffic stats.
// Dynamically updated by incoming messages.
const powPlantList = {};

// Maintain power plant list and selection menu
function updatePowerPlantList(data, topic) {
    const powerPlantName = data.name;
    if (powerPlantName in powPlantList) {
        return;
    }

    // Add station if these conditions are satisfied:
    // - valid location data
    // - valid generator data
    const nGenr = data.aggs.length;
    if (data.location && data.location.lon && nGenr > 0) {
        const info = {
            topic: topic,
            aggs: []
        };
        // Add generator data if applicable
        if (nGenr > 1) {
            for (let i = 0; i < nGenr; i++) {
                info.aggs.push(data.aggs[i].name);
            }
        }
        powPlantList[powerPlantName] = info;

        // Update dropdown list
        if (controlBar) {
            controlBar.updatePowPlantDropdown(powPlantList);
        }
    }
}


// Update all Dashboards components
async function dashboardUpdate(mqttData, connId) {
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

    // Update KPI, chart and datagrid
    const idx = activeItem.generatorId - 1;
    const aggInfo = mqttData.aggs[idx];

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
    if (mqttData.aggs.length > 1) {
        aggName += ` "${aggInfo.name}"`;
    }

    // KPI
    const kpiComp = dashboard.getComponentByCellId('el-kpi');
    await kpiComp.update({
        value: rowCount > 0 ?
            dataTable.getCellAsNumber('power', rowCount - 1) : 0,
        chartOptions: chartOptions,
        title: aggName
    });

    // Spline chart
    const chartComp = dashboard.getComponentByCellId('el-chart');
    await chartComp.update({
        connector: {
            id: connId
        },
        chartOptions: chartOptions,
        title: aggName
    });

    // Datagrid
    const gridComp = dashboard.getComponentByCellId('el-datagrid');
    await gridComp.update({
        connector: {
            id: connId
        },
        title: aggName
    });
}


/*
 *  Control/status bar
 */
class ControlBar {

    constructor() {
        if (controlBar) {
            throw new Error('ControlBar instance already exists!!');
        }

        controlBar = this;

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

    updatePowPlantDropdown(powPlantList) {
        const el = this.elDropdownContent;
        el.innerHTML = '';

        for (const [key, value] of Object.entries(powPlantList)) {
            const tag = '<a class="dropdown-select" href="#">';
            if (value.aggs.length === 0) {
                // Single generator, no need to specify
                el.innerHTML += `${tag}${key}</a>`;
            } else {
                // Multiple generators, list them all
                for (let i = 0; i < value.aggs.length; i++) {
                    const id = i + 1;
                    el.innerHTML += `${tag}${key}-${id}</a>`;
                }
            }
        }
    }

    // eslint-disable-next-line class-methods-use-this
    async onConnectClicked() {
        if (nDiscoveredTopics === 0) {
            startTopicDiscovery();
            return;
        }
        const connName = 'mqtt-data-1';
        const con = await dashboard.dataPool.getConnector(connName);
        if (con.connected) {
            await con.disconnect();
        } else {
            await con.connect();
        }
    }

    async onPowPlantClicked(fullName) {
        if (activeItem.fullName === fullName) {
            // Power planet/generator already selected
            return;
        }

        // Extract the power plant name
        const tmp = fullName.split('-');
        const plant = tmp[0];

        if (!(plant in powPlantList)) {
            this.showError('Invalid power plant selection: ' + plant);
            return;
        }

        // Extract the generator ID
        const genId = tmp.length > 1 ? tmp[1] : 1;

        // Show the power plant name
        this.elDropdownButton.innerHTML =
            fullName + '&nbsp;&#9662;';

        const id = activeItem.plantName;
        if (id === '') {
            // First power plant selection, create the dashboard
            if (!dashboard) {
                await createDashboard();
            }
        } else {
            // Unsubscribe from the current power plant topic
            const topic = powPlantList[id].topic;
            const cn = topicMap[topic];

            const con = await dashboard.dataPool.getConnector(cn);
            printLog('Unsubscribed: ' + con.options.topic);
            await con.unsubscribe();
        }

        // Subscribe to the new power plant topic
        const topic = powPlantList[plant].topic;
        const cn = topicMap[topic];
        const con = await dashboard.dataPool.getConnector(cn);

        if (con.connected) {
            printLog('Subscribed: ' + con.options.topic);
            await con.subscribe();
        }

        // Update the active power plant/generator
        activeItem.generatorId = genId;
        activeItem.fullName = fullName;
        activeItem.plantName = plant;
    }

    async clickHandler(event) {
        if (event.target === this.elDropdownButton) {
            // Reveals the dropdown list of power stations
            this.elDropdownContent.classList.toggle('show');
            return;
        }
        if (event.target === this.elToggle) {
            // Connect/Disconnect button
            await this.onConnectClicked();
            return;
        }
        if (event.target.matches('.dropdown-select')) {
            // Power plant selection
            await this.onPowPlantClicked(event.target.innerText);
            return;
        }
        // Hide the dropdown if the user clicks outside of it
        const items = document.getElementsByClassName('dropdown-content');
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.classList.contains('show')) {
                item.classList.remove('show');
            }
        }
    }
}

/*
* Topic discovery
*/
let discoveryTopic;

function startTopicDiscovery() {
    // Create a special connector for topic (power plant) discovery
    const config = {
        ...mqttLinkConfig,
        topic: 'prod/+/+/overview',
        autoConnect: true,
        connectEvent: event => {
            const { connected, host, port } = event.detail;
            controlBar.setConnectState(connected);
            if (connected) {
                controlBar.showStatus(`Connected to ${host}:${port}`);
            } else {
                controlBar.showStatus('Not connected');
            }
            // eslint-disable-next-line max-len
            printLog(`Client ${connected ? 'connected' : 'disconnected'}: host: ${host}, port: ${port}`);
        },
        packetEvent: event => {
            const { count } = event.detail;
            printLog(`Packet #${count} received`);
            updatePowerPlantList(event.data, event.detail.topic);

            // Check if all topics have been discovered
            nDiscoveredTopics++;
            const expTopics = Object.keys(topicMap).length;
            if (count === expTopics) {
                discoveryTopic.unsubscribe();
            }
        }
    };
    // eslint-disable-next-line no-use-before-define
    discoveryTopic = new MQTTConnector(config);
    discoveryTopic.load();
}

/*
 *  Application initialization
 */

window.onload = () => {
    controlBar = new ControlBar();

    // Hide the logo on small devices
    window.onresize = () => {
        controlBar.setLogoVisibility();
    };

    // Click handler for control bar
    window.onclick = event => {
        controlBar.clickHandler(event);
    };
};


//
// Brief description and unit of received MQTT measurement data
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
            unit: 'MASL'
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
            unit: 'MASL'
        },
        HRV: {
            brief: 'Highest regulated level',
            unit: 'MASL'
        },
        LRV: {
            brief: 'Lowest regulated level',
            unit: 'MASL'
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


/* *
 *
 * MQTT connector class - a custom DataConnector,
 * interfacing with the Paho MQTT client library.
 *
 *
 * Paho MQTT client documentation
 *
 * https://bito.ai/resources/paho-mqtt-javascript-javascript-explained/
 *
 */

let MQTTClient;
try {
    // eslint-disable-next-line no-undef
    MQTTClient = Paho.Client;
} catch (e) {
    console.error('Paho MQTT library not found:', e);
}

/* eslint-disable no-underscore-dangle */
const modules = Dashboards._modules;
const DataConnector = Dashboards.DataConnector;
// eslint-disable-next-line max-len
const JSONConverter = modules['Data/Converters/JSONConverter.js']; // TBD: use namespace when becoming available
const merge = Highcharts.merge;

// Connector instances
const connectorTable = {};

/* *
 *
 *  Class MQTTConnector
 *
 * */

class MQTTConnector extends DataConnector {
    /**
     * Constructs an instance of MQTTConnector.
     *
     */
    constructor(options) {
        const mergedOptions = merge(
            MQTTConnector.defaultOptions,
            options
        );
        super(mergedOptions);
        mergedOptions.firstRowAsNames = false;

        this.converter = new JSONConverter(mergedOptions);
        this.options = mergedOptions;

        // Connection status
        this.packetCount = 0;

        // Generate a unique client ID
        const clientId = 'clientId-' + Math.floor(Math.random() * 10000);
        this.clientId = clientId;

        // Store connector instance (for use in callbacks from MQTT client)
        const connector = this;
        connectorTable[clientId] = connector;

        // Register events
        connector.registerEvents();
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Creates the MQTT client and initiates the connection
     * if autoConnect is set to true.
     *
     */
    async load() {
        super.load();

        const connector = this,
            {
                host, port, autoConnect
            } = connector.options;

        // Start MQTT client
        this.mqtt = new MQTTClient(host, port, this.clientId);
        this.mqtt.onConnectionLost = this.onConnectionLost;
        this.mqtt.onMessageArrived = this.onMessageArrived;

        if (autoConnect) {
            await this.connect();
        }
        return connector;
    }

    /**
     * Clear the data table and reset the packet count.
     *
     */
    async reset() {
        const connector = this,
            table = connector.table;

        connector.packetCount = 0;
        table.deleteRows();
    }

    /**
     * Connects to the MQTT broker.
     *
     */
    async connect() {
        const { user, password, timeout, useSSL, cleanSession } = this.options;

        // Connect to broker
        this.mqtt.connect({
            useSSL: useSSL,
            timeout: timeout,
            cleanSession: cleanSession,
            onSuccess: () => this.onConnect(),
            onFailure: resp => this.onFailure(resp),
            userName: user,
            password: password
        });
    }

    /**
     * Disconnects from the MQTT broker.
     *
     */
    async disconnect() {
        this.mqtt.disconnect();
    }

    /**
     * Subscribe to an MQTT topic.
     *
     */
    async subscribe() {
        const { topic, qOs, autoReset } = this.options;

        if (autoReset) {
            // Reset the data table
            await this.reset();
        }

        this.mqtt.subscribe(topic, {
            qos: qOs,
            onSuccess: () => {
                this.emit({
                    type: 'subscribeEvent',
                    detail: {
                        subscribed: true,
                        topic: topic
                    }
                });
            },
            onFailure: response => {
                // Execute custom error handler
                this.onFailure(response);
            },
            timeout: 10
        });
    }

    /**
     * Unsubscribe from an MQTT topic.
     *
     */
    unsubscribe() {
        const { topic } = this.options;

        this.mqtt.unsubscribe(topic, {
            onSuccess: () => {
                this.emit({
                    type: 'subscribeEvent',
                    detail: {
                        subscribed: false,
                        topic: topic
                    }
                });
            },
            onFailure: response => {
                // Execute custom error handler
                this.onFailure(response);
            }
        });
    }

    /**
     * Process connection success
     *
     */
    onConnect() {
        const { host, port, user, autoSubscribe } = this.options;

        this.connected = true;

        // Execute custom connect handler
        this.emit({
            type: 'connectEvent',
            detail: {
                connected: true,
                host: host,
                port: port,
                user: user
            }
        });

        // Subscribe to the topic
        if (autoSubscribe) {
            this.subscribe();
        }
    }

    /**
     * Process incoming message
     *
     */
    onMessageArrived(mqttPacket) {
        // Executes in Paho.Client context
        const connector = connectorTable[this.clientId],
            converter = connector.converter,
            connTable = connector.table;

        // Clear the data table on each packet
        if (connector.options.autoClear) {
            connTable.deleteRows();
        }

        // Parse the message
        let data;
        const payload = mqttPacket.payloadString;
        try {
            data = JSON.parse(payload);
        } catch (e) {
            connector.emit({
                type: 'errorEvent',
                detail: {
                    code: 0, // N.A.
                    message: 'Invalid JSON: ' + payload
                }
            });
            return; // Skip invalid messages
        }

        converter.parse({ data });
        const convTable = converter.getTable();

        // Append the incoming data to the current table
        if (connTable.getRowCount() === 0) {
            // First message, initialize columns for data storage
            connTable.setColumns(convTable.getColumns());
        } else {
            // Subsequent message, append as row
            connTable.setRows(convTable.getRows());
        }
        connector.packetCount++;

        // Execute custom packet handler
        connector.emit({
            type: 'packetEvent',
            data,
            detail: {
                topic: mqttPacket.destinationName,
                count: connector.packetCount
            }
        });
    }

    /**
     * Process lost connection
     *
     */
    onConnectionLost(response) {
        // Executes in Paho.Client context
        const connector = connectorTable[this.clientId];
        const { host, port, user } = connector.options;

        // Execute custom connect handler
        connector.emit({
            type: 'connectEvent',
            detail: {
                connected: false,
                host: host,
                port: port,
                user: user
            }
        });

        if (response.errorCode === 0) {
            connector.connected = false;

            return;
        }

        // Execute custom error handler
        connector.onFailure(response);
    }

    /**
     * Process failure
     *
     */
    onFailure(response) {
        this.connected = false;
        this.packetCount = 0;

        // Execute custom error handler
        this.emit({
            type: 'errorEvent',
            detail: {
                code: response.errorCode,
                message: response.errorMessage
            }
        });
    }

    /**
     * Register events
     *
     */
    registerEvents() {
        const connector = this;
        // Register general connector events (load, afterLoad, loadError)
        // Not used, included for reference only.
        connector.on('load', event => {
            console.log('Connector load event:', event);
        });

        connector.on('afterLoad', event => {
            console.log('Connector afterLoad event:', event);
        });

        connector.on('loadError', event => {
            console.log('Connector loadError event:', event);
        });

        // Register MQTT specific connector events
        if (connector.options.connectEvent) {
            connector.on('connectEvent', connector.options.connectEvent);
        }

        if (connector.options.subscribeEvent) {
            connector.on('subscribeEvent', connector.options.subscribeEvent);
        }

        if (connector.options.packetEvent) {
            connector.on('packetEvent', connector.options.packetEvent);
        }

        if (connector.options.errorEvent) {
            connector.on('errorEvent', connector.options.errorEvent);
        }
    }
}

/**
 *
 *  Static Properties
 *
 */
MQTTConnector.defaultOptions = {
    // MQTT client properties
    host: 'broker.hivemq.com',
    port: 8000,
    user: '',
    password: '',
    topic: 'highcharts/test',
    timeout: 10,
    qOs: 0,  // Quality of Service
    useSSL: false,
    cleanSession: true,

    // Custom connector properties
    autoConnect: false,  // Automatically connect after load
    autoSubscribe: true, // Automatically subscribe after connect
    autoReset: false,    // Clear data table on subscribe
    autoClear: false     // Clear data table on each packet
};

// Register the connector
MQTTConnector.registerType('MQTT', MQTTConnector);
