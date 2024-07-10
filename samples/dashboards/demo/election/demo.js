/* eslint-disable max-len */
/* eslint-disable jsdoc/require-description */

// Data grid contents

// State    | Dem. electors | Rep. electors | Dem. votes  | Rep. votes  | Total votes
// ---------|---------------|---------------|------- -----|-------------|------------
// National | int           | int           | int (%)     | int (%)     | int
// Alabama  | int           | int           | int (%)     | int (%)     | int
// ........ | ............. | .........     | ........    | ........... | int
// Wyoming  | int           | int           | int (%)     | int (%)     | int


// Data sources
const mapUrl = 'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json';
const elVoteUrl = 'https://www.highcharts.com/samples/data/us-2008-2020-president.csv';
const elCollegeUrl = 'https://www.highcharts.com/samples/data/us-electorial_votes.csv';

const commonTitle = 'U.S. Presidential Election';
const electionYears = ['2020', '2016', '2012', '2008'];

// Election data loaded from CSV and converted to JSON
let electionData;


// Launches the Dashboards application
async function setupDashboard() {
    // Start with national results and latest election
    let selectedState = 'US';
    const defaultYear = electionYears[0];

    // Load the basic map
    const mapData = await fetch(mapUrl).then(response => response.json());

    // Load electoral college data and convert from CSV jo JSON
    const elCollegeData = await loadAndParseCsv(elCollegeUrl, parseElectoralCollegeData);

    // Load election results and convert from CSV jo JSON
    electionData = await loadAndParseCsv(elVoteUrl, parseElectionData);

    // Create the Dashboard
    const board = await Dashboards.board('container', {
        dataPool: {
            // Data connectors, one per election
            connectors: getDataConnectors()
        },
        components: [{
            renderTo: 'elections-selector-wrapper',
            type: 'CustomHTML',
            html: `
            <select name="elections" id="election-year">
                <option value="2020">2020 - Biden vs Trump</option>
                <option value="2016">2016 - Clinton vs Trump</option>
                <option value="2012">2012 - Obama vs Romney</option>
                <option value="2008">2008 - Obama vs McCain</option>
            </select>`
        }, {
            renderTo: 'html-control',
            type: 'CustomHTML',
            id: 'html-control-div'
        }, {
            renderTo: 'html-result',
            type: 'CustomHTML',
            id: 'html-result-div',
            title: 'Electoral College Results'
        }, {
            renderTo: 'election-map',
            type: 'Highcharts',
            chartConstructor: 'mapChart',
            title: 'Popular Vote Results', // Populated by election year
            chartOptions: {
                chart: {
                    type: 'map',
                    map: mapData,
                    styledMode: false,
                    animation: true,
                    events: {
                        click: function () {
                            // Clicked outside map
                            onStateClicked(board, 'US');
                            resetMap(this);
                        }
                    },
                    spacing: [0, 30, 30, 30]
                },
                title: {
                    text: ''
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
                series: [{
                    name: 'US Map',
                    type: 'map'
                }, {
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
                }],
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
                    description: 'The map is displaying ' + commonTitle + ', ' + defaultYear
                }
            }
        }, {
            renderTo: 'election-chart-national',
            type: 'Highcharts',
            title: {
                text: 'Historical ' + commonTitle + 's'
            },
            chartOptions: {
                title: {
                    text: '<span class="title-bck-wrapper">' + defaultYear + '</span>National',
                    align: 'left',
                    useHTML: true
                },
                chart: {
                    styledMode: true,
                    type: 'bar',
                    height: 340,
                    spacing: [40, 20, 40, 20]
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    enabled: false
                },
                plotOptions: {
                    bar: {
                        pointPadding: 0,
                        groupPadding: 0.2,
                        grouping: false,
                        dataLabels: {
                            align: 'left',
                            useHTML: true,
                            enabled: true,
                            inside: true,
                            format: '<span class="datalabels-wrapper">{point.votes}</span>'
                        }
                    }
                },
                xAxis: {
                    type: 'category',
                    categories: [electionData[defaultYear].candDem, electionData[defaultYear].candRep],
                    labels: {
                        useHTML: true,
                        accessibility: {
                            description: 'Election year'
                        }
                    }
                },
                yAxis: {
                    enabled: false,
                    labels: {
                        enabled: false
                    },
                    title: false,
                    accessibility: {
                        description: 'Percent of votes'
                    }
                },
                series: getHistoricalElectionSeries('US', defaultYear),
                lang: {
                    accessibility: {
                        chartContainerLabel: commonTitle + ' results.'
                    }
                },
                accessibility: {
                    description: 'The chart displays national election results.'
                }
            }
        }, {
            renderTo: 'election-chart',
            type: 'Highcharts',
            chartOptions: {
                title: {
                    text: '<span class="title-bck-wrapper">Historic</span>National',
                    align: 'left',
                    useHTML: true
                },
                chart: {
                    styledMode: true,
                    type: 'column',
                    height: 340,
                    spacing: [40, 20, 40, 20]
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: true,
                    verticalAlign: 'bottom',
                    align: 'right'
                },
                tooltip: {
                    enabled: true,
                    format: '{point.candidate}: {point.electors} electors'
                },
                plotOptions: {
                    column: {
                        pointPadding: 0,
                        dataLabels: [{
                            enabled: true,
                            inside: false,
                            format: '{point.y:.1f}'
                        }]
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
                    showLastLabel: false,
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
                id: 'votes' + defaultYear
            },
            title: {
                text: 'Updating...' // Populated later
            },
            dataGridOptions: {
                cellHeight: 38,
                editable: false,
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
        }]
    }, true);

    // Apply initial election data
    await onYearClicked(board, defaultYear);

    // Handle change year events
    Highcharts.addEvent(
        document.getElementById('election-year'),
        'change',
        function () {
            const selectedOption = this.options[this.selectedIndex];
            const mapChart = board.getComponentByCellId('election-map').chart;

            // Choose a different election year
            onYearClicked(board, selectedOption.value);

            // Revert to national view
            onStateClicked(board, 'US');
            resetMap(mapChart);
        }
    );


    //
    // Data set pre-processing
    //
    async function loadAndParseCsv(url, parser) {
        const data = await fetch(url)
            .then(response => response.text()).then(csv => parser(csv));

        return data;
    }

    function parseElectionData(csv) {
        function parseLine(line) {
            // Example of line:
            //    2020,"FLORIDA","FL",12,59,43,"US PRESIDENT","TRUMP, DONALD J.","REPUBLICAN",FALSE,5668731,11067456,"20210113",NA,"REPUBLICAN"

            // Remove separators from column(e.g. "TRUMP, DONALD J.")
            let tmp = line.replace(', ', ' ');

            // Remove all double quotes
            tmp = tmp.replaceAll('"', '');

            // Split on separator (",")
            return tmp.split(',');
        }

        // One row per state
        const rowObj = {
            state: '',
            demColVotes: 0,
            repColVotes: 0,
            demPercent: 0.0, // Hidden
            repPercent: 0.0, // Hidden
            'postal-code': '', // Hidden
            demVotes: 0, // Hidden
            repVotes: 0, // Hidden
            demVoteSummary: 0,
            repVoteSummary: 0,
            totalVotes: 0
        };
        const header = Object.keys(rowObj);

        const national = {
            repCand: '',
            demCand: '',
            // Additional row for national results
            data: { ...rowObj }
        };
        const rowObjNational = national.data;
        rowObjNational.state = 'National';
        rowObjNational['postal-code'] = 'US';

        // Create JSON data, one array per year
        const jsonData = {};
        const lines = csv.split('\n');
        let key = null;

        lines.forEach(function (line) {
            const match = parseLine(line);
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

                        addNationalSummary(jsonData, national, prevKey);

                        // Reset counting
                        rowObjNational.totalVotes = 0;
                        rowObjNational.repVotes = 0;
                        rowObjNational.demVotes = 0;
                        rowObjNational.repColVotes = 0;
                        rowObjNational.demColVotes = 0;
                    }
                }

                // Create processed data record
                const party = match[14].trim();
                const candidate = match[7];

                // Ignore "other" candidates and empty candidate names
                if ((party === 'REPUBLICAN' || party === 'DEMOCRAT') && candidate.length > 0) {
                    const state = match[1];
                    const postCode = match[2];
                    const popVote = Number(match[10]);
                    const totalVote = Number(match[11]);
                    const percent = ((popVote / totalVote) * 100).toFixed(1);

                    // Accumulate nationwide data
                    rowObj.state = state;
                    rowObj['postal-code'] = postCode;

                    if (party === 'REPUBLICAN') {
                        rowObj.repVotes = popVote;
                        rowObj.repPercent = percent;
                        rowObjNational.totalVotes += totalVote;
                        rowObjNational.repVotes += popVote;
                    } else { // DEMOCRAT
                        rowObj.demVotes = popVote;
                        rowObj.demPercent = percent;
                        rowObj.totalVotes = totalVote;
                        rowObjNational.demVotes += Number(popVote);
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

                        // Add row (state)
                        jsonData[key].data.push(Object.values(rowObj));

                        // Prepare for next row (state)
                        rowObj.repVotes = 0;
                        rowObj.demVotes = 0;
                    }
                }
            }
        });
        addNationalSummary(jsonData, national, key);

        return jsonData;
    }


    function parseElectoralCollegeData(csv) {
        const jsonData = {};
        const lines = csv.split(/\r?\n/);
        const header = lines[0].split(';');

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const items = line.split(';');
            const state = items[0];

            const obj = {};
            for (let j = 1; j < header.length; j++) {
                const year = header[j];
                obj[year] = items[j];
            }
            jsonData[state] = obj;
        }
        return jsonData;
    }

    //
    // Utilities
    //
    function formatVotesColumns(rowObj) {
        rowObj.demVoteSummary = rowObj.demVotes.toLocaleString('en-US') + ' (' + rowObj.demPercent + '%)';
        rowObj.repVoteSummary = rowObj.repVotes.toLocaleString('en-US') + ' (' + rowObj.repPercent + '%)';
    }


    function addNationalSummary(jsonAllData, national, year) {
        const summary = national.data;

        // Insert a row with national results (row 1, below header)
        summary.repPercent = ((summary.repVotes / summary.totalVotes) * 100).toFixed(1);
        summary.demPercent = ((summary.demVotes / summary.totalVotes) * 100).toFixed(1);

        formatVotesColumns(summary);

        const jsonElData = jsonAllData[year];
        jsonElData.data.splice(1, 0, Object.values(summary));

        // Save candidate names (to be displayed in header)
        const yearEl = document.querySelector('year#ei_' + year);
        jsonElData.candDem = yearEl.querySelector('dem candidate').textContent;
        jsonElData.candRep = yearEl.querySelector('rep candidate').textContent;
    }

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


function formatVotes(votes, percent, text = 'Votes') {
    const voteStr = votes.toLocaleString('en-US');

    return `${voteStr} (${percent}%) ${text}`;
}


function getHistoricalElectionSeries(state, year) {
    const series = [{
        name: 'Democrat',
        data: []
    }, {
        name: 'Republican',
        pointStart: year ? 1 : 0,
        data: []
    }];

    for (const [key] of Object.entries(electionData).reverse()) {
        if (year && key !== year) {
            continue;
        }
        const row = electionData[key].data.find(c => c[5] === (state || 'US'));

        if (row) {
            const demPercent = Number(row[3]);
            const repPercent = Number(row[4]);
            const demVotes = Number(row[6]);
            const repVotes = Number(row[7]);

            // Percentage, Democrat
            series[0].data.push({
                candidate: electionData[key].candDem,
                y: demPercent,
                electors: row[1],
                votes: formatVotes(demVotes, demPercent)
            });

            // Percentage, Republicans
            series[1].data.push({
                candidate: electionData[key].candRep,
                y: repPercent,
                electors: row[2],
                votes: formatVotes(repVotes, repPercent)
            });
        }
    }

    return series;
}


async function getElectionTable(board, year) {
    return await board.dataPool.getConnectorTable('votes' + year);
}


async function updateResultComponent(electionTable, year) {
    // Candidate names
    const candDem = electionData[year].candDem;
    const candRep = electionData[year].candRep;

    // Candidate percentages/electors
    const row = electionTable.getRowIndexBy('postal-code', 'US');
    const demColVotes = electionTable.getCellAsNumber('demColVotes', row);
    const repColVotes = electionTable.getCellAsNumber('repColVotes', row);
    const totalColVotes = demColVotes + repColVotes;
    const demVotes = electionTable.getCellAsNumber('demVotes', row);
    const repVotes = electionTable.getCellAsNumber('repVotes', row);
    const demPercent = electionTable.getCellAsNumber('demPercent', row);
    const repPercent = electionTable.getCellAsNumber('repPercent', row);

    // Grab auxiliary data about the election (photos, description, etc.)
    const yearEl = document.querySelector('elections year#ei_' + year);

    // Photos
    const imgDemUrl = yearEl.querySelector('dem imgUrl').innerHTML;
    const imgRepUrl = yearEl.querySelector('rep imgUrl').innerHTML;

    document.querySelector('div#dem-cand img').src = imgDemUrl;
    document.querySelector('div#rep-cand img').src = imgRepUrl;

    // Election information
    let el = document.getElementById('info-dem1');
    el.innerHTML = `${candDem}: ${demColVotes}`;
    el = document.getElementById('info-dem2');
    el.innerHTML = formatVotes(demVotes, demPercent, 'Total Votes');

    el = document.getElementById('info-rep1');
    el.innerHTML = `${candRep}: ${repColVotes}`;
    el = document.getElementById('info-rep2');
    el.innerHTML = formatVotes(repVotes, repPercent, 'Total Votes');

    // Result bar
    el = document.getElementById('bar-dem');
    el.style.width = ((demColVotes / totalColVotes) * 100) + '%';
    el = document.getElementById('bar-rep');
    el.style.width = ((repColVotes / totalColVotes) * 100) + '%';

    // Votes needed to win
    const neededVotes = Math.floor(totalColVotes / 2) + 1;
    el = document.getElementById('info-to-win');
    el.innerHTML = neededVotes + ' to win';
}


function updateControlComponent(year) {
    // Data element containing election info.
    const el = document.querySelector('elections year#ei_' + year);
    const title = document.querySelector('#election-description-container > h1');
    const descContainer = document.getElementById('election-description');

    // Update title with year
    title.innerHTML = year + ' ' + commonTitle;

    // Brief text about the election
    const brief = el.querySelector('descr').innerHTML;

    // Wikipedia link
    const wikiUrl = el.querySelector('wiki').innerHTML;

    // Update custom HTML component
    descContainer.innerHTML = `${brief}<a href="${wikiUrl}" target="_blank">Wikipedia</a>.`;
}


async function updateMapComponent(component, electionTable, year) {
    const chart = component.chart;

    // Update all U.S. states with new election results
    const voteSeries = chart.series[1].data;

    voteSeries.forEach(async function (usState) {
        const row = electionTable.getRowIndexBy('postal-code', usState['postal-code']);
        const percentRep = electionTable.getCellAsNumber('repPercent', row);
        const percentDem = electionTable.getCellAsNumber('demPercent', row);

        usState.update({
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
        }, false); // No redraw at point level
    });

    // Redraw points
    chart.redraw();
}


async function updateGridComponent(component, year) {
    const candDem = electionData[year].candDem;
    const candRep = electionData[year].candRep;

    await component.update({
        title: {
            text: year + ' ' + commonTitle
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

function updateBarComponent(component, year) {
    const updatedSeries = getHistoricalElectionSeries('US', year);

    component.chart.update({
        xAxis: {
            categories: [electionData[year].candDem, electionData[year].candRep]
        },
        title: {
            text: '<span class="title-bck-wrapper">' + year + '</span>National'
        },
        series: updatedSeries
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
    const stateTitle = state === 'US' ? 'National' : stateName;
    const yearSelector = document.getElementById('election-year');

    // Update chart title
    const comp = board.getComponentByCellId('election-chart');
    const barComponent = board.getComponentByCellId('election-chart-national');

    // Election data for current state
    const stateSeries = getHistoricalElectionSeries(state);
    const yearStateSeries = getHistoricalElectionSeries(
        state, yearSelector.value
    );

    await comp.update({
        chartOptions: {
            title: {
                text: '<span class="title-bck-wrapper">Historic</span>' +
                    stateTitle
            },
            series: stateSeries
        }
    });

    await barComponent.update({
        chartOptions: {
            title: {
                text: '<span class="title-bck-wrapper">' + yearSelector.value +
                    '</span>' + stateTitle
            },
            series: yearStateSeries
        }
    });
}


// Update board after changing data set (state or election year)
async function onYearClicked(board, year) {
    // Dashboards components
    const mapComponent = board.getComponentByCellId('election-map');
    const gridComponent = board.getComponentByCellId('election-grid');
    const barComponent = board.getComponentByCellId('election-chart-national');

    // Get election data
    const electionTable = await getElectionTable(board, year);

    // Update result component (HTML)
    updateResultComponent(electionTable, year);

    // Update control component (HTML), works directly on DOM
    updateControlComponent(year);

    // Update map component (Highcharts Map)
    resetMap(mapComponent.chart);
    updateMapComponent(mapComponent, electionTable, year);

    // Update data grid component (Dashboards datagrid)
    updateGridComponent(gridComponent, year);

    // Update national bar chart
    updateBarComponent(barComponent, year);
}


//
// Custom HTML component
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
