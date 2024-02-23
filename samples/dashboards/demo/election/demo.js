/* eslint-disable max-len */
/* eslint-disable jsdoc/require-description */


// Layout
// ! -----------------------!
// ! HTML        | HTML     !
// ! ------------|--------- !
// ! Map         | Chart    !
// ! -----------------------!
// ! Data grid              !
// ! -----------------------!

// Data grid contents

// State    | Dem. electors | Rep. electors | Dem. votes  | Rep. votes  | Total votes
// ---------|---------------|---------------|------- -----|-------------|------------
// National | int           | int           | int (%)     | int (%)     | int
// Alabama  | int           | int           | int (%)     | int (%)     | int
// ........ | ............. | .........     | ........    | ........... | int
// Wyoming  | int           | int           | int (%)     | int (%)     | int

// Useful links (TBD: remove before release )
// -----------------------------------------------------------------------------
// * https://www.highcharts.com/demo/maps/data-class-two-ranges
// * https://www.highcharts.com/demo/maps/map-pies
// * https://www.highcharts.com/demo/highcharts/column-comparison
// * https://www.presidency.ucsb.edu/statistics/elections
// * https://edition.cnn.com/election/2020/results/president
// * https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/

// Data sources
const mapUrl = 'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json';
const elVoteUrl = 'https://www.highcharts.com/samples/data/us-1976-2020-president.csv';
const elCollegeUrl = 'https://www.highcharts.com/samples/data/us-electorial_votes.csv';

const commonTitle = 'U.S. presidential election';

// TBD: expand as more elections are added
const electionYears = ['2020', '2016', '2012', '2008'];

// Election data loaded from CSV file and converted to JSON
let electionData = null;


// Launches the Dashboards application
async function setupDashboard() {
    // Start with national results and latest election
    let selectedState = 'US';
    let selectedYear = electionYears[0];

    // Load the basic map
    const mapData = await fetch(mapUrl).then(response => response.json());

    // Load electoral college data and convert from CSV jo JSON
    const elCollegeData = await fetch(elCollegeUrl)
        .then(response => response.text()).then(csv => parseElectoralCollegeData(csv));

    // Load election results and convert to the JSON format used by this application.
    electionData = await fetch(elVoteUrl)
        .then(response => response.text()).then(csv => parseElectionData(csv));

    // Create the Dashboard
    const board = await Dashboards.board('container', {
        dataPool: {
            // Data connectors, one per election
            connectors: getDataConnectors()
        },
        gui: {
            // TBD: move to HTML
            layouts: [{
                rows: [{
                    cells: [{
                        // Top left
                        id: 'html-result'
                    }, {
                        // Top right
                        id: 'html-control'
                    }]
                }, {
                    cells: [{
                        // Mid left
                        id: 'election-map'
                    }, {
                        // Mid right
                        id: 'election-chart'
                    }]
                }, {
                    cells: [{
                        // Spanning all columns
                        id: 'election-grid'
                    }]
                }]
            }]
        },
        components: [
            {
                renderTo: 'html-result',
                type: 'CustomHTML',
                id: 'html-result-div'
            },
            {
                renderTo: 'html-control',
                type: 'CustomHTML',
                id: 'html-control-div',
                title: 'U.S. presidential election'
            },
            {
                renderTo: 'election-map',
                type: 'Highcharts',
                chartConstructor: 'mapChart',
                chartOptions: {
                    chart: {
                        type: 'map',
                        map: mapData,
                        styledMode: false,
                        events: {
                            click: function () {
                                // Clicked outside map
                                onStateClicked(board, 'US');
                                resetMap(this);
                            }
                        }
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
                            colorIndex: 0,
                            name: 'Democrat'
                        }, {
                            from: 0,
                            to: 100,
                            colorIndex: 1,
                            name: 'Republican'
                        }]
                    },
                    plotOptions: {
                        series: {
                            allowPointSelect: true
                        }
                    },
                    series: [
                        {
                            name: 'US Map',
                            type: 'map'
                        },
                        {
                            name: 'State election result',
                            data: [],
                            joinBy: 'postal-code',
                            dataLabels: {
                                enabled: true,
                                color: 'white',
                                format: '{point.postal-code}',
                                style: {
                                    textTransform: 'uppercase'
                                }
                            },
                            point: {
                                events: {
                                    click: function (e) {
                                        const sel = e.point['postal-code'];
                                        if (sel !== selectedState) {
                                            selectedState = sel;
                                        } else {
                                            // Back to national view if clicking on already selected state.
                                            selectedState = 'US';
                                        }
                                        onStateClicked(board, selectedState);
                                    }
                                }
                            }
                        }, {
                            name: 'Separators',
                            type: 'mapline',
                            nullColor: 'silver',
                            showInLegend: false,
                            enableMouseTracking: false,
                            accessibility: {
                                enabled: false
                            }
                        }
                    ],
                    tooltip: {
                        useHTML: true,
                        headerFormat: '<table class="map-tooltip"><caption>{point.key}</caption><tr><th>Party</th><th>Electors</th><th>Votes</th></tr>',
                        pointFormat: '<tr><td>Dem.</td><td>{point.custom.elVotesDem}</td><td>{point.custom.votesDem}</td></tr>' +
                            '<tr><td>Rep.</td><td>{point.custom.elVotesRep}</td><td>{point.custom.votesRep}</td></tr>' +
                            '<tr><th colspan="3">{point.custom.winner}</th></tr>',
                        footerFormat: '</table>'
                    },
                    lang: {
                        accessibility: {
                            chartContainerLabel: commonTitle + '. Highcharts Interactive Map.'
                        }
                    },
                    accessibility: {
                        description: 'The map is displaying ' + commonTitle + ', ' + selectedYear
                    }
                }
            },
            {
                renderTo: 'election-chart',
                type: 'Highcharts',
                title: {
                    text: 'Historical ' + commonTitle + 's'
                },
                chartOptions: {
                    title: {
                        text: 'National'
                    },
                    chart: {
                        styledMode: true,
                        type: 'column',
                        height: 360 // TBD: use min-height in CSS
                    },
                    credits: {
                        enabled: true,
                        href: 'https://www.archives.gov/electoral-college/allocation',
                        text: 'National Archives'
                    },
                    legend: {
                        enabled: true
                    },
                    tooltip: {
                        enabled: true,
                        format: '{point.candidate}: {point.electors} electors'
                    },
                    plotOptions: {
                        column: {
                            dataLabels: [
                                {
                                    align: 'center',
                                    verticalAlign: 'bottom',
                                    inside: true,
                                    enabled: true,
                                    rotation: -90,
                                    y: -5, // Pixels up from bottom
                                    format: '{point.candidate}'
                                }, {
                                    enabled: true,
                                    inside: false,
                                    format: '{point.y:.1f}'
                                }
                            ]
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
                            text: 'Percent of votes'
                        },
                        accessibility: {
                            description: 'Percent of votes'
                        }
                    },
                    series: getHistoricalElectionSeries(),
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
                renderTo: 'election-grid',
                type: 'DataGrid',
                connector: {
                    id: 'votes' + selectedYear
                },
                title: {
                    text: 'Updating...' // Populated later
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
                        demPercent: {
                            show: false
                        },
                        repPercent: {
                            show: false
                        },
                        demVotes: {
                            show: false
                        },
                        repVotes: {
                            show: false
                        },
                        demVoteSummary: {
                            headerFormat: 'Dem. votes'
                        },
                        repVoteSummary: {
                            headerFormat: 'Rep. votes'
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

    // Apply initial election data
    await onYearClicked(board, selectedYear);

    // Handle change year events
    Highcharts.addEvent(
        document.getElementById('election-year'),
        'change',
        async function () {
            const selectedOption = this.options[this.selectedIndex];
            selectedYear = selectedOption.value;

            await onYearClicked(board, selectedYear);

            // Revert to national view
            await onStateClicked(board, 'US');
            resetMap(getComponent(board, 'election-map').chart);
        }
    );


    function getDataConnectors() {
        const connectors = [];

        electionYears.forEach(function (year) {
            connectors.push(
                {
                    id: 'votes' + year,
                    type: 'JSON',
                    options: {
                        firstRowAsNames: true,
                        data: electionData[year].data
                    }
                }
            );
        });
        return connectors;
    }


    function parseElectionData(csv) {
        const rowObj = {
            state: '',
            demColVotes: 0,
            repColVotes: 0,
            demPercent: 0.0,
            repPercent: 0.0,
            'postal-code': '',
            demVotes: 0,
            repVotes: 0,
            demVoteSummary: 0,
            repVoteSummary: 0,
            totalVotes: 0
        };

        const header = Object.keys(rowObj);

        const national = {
            repCand: '',
            demCand: '',
            data: { ...rowObj }
        };
        const rowObjNational = national.data;
        rowObjNational.state = 'National';
        rowObjNational['postal-code'] = 'US';

        // RegEx for splitting a single line
        const csvSplit = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
        const tidyCol = /[,"]/g;

        // Create JSON data, one array per year
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
                    // First record of a new election year
                    jsonData[key] = {
                        data: [header]
                    };

                    // Wrap up the election that is currently being processed?
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

                        // Pre-format votes column
                        formatVotesColumns(rowObj);

                        jsonData[key].data.push(Object.values(rowObj));

                        // Prepare for next row (state)
                        rowObj.repVotes = 0;
                        rowObj.demVotes = 0;
                    }
                }
            }
        });
        addNationalSummary(jsonData[key], national);

        return jsonData;
    }


    function parseElectoralCollegeData(csv) {
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
    }


    function formatVotesColumns(rowObj) {
        rowObj.demVoteSummary = rowObj.demVotes.toLocaleString('en-US') + ' (' + rowObj.demPercent + '%)';
        rowObj.repVoteSummary = rowObj.repVotes.toLocaleString('en-US') + ' (' + rowObj.repPercent + '%)';
    }


    function addNationalSummary(jsonData, national) {
        function getSurname(name) {
            return name.split(',')[0];
        }

        const summary = national.data;

        // Insert a row with national results (row 1, below header)
        summary.repPercent = ((summary.repVotes / summary.totalVotes) * 100).toFixed(1);
        summary.demPercent = ((summary.demVotes / summary.totalVotes) * 100).toFixed(1);

        formatVotesColumns(summary);

        jsonData.data.splice(1, 0, Object.values(summary));

        // Save candidate names (to be displayed in header)
        jsonData.candRep = getSurname(national.repCand);
        jsonData.candDem = getSurname(national.demCand);
    }
}

//
// Support functions
//
function resetMap(mapChart) {
    // Reset zoom
    mapChart.mapZoom();

    // Unselect all selected points
    const points = mapChart.getSelectedPoints();
    if (points.length > 0) {
        points.forEach(point => point.select(false));
    }
}

function getHistoricalElectionSeries(state = 'US') {
    const series = [
        {
            name: 'Democrat',
            data: []
        }, {
            name: 'Republican',
            data: []
        }
    ];

    Object.values(electionData).reverse().forEach(function (item) {
        const row = item.data.find(c => c[5] === state);

        // Percentage, Democrat
        series[0].data.push({
            candidate: item.candDem,
            y: Number(row[3]),
            electors: row[1]
        });

        // Percentage, Republicans
        series[1].data.push({
            candidate: item.candRep,
            y: Number(row[4]),
            electors: row[2]
        });
    });
    return series;
}


async function getElectionTable(board, year) {
    return await board.dataPool.getConnectorTable('votes' + year);
}


function getComponent(board, id) {
    return board.mountedComponents.find(c => c.cell.id === id).component;
}


async function updateResultComponent(component, electionTable, year) {
    await component.update({
        title: {
            text: commonTitle + ' ' + year
        }
    });

    // Candidate names
    const candDem = electionData[year].candDem;
    const candRep = electionData[year].candRep;

    // Candidate percentages/electors
    const row = electionTable.getRowIndexBy('postal-code', 'US');
    const demPercent = electionTable.getCellAsNumber('demPercent', row);
    const repPercent = electionTable.getCellAsNumber('repPercent', row);
    const demColVotes = electionTable.getCellAsNumber('demColVotes', row);
    const repColVotes = electionTable.getCellAsNumber('repColVotes', row);
    const totalColVotes = demColVotes + repColVotes;
    const demVotes = electionTable.getCellAsNumber('demVotes', row);
    const repVotes = electionTable.getCellAsNumber('repVotes', row);

    // Grab auxiliary data about the election (photos, description, etc.)
    const yearEl = document.querySelector('elections year#ei_' + year);

    // Photos
    const imgDemUrl = yearEl.querySelector('dem imgUrl').textContent;
    const imgRepUrl = yearEl.querySelector('rep imgUrl').textContent;

    document.querySelector('div#dem-cand img').src = imgDemUrl;
    document.querySelector('div#rep-cand img').src = imgRepUrl;

    // Election information
    let el = document.getElementById('info-dem1');
    el.innerHTML = `<b>${demColVotes}</b> ${candDem}`;
    el = document.getElementById('info-dem2');
    el.innerHTML = `<b>${demPercent}%</b> ${demVotes.toLocaleString('en-US')}`;

    el = document.getElementById('info-rep1');
    el.innerHTML = `${candRep} <b>${repColVotes}</b>`;
    el = document.getElementById('info-rep2');
    el.innerHTML = `${repVotes.toLocaleString('en-US')} <b>${repPercent}%</b>`;

    // Result bar
    el = document.getElementById('bar-dem');
    el.style.width = ((demColVotes / totalColVotes) * 100) + '%';
    el = document.getElementById('bar-rep');
    el.style.width = ((repColVotes / totalColVotes) * 100) + '%';

    // Votes needed to win
    const neededVotes = Math.floor(totalColVotes / 2) + 1; // TBC: is this safe?
    el = document.getElementById('info-to-win');
    el.innerHTML = neededVotes + ' to win';
}


function updateControlComponent(year) {
    const yearEl = document.querySelector('elections year#ei_' + year);
    const domEl = document.getElementById('election-description');
    const el = yearEl.querySelector('descr');
    domEl.innerHTML = el.innerHTML;
}


async function updateMapComponent(component, electionTable, year) {
    await component.chart.update({
        title: {
            text: commonTitle + ' ' + year
        }
    });

    // U.S. states with election results
    const voteSeries = component.chart.series[1].data;
    voteSeries.forEach(function (state) {
        const row = electionTable.getRowIndexBy('postal-code', state['postal-code']);
        const percentRep = electionTable.getCellAsNumber('repPercent', row);
        const percentDem = electionTable.getCellAsNumber('demPercent', row);

        state.update({
            // Determine color
            value: Number(percentRep - percentDem),
            // For use in tooltip
            custom: {
                winner: percentRep > percentDem ? electionData[year].candRep : electionData[year].candDem,
                elVotesDem: electionTable.getCellAsNumber('demColVotes', row),
                elVotesRep: electionTable.getCellAsNumber('repColVotes', row),
                votesDem: electionTable.getCell('demVoteSummary', row),
                votesRep: electionTable.getCell('repVoteSummary', row),
                totalVotes: electionTable.getCellAsNumber('totalVotes', row)
            }
        });
    });
}


async function updateGridComponent(component, year) {
    const candDem = electionData[year].candDem;
    const candRep = electionData[year].candRep;

    await component.update({
        title: {
            text: commonTitle + ' ' + year
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

//
// Callbacks (event handlers)
//
async function onStateClicked(board, state) {
    // State name picked from the latest election data
    const electionTable = await getElectionTable(board, electionYears[0]);
    const row = electionTable.getRowIndexBy('postal-code', state);
    const stateName = electionTable.getCell('state', row);

    // Update chart title
    const comp = getComponent(board, 'election-chart');

    // Election data for current state
    const stateSeries = getHistoricalElectionSeries(state);

    await comp.update({
        chartOptions: {
            title: {
                text: state === 'US' ? 'National' : stateName
            },
            series: stateSeries
        }
    });
}


// Update board after changing data set (state or election year)
async function onYearClicked(board, year) {
    // Dashboards components
    const resultComponent = getComponent(board, 'html-result');
    const mapComponent = getComponent(board, 'election-map');
    const gridComponent = getComponent(board, 'election-grid');

    // Get election data
    const electionTable = await getElectionTable(board, year);

    // Update result component (HTML)
    updateResultComponent(resultComponent, electionTable, year);

    // Update control component (HTML), works directly on DOM
    updateControlComponent(year);

    // Update map component (Highcharts Map)
    resetMap(mapComponent.chart);
    updateMapComponent(mapComponent, electionTable, year);

    // Update data grid component (Dashboards datagrid)
    updateGridComponent(gridComponent, year);
}


//
// Custom HTML component (TBD: remove when integrated with Dashboards)
//
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
        }
    }
}

ComponentRegistry.registerComponent('CustomHTML', CustomHTML);

//
// Launch the application
//
setupDashboard();
