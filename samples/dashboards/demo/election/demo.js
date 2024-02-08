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
        .then(response => response.text()).then(function (csv) {
            // Split lines
            const lines = csv.split('\n');

            const tidyCol = /[,"]/g;

            // Create JSON data, one object for each year
            const data = {};
            const header = ['Year', 'State', 'Candidate', 'Party', 'Votes', 'Percentage', 'Total votes'];

            lines.forEach(function (line) {
                const match = line.match(csvSplit);

                const key = match[0]; // Year

                // Only two elections for proof of concept. TBD: expand
                if (Number(key) >= 2016) {
                    // The first record is the header
                    if (!(key in data)) {
                        data[key] = [header];
                    }

                    // Create processed data record
                    const state = match[1].replace(tidyCol, '');
                    const candidate = match[7].replace(/^,/, '').replace(/["]/g, '');
                    const party = match[8].replace(tidyCol, '');
                    const vote = match[10].replace(tidyCol, '');
                    const total = match[11].replace(tidyCol, '');
                    const percent = ((vote / total) * 100).toFixed(1);

                    // Add to JSON data
                    data[key].push(
                        [key, state, candidate, party, vote, percent, total]
                    );
                }
            });
            return data;
        });

    const board = await Dashboards.board('container', {
        dataPool: {
            connectors: [
                // TBD: eventually to be populated dynamically
                {
                    id: 'votes_2020',
                    type: 'JSON',
                    options: {
                        firstRowAsNames: true,
                        // columnNames: ['year', 'test'],
                        data: electionData['2020']
                    }
                },
                {
                    id: 'votes_2016',
                    type: 'CSV',
                    options: {
                        firstRowAsNames: true,
                        options: {
                            firstRowAsNames: true,
                            data: electionData['2016']
                        }
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
            }, {
                renderTo: 'kpi-result',
                type: 'KPI',
                columnName: 'result',
                title: {
                    enabled: true,
                    text: 'National presidential election results, ' + activeYear
                }
            }, {
                renderTo: 'html-control',
                title: {
                    enabled: true,
                    text: 'Choose election (year)'
                },
                type: 'HTML'
            },
            {
                renderTo: 'selection-grid',
                type: 'DataGrid',
                connector: {
                    id: 'votes_2020'
                },
                title: {
                    enabled: true,
                    text: 'Presidential election results by state, ' + activeYear
                },
                sync: {
                    highlight: true
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
            }, {
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
            }]
    }, true);

    const dataPool = board.dataPool;
    const votesTable = await dataPool.getConnectorTable('votes_2020');
    const stateRows = votesTable.getRowObjects();

    // Update map (series 0 is the world map, series 1 the election date)
    const mapChart = getMapChart(board);

    // Load active state
    // await updateBoard(board, activeState, activeYear);

    // HELPER functions

    // Get map chart
    function getMapChart(board) {
        // Update map (series 0 is the world map, series 1 the weather data)
        return board.mountedComponents[0].component.chart.series[1];
    }

    updateBoard(board, 'Alaska', 2020);
}


// Update board after changing data set (state or election year)
async function updateBoard(board, state, year) {

    // Data access
    const dataPool = board.dataPool;

    // Geographical information
    const votesTable1 = await dataPool.getConnectorTable('votes_' + year);

    const [
        // The order here must be the same as
        // in the component definition in the Dashboard.
        usMap
    ] = board.mountedComponents.map(c => c.component);

    // 1. Update KPI (if state or year changes)

    // 2. Update map (if year changes)
    await usMap.chart.update({
        title: {
            text: 'Presidential election ' + year
        }
    });

    const mapPoints = usMap.chart.series[1].data;

    // 2. Update grid (only if year changes)

    // 3. Update chart (if state clicked)

}

// Launch the application
setupDashboard();
