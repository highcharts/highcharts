/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable jsdoc/require-description */


// Layout
// ! -------------------- !
// ! KPI          | HTML  !
// ! -------------|------ !
// ! Map          | Chart !
// ! -------------------- !
// ! Data grid            !
// ! -------------------- !

// Data grid contents (proposed for PoC) - mandates to be added

// State    | Rep. cand | Dem. cand. | Total votes | Rep % | Dem % | Postal code (hidden)
// ---------|-----------|------------|-------------|-------|-------|----
// National | rep. vote | dem. vote  | int         | float | float | -
// Alabama  | rep. vote | dem. vote  | int         | float | float | AL
// ........ | ......... | .........  | ...         | ..... | ....  |
// Wyoming  | rep. vote | dem. vote  | int         | float | float | WY

// PoC, possible ideas
// -----------------------------------------------------------------------------
// * Bar race https://www.highcharts.com/demo/highcharts/bar-race
// * KPI? https://www.highcharts.com/demo/highcharts/column-stacked-percent
// * KPI? https://www.highcharts.com/demo/highcharts/pie-semi-circle (picture on both sides)
// * Map: https://www.highcharts.com/demo/maps/data-class-two-ranges

const mapUrl = 'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json';
const elVoteUrl = 'https://www.highcharts.com/samples/data/us-1976-2020-president.csv';
const elCollegeUrl = 'https://www.highcharts.com/samples/data/us-electorial_votes.csv';

const commonTitle = 'U.S. presidential election';
const electionYears = ['2020', '2016', '2012', '2008'];
const selectedYear = electionYears[0];
const repColor = '#C40401';
const demColor = '#0200D0';


// Launches the Dashboards application
async function setupDashboard() {
    // Load the dataset and convert to JSON data that are suitable for this application.

    const electionData = await fetch(elVoteUrl)
        .then(response => response.text()).then(function (csv) {
            // TBD: Add mandates
            const header = ['state', 'repCand', 'demCand', 'totalVotes', 'repPercent', 'demPercent', 'pc'];
            // eslint-disable-next-line max-len
            const csvSplit = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
            const tidyCol = /[,"]/g;

            // Create JSON data, one array for each year
            const jsonData = {};
            const lines = csv.split('\n');

            const national = {
                totalVotes: 0,
                repVotes: 0,
                demVotes: 0,
                candRep: '',
                candDem: '',
                repMandates: 0, // TBD
                demMandates: 0 // TBD
            };
            let key = null;
            const row = ['', 0, 0, 0, 0.0, 0.0];

            lines.forEach(function (line) {
                const match = line.match(csvSplit);
                const year = match[0]; // Year

                if (electionYears.includes(year)) {
                    // The first record is the header
                    key = 'y' + year;
                    if (!(key in jsonData)) {
                        // First record for a new election year
                        jsonData[key] = [header];

                        // Need to wrap up the election that is
                        // currently being processed?
                        if (national.totalVotes > 0) {
                            const prevKey = 'y' + (year - 4);
                            addNationalSummary(jsonData[prevKey], national);
                            // Reset counting
                            national.totalVotes = 0;
                            national.repVotes = 0;
                            national.demVotes = 0;
                        }
                    }

                    // Create processed data record
                    const party = match[8].replace(tidyCol, '');
                    const candidate = match[7].replace(/^,/, '').replace(/["]/g, '');

                    // Ignore "other" candidates and empty candidate names
                    if ((party === 'REPUBLICAN' || party === 'DEMOCRAT') && candidate.length > 0) {
                        const state = match[1].replace(tidyCol, '');
                        const pc = match[2].replace(tidyCol, '');
                        const vote = Number(match[10].replace(tidyCol, ''));
                        const total = Number(match[11].replace(tidyCol, ''));
                        const percent = ((vote / total) * 100).toFixed(1);

                        // Accumulate nationwide data
                        row[0] = state;
                        row[6] = pc;
                        if (party === 'REPUBLICAN') {
                            header[1] = candidate;
                            row[1] = vote;
                            row[4] = percent;
                            national.candRep = candidate;
                            national.totalVotes += total;
                            national.repVotes += vote;
                        } else { // 'DEMOCRAT'
                            header[2] = candidate;
                            row[2] = vote;
                            row[3] = total;
                            row[5] = percent;
                            national.candDem = candidate;
                            national.demVotes += Number(vote);
                        }

                        // Merge rows
                        if (row[1] > 0 && row[2] > 0) {
                            jsonData[key].push([...row]);
                            row[1] = 0;
                            row[2] = 0;
                        }
                    }
                }
            });
            addNationalSummary(jsonData[key], national);

            return jsonData;
        });

    function addNationalSummary(jsonData, totals) {
        // Insert row with national results
        const percentRep = ((totals.repVotes / totals.totalVotes) * 100).toFixed(1);
        const percentDem = ((totals.demVotes / totals.totalVotes) * 100).toFixed(1);
        const row = ['Federal', totals.repVotes, totals.demVotes, totals.totalVotes, percentRep, percentDem, 'US'];
        jsonData.splice(1, 0, row);
    }

    function getElectionSummary() {
        const ret = [
            {
                name: 'Republican',
                color: repColor,
                data: []
            }, {
                name: 'Democrat',
                color: demColor,
                data: []
            }
        ];

        Object.values(electionData).reverse().forEach(function (item) {
            const row = item[1];

            ret[0].data.push(Number(row[4])); // Percentage, Republican party
            ret[1].data.push(Number(row[5])); // Percentage, Democrat party
        });
        return ret;
    }

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
                title: commonTitle,
                valueFormat: '{value} per cent',
                chartOptions: {
                    chart: {
                        styledMode: false,
                        height: 166
                    },
                    series: [{
                        type: 'pie',
                        keys: ['repPercent', 'y'],
                        innerSize: '50%',
                        size: '110%',
                        showInLegend: true,
                        dataLabels: {
                            enabled: true,
                            format: '{point.name}: {point.percentage:,.1f}%'
                        }
                    }]
                }
            }, {
                renderTo: 'html-control',
                type: 'CustomHTML',
                id: 'html-control-div'
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
                        text: '' // Populated later
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
                                // TBD: change data filter
                            }
                        },
                        tooltip: {
                            footerFormat: '',
                            headerFormat: '',
                            pointFormat: (
                                '<b>{point.name}</b>'
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
                            chartContainerLabel: commonTitle + '. Highcharts Interactive Map.'
                        }
                    },
                    accessibility: {
                        description: 'The map is displaying ' + commonTitle + ' for year TBD' // TBD: Update dynamically
                    }
                }
            },
            {
                renderTo: 'election-chart',
                type: 'Highcharts',
                chartOptions: {
                    chart: {
                        styledMode: false,
                        type: 'column'
                    },
                    credits: {
                        enabled: true,
                        href: 'https://www.archives.gov/electoral-college/allocation',
                        text: 'National Archives'
                    },
                    legend: {
                        enabled: true
                    },
                    title: {
                        text: 'Historical ' + commonTitle + ' results'
                    },
                    xAxis: {
                        type: 'category',
                        categories: electionYears,
                        labels: {
                            accessibility: {
                                description: 'Election year'
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Percentage of votes'
                        },
                        accessibility: {
                            description: 'Percentage of votes'
                        }
                    },
                    series: getElectionSummary(),
                    lang: {
                        accessibility: {
                            chartContainerLabel: commonTitle + ' results.'
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
                    id: 'votes' + selectedYear
                },
                title: {
                    enabled: true,
                    text: '' // Populated later
                },
                dataGridOptions: {
                    cellHeight: 38,
                    editable: false, // TBD: enable
                    columns: {
                        state: {
                            headerFormat: 'State'
                        },
                        totalVotes: {
                            headerFormat: 'Total votes'
                        },
                        repPercent: {
                            headerFormat: 'Rep. percent.'
                        },
                        demPercent: {
                            headerFormat: 'Dem. percent.'
                        },
                        pc: {
                            show: false
                        }
                    }
                }
            }
        ]
    }, true);

    // Initialize data
    await updateBoard(board, 'Alaska', selectedYear);

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

    // Common title
    const title = commonTitle + ' ' + year;
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
    const row = votesTable.getRowIndexBy('state', 'Federal');
    const repVal = votesTable.getCellAsNumber('repPercent', row);
    const demVal = votesTable.getCellAsNumber('demPercent', row);

    await resultKpi.update({
        title: {
            text: title
        }
    });
    await resultKpi.chart.series[0].update({
        data: [
            ['repPercent', repVal],
            ['demPercent', demVal]
        ]
    });
    // 2. Update control (if state changes)

    // 3. Update map (if year changes)
    await usMap.chart.update({
        title: {
            text: title
        }
    });
    // TBD: Map update
    const mapPoints = usMap.chart.series[1].data;

    // 4. Update chart (if state clicked)

    // 5. Update grid (if year changes)
    await selectionGrid.update({
        title: {
            text: title
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
