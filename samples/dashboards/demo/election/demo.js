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

// State    | Rep. cand | Dem. cand. | Total votes | Rep % | Dem % | P.C. (hidden)
// ---------|-----------|------------|-------------|-------|-------|----
// U.S.     | rep. vote | dem. vote  | int         | float | float | -
// Alabama  | rep. vote | dem. vote  | int         | float | float | AL
// ........ | ......... | .........  | ...         | ..... | ....  |
// Wyoming  | rep. vote | dem. vote  | int         | float | float | WY

// PoC, possible ideas
// -----------------------------------------------------------------------------
// * Bar race https://www.highcharts.com/demo/highcharts/bar-race
// * KPI? https://www.highcharts.com/demo/highcharts/pie-semi-circle (picture on both sides)
// * Map: https://www.highcharts.com/demo/maps/data-class-two-ranges

const mapUrl = 'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json';
const elVoteUrl = 'https://www.highcharts.com/samples/data/us-1976-2020-president.csv';
const elCollegeUrl = 'https://www.highcharts.com/samples/data/us-electorial_votes.csv';

const commonTitle = 'U.S. presidential election';
const electionYears = ['2020', '2016', '2012', '2008'];
const selectedYear = electionYears[0];

let electionData = null;
let mapData = null;
let elCollegeData = null;

// Launches the Dashboards application
async function setupDashboard() {
    // Load the basic map
    mapData = await fetch(mapUrl).then(response => response.json());

    // Load the electoral mandate data and convert from CSV jo JSON
    elCollegeData = await fetch(elCollegeUrl)
        .then(response => response.text()).then(function (csv) {
            const jsonData = {};
            const lines = csv.split(/\r?\n/);
            const header = lines[0].split(';');

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i];
                const items = line.split(';');
                const state = items[0].toUpperCase();

                const obj = {};
                for (let j = 1; j < header.length; j++) {
                    const year = header[j];
                    obj[year] = items[j];
                }
                jsonData[state] = obj;
            }
            return jsonData;
        });

    // Load the election results and convert to JSON data that are suitable for this application.
    electionData = await fetch(elVoteUrl)
        .then(response => response.text()).then(function (csv) {
            const header = ['state', 'candRep', 'canDem', 'totalVotes', 'repPercent',
                'demPercent', 'postal-code', 'repMand', 'demMand'];
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
                repMand: 0,
                demMand: 0
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
                        jsonData[key] = {
                            data: [header]
                        };

                        // Need to wrap up the election that is
                        // currently being processed?
                        if (national.totalVotes > 0) {
                            const prevKey = 'y' + (year - 4);
                            addNationalSummary(jsonData[prevKey], national);

                            // Reset counting
                            national.totalVotes = 0;
                            national.repVotes = 0;
                            national.demVotes = 0;
                            national.repMand = 0;
                            national.demMand = 0;
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
                            row[1] = vote;
                            row[4] = percent;
                            national.candRep = candidate;
                            national.totalVotes += total;
                            national.repVotes += vote;
                        } else { // DEMOCRAT
                            row[2] = vote;
                            row[3] = total;
                            row[5] = percent;
                            national.candDem = candidate;
                            national.demVotes += Number(vote);
                        }

                        // Merge rows
                        if (row[1] > 0 && row[2] > 0) {
                            // Add electoral votes
                            const elVotes = elCollegeData[state][year];
                            const elVotesSplit = elVotes.split('|');
                            const isSplitVote = elVotesSplit.length === 4;
                            let repVotes, demVotes;

                            if (row[1] > row[2]) {
                                // Rep. won
                                if (isSplitVote) {
                                    repVotes = elVotesSplit[1];
                                    demVotes = elVotesSplit[2];
                                } else {
                                    demVotes = 0;
                                    repVotes = elVotes;
                                }
                            } else {
                                // Dem. won
                                if (isSplitVote) {
                                    repVotes = elVotesSplit[2];
                                    demVotes = elVotesSplit[1];
                                } else {
                                    demVotes = elVotes;
                                    repVotes = 0;
                                }
                            }
                            row[7] = repVotes;
                            row[8] = demVotes;
                            national.repMand += Number(repVotes);
                            national.demMand += Number(demVotes);

                            jsonData[key].data.push([...row]);
                            row[1] = 0;
                            row[2] = 0;
                        }
                    }
                }
            });
            addNationalSummary(jsonData[key], national);

            return jsonData;
        });

    function addNationalSummary(jsonData, summary) {
        // Insert a row with national results (row 1, below header)
        const percentRep = ((summary.repVotes / summary.totalVotes) * 100).toFixed(1);
        const percentDem = ((summary.demVotes / summary.totalVotes) * 100).toFixed(1);

        const row = ['Federal', summary.repVotes, summary.demVotes, summary.totalVotes,
            percentRep, percentDem, 'US', summary.repMand, summary.demMand];

        jsonData.data.splice(1, 0, row);

        // Save candidate names (to be displayed in header)
        jsonData.candRep = summary.candRep;
        jsonData.candDem = summary.candDem;
    }

    function getElectionSummary() {
        const ret = [
            {
                name: 'Republican',
                data: []
            }, {
                name: 'Democrat',
                data: []
            }
        ];

        Object.values(electionData).reverse().forEach(function (item) {
            const row = item.data[1];

            ret[0].data.push(Number(row[4])); // Percentage, Republicans
            ret[1].data.push(Number(row[5])); // Percentage, Democrats
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
                        data: electionData.y2020.data
                    }
                }, {
                    id: 'votes2016',
                    type: 'JSON',
                    options: {
                        firstRowAsNames: true,
                        data: electionData.y2016.data
                    }
                }, {
                    id: 'votes2012',
                    type: 'JSON',
                    options: {
                        firstRowAsNames: true,
                        data: electionData.y2012.data
                    }
                }, {
                    id: 'votes2008',
                    type: 'JSON',
                    options: {
                        firstRowAsNames: true,
                        data: electionData.y2008.data
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
                        type: 'pie',
                        styledMode: false,
                        height: 180
                    },
                    plotOptions: {
                        pie: {
                            borderRadius: 1,
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b><br>{point.percentage:.1f} per cent',
                                filter: {
                                    property: 'percentage',
                                    operator: '>',
                                    value: 10
                                }
                            }
                        }
                    },
                    tooltip: {
                        valueDecimals: 1,
                        headerFormat: null,
                        pointFormat: '{point.name}: {point.percentage:.1f} per cent'
                    },
                    series: [{
                        name: 'kpiResult',
                        // Data populated dynamically
                        data: []
                    }]
                }
            },
            {
                renderTo: 'html-control',
                type: 'CustomHTML',
                id: 'html-control-div'
            },
            {
                renderTo: 'us-map',
                type: 'Highcharts',
                chartConstructor: 'mapChart',
                chartOptions: {
                    borderWidth: 1,
                    chart: {
                        type: 'map',
                        map: mapData,
                        styledMode: false
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
                    colorAxis: {
                        min: -100,
                        max: 100,
                        dataClasses: [{
                            from: -100,
                            to: 0,
                            color: '#0200D0',
                            name: 'Democrat'
                        }, {
                            from: 0,
                            to: 100,
                            color: '#C40401',
                            name: 'Republican'
                        }]
                    },
                    series: [{
                        name: 'US Map',
                        type: 'map'
                    },
                    {
                        name: 'State election result', // TBD: electoral mandates
                        data: createMapElectionData(),
                        joinBy: 'postal-code',
                        dataLabels: {
                            enabled: true,
                            color: 'white',
                            format: '{point.postal-code}',
                            style: {
                                textTransform: 'uppercase'
                            }
                        }
                        /*
                        point: {
                            events: {
                                click: pointClick
                            }
                        }
                        */
                    }, {
                        name: 'Separators',
                        type: 'mapline',
                        nullColor: 'silver',
                        showInLegend: false,
                        enableMouseTracking: false,
                        accessibility: {
                            enabled: false
                        }
                    }],
                    tooltip: {
                        headerFormat: '<span style="font-size: 14px;font-weight:bold">{point.key}</span><br/>',
                        pointFormat: 'Winner: {point.custom.winner}<br/><br/>' +
                            'Rep.: {point.custom.votesRep} ({point.custom.percentRep} per cent)<br/>' +
                            'Dem.: {point.custom.votesDem} ({point.custom.percentDem} per cent)'
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
                        styledMode: true,
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
                    tooltip: {
                        enabled: true
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
                        candRep: {
                            headerFormat: 'Rep. votes',
                            cellFormatter: function () {
                                return Number(this.value).toLocaleString('en-US');
                            }
                        },
                        canDem: {
                            headerFormat: 'Dem. votes',
                            cellFormatter: function () {
                                return Number(this.value).toLocaleString('en-US');
                            }
                        },
                        totalVotes: {
                            headerFormat: 'Total votes',
                            cellFormatter: function () {
                                return Number(this.value).toLocaleString('en-US');
                            }
                        },
                        repPercent: {
                            headerFormat: 'Rep. percent'
                        },
                        demPercent: {
                            headerFormat: 'Dem. percent'
                        },
                        repMand: {
                            headerFormat: 'Rep. mandates'
                        },
                        demMand: {
                            headerFormat: 'Dem. mandates'
                        },
                        'postal-code': {
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
            await updateBoard(board, null, selectedOption.value);
        }
    );

    function createMapElectionData() {
        const mapSeries = [];

        // Get election data
        const stateTable = electionData['y' + selectedYear];

        // Skip header and federal results
        for (let row = 2; row < stateTable.data.length; row++) {
            const stateData = stateTable.data[row];
            const postCode = stateData[6];
            const diffRep = stateData[4] - stateData[5];

            mapSeries.push({
                value: Number(diffRep), // Selects 'party color' on the map
                'postal-code': postCode, // For joining map data series
                // For use in tooltip
                custom: {
                    winner: diffRep > 0 ? 'Republican' : 'Democrat',
                    votesRep: stateData[1].toLocaleString('en-US'),
                    votesDem: stateData[2].toLocaleString('en-US'),
                    percentRep: stateData[4],
                    percentDem: stateData[5]
                }
            });
        }

        return mapSeries;
    }
}

async function getVotesTable(board, year) {
    return board.dataPool.getConnectorTable('votes' + year);
}

// Update board after changing data set (state or election year)
async function updateBoard(board, state, year) {
    // Get election data
    const votesTable = await getVotesTable(board, year);

    // Common title
    const title = commonTitle + ' ' + year;

    const [
        // The order here must be the same as in the component definition in the Dashboard.
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
    const otherVal = 100.0 - repVal - demVal;

    await resultKpi.update({
        title: {
            text: title
        }
    });

    const canDem = electionData['y' + year].candDem;
    const candRep = electionData['y' + year].candRep;

    await resultKpi.chart.series[0].update({
        data: [
            { name: candRep, y: repVal },
            { name: canDem, y: demVal },
            { name: 'Others', y: otherVal }
        ]
    });

    // 2. Update control (if state changes)

    // 3. Update map (if year changes)
    await usMap.chart.update({
        title: {
            text: title
        }
    });

    // U.S. states with election results
    const voteSeries = usMap.chart.series[1].data;
    voteSeries.forEach(function (state) {
        const row = votesTable.getRowIndexBy('postal-code', state['postal-code']);
        const percentRep = votesTable.getCellAsNumber('repPercent', row);
        const percentDem = votesTable.getCellAsNumber('demPercent', row);

        state.update({
            value: Number(percentRep - percentDem)
        });
    });

    // 4. Update chart (if state clicked)

    // 5. Update grid (if year changes)
    await selectionGrid.update({
        title: {
            text: title
        },
        connector: {
            id: 'votes' + year
        },
        dataGridOptions: {
            columns: {
                candRep: {
                    headerFormat: candRep
                },
                canDem: {
                    headerFormat: canDem
                }
            }
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
