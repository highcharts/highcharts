const series = [
    {
        name: 'Year',
        data: [
            2010, 2011, 2012, 2013, 2014, 2015,
            2016, 2017, 2018, 2019, 2020, 2021, 2022
        ],
        xAxis: 0
    }, {
        name: 'Installation & Developers',
        data: [
            43934, 48656, 65165, 81827, 112143, 142383,
            171533, 165174, 155157, 161454, 154610, 168960, 171558
        ]
    }, {
        name: 'Manufacturing',
        data: [
            24916, 37941, 29742, 29851, 32490, 30282,
            38121, 36885, 33726, 34243, 31050, 33099, 33473
        ]
    }, {
        name: 'Sales & Distribution',
        data: [
            11744, 30000, 16005, 19771, 20185, 24377,
            32147, 30912, 29243, 29213, 25663, 28978, 30618
        ]
    }, {
        name: 'Operations & Maintenance',
        data: [
            null, null, null, null, null, null, null,
            null, 11164, 11218, 10077, 12530, 16585
        ]
    }, {
        name: 'Other',
        data: [
            21908, 5548, 8105, 11248, 8989, 11816, 18274,
            17300, 13053, 11906, 10073, 11471, 11648
        ]
    }];

let grid = null;

Highcharts.chart('chart', {

    title: {
        text: 'U.S Solar Employment Growth',
        align: 'left'
    },

    subtitle: {
        text: 'By Job Category. Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>.',
        align: 'left'
    },

    yAxis: {
        title: {
            text: 'Number of Employees'
        }
    },

    xAxis: {
        accessibility: {
            rangeDescription: 'Range: 2010 to 2022'
        }
    },

    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: 2010
        }
    },

    exporting: {
        menuItemDefinitions: {
            viewData: {
                onclick: function () {
                    if (!grid) {
                        createGrid();
                    } else {
                        grid.container.classList.toggle('hide');
                    }
                    const isGridHidden = grid.container
                        .classList.contains(
                            'hide'
                        );
                    const viewDataElement = this.exportDivElements[2];
                    viewDataElement.innerText =
                        `${isGridHidden ? 'Show' : 'Hide'} data table`;
                }
            }
        },
        buttons: {
            contextButton: {
                menuItems: ['viewFullscreen', 'printChart', 'viewData']
            }
        }
    },

    series,

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});

const cols = {
    ...Object.fromEntries(series.map(s => [s.name, s.data]))
};

function createGrid() {
    const gridElement = document.createElement('div');
    gridElement.id = 'grid';
    document.getElementById('container').appendChild(gridElement);
    grid = Grid.grid('grid', {
        dataTable:
        {
            columns: cols
        },
        rendering: {
            columns: {
                resizing: {
                    mode: 'mixed'
                }
            },
            theme: 'hcg-theme-default theme-custom'
        },
        columnDefaults: {
            cells: {
                // Format numbers to mimic the chart tooltip
                // Uses Highcharts template engine to add commas on thousands
                format: '{value:,.0f}'
            }
        },
        columns: [
            {
                id: 'Year',
                name: 'Year',
                // 100px width for Year column
                width: 100,
                cells: {
                    // We do not want commas on the Year column
                    format: '{value}'
                }
            }
        ]
    });
}
