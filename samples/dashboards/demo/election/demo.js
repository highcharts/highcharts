/* eslint-disable no-unused-vars */
/* eslint-disable jsdoc/require-description */

// Layout
// ! -------------------- !
// ! KPI          ! HTML  !
// ! -------------!------ !
// ! Map          ! Chart !
// ! -------------------- !
// ! Data grid            !
// ! -------------------- !

// PoC, possible ideas
// * Bar race https://www.highcharts.com/demo/highcharts/bar-race
// * KPI? https://www.highcharts.com/demo/highcharts/column-stacked-percent
// * KPI? https://www.highcharts.com/demo/highcharts/pie-semi-circle (picture on both sides)
// * Map: https://www.highcharts.com/demo/maps/data-class-two-ranges

const mapUrl = 'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json';
const elVoteUrl = 'https://www.highcharts.com/samples/data/us-1976-2020-president.csv';
const elCollegeUrl = 'https://www.highcharts.com/samples/data/us-electorial_votes.csv';

const activeYear = '2020';
const csvSplit = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;

// Launches the Dashboards application
async function setupDashboard() {
    // Load the dataset and convert to JSON data.
    // Some items are filtered out.

    const electionData = await fetch(elVoteUrl)
        .then(response => response.text()).then(async function (csv) {
            // Split lines
            const lines = csv.split('\n');

            const tidyCol = /[,"]/g;

            // Create JSON data, one object for each year
            const data = {};
            const header = ['State', 'Candidate', 'Party', 'Votes', 'Percentage', 'Total votes'];

            lines.forEach(async function (line) {
                const match = line.match(csvSplit);
                const year = match[0]; // Year

                if (Number(year) >= 2008) {
                    // The first record is the header
                    const key = 'y' + match[0];
                    if (!(key in data)) {
                        data[key] = [header];
                    }

                    // Create processed data record
                    const party = match[8].replace(tidyCol, '');
                    const candidate = match[7].replace(/^,/, '').replace(/["]/g, '');

                    // Ignore other candidates and empty candidate names
                    if ((party === 'REPUBLICAN' || party === 'DEMOCRAT') && candidate.length > 0) {
                        const state = match[1].replace(tidyCol, '');
                        const vote = match[10].replace(tidyCol, '');
                        const total = match[11].replace(tidyCol, '');
                        const percent = ((vote / total) * 100).toFixed(1);

                        // Add to JSON data
                        data[key].push(
                            [state, candidate, party, vote, percent, total]
                        );
                    }
                }
            });
            return data;
        });

    const board = await Dashboards.board('container', {
        dataPool: {
            connectors: [
                // TBD: to be populated dynamically if
                // the number of elections increases.
                {
                    id: 'votes2020',
                    type: 'JSON',
                    options: {
                        firstRowAsNames: true,
                        data: electionData.y2020
                    }
                }, {
                    id: 'votes2016',
                    type: 'JSON',
                    options: {
                        firstRowAsNames: true,
                        data: electionData.y2016
                    }
                }, {
                    id: 'votes2012',
                    type: 'JSON',
                    options: {
                        firstRowAsNames: true,
                        data: electionData.y2012
                    }
                }, {
                    id: 'votes2008',
                    type: 'JSON',
                    options: {
                        firstRowAsNames: true,
                        data: electionData.y2008
                    }
                }
            ]
        },
        gui: {
            layouts: [{
                rows: [{
                    cells: [{
                        // Top left
                        id: 'kpi-result'
                    }, {
                        // Top right
                        id: 'html-control'
                    }]
                }, {
                    cells: [{
                        // Mid left
                        id: 'us-map'
                    }, {
                        // Mid right
                        id: 'election-chart'
                    }]
                }, {
                    cells: [{
                        // Spanning all columns
                        id: 'selection-grid'
                    }]
                }]
            }]
        },
        components: [
            {
                renderTo: 'kpi-result',
                type: 'KPI',
                columnName: 'result',
                title: {
                    enabled: true,
                    text: 'National presidential election results, ' + activeYear
                }
            }, {
                renderTo: 'html-control',
                type: 'CustomHTML',
                id: 'custom-html-div'
            },
            {
                renderTo: 'us-map',
                type: 'Highcharts',
                chartConstructor: 'mapChart',
                chartOptions: {
                    chart: {
                        map: await fetch(mapUrl)
                            .then(response => response.json())
                    },
                    title: {
                        text: 'Presidential election results by state, ' + activeYear
                    },
                    legend: {
                        enabled: false
                    },
                    mapNavigation: {
                        buttonOptions: {
                            verticalAlign: 'bottom'
                        },
                        enabled: true,
                        enableMouseWheelZoom: true
                    },
                    mapView: {
                        maxZoom: 4
                    },
                    series: [{
                        type: 'map',
                        name: 'US map'
                    }, {
                        type: 'mappoint',
                        name: 'Votes',
                        data: [],
                        allowPointSelect: true,
                        dataLabels: [{
                            align: 'left',
                            crop: false,
                            enabled: true,
                            format: '{point.name}',
                            padding: 0,
                            verticalAlign: 'top',
                            x: -2,
                            y: 2
                        }, {
                            crop: false,
                            enabled: true,
                            format: '{point.y:.0f}',
                            inside: true,
                            padding: 0,
                            verticalAlign: 'bottom',
                            y: -16
                        }],
                        events: {
                            click: function (e) {
                                const state = e.point.name;
                                /*
                                if (city !== activeCity) {
                                    // New city
                                    activeCity = city;
                                    updateBoard(
                                        board,
                                        activeCity,
                                        '',
                                        false, // No parameter update
                                        true // Data set update
                                    );
                                } else {
                                    // Re-select (otherwise marker is reset)
                                    selectActiveCity();
                                }
                                */
                            }
                        },
                        tooltip: {
                            footerFormat: '',
                            headerFormat: '',
                            pointFormat: (
                                '<b>{point.name}</b><br>' +
                                'Elevation: {point.custom.elevation} m<br>' +
                                '{point.y:.1f} {point.custom.unit}'
                            )
                        }
                    }],
                    tooltip: {
                        shape: 'rect',
                        distance: -60,
                        useHTML: true,
                        stickOnContact: true
                    },
                    lang: {
                        accessibility: {
                            chartContainerLabel: 'US presidential elections. Highcharts Interactive Map.'
                        }
                    },
                    accessibility: {
                        description: 'The map is displaying US presidential elections results for ' + activeYear
                    }
                }
            },
            {
                renderTo: 'election-chart',
                title: {
                    enabled: true,
                    text: 'Historical presidential election results'
                },

                type: 'Highcharts',
                columnAssignment: {
                    year: 'x',
                    data: 'y' // TBD
                },
                sync: {
                    highlight: true
                },
                chartOptions: {
                    chart: {
                        spacing: [40, 40, 40, 10],
                        styledMode: true,
                        type: 'column'
                    },
                    credits: {
                        enabled: true,
                        href: 'https://www.archives.gov/electoral-college/allocation',
                        text: 'National Archives'
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            marker: {
                                enabled: true,
                                symbol: 'circle'
                            },
                            tooltip: {
                                pointFormatter: function () {
                                    return this.y;
                                }
                            }
                        }
                    },
                    title: {
                        margin: 20,
                        x: 15,
                        y: 5,
                        text: ''
                    },
                    subtitle: {
                        text: ''
                    },
                    xAxis: {
                        labels: {
                            accessibility: {
                                description: 'Election year'
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            enabled: false
                        },
                        accessibility: {
                            description: 'Vote in per cent'
                        }
                    },
                    lang: {
                        accessibility: {
                            chartContainerLabel: 'Presidential election results.'
                        }
                    },
                    accessibility: {
                        description: 'The chart displays historical election results.'
                    }
                }
            }, {
                renderTo: 'selection-grid',
                type: 'DataGrid',
                connector: {
                    id: 'votes' + activeYear
                },
                title: {
                    enabled: true,
                    text: 'Presidential election results by state, ' + activeYear
                },
                dataGridOptions: {
                    cellHeight: 38,
                    editable: false,
                    columns: {
                        year: {
                            headerFormat: 'Election year'
                        }
                    }
                }
            }
        ]
    }, true);

    const dataPool = board.dataPool;
    const votesTable = await dataPool.getConnectorTable('votes2020');
    const votesTable2 = await dataPool.getConnectorTable('votes2016');
    // const stateRows = votesTable.getRowObjects();

    // Update map (series 0 is the world map, series 1 the election date)
    const mapChart = getMapChart(board);

    // Load active state
    // await updateBoard(board, activeState, activeYear);

    // HELPER functions

    // Get map chart
    function getMapChart(board) {
        // Update map (series 0 is the world map, series 1 the weather data)
        return board.mountedComponents[2].component.chart.series[1];
    }

    await updateBoard(board, 'Alaska', activeYear);

    // Handle change year events
    Highcharts.addEvent(
        document.getElementById('election_year'),
        'change',
        async function () {
            const selectedOption = this.options[this.selectedIndex];
            await updateBoard(board, 'Alabama', selectedOption.value);
        }
    );
}


// Update board after changing data set (state or election year)
async function updateBoard(board, state, year) {

    // Data access
    const dataPool = board.dataPool;

    // Connector ID
    const connId = 'votes' + year;

    // Geographical information (TBD)
    const votesTable = await dataPool.getConnectorTable(connId);
    const stateRows = votesTable.getRowObjects();

    const [
        // The order here must be the same as
        // in the component definition in the Dashboard.
        resultKpi,
        controlHtml,
        usMap,
        historyChart,
        selectionGrid
    ] = board.mountedComponents.map(c => c.component);

    // 1. Update KPI (if state or year changes)
    await resultKpi.update({
        title: {
            text: 'Presidential election ' + year
        }
    });

    // 2. Update control (if state changes)

    // 3. Update map (if year changes)
    await usMap.chart.update({
        title: {
            text: 'Presidential election ' + year
        }
    });
    // TBD: Map update
    const mapPoints = usMap.chart.series[1].data;

    // 4. Update chart (if state clicked)

    // 5. Update grid (if year changes)
    await selectionGrid.update({
        title: {
            text: 'Presidential election ' + year
        },
        connector: {
            id: connId
        }
    });
}

// Create custom HTML component
const { ComponentRegistry } = Dashboards,
    HTMLComponent = ComponentRegistry.types.HTML,
    AST = Highcharts.AST;

class CustomHTML extends HTMLComponent {
    constructor(cell, options) {
        super(cell, options);
        this.type = 'CustomHTML';
        this.getCustomHTML();

        return this;
    }

    getCustomHTML() {
        const options = this.options;
        if (options.id) {
            const domEl = document.getElementById(options.id);
            const customHTML = domEl.outerHTML;

            // Copy custom HTML into Dashboards component
            this.options.elements = new AST(customHTML).nodes;

            // Remove original
            domEl.remove();
        }
    }
}

ComponentRegistry.registerComponent('CustomHTML', CustomHTML);


// Launch the application
setupDashboard();
