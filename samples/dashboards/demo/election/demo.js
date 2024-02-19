/* eslint-disable max-len */
/* eslint-disable jsdoc/require-description */


// Layout
// ! -------------------------- !
// ! HTML |Chart | HTML | HTML  !
// ! -------------------|------ !
// ! Map                | Chart !
// ! -------------------------- !
// ! Data grid                  !
// ! -------------------------- !

// Data grid contents

// TBD: update to match new layout

// State    | Dem. cand    | Repo. cand.  | Dem % | Rep % |
// ---------|--------------|--------------|-------|-------|
// National | dem el. vote | rep el. vote | float | float |
// Alabama  | dem el. vote | rep el. vote | float | float |
// ........ | ............ | .........    | ...   | ..... |
// Wyoming  | dem el. vote | rep el. vote | float | float |

// Useful links
// -----------------------------------------------------------------------------
// * Bar race https://www.highcharts.com/demo/highcharts/bar-race
// * Map: https://www.highcharts.com/demo/maps/data-class-two-ranges
// * Ref: https://www.presidency.ucsb.edu/statistics/elections

const mapUrl = 'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json';
const elVoteUrl = 'https://www.highcharts.com/samples/data/us-1976-2020-president.csv';
const elCollegeUrl = 'https://www.highcharts.com/samples/data/us-electorial_votes.csv';

const commonTitle = 'U.S. presidential election';
const elections = {
    2020: {
        descrId: 'ei_2020'
    },
    2016: {
        descrId: 'ei_2016'
    },
    2012: {
        descrId: 'ei_2012'
    },
    2008: {
        descrId: 'ei_2008'
    }
};
const electionYears = Object.keys(elections).reverse();

let electionData = null;

// Launches the Dashboards application
async function setupDashboard() {

    // Start with national results and latest election
    let selectedState = 'US';
    let selectedYear = electionYears[0];

    // Load the basic map
    const mapData = await fetch(mapUrl).then(response => response.json());

    // Load the electoral mandate data and convert from CSV jo JSON
    const elCollegeData = await fetch(elCollegeUrl)
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
                demColVotes: 0,
                repColVotes: 0,
                demPercent: 0.0,
                repPercent: 0.0,
                'postal-code': '',
                demVotes: 0,
                repVotes: 0,
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
            return name.split(',')[0];
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
                name: 'Democrat',
                data: []
            }, {
                name: 'Republican',
                data: []
            }
        ];

        Object.values(electionData).reverse().forEach(function (item) {
            const row = item.data[1];

            // Percentage, Democrat
            ret[0].data.push({
                name: item.candDem,
                y: Number(row[3]),
                custom: {
                    electors: row[1]
                }
            });

            // Percentage, Republicans
            ret[1].data.push({
                name: item.candRep,
                y: Number(row[4]),
                custom: {
                    electors: row[2]
                }
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
                        id: 'html-result',
                        layout: {
                            rows: [{
                                cells: [{
                                    id: 'dem-info'
                                }, {
                                    id: 'progress-bar'
                                }, {
                                    id: 'rep-info'
                                }]
                            }]
                        }
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
                renderTo: 'dem-info',
                type: 'CustomHTML',
                id: 'html-dem-info'
            },
            {
                // One point bar chart
                renderTo: 'progress-bar',
                type: 'Highcharts',
                chartOptions: {
                    chart: {
                        type: 'bar',
                        height: '35%'
                    },
                    title: {
                        text: ''
                    },
                    legend: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        categories: ['Votes', 'Electors'],
                        lineWidth: 0,
                        labels: {
                            rotation: 45,
                            y: 15
                        }
                    },
                    yAxis: {
                        visible: false
                    },
                    plotOptions: {
                        bar: {
                            stacking: 'percent',
                            dataLabels: {
                                enabled: true,
                                formatter: function () {
                                    if (this.x === 'Votes') {
                                        return `${this.y} %`;
                                    }
                                    return this.y > 0 ? this.y : '';
                                }
                            }
                        }
                    },
                    series: [{
                        name: 'Rep. vote',
                        colorIndex: 1
                    }, {
                        name: 'Dem. vote',
                        colorIndex: 0
                    }, {
                        name: 'Rep. mand.',
                        colorIndex: 1
                    }, {
                        name: 'Dem. mand.',
                        colorIndex: 0
                    }]
                }
            },
            {
                renderTo: 'rep-info',
                type: 'CustomHTML',
                id: 'html-rep-info'
            },
            {
                renderTo: 'html-control',
                type: 'CustomHTML',
                id: 'html-control-div',
                title: 'U.S. presidential election'
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
                            colorIndex: 0,
                            name: 'Democrat'
                        }, {
                            from: 0,
                            to: 100,
                            colorIndex: 1,
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
                        },
                        point: {
                            events: {
                                click: function (e) {
                                    selectedState = e.point['postal-code'];
                                    updateBoard(board, selectedState, selectedYear);
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
                        headerFormat: '<span style="font-size: 14px;font-weight:bold">{point.key}</span><br/>',
                        pointFormat: 'Winner: {point.custom.winner}<br/><br/>' +
                            'Rep.: {point.custom.votesRep} elector(s), {point.custom.percentRep} per cent of votes<br/>' +
                            'Dem.: {point.custom.votesDem} elector(s), {point.custom.percentDem} per cent of votes'
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
                    text: 'Historical ' + commonTitle + ' results'
                },
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
                    tooltip: {
                        enabled: true,
                        format: '{point.custom.electors} electors'
                    },
                    plotOptions: {
                        series: {
                            dataLabels: [{
                                enabled: true,
                                rotation: -90,
                                format: '{point.y:.1f} %',
                                y: 60 // Pixels down from the top
                            }, {
                                enabled: true,
                                rotation: -90,
                                format: '{point.name}',
                                y: 140
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
    await updateBoard(board, 'US', selectedYear);

    // Handle change year events
    Highcharts.addEvent(
        document.getElementById('election-year'),
        'change',
        async function () {
            const selectedOption = this.options[this.selectedIndex];
            selectedYear = selectedOption.value;

            await updateBoard(board, selectedState, selectedYear);
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
        demInfo,
        progressBar,
        repInfo,
        controlHtml, // Updates bypass Dashboards
        usMap,
        historyChart, // TBD: use when a state is clicked
        selectionGrid
    ] = board.mountedComponents.map(c => c.component);

    // 1. Update result HTML (if state or year changes)
    let row = votesTable.getRowIndexBy('postal-code', 'US');

    // Candidate names
    const candDem = electionData[year].candDem;
    const candRep = electionData[year].candRep;

    await repInfo.update({
        title: {
            text: candRep
        }
    });

    await demInfo.update({
        title: {
            text: candDem
        }
    });

    // Progress bar (stacked)
    await progressBar.update({
        title: {
            text: title
        }
    });

    // Candidate percentages
    const demPercent = votesTable.getCellAsNumber('demPercent', row);
    const repPercent = votesTable.getCellAsNumber('repPercent', row);
    const demColVotes = votesTable.getCellAsNumber('demColVotes', row);
    const repColVotes = votesTable.getCellAsNumber('repColVotes', row);

    const [repEl, demEl] = progressBar.chart.series;
    demEl.update({
        data: [
            demPercent, demColVotes
        ]
    });
    repEl.update({
        data: [
            repPercent, repColVotes
        ]
    });

    // Grab auxiliary data about the election (photos, description, etc.)
    const yearEl = document.querySelector('elections year#' + elections[year].descrId);

    // Photos
    const imgDemUrl = yearEl.querySelector('dem imgUrl').textContent;
    const imgRepUrl = yearEl.querySelector('rep imgUrl').textContent;

    document.querySelector('div#dem-cand img').src = imgDemUrl;
    document.querySelector('div#rep-cand img').src = imgRepUrl;

    // Get data for selected state (or US)
    row = votesTable.getRowIndexBy('postal-code', state);
    const stateName = votesTable.getCell('state', row);

    // 2. Update control HTML description if the year changes
    const domEl = document.getElementById('election-description');
    const el = yearEl.querySelector('descr');
    domEl.innerHTML = el.innerHTML;

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
                votesDem: elVotesDem,
                votesRep: elVotesRep,
                percentDem: percentDem,
                percentRep: percentRep
            }
        });
    });

    // 4. Update history chart (TBD: when state clicked)
    await historyChart.update({
        chartOptions: {
            title: {
                text: state === 'US' ? 'National' : stateName
            }
        }
        // TBD: update columns
    });

    // 5. Update grid (if year changes)
    await selectionGrid.update({
        title: {
            text: title
        },
        connector: {
            id: 'votes' + year
        }
    });
}


// This tag is not allowed bu default
Highcharts.AST.allowedTags.push('figure');

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

            // Remove the original
            domEl.remove();
        }
    }
}

ComponentRegistry.registerComponent('CustomHTML', CustomHTML);

// Launch the application
setupDashboard();
