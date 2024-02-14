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
            const rowObj = {
                state: '',
                repColVotes: 0,
                demColVotes: 0,
                totalVotes: 0,
                repPercent: 0.0,
                demPercent: 0.0,
                'postal-code': '',
                repVotes: 0,
                demVotes: 0
            };

            const header = Object.keys(rowObj);

            const national = {
                repCand: '',
                demCand: '',
                data: { ...rowObj }
            };
            const rowObjNational = national.data;
            rowObjNational.state = 'Federal';
            rowObjNational['postal-code'] = 'US';

            // eslint-disable-next-line max-len
            const csvSplit = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
            const tidyCol = /[,"]/g;

            // Create JSON data, one array for each year
            const jsonData = {};
            const lines = csv.split('\n');

            let key = null;

            lines.forEach(function (line) {
                const match = line.match(csvSplit);
                const year = match[0]; // Year

                if (electionYears.includes(year)) {
                    // The first record is the header
                    key = year;
                    if (!(key in jsonData)) {
                        // First record for a new election year
                        jsonData[key] = {
                            data: [header]
                        };

                        // Need to wrap up the election that is
                        // currently being processed?
                        if (rowObjNational.totalVotes > 0) {
                            const prevKey = year - 4;
                            addNationalSummary(jsonData[prevKey], national);

                            // Reset counting
                            rowObjNational.totalVotes = 0;
                            rowObjNational.repVotes = 0;
                            rowObjNational.demVotes = 0;
                            rowObjNational.repColVotes = 0;
                            rowObjNational.demColVotes = 0;
                        }
                    }

                    // Create processed data record
                    const party = match[8].replace(tidyCol, '');
                    const candidate = match[7].replace(/^,/, '').replace(/["]/g, '');

                    // Ignore "other" candidates and empty candidate names
                    if ((party === 'REPUBLICAN' || party === 'DEMOCRAT') && candidate.length > 0) {
                        const state = match[1].replace(tidyCol, '');
                        const postCode = match[2].replace(tidyCol, '');
                        const popVote = Number(match[10].replace(tidyCol, ''));
                        const totalVote = Number(match[11].replace(tidyCol, ''));
                        const percent = ((popVote / totalVote) * 100).toFixed(1);

                        // Accumulate nationwide data
                        rowObj.state = state;
                        rowObj['postal-code'] = postCode;

                        if (party === 'REPUBLICAN') {
                            rowObj.repVotes = popVote;
                            rowObj.repPercent = percent;
                            rowObjNational.totalVotes += totalVote;
                            rowObjNational.repVotes += popVote;
                            national.repCand = candidate;
                        } else { // DEMOCRAT
                            rowObj.demVotes = popVote;
                            rowObj.demPercent = percent;
                            rowObj.totalVotes = totalVote;
                            rowObjNational.demVotes += Number(popVote);
                            national.demCand = candidate;
                        }

                        // Merge rows
                        if (rowObj.repVotes > 0 && rowObj.demVotes > 0) {
                            // Add electoral votes
                            const elVotes = elCollegeData[state][year];
                            const elVotesSplit = elVotes.split('|');
                            const isSplitVote = elVotesSplit.length === 4;
                            let repVotes, demVotes;

                            if (rowObj.repVotes > rowObj.demVotes) {
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
                            rowObj.repColVotes = repVotes;
                            rowObj.demColVotes = demVotes;
                            rowObjNational.repColVotes += Number(repVotes);
                            rowObjNational.demColVotes += Number(demVotes);

                            jsonData[key].data.push(Object.values(rowObj));
                            rowObj.repVotes = 0;
                            rowObj.demVotes = 0;
                        }
                    }
                }
            });
            addNationalSummary(jsonData[key], national);

            return jsonData;
        });

    function addNationalSummary(jsonData, national) {
        function getSurname(name) {
            const surname = name.split(',')[0];
            return surname; // .charAt(0).toUpperCase() + surname.slice(1).toLowerCase();
        }
        const summary = national.data;

        // Insert a row with national results (row 1, below header)
        summary.repPercent = ((summary.repVotes / summary.totalVotes) * 100).toFixed(1);
        summary.demPercent = ((summary.demVotes / summary.totalVotes) * 100).toFixed(1);

        jsonData.data.splice(1, 0, Object.values(summary));

        // Save candidate names (to be displayed in header)
        jsonData.candRep = getSurname(national.repCand);
        jsonData.candDem = getSurname(national.demCand);
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

            // Percentage, Republicans
            ret[0].data.push({
                name: item.candRep,
                y: Number(row[4])
            });

            ret[1].data.push({
                name: item.candDem,
                y: Number(row[5])
            });
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
                        data: electionData[2020].data
                    }
                }, {
                    id: 'votes2016',
                    type: 'JSON',
                    options: {
                        firstRowAsNames: true,
                        data: electionData[2016].data
                    }
                }, {
                    id: 'votes2012',
                    type: 'JSON',
                    options: {
                        firstRowAsNames: true,
                        data: electionData[2012].data
                    }
                }, {
                    id: 'votes2008',
                    type: 'JSON',
                    options: {
                        firstRowAsNames: true,
                        data: electionData[2008].data
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
                title: '(to be replaced by progress bar)', // commonTitle,
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
                        data: [],
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
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true,
                                rotation: -90,
                                format: '{point.name}  {point.y:.1f} %',
                                y: 120 // Pixels down from the top
                            }
                        }
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
                        'postal-code': {
                            show: false
                        },
                        repPercent: {
                            headerFormat: 'Rep. percent',
                            cellFormat: '{value:.1f}'
                        },
                        demPercent: {
                            headerFormat: 'Dem. percent',
                            cellFormat: '{value:.1f}'
                        },
                        repVotes: {
                            headerFormat: 'Rep. votes',
                            cellFormatter: function () {
                                return Number(this.value).toLocaleString('en-US');
                            }
                        },
                        demVotes: {
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
        document.getElementById('election-year'),
        'change',
        async function () {
            const selectedOption = this.options[this.selectedIndex];
            await updateBoard(board, null, selectedOption.value);
        }
    );
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

    /*
    await resultKpi.update({
        title: {
            text: title
        }
    });
    */
    const candDem = electionData[year].candRep;
    const candRep = electionData[year].candDem;

    await resultKpi.chart.series[0].update({
        data: [
            { name: candRep, y: repVal },
            { name: candDem, y: demVal },
            { name: 'Others', y: otherVal }
        ]
    });

    // 2. Update control (TBD: if state changes)

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
        const elVotesRep = votesTable.getCellAsNumber('repColVotes', row);
        const elVotesDem = votesTable.getCellAsNumber('demColVotes', row);

        state.update({
            value: Number(percentRep - percentDem),
            custom: {
                winner: percentRep > percentDem ? 'Republican' : 'Democrat',
                votesRep: elVotesRep,
                votesDem: elVotesDem,
                percentRep: percentRep,
                percentDem: percentDem
            }
        });
    });

    // 4. Update chart (TBD: if state clicked)

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
                repColVotes: {
                    headerFormat: candRep + ' (Republican)'
                },
                demColVotes: {
                    headerFormat: candDem + ' (Democrat)'
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
