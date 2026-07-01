let chart = null; // Chart is not created initially

const activeCols = new Set();
const groupStageData = [
    // Group A
    {
        country: 'Mexico',
        iso2: 'mx',
        group: 'A',
        wins: 3,
        losses: 0,
        draws: 0,
        points: 9,
        goalDifference: 6
    },
    {
        country: 'South Africa',
        iso2: 'za',
        group: 'A',
        wins: 1,
        losses: 1,
        draws: 1,
        points: 4,
        goalDifference: -1
    },
    {
        country: 'Korea Republic',
        iso2: 'kr',
        group: 'A',
        wins: 1,
        losses: 2,
        draws: 0,
        points: 3,
        goalDifference: -1
    },
    {
        country: 'Czechia',
        iso2: 'cz',
        group: 'A',
        wins: 0,
        losses: 2,
        draws: 1,
        points: 1,
        goalDifference: -4
    },

    // Group B
    {
        country: 'Switzerland',
        iso2: 'ch',
        group: 'B',
        wins: 2,
        losses: 0,
        draws: 1,
        points: 7,
        goalDifference: 4
    },
    {
        country: 'Canada',
        iso2: 'ca',
        group: 'B',
        wins: 1,
        losses: 1,
        draws: 1,
        points: 4,
        goalDifference: 5
    },
    {
        country: 'Bosnia and Herzegovina',
        iso2: 'ba',
        group: 'B',
        wins: 1,
        losses: 1,
        draws: 1,
        points: 4,
        goalDifference: -1
    },
    {
        country: 'Qatar',
        iso2: 'qa',
        group: 'B',
        wins: 0,
        losses: 2,
        draws: 1,
        points: 1,
        goalDifference: -8
    },

    // Group C
    {
        country: 'Brazil',
        iso2: 'br',
        group: 'C',
        wins: 2,
        losses: 0,
        draws: 1,
        points: 7,
        goalDifference: 6
    },
    {
        country: 'Morocco',
        iso2: 'ma',
        group: 'C',
        wins: 2,
        losses: 0,
        draws: 1,
        points: 7,
        goalDifference: 3
    },
    {
        country: 'Scotland',
        iso2: 'gb-sct',
        group: 'C',
        wins: 1,
        losses: 2,
        draws: 0,
        points: 3,
        goalDifference: -3
    },
    {
        country: 'Haiti',
        iso2: 'ht',
        group: 'C',
        wins: 0,
        losses: 3,
        draws: 0,
        points: 0,
        goalDifference: -6
    },

    // Group D
    {
        country: 'United States',
        iso2: 'us',
        group: 'D',
        wins: 2,
        losses: 1,
        draws: 0,
        points: 6,
        goalDifference: 4
    },
    {
        country: 'Australia',
        iso2: 'au',
        group: 'D',
        wins: 1,
        losses: 1,
        draws: 1,
        points: 4,
        goalDifference: 0
    },
    {
        country: 'Paraguay',
        iso2: 'py',
        group: 'D',
        wins: 1,
        losses: 1,
        draws: 1,
        points: 4,
        goalDifference: -2
    },
    {
        country: 'Türkiye',
        iso2: 'tr',
        group: 'D',
        wins: 1,
        losses: 2,
        draws: 0,
        points: 3,
        goalDifference: -2
    },

    // Group E
    {
        country: 'Germany',
        iso2: 'de',
        group: 'E',
        wins: 2,
        losses: 1,
        draws: 0,
        points: 6,
        goalDifference: 6
    },
    {
        country: 'Côte d\'Ivoire',
        iso2: 'ci',
        group: 'E',
        wins: 2,
        losses: 1,
        draws: 0,
        points: 6,
        goalDifference: 2
    },
    {
        country: 'Ecuador',
        iso2: 'ec',
        group: 'E',
        wins: 1,
        losses: 1,
        draws: 1,
        points: 4,
        goalDifference: 0
    },
    {
        country: 'Curaçao',
        iso2: 'cw',
        group: 'E',
        wins: 0,
        losses: 2,
        draws: 1,
        points: 1,
        goalDifference: -8
    },

    // Group F
    {
        country: 'Netherlands',
        iso2: 'nl',
        group: 'F',
        wins: 2,
        losses: 0,
        draws: 1,
        points: 7,
        goalDifference: 6
    },
    {
        country: 'Japan',
        iso2: 'jp',
        group: 'F',
        wins: 1,
        losses: 0,
        draws: 2,
        points: 5,
        goalDifference: 4
    },
    {
        country: 'Sweden',
        iso2: 'se',
        group: 'F',
        wins: 1,
        losses: 1,
        draws: 1,
        points: 4,
        goalDifference: 0
    },
    {
        country: 'Tunisia',
        iso2: 'tn',
        group: 'F',
        wins: 0,
        losses: 3,
        draws: 0,
        points: 0,
        goalDifference: -10
    },

    // Group G
    {
        country: 'Belgium',
        iso2: 'be',
        group: 'G',
        wins: 1,
        losses: 0,
        draws: 2,
        points: 5,
        goalDifference: 4
    },
    {
        country: 'Egypt',
        iso2: 'eg',
        group: 'G',
        wins: 1,
        losses: 0,
        draws: 2,
        points: 5,
        goalDifference: 2
    },
    {
        country: 'Iran',
        iso2: 'ir',
        group: 'G',
        wins: 0,
        losses: 0,
        draws: 3,
        points: 3,
        goalDifference: 0
    },
    {
        country: 'New Zealand',
        iso2: 'nz',
        group: 'G',
        wins: 0,
        losses: 2,
        draws: 1,
        points: 1,
        goalDifference: -6
    },

    // Group H
    {
        country: 'Spain',
        iso2: 'es',
        group: 'H',
        wins: 2,
        losses: 0,
        draws: 1,
        points: 7,
        goalDifference: 5
    },
    {
        country: 'Cape Verde',
        iso2: 'cv',
        group: 'H',
        wins: 0,
        losses: 0,
        draws: 3,
        points: 3,
        goalDifference: 0
    },
    {
        country: 'Uruguay',
        iso2: 'uy',
        group: 'H',
        wins: 0,
        losses: 1,
        draws: 2,
        points: 2,
        goalDifference: -1
    },
    {
        country: 'Saudi Arabia',
        iso2: 'sa',
        group: 'H',
        wins: 0,
        losses: 1,
        draws: 2,
        points: 2,
        goalDifference: -4
    },

    // Group I
    {
        country: 'France',
        iso2: 'fr',
        group: 'I',
        wins: 3,
        losses: 0,
        draws: 0,
        points: 9,
        goalDifference: 8
    },
    {
        country: 'Norway',
        iso2: 'no',
        group: 'I',
        wins: 2,
        losses: 1,
        draws: 0,
        points: 6,
        goalDifference: 1
    },
    {
        country: 'Senegal',
        iso2: 'sn',
        group: 'I',
        wins: 1,
        losses: 2,
        draws: 0,
        points: 3,
        goalDifference: 2
    },
    {
        country: 'Iraq',
        iso2: 'iq',
        group: 'I',
        wins: 0,
        losses: 3,
        draws: 0,
        points: 0,
        goalDifference: -11
    },

    // Group J
    {
        country: 'Argentina',
        iso2: 'ar',
        group: 'J',
        wins: 3,
        losses: 0,
        draws: 0,
        points: 9,
        goalDifference: 7
    },
    {
        country: 'Austria',
        iso2: 'at',
        group: 'J',
        wins: 1,
        losses: 1,
        draws: 1,
        points: 4,
        goalDifference: 0
    },
    {
        country: 'Algeria',
        iso2: 'dz',
        group: 'J',
        wins: 1,
        losses: 1,
        draws: 1,
        points: 4,
        goalDifference: -2
    },
    {
        country: 'Jordan',
        iso2: 'jo',
        group: 'J',
        wins: 0,
        losses: 3,
        draws: 0,
        points: 0,
        goalDifference: -5
    },

    // Group K
    {
        country: 'Colombia',
        iso2: 'co',
        group: 'K',
        wins: 2,
        losses: 0,
        draws: 1,
        points: 7,
        goalDifference: 3
    },
    {
        country: 'Portugal',
        iso2: 'pt',
        group: 'K',
        wins: 1,
        losses: 0,
        draws: 2,
        points: 5,
        goalDifference: 5
    },
    {
        country: 'DR Congo',
        iso2: 'cd',
        group: 'K',
        wins: 1,
        losses: 1,
        draws: 1,
        points: 4,
        goalDifference: 1
    },
    {
        country: 'Uzbekistan',
        iso2: 'uz',
        group: 'K',
        wins: 0,
        losses: 3,
        draws: 0,
        points: 0,
        goalDifference: -9
    },

    // Group L
    {
        country: 'England',
        iso2: 'gb',
        group: 'L',
        wins: 2,
        losses: 0,
        draws: 1,
        points: 7,
        goalDifference: 4
    },
    {
        country: 'Croatia',
        iso2: 'hr',
        group: 'L',
        wins: 2,
        losses: 1,
        draws: 0,
        points: 6,
        goalDifference: 0
    },
    {
        country: 'Ghana',
        iso2: 'gh',
        group: 'L',
        wins: 1,
        losses: 1,
        draws: 1,
        points: 4,
        goalDifference: 0
    },
    {
        country: 'Panama',
        iso2: 'pa',
        group: 'L',
        wins: 0,
        losses: 3,
        draws: 0,
        points: 0,
        goalDifference: -4
    }
];
const columnData = {
    Country: groupStageData.map(r => r.country),
    Wins: groupStageData.map(r => r.wins),
    Draws: groupStageData.map(r => r.draws),
    Losses: groupStageData.map(r => r.losses),
    Points: groupStageData.map(r => r.points),
    GoalDifference: groupStageData.map(r => r.goalDifference)
};
const dataTable = new Grid.DataTable({
    columns: columnData
});
Grid.grid('grid', {
    gridKey: 'YOUR-GRID-KEY-HERE',
    data: {
        dataTable
    },
    columnDefaults: {
        cells: {
            events: {
                click: function () {
                    const grid = this.row.viewport.grid;
                    const yearColumnId = 'Year';
                    const columnId = this.column.id;

                    // Skip if clicked on Year column
                    if (columnId === yearColumnId) {
                        return;
                    }

                    // We get the x axis from the Year column
                    const years = grid.dataProvider
                        .getDataTable()
                        .getColumn(yearColumnId);

                    // Create chart if it doesn't exist
                    if (!chart) {
                        chart = Highcharts.chart('chart', {
                            title: {
                                text: 'U.S Solar Employment Growth',
                                align: 'center'
                            },
                            xAxis: {
                                categories: years
                            },
                            yAxis: {
                                title: {
                                    text: 'Number of Employees'
                                }
                            }
                        });
                    }

                    // Check if series already exists in the chart
                    const existingSeries = chart.series.find(
                        s => s.name === columnId
                    );

                    const toggleColumnHighlight = () => {
                        if (activeCols.has(columnId)) {
                            activeCols.delete(columnId);
                        } else {
                            activeCols.add(columnId);
                        }
                    };

                    const accessibility = grid.accessibility;

                    if (existingSeries) {
                        // Remove the series from chart
                        existingSeries.remove();

                        // Accessibility
                        accessibility.announce(
                            `Removed series ${columnId} from chart.`,
                            true
                        );

                        // If no series left, destroy the chart
                        if (chart.series.length === 0) {
                            chart.destroy();
                            chart = null;

                            // Accessibility
                            accessibility.announce('Destroyed chart.', true);
                        }
                    } else {
                        // Add new series to chart
                        chart.addSeries({
                            name: columnId,
                            data: this.column.data
                        });

                        // Accessibility
                        accessibility.announce(
                            `Added series ${columnId} to the chart.`,
                            true
                        );
                    }
                    toggleColumnHighlight();
                    setActiveColumnStyle(this);
                },
                afterSetValue: function () {
                    setActiveColumnStyle(this);
                }
            }
        }
    },
    columns: [{
        id: 'Year',
        width: 65
    }]
});

function setActiveColumnStyle(cell) {
    const isActive = activeCols.has(cell.column.id);
    const cells = cell.column.cells;
    cells.forEach(c => {
        c.htmlElement.classList.toggle('active-column', isActive);
    });
    cell.column.header.htmlElement.classList.toggle('active-column', isActive);
}
