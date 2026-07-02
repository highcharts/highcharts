// Norwegian Storting (parliament) election results, 1957–2025.
// Shape per party: [Full name, value, color, abbreviation]

const norwayElectionResults = {
    2025: [
        ['Red Party', 9, '#AA0000', 'Rødt'],
        ['Socialist Left Party', 9, '#C4145F', 'SV'],
        ['Labour Party', 53, '#E3000F', 'Ap'],
        ['Centre Party', 9, '#00843D', 'Sp'],
        ['Green Party', 8, '#529A44', 'MDG'],
        ['Christian Democratic Party', 7, '#FFBC42', 'KrF'],
        ['Liberal Party', 3, '#00807D', 'V'],
        ['Conservative Party', 24, '#0065B1', 'H'],
        ['Progress Party', 47, '#00205B', 'FrP']
    ],
    2021: [
        ['Red Party', 8, '#AA0000', 'Rødt'],
        ['Socialist Left Party', 13, '#C4145F', 'SV'],
        ['Labour Party', 48, '#E3000F', 'Ap'],
        ['Centre Party', 28, '#00843D', 'Sp'],
        ['Green Party', 3, '#529A44', 'MDG'],
        ['Christian Democratic Party', 3, '#FFBC42', 'KrF'],
        ['Liberal Party', 8, '#00807D', 'V'],
        ['Conservative Party', 36, '#0065B1', 'H'],
        ['Progress Party', 21, '#00205B', 'FrP']
    ],
    2017: [
        ['Red Party', 1, '#AA0000', 'Rødt'],
        ['Socialist Left Party', 11, '#C4145F', 'SV'],
        ['Labour Party', 49, '#E3000F', 'Ap'],
        ['Centre Party', 19, '#00843D', 'Sp'],
        ['Green Party', 1, '#529A44', 'MDG'],
        ['Christian Democratic Party', 8, '#FFBC42', 'KrF'],
        ['Liberal Party', 8, '#00807D', 'V'],
        ['Conservative Party', 45, '#0065B1', 'H'],
        ['Progress Party', 27, '#00205B', 'FrP']
    ],
    2013: [
        ['Red Party', 0, '#AA0000', 'Rødt'],
        ['Socialist Left Party', 7, '#C4145F', 'SV'],
        ['Labour Party', 55, '#E3000F', 'Ap'],
        ['Centre Party', 10, '#00843D', 'Sp'],
        ['Green Party', 1, '#529A44', 'MDG'],
        ['Christian Democratic Party', 10, '#FFBC42', 'KrF'],
        ['Liberal Party', 9, '#00807D', 'V'],
        ['Conservative Party', 48, '#0065B1', 'H'],
        ['Progress Party', 29, '#00205B', 'FrP']
    ],
    2009: [
        ['Red Party', 0, '#AA0000', 'Rødt'],
        ['Socialist Left Party', 11, '#C4145F', 'SV'],
        ['Labour Party', 64, '#E3000F', 'Ap'],
        ['Centre Party', 11, '#00843D', 'Sp'],
        ['Green Party', 0, '#529A44', 'MDG'],
        ['Christian Democratic Party', 10, '#FFBC42', 'KrF'],
        ['Liberal Party', 2, '#00807D', 'V'],
        ['Conservative Party', 30, '#0065B1', 'H'],
        ['Progress Party', 41, '#00205B', 'FrP']
    ],
    2005: [
        ['Red Party', 0, '#AA0000', 'Rødt'],
        ['Socialist Left Party', 15, '#C4145F', 'SV'],
        ['Labour Party', 61, '#E3000F', 'Ap'],
        ['Centre Party', 11, '#00843D', 'Sp'],
        ['Green Party', 0, '#529A44', 'MDG'],
        ['Christian Democratic Party', 11, '#FFBC42', 'KrF'],
        ['Liberal Party', 10, '#00807D', 'V'],
        ['Conservative Party', 23, '#0065B1', 'H'],
        ['Progress Party', 38, '#00205B', 'FrP']
    ],
    2001: [
        ['Red Party', 0, '#AA0000', 'Rødt'],
        ['Socialist Left Party', 23, '#C4145F', 'SV'],
        ['Labour Party', 43, '#E3000F', 'Ap'],
        ['Centre Party', 10, '#00843D', 'Sp'],
        ['Green Party', 0, '#529A44', 'MDG'],
        ['Christian Democratic Party', 22, '#FFBC42', 'KrF'],
        ['Liberal Party', 2, '#00807D', 'V'],
        ['Conservative Party', 38, '#0065B1', 'H'],
        ['Progress Party', 26, '#00205B', 'FrP']
    ],
    1997: [
        ['Red Party', 0, '#AA0000', 'Rødt'],
        ['Socialist Left Party', 9, '#C4145F', 'SV'],
        ['Labour Party', 65, '#E3000F', 'Ap'],
        ['Centre Party', 11, '#00843D', 'Sp'],
        ['Green Party', 0, '#529A44', 'MDG'],
        ['Christian Democratic Party', 25, '#FFBC42', 'KrF'],
        ['Liberal Party', 6, '#00807D', 'V'],
        ['Conservative Party', 23, '#0065B1', 'H'],
        ['Progress Party', 25, '#00205B', 'FrP']
    ],
    1993: [
        ['Red Party', 0, '#AA0000', 'Rødt'],
        ['Socialist Left Party', 13, '#C4145F', 'SV'],
        ['Labour Party', 67, '#E3000F', 'Ap'],
        ['Centre Party', 32, '#00843D', 'Sp'],
        ['Green Party', 0, '#529A44', 'MDG'],
        ['Christian Democratic Party', 13, '#FFBC42', 'KrF'],
        ['Liberal Party', 1, '#00807D', 'V'],
        ['Conservative Party', 28, '#0065B1', 'H'],
        ['Progress Party', 10, '#00205B', 'FrP']
    ],
    1989: [
        ['Red Party', 0, '#AA0000', 'Rødt'],
        ['Socialist Left Party', 17, '#C4145F', 'SV'],
        ['Labour Party', 63, '#E3000F', 'Ap'],
        ['Centre Party', 11, '#00843D', 'Sp'],
        ['Green Party', 0, '#529A44', 'MDG'],
        ['Christian Democratic Party', 14, '#FFBC42', 'KrF'],
        ['Liberal Party', 0, '#00807D', 'V'],
        ['Conservative Party', 37, '#0065B1', 'H'],
        ['Progress Party', 22, '#00205B', 'FrP']
    ]
};
const years = Object.keys(norwayElectionResults).reverse();
let selectedYear = years[0];
let grid = null;
const getColumnData = data => {
    // Collect all unique party names across all years
    const partyNames = [
        ...new Set(years.flatMap(year => data[year].map(p => p[0])))
    ];

    const columns = {
        Year: years,
        ...Object.fromEntries(partyNames.map(name => [name, []]))
    };

    years.forEach(year => {
        const resultsByParty = Object.fromEntries(
            data[year].map(p => [p[0], p[1]])
        );
        partyNames.forEach(name => {
            columns[name].push(
                resultsByParty[name] !== 0 ?
                    resultsByParty[name] :
                    'n/a'
            );
        });
    });
    return columns;
};
const columnData = getColumnData(norwayElectionResults);
const dataTable = new Grid.DataTable({
    columns: columnData
});

const setActiveRowStyle = (row, grid) => {
    if (!row) {
        return;
    }
    grid.viewport.rows.forEach(r => {
        r.cells.forEach(c => c.htmlElement.classList?.remove('active-row'));
    });

    row.cells.forEach(c => c.htmlElement.classList?.add('active-row'));
};
const onGridChange = () => {
    const highlightedRow = grid.viewport.rows?.find(
        s => s.data.Year === selectedYear
    );
    setActiveRowStyle(highlightedRow, grid);
};

const chart = Highcharts.chart('chart', {
    chart: {
        type: 'item'
    },
    title: {
        text: 'Distribution of seats'
    },
    subtitle: {
        text: `Norwegian Parliament election ${selectedYear}`
    },
    legend: {
        labelFormat: '{name} <span style="opacity: 0.4">{y}</span>'
    },
    series: [{
        name: 'Representatives',
        keys: ['name', 'y', 'color', 'label'],
        data: norwayElectionResults[selectedYear].map(
            point => [...point]
        ),
        dataLabels: {
            enabled: true,
            formatter: function () {
                return this.point.y > 0 ? this.point.label : null;
            },
            style: {
                textOutline: '3px contrast'
            }
        },
        // Circular options
        center: ['50%', '88%'],
        size: '170%',
        startAngle: -100,
        endAngle: 100
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 600
            },
            chartOptions: {
                series: [{
                    dataLabels: {
                        distance: -30
                    }
                }]
            }
        }]
    }
});

grid = Grid.grid('grid', {
    gridKey: 'YOUR-GRID-KEY-HERE',
    data: {
        dataTable
    },
    events: {
        afterLoad: onGridChange
    },
    columnDefaults: {
        events: {
            afterSort: onGridChange
        },
        cells: {
            events: {
                click: function () {
                    const row = this.row;
                    setActiveRowStyle(row, grid);
                    selectedYear = row.data.Year;
                    chart.series[0].setData(
                        norwayElectionResults[selectedYear].map(
                            point => [...point]
                        )
                    );
                    chart.setSubtitle({
                        text: `
                            Norwegian Parliament election ${selectedYear}
                        `
                    });
                }
            }
        }
    }
});